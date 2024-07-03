import {GameHandler} from "./base/game/GameHandler.js";
import TikTakToeGame from "./games/tiktaktoe/TikTakToeGame.js";
import {GameEvents} from "./base/game/GameEvents.js";

const gameHandler= new GameHandler();

gameHandler.subscribe(GameEvents.ALL, (event) => {
   console.log(event.type, event.data);
});

gameHandler.register(TikTakToeGame.GAME_TYPE);

gameHandler.create(TikTakToeGame.GAME_TYPE.namespace);

