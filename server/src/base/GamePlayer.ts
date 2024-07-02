import {CustomPlayerData} from "../types/game.types.js";

export default class GamePlayer<T extends CustomPlayerData> {
    private readonly playerId: string;
    private playerData: T;

    constructor(playerId: string, playerData: T) {
        this.playerId = playerId;
        this.playerData = playerData;
    }

    getPlayerId(): string {
        return this.playerId;
    }

    getPlayerData(): T {
        return this.playerData;
    }

    setPlayerData(playerData: T) {
        this.playerData = playerData;
    }
}