import BaseGame from "../../base/game/BaseGame.js";
import GamePlayer from "../../base/game/GamePlayer.js";
import {GameData, PlayerData, TikTakToeAction, TikTakToeGameData} from "socket-game-types";
import {GameType} from "../../types/base/game.type.js";
import {TikTakToeNamespace as NAMESPACE} from "socket-game-types";

export default class TikTakToeGame extends BaseGame<PlayerData, TikTakToeGameData, TikTakToeAction> {

    public static readonly GAME_TYPE: GameType<PlayerData, GameData, TikTakToeAction> = {
        namespace: NAMESPACE,
        creation: () => new TikTakToeGame()
    }

    private static readonly MAX_PLAYERS = 2;
    private static readonly MIN_PLAYERS = 2;

    private get board(): (boolean | null)[][] {
        return this.getGameData().board;
    }


    constructor() {
        super(TikTakToeGame.MAX_PLAYERS, TikTakToeGame.MIN_PLAYERS, {
            board: Array(3).fill(null).map(() => Array(3).fill(null)),
        });
    }

    protected checkWin(): GamePlayer<PlayerData> | null {
        for (let i = 0; i < 3; i++) {
            if (this.board[i][0] !== null && this.board[i][0] === this.board[i][1] && this.board[i][1] === this.board[i][2]) {
                return this.board[i][0] ? this.players[1] : this.players[0];
            }
            if (this.board[0][i] !== null && this.board[0][i] === this.board[1][i] && this.board[1][i] === this.board[2][i]) {
                return this.board[0][i] ? this.players[1] : this.players[0];
            }
        }
        if (this.board[0][0] !== null && this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2]) {
            return this.board[0][0] ? this.players[1] : this.players[0];
        }
        if (this.board[0][2] !== null && this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0]) {
            return this.board[0][2] ? this.players[1] : this.players[0];
        }
        return null;
    }

    protected onPlayerAction(player: GamePlayer<PlayerData>, action: TikTakToeAction): boolean {
        if(!this.isPlayerActionValid(action)) return false;

        const {x, y} = action as TikTakToeAction;

        this.board[x][y] = player === this.players[0];

        return true;
    }

    private isPlayerActionValid(action: object): boolean {

        const {x, y} = action as TikTakToeAction;

        return x >= 0 && x < 3 && y >= 0 && y < 3 && this.board[x][y] === null;
    }

    onGameEnd(): void {
    }

    onGameStart(): void {
    }

}