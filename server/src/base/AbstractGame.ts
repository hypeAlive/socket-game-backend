import { CustomGameData, GameState } from "../types/game.types.js";
import GamePlayer from "./GamePlayer.js";

export default abstract class AbstractGame<T extends CustomGameData> {
    gameUUID: string;
    private currentPlayer: GamePlayer<T> | null = null;
    private players: GamePlayer<T>[] = [];
    private gameState: GameState = GameState.WAITING;
    private maxPlayers: number;
    private minPlayers: number;

    constructor(gameId: string, maxPlayers: number, minPlayers: number) {
        this.gameUUID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.maxPlayers = maxPlayers;
        this.minPlayers = minPlayers;
    }

    public startGame() {
        if (this.players.length < this.minPlayers || this.players.length > this.maxPlayers) return;
        this.currentPlayer = this.players[0];
        this.gameState = GameState.STARTED;
    }

    public endGame() {
        this.gameState = GameState.ENDED;
    }

    abstract onPlayerAction(player: GamePlayer<T>, action: any): void;

    abstract checkWin(): boolean;

    protected getCurrentPlayer(): GamePlayer<T> | null {
        return this.currentPlayer;
    }

    protected getPlayers(): GamePlayer<T>[] {
        return this.players;
    }

    protected nextTurn() {
        if (this.currentPlayer) {
            const currentPlayerIndex = this.players.indexOf(this.currentPlayer);
            this.currentPlayer = this.players[(currentPlayerIndex + 1) % this.players.length];
        } else {
            this.currentPlayer = this.players[0];
        }
    }

    public addPlayer(player: GamePlayer<T>) {
        if (this.players.length < this.maxPlayers) {
            this.players.push(player);
        }
    }

    public removePlayer(playerId: string) {
        this.players = this.players.filter(player => player.getPlayerId() !== playerId);
    }
}
