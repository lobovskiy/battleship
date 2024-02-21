import { httpServer } from './src/http_server';
import { WsServer } from './src/ws_server';
import { Battleship } from './src/battleship';

const HTTP_PORT = Number(process.env.HTTP_PORT) || 8181;
const WS_PORT = Number(process.env.WS_PORT) || 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wsServer = new WsServer(WS_PORT);
const app = new Battleship();
wsServer.setConnectionHandlerApp(app);
