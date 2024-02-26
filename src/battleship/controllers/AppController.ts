import WebSocket from 'ws';
import UserController from './UserController';
import RoomController from './RoomController';
import {
  createMessagePayload,
  createServerMessage,
  sendServerMessage,
} from '../utils';
import { IAppWsServer, IWsConnection } from '../../types';
import {
  Actions,
  AttackResult,
  IClientAttackData,
  IClientRandomAttackData,
  IClientRoomData,
  IClientShipDataset,
  IClientUserData,
  IServerAttackResultData,
  IServerFinishGameData,
  IServerGameData,
  IServerTurnData,
  IServerUserData,
  IServerUserShipsDataset,
  MessagePayload,
} from '../types';
import { GameWinnerNotFound } from '../models/errors';

export default class AppController {
  private userController: UserController;

  private roomController: RoomController;

  constructor(private wsServer: IAppWsServer) {
    this.userController = new UserController();
    this.roomController = new RoomController();
  }

  public registerUser(data: IClientUserData, wsConnection: IWsConnection) {
    const onUserExists = (oldConnectionId: string) => {
      this.wsServer.removeConnection(oldConnectionId);
    };
    const user = this.userController.registerUser(
      data.name,
      data.password,
      wsConnection.id,
      onUserExists.bind(this)
    );
    const messagePayloadData: IServerUserData = {
      name: user.name,
      index: user.id,
    };
    const payload = createMessagePayload(
      Actions.RegisterUser,
      messagePayloadData
    );

    sendServerMessage(payload, wsConnection);
  }

  public createRoom(wsConnection: IWsConnection) {
    const user = this.userController.getUserByConnectionId(wsConnection.id);

    return this.roomController.addNewRoom(user);
  }

  public addUserToRoom(data: IClientRoomData, wsConnection: IWsConnection) {
    const user = this.userController.getUserByConnectionId(wsConnection.id);

    return this.roomController.addUserToRoom(user, data.indexRoom);
  }

  public createGame(roomId: number) {
    this.roomController.createGame(roomId);

    const { player1, player2 } = this.roomController.getRoomGamePlayers(roomId);

    const player1MessagePayloadData: IServerGameData = {
      idGame: roomId,
      idPlayer: player1.id,
    };
    const player2MessagePayloadData: IServerGameData = {
      idGame: roomId,
      idPlayer: player2.id,
    };

    const player1Payload = createMessagePayload(
      Actions.CreateGame,
      player1MessagePayloadData
    );
    const player2Payload = createMessagePayload(
      Actions.CreateGame,
      player2MessagePayloadData
    );

    this.sendMessagesToRoomGamePlayers(player1Payload, player2Payload, roomId);
  }

  public addShips(data: IClientShipDataset, wsConnection: IWsConnection) {
    const user = this.userController.getUserByConnectionId(wsConnection.id);

    return this.roomController.addUserShipsToRoom(
      data.ships,
      user.id,
      data.gameId
    );
  }

  public startGame(roomId: number) {
    const { player1, player2 } = this.roomController.getRoomGamePlayers(roomId);
    const currentPlayerIndex =
      this.roomController.getRoomGameCurrentPlayerId(roomId);

    const player1MessagePayloadData: IServerUserShipsDataset = {
      ships: this.roomController.getRoomGamePlayerShipsDataset(
        roomId,
        player1.id
      ),
      currentPlayerIndex,
    };
    const player2MessagePayloadData: IServerUserShipsDataset = {
      ships: this.roomController.getRoomGamePlayerShipsDataset(
        roomId,
        player2.id
      ),
      currentPlayerIndex,
    };

    const player1Payload = createMessagePayload(
      Actions.StartGame,
      player1MessagePayloadData
    );
    const player2Payload = createMessagePayload(
      Actions.StartGame,
      player2MessagePayloadData
    );

    this.sendMessagesToRoomGamePlayers(player1Payload, player2Payload, roomId);
  }

  public attack(data: IClientAttackData) {
    const { gameId, indexPlayer, x, y } = data;
    if (
      indexPlayer !== this.roomController.getRoomGameCurrentPlayerId(gameId)
    ) {
      return;
    }

    const attackResult = this.roomController.gameAttack(data);

    if (attackResult === AttackResult.Error) {
      return;
    }

    if (this.roomController.isRoomGameOver(gameId)) {
      this.finishGame(gameId);
      this.roomController.deleteRoom(gameId);

      return;
    }

    const playersAttackMessagePayloadData: IServerAttackResultData = {
      position: { x, y },
      currentPlayer: indexPlayer,
      status: attackResult,
    };
    const playersAttackPayload = createMessagePayload(
      Actions.Attack,
      playersAttackMessagePayloadData
    );

    const nextPlayerId = this.roomController.getRoomGameCurrentPlayerId(gameId);
    const playersTurnMessagePayloadData: IServerTurnData = {
      currentPlayer: nextPlayerId,
    };
    const playersTurnPayload = createMessagePayload(
      Actions.Turn,
      playersTurnMessagePayloadData
    );

    this.sendMessagesToRoomGamePlayers(
      playersAttackPayload,
      playersAttackPayload,
      gameId
    );

    this.sendMessagesToRoomGamePlayers(
      playersTurnPayload,
      playersTurnPayload,
      gameId
    );

    const nextPlayer = this.userController.findUserById(nextPlayerId);
    if (nextPlayer && nextPlayer.bot) {
      setTimeout(() => {
        this.randomAttack({ gameId, indexPlayer: nextPlayerId });
      }, 2000);
    }
  }

  public randomAttack(data: IClientRandomAttackData) {
    const randomAttackCoords =
      this.roomController.getRoomGameRandomAttackCoords(data.gameId);

    if (!randomAttackCoords) {
      return;
    }

    this.attack({ ...data, x: randomAttackCoords.x, y: randomAttackCoords.y });
  }

  public startSinglePlay(wsConnection: IWsConnection) {
    const user = this.userController.getUserByConnectionId(wsConnection.id);
    const room = this.createRoom(wsConnection);
    const bot = this.userController.createBot();
    this.roomController.addUserToRoom(bot, room.id);

    this.roomController.createGame(room.id);
    this.roomController.addShipsToBot(room.id, bot.id);

    const messagePayloadData: IServerGameData = {
      idGame: room.id,
      idPlayer: user.id,
    };

    const payload = createMessagePayload(
      Actions.CreateGame,
      messagePayloadData
    );

    sendServerMessage(payload, wsConnection);
  }

  public updateRooms() {
    const payload = createMessagePayload(
      Actions.UpdateRooms,
      this.roomController.getRooms()
    );

    this.broadcast(payload);
  }

  public updateWinners() {
    const payload = createMessagePayload(
      Actions.UpdateWinners,
      this.userController.getWinners()
    );

    this.broadcast(payload);
  }

  public closeConnection(connectionId: string) {
    const disconnectedUserRooms =
      this.roomController.getRoomsByUserConnectionId(connectionId);

    disconnectedUserRooms.forEach((room) => {
      const { game } = room;

      if (game) {
        const gamePlayers = game.getPlayers();
        const connectedUser = Object.values(gamePlayers).find(
          (player) => player.connectionId !== connectionId
        );

        if (connectedUser) {
          const connectedUserWsConnection = this.wsServer.findWsConnectionById(
            connectedUser.connectionId
          );

          if (
            connectedUserWsConnection &&
            connectedUserWsConnection.ws.readyState === WebSocket.OPEN
          ) {
            const disconnectPayload = createMessagePayload(
              Actions.Disconnect,
              {}
            );

            connectedUser.wins += 1;
            this.roomController.deleteRoom(room.id);

            sendServerMessage(disconnectPayload, connectedUserWsConnection);

            this.updateRooms();
            this.updateWinners();

            this.wsServer.removeConnection(connectionId);
          }
        }
      }
    });
  }

  private finishGame(roomId: number) {
    const winPlayer = this.roomController.getRoomGameWinnerId(roomId);

    if (!winPlayer) {
      throw new GameWinnerNotFound();
    }

    const playersFinishGameMessagePayloadData: IServerFinishGameData = {
      winPlayer,
    };
    const playersFinishGamePayload = createMessagePayload(
      Actions.Finish,
      playersFinishGameMessagePayloadData
    );

    this.sendMessagesToRoomGamePlayers(
      playersFinishGamePayload,
      playersFinishGamePayload,
      roomId
    );
    this.updateRooms();
    this.updateWinners();
  }

  private sendMessagesToRoomGamePlayers(
    player1Payload: MessagePayload,
    player2Payload: MessagePayload,
    roomId: number
  ) {
    const { player1, player2 } = this.roomController.getRoomGamePlayers(roomId);
    const player1WsConnection = this.wsServer.findWsConnectionById(
      player1.connectionId
    );
    const player2WsConnection = this.wsServer.findWsConnectionById(
      player2.connectionId
    );

    if (
      player1WsConnection &&
      player1WsConnection.ws.readyState === WebSocket.OPEN
    ) {
      sendServerMessage(player1Payload, player1WsConnection);
    }

    if (
      player2WsConnection &&
      player2WsConnection.ws.readyState === WebSocket.OPEN
    ) {
      sendServerMessage(player2Payload, player2WsConnection);
    }
  }

  private broadcast(messagePayload: MessagePayload) {
    const serverMessage = createServerMessage(messagePayload);

    this.wsServer.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(serverMessage);
      }
    });
  }
}
