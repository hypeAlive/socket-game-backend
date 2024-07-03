import BaseGame from "../../base/game/BaseGame.js";
import {GameActions, GameData, GameType, PlayerData} from "../../types/game/game.type.js";
import GamePlayer from "../../base/game/GamePlayer.js";

type TikTakToePlayerAction = GameActions & {
    x: number,
    y: number
}

export default class TikTakToeGame extends BaseGame<PlayerData, GameData, TikTakToePlayerAction> {

    public static readonly GAME_TYPE: GameType<PlayerData, GameData, TikTakToePlayerAction> = {
        namespace: TikTakToeGame.constructor.name.toLowerCase(),
        gameClass: () => new TikTakToeGame()
    }

    private static readonly MAX_PLAYERS = 2;
    private static readonly MIN_PLAYERS = 2;

    private readonly board: (boolean | null)[][];


    constructor() {
        super(TikTakToeGame.MAX_PLAYERS, TikTakToeGame.MIN_PLAYERS);
        this.board = Array(3).fill(null).map(() => Array(3).fill(null));
    }

    protected checkWin(): GamePlayer<PlayerData> | null {
        for (let i = 0; i < 3; i++) {
            if (this.board[i][0] !== null && this.board[i][0] === this.board[i][1] && this.board[i][1] === this.board[i][2]) {
                return this.board[i][0] ? this.players[0] : this.players[1];
            }
            if (this.board[0][i] !== null && this.board[0][i] === this.board[1][i] && this.board[1][i] === this.board[2][i]) {
                return this.board[0][i] ? this.players[0] : this.players[1];
            }
        }
        if (this.board[0][0] !== null && this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2]) {
            return this.board[0][0] ? this.players[0] : this.players[1];
        }
        if (this.board[0][2] !== null && this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0]) {
            return this.board[0][2] ? this.players[0] : this.players[1];
        }
        return null;
    }

    protected onPlayerAction(player: GamePlayer<PlayerData>, action: TikTakToePlayerAction): boolean {
        if(!this.isPlayerActionValid(action)) return false;

        const {x, y} = action as TikTakToePlayerAction;

        this.board[x][y] = player === this.players[0];

        return false;
    }

    private isPlayerActionValid(action: object): boolean {

        const {x, y} = action as TikTakToePlayerAction;

        return x >= 0 && x < 3 && y >= 0 && y < 3 && this.board[x][y] === null;
    }

    onGameEnd(): void {
    }

    onGameStart(): void {
    }

}