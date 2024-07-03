import {GameEvents} from "./GameEvents.js";
import {GameHandler} from "./GameHandler.js";
import GamePlayer from "./GamePlayer.js";
import {GameActions, GameData, GameState, PlayerData} from "socket-game-types";

export default abstract class BaseGame<PD extends PlayerData, GD extends GameData, GA extends GameActions> {

    private gameHandler!: GameHandler;
    private readonly maxPlayers: number;
    private readonly minPlayers: number;
    private gameData!: GD;
    protected players: GamePlayer<PD>[] = [];
    private currentPlayer!: GamePlayer<PD>;

    private state: GameState = GameState.WAITING;

    protected constructor(maxPlayers: number, minPlayers: number) {
        this.maxPlayers = maxPlayers;
        this.minPlayers = minPlayers;
    }

    public init(gameHandler: GameHandler) {
        this.gameHandler = gameHandler;
        this.gameHandler.callEvent({
            type: GameEvents.GAME_CREATED,
            data: null
        });
    }

    startGame(): void {
        if(!this.gameHandler)
            throw new Error("GameHandler not set");

        if(this.players.length < this.minPlayers || this.players.length > this.maxPlayers)
            throw new Error("Not enough players");

        this.randomizePlayerOrder();

        this.state = GameState.STARTED;

        this.currentPlayer = this.players[0];

        this.gameHandler.callEvent({
            type: GameEvents.GAME_STARTED,
            data: null
        });

        this.onGameStart();
    }

    private randomizePlayerOrder(): void {
        this.players.sort(() => Math.random() - 0.5);
    }

    abstract onGameStart(): void;

    abstract onGameEnd(): void;

    joinGame(player: GamePlayer<PD>): void {
        if(!this.gameHandler)
            throw new Error("GameHandler not set");
        if(this.state !== GameState.WAITING)
            throw new Error("Game already started");

        if(this.players.length < this.maxPlayers) {
            this.players.push(player);
            this.gameHandler.callEvent({
                type: GameEvents.PLAYER_JOINED,
                data: player.getPlayerData()
            });
        }
    }

    leaveGame(playerId: string): void {
        if(!this.gameHandler)
            throw new Error("GameHandler not set");
        if(this.players.find(player => player.getPlayerId() === playerId) === undefined)
            throw new Error("Player not found");

        this.players = this.players.filter(player => player.getPlayerId() !== playerId);
        this.gameHandler.callEvent({
            type: GameEvents.PLAYER_LEFT,
            data: playerId
        });
        if(this.state !== GameState.STARTED) return;

        if(this.players.length <= 1) {
            this.endGame(this.players[0] || null);
        }

        if(this.currentPlayer.getPlayerId() === playerId) {
            this.nextTurn();
        }
    }

    /**
     * Prüft, ob ein Spieler gewonnen hat
     * @returns GamePlayer<PD> | null - Gibt den Gewinner zurück, oder null, wenn es keinen gibt
     */
    protected abstract checkWin(): GamePlayer<PD> | null;

    /**
     * Behandelt die Aktion eines Spielers, returnt true wenn, der spieler seinen Zug beendet hat und der nächste dran ist
     *
     * @param player - Spieler, der die Aktion ausführt
     * @param action - Aktion, die ausgeführt wird
     *
     * @returns boolean - true, wenn der Spieler seinen Zug beendet hat, sonst false
     */
    protected abstract onPlayerAction(player: GamePlayer<PD>, action: GA): boolean;

    public handleAction(playerId: string, action: GA): void {
        const player = this.players.find(player => player.getPlayerId() === playerId);
        if(!player) {
            throw new Error("Player not found");
        }

        const nextTurn = this.onPlayerAction(player, action);

        if(nextTurn) {
            this.nextTurn();
        }
    }

    private nextTurn(): void {
        if(!this.gameHandler)
            throw new Error("No GameHandler set");
        if(this.state !== GameState.STARTED)
            throw new Error("Game not started");

        const winner = this.checkWin();

        if(winner) {
            this.endGame(winner);
            return;
        }

        if (this.currentPlayer) {
            const currentPlayerIndex = this.players.indexOf(this.currentPlayer);
            this.currentPlayer = this.players[(currentPlayerIndex + 1) % this.players.length];
        } else {
            this.currentPlayer = this.players[0];
        }

        this.gameHandler.callEvent({
            type: GameEvents.NEXT_TURN,
            data: this.currentPlayer.getPlayerData()
        });
    }

    private endGame(winner: GamePlayer<PD> | null): void {
        if(!this.gameHandler)
            throw new Error("No GameHandler set");
        if(this.state !== GameState.STARTED)
            throw new Error("Game not started");

        this.state = GameState.ENDED;

        this.gameData.winnerId = winner?.getPlayerId() || null;

        this.gameHandler.callEvent({
            type: GameEvents.GAME_ENDED,
            data: this.gameData
        });
    }

}