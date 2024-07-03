import {PlayerData} from "../../types/game/game.type.js";

export default class GamePlayer<PD extends PlayerData> {

    private readonly playerId: string;
    private playerData: PD;

    constructor(playerId: string) {
        this.playerId = playerId;
        this.playerData = {
            playerId: playerId
        } as PD;
    }

    getPlayerId(): string {
        return this.playerId;
    }

    getPlayerData(): PD {
        return this.playerData;
    }

    setPlayerData(playerData: PD) {
        this.playerData = playerData;
    }

}