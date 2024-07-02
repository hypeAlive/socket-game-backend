import AbstractGame from "../../base/AbstractGame.js";
import GamePlayer from "../../base/GamePlayer.js";
import {CustomGameData} from "../../types/game.types.js";

export interface TikTakToeGameData extends CustomGameData {
    row: number;
    col: number;
}

export interface TikTakToePlayerData {
    playerId: string;
}

export default class TikTakToeGame extends AbstractGame<TikTakToePlayerData> {
    private static readonly GAME_ID = 'tiktaktoe';
    private static readonly MAX_PLAYERS = 2;
    private static readonly MIN_PLAYERS = 2;
    private readonly board: (boolean | null)[][];

    constructor() {
        super(TikTakToeGame.GAME_ID, TikTakToeGame.MAX_PLAYERS, TikTakToeGame.MIN_PLAYERS);
        this.board = Array(3).fill(null).map(() => Array(3).fill(null));
    }

    checkWin(): boolean {
        for (let i = 0; i < 3; i++) {
            if (this.board[i][0] !== null && this.board[i][0] === this.board[i][1] && this.board[i][1] === this.board[i][2]) {
                return true;
            }
            if (this.board[0][i] !== null && this.board[0][i] === this.board[1][i] && this.board[1][i] === this.board[2][i]) {
                return true;
            }
        }
        if (this.board[0][0] !== null && this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2]) {
            return true;
        }
        if (this.board[0][2] !== null && this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0]) {
            return true;
        }
        return false;
    }

    onPlayerAction(player: GamePlayer<TikTakToePlayerData>, action: { row: number; col: number }): void {
        if (this.board[action.row][action.col] === null) {
            this.board[action.row][action.col] = player.getPlayerId() === this.getPlayers()[0].getPlayerId();
            if (this.checkWin()) {
                this.endGame();
            } else {
                this.nextTurn();
            }
        }
    }
}
