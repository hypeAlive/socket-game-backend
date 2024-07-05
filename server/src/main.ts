import {GameHandler} from "./base/game/GameHandler.js";
import TikTakToeGame from "./games/tiktaktoe/TikTakToeGame.js";
import {GameEvents} from "./base/game/GameEvents.js";
import {GameId, GameState, TikTakToeNamespace} from "socket-game-types";
import BaseGame from "./base/game/BaseGame.js";
import {PlayerId} from "socket-game-types/dist/base/game.types.js";

const gameHandler = new GameHandler();

let i = 0;
let j = 0;
let j2 = 0;

gameHandler.subscribe(GameEvents.ALL, (event) => {
    console.log(event.type, event.data);
    if(event.type === GameEvents.NEXT_TURN) {
        i = i > 0 ? 0 : 1;
        let newJ;
        if(i > 0) {
            newJ = j2;
            j2++;
        } else {
            newJ = j;
            j++;
        }
        gameHandler.sendAction(event.data.gameId, event.data.currentPlayerId, {
            x: i,
            y: newJ
        });
    }
});

gameHandler.register(TikTakToeGame.GAME_TYPE);

const exampleGame: BaseGame<any, any, any> = gameHandler.create(TikTakToeNamespace);
const exampleGameId: GameId = exampleGame.getGameId();

const examplePlayer1 = joinGame(exampleGameId);
const examplePlayer2 = joinGame(exampleGameId);
exampleGame.startGame();

function joinGame(gameid: GameId): PlayerId {
   return gameHandler.join(gameid);
}

gameHandler.getAllGames(TikTakToeNamespace, GameState.WAITING)
    .forEach((game: BaseGame<any, any, any>) => {
        gameHandler.getGameId(game);
    });

while (true) {
    // wait for events
}

