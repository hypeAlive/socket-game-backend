import {PlayerData} from "socket-game-types";
import {PlayerId} from "socket-game-types/dist/base/game.types.js";
import BaseGame from "./BaseGame.js";
import {GameEvents} from "./GameEvents.js";

export default class GamePlayer<PD extends PlayerData> {

    private readonly playerId: PlayerId;
    private playerData: PD;
    private readonly game: BaseGame<any, any, any>;

    constructor(playerId: PlayerId, game: BaseGame<any, any, any>) {
        this.playerId = playerId;
        this.game = game;
        this.playerData = {
            playerId: playerId
        } as PD;
    }

    getPlayerId(): PlayerId {
        return this.playerId;
    }

    getPlayerData(): PD {
        return this.playerData;
    }

    updatePlayerData(playerData: Partial<PD>) {
        this.playerData = {...this.playerData, ...playerData};
        this.game.getGameHandler().callEvent({
            type: GameEvents.PLAYER_DATA_CHANGED,
            data: {
                gameId: this.game.gameId,
                playerId: this.playerId,
                playerData: this.playerData
            }
        })
    }

}