import {GameHandler} from "./GameHandler.js";
import {GameData} from "../../types/base/game.type.js";

export enum GameEvents {
    GAME_CREATED = 'GAME_CREATED',
    GAME_STARTED = 'GAME_STARTED',
    GAME_ENDED = 'GAME_ENDED',
    PLAYER_JOINED = 'PLAYER_JOINED',
    PLAYER_LEFT = 'PLAYER_LEFT',
    GAME_STATE_CHANGED = 'GAME_STATE_CHANGED',
    GAME_DATA_CHANGED = 'GAME_DATA_CHANGED',
    PLAYER_DATA_CHANGED = 'PLAYER_DATA_CHANGED',
    GAME_ERROR = 'GAME_ERROR',
    NEXT_TURN = 'NEXT_TURN',
    ALL = 'ALL'
}

export class GameEventSubscription {

    private type: GameEvents;
    private callback: (event: GameEvent<any>) => void;
    private gameHandler: GameHandler;

    constructor(type: GameEvents, callback: (event: GameEvent<any>) => void, gameHandler: GameHandler) {
        this.type = type;
        this.callback = callback;
        this.gameHandler = gameHandler;
    }

    unsubscribe(): void {
        this.gameHandler.unsubscribe(this);
    }

    getType(): GameEvents {
        return this.type;
    }

    getCallback(): (event: GameEvent<any>) => void {
        return this.callback;
    }
}

export interface GameEvent<GD extends GameData> {
    type: GameEvents;
    data: GD;
}



