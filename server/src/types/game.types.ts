import GamePlayer from "../base/GamePlayer.js";

export type GameData = {
    gameId: string;
    players: GamePlayer[];
    state: GameState;
    gameData: CustomGameData;
}

export type CustomGameData = {
    [key: string]: any;
}

export type CustomPlayerData = {
    [key: string]: any;
}

export enum GameState {
    WAITING = 'WAITING',
    STARTED = 'STARTED',
    ENDED = 'ENDED'
}