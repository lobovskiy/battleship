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
  IClientRoomData,
  IClientShipDataset,
  IClientUserData,
  IServerAttackResultData,
  IServerGameData,
  IServerTurnData,
  IServerUserData,
  IServerUserShipsDataset,
  MessagePayload,
} from '../types';

export default class AppController {
  private userController: UserController;

  private roomController: RoomController;

  constructor(private wsServer: IAppWsServer) {
    this.userController = new UserController();
    this.roomController = new RoomController();
  }

  public registerUser(data: IClientUserData, wsConnection: IWsConnection) {
    const user = this.userController.registerUser(
      data.name,
      data.password,
      wsConnection.id
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

    this.roomController.addNewRoom(user);
  }

  public addUserToRoom(data: IClientRoomData, wsConnection: IWsConnection) {
    const user = this.userController.getUserByConnectionId(wsConnection.id);

    return this.roomController.addUserToRoom(user, data.indexRoom);
  }

  public createGame(roomId: number, wsConnection: IWsConnection) {
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
    if (
      data.indexPlayer !==
      this.roomController.getRoomGameCurrentPlayerId(data.gameId)
    ) {
      return;
    }

    const attackResult = this.roomController.gameAttack(data);

    if (attackResult === AttackResult.Error) {
      return;
    }

    const playersAttackMessagePayloadData: IServerAttackResultData = {
      position: { x: data.x, y: data.y },
      currentPlayer: data.indexPlayer,
      status: attackResult,
    };
    const playersAttackPayload = createMessagePayload(
      Actions.Attack,
      playersAttackMessagePayloadData
    );

    const playersTurnMessagePayloadData: IServerTurnData = {
      currentPlayer: this.roomController.getRoomGameCurrentPlayerId(
        data.gameId
      ),
    };
    const playersTurnPayload = createMessagePayload(
      Actions.Turn,
      playersTurnMessagePayloadData
    );

    this.sendMessagesToRoomGamePlayers(
      playersAttackPayload,
      playersAttackPayload,
      data.gameId
    );

    this.sendMessagesToRoomGamePlayers(
      playersTurnPayload,
      playersTurnPayload,
      data.gameId
    );
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

    if (player1WsConnection) {
      sendServerMessage(player1Payload, player1WsConnection);
    }

    if (player2WsConnection) {
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
