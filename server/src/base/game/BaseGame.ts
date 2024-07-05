import {GameEvents} from "./GameEvents.js";
import {GameHandler} from "./GameHandler.js";
import GamePlayer from "./GamePlayer.js";
import {GameActions, GameData, GameId, GameState, PlayerData} from "socket-game-types";
import {PlayerId} from "socket-game-types/dist/base/game.types.js";

export default abstract class BaseGame<PD extends PlayerData, GD extends GameData, GA extends GameActions> {

    private gameHandler!: GameHandler;
    private readonly maxPlayers: number;
    private readonly minPlayers: number;
    private gameData!: GD;
    protected players: GamePlayer<PD>[] = [];

    private readonly initialCustomGameData: Partial<GD>;

    protected constructor(maxPlayers: number, minPlayers: number, initialCustomGameData: Partial<GD>) {
        this.maxPlayers = maxPlayers;
        this.minPlayers = minPlayers;
        this.initialCustomGameData = initialCustomGameData;
    }

    public init(gameHandler: GameHandler, gameId: GameId) {
        this.gameHandler = gameHandler;

        this.gameData = {
            gameId: gameId,
            state: this.state,
            playerIds: [],
            ...this.initialCustomGameData
        } as unknown as GD;

        this.gameHandler.callEvent({
            type: GameEvents.GAME_CREATED,
            data: this.gameData
        });
    }

    startGame(): void {
        if (!this.gameHandler)
            throw new Error("GameHandler not set");

        if (this.players.length < this.minPlayers || this.players.length > this.maxPlayers)
            throw new Error("Not enough players");

        this.randomizePlayerOrder();

        this.state = GameState.STARTED;
        this.gameData.state = this.state;

        this.gameHandler.callEvent({
            type: GameEvents.GAME_STARTED,
            data: this.gameData
        });

        this.onGameStart();

        this.nextTurn();
    }

    private randomizePlayerOrder(): void {
        this.players.sort(() => Math.random() - 0.5);
    }

    abstract onGameStart(): void;

    abstract onGameEnd(): void;

    joinGame(): PlayerId {
        if (!this.gameHandler)
            throw new Error("GameHandler not set");
        if (this.state !== GameState.WAITING)
            throw new Error("Game already started");

        const playerId = this.createPlayerId();
        const player = new GamePlayer<PD>(playerId, this);

        if (this.players.length >= this.maxPlayers)
            throw new Error("Game is full");

        this.players.push(player);
        this.gameData.playerIds.push(playerId);

        this.gameHandler.callEvent({
            type: GameEvents.PLAYER_JOINED,
            data: this.gameData
        });

        return player.getPlayerId();
    }

    leaveGame(playerId: PlayerId): void {
        if (!this.gameHandler)
            throw new Error("GameHandler not set");
        if (this.players.find(player => player.getPlayerId() === playerId) === undefined)
            throw new Error("Player not found");

        this.players = this.players.filter(player => player.getPlayerId() !== playerId);
        this.gameData.playerIds = this.gameData.playerIds.filter(id => id !== playerId);
        this.gameHandler.callEvent({
            type: GameEvents.PLAYER_LEFT,
            data: this.gameData
        });
        if (this.state !== GameState.STARTED) return;

        if (this.players.length <= 1) {
            this.endGame(this.players[0] || null);
        }

        if (this.currentPlayerId === playerId) {
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

    public handleAction(playerId: PlayerId, action: GA): void {
        const player = this.players.find(player => player.getPlayerId() === playerId);
        if (!player) {
            throw new Error("Player not found");
        }

        const nextTurn = this.onPlayerAction(player, action);

        if (nextTurn) {
            this.nextTurn();
        }
    }

    private nextTurn(): void {
        if (!this.gameHandler)
            throw new Error("No GameHandler set");
        if (this.state !== GameState.STARTED)
            throw new Error("Game not started");

        const winner = this.checkWin();

        if (this.currentPlayer) {
            const currentPlayerIndex = this.players.indexOf(this.currentPlayer);
            this.currentPlayerId = this.players[(currentPlayerIndex + 1) % this.players.length].getPlayerId();
        } else {
            this.currentPlayerId = this.players[0].getPlayerId();
        }

        if (winner) {
            this.endGame(winner);
            return;
        } else {
            this.gameHandler.callEvent({
                type: GameEvents.NEXT_TURN,
                data: this.gameData
            });
        }
    }

    private endGame(winner: GamePlayer<PD> | null): void {
        if (!this.gameHandler)
            throw new Error("No GameHandler set");
        if (this.state !== GameState.STARTED)
            throw new Error("Game not started");

        this.state = GameState.ENDED;

        this.gameData.winnerId = winner?.getPlayerId() || undefined;

        this.gameHandler.callEvent({
            type: GameEvents.GAME_ENDED,
            data: this.gameData
        });
    }

    public getState(): GameState {
        return this.state;
    }

    /**
     * Erzeugt eine neue PlayerId für ein Spiel.
     *
     * @private
     */
    private createPlayerId(): PlayerId {
        const playerIds = this.players
            .map(player => player.getPlayerId()[1]) // Get the player identifier part of the PlayerId
            .sort((a, b) => a - b);
        let nextNumber = 0;
        for (const number of playerIds) {
            if (number !== nextNumber) {
                break;
            }
            nextNumber++;
        }
        return [this.gameId, nextNumber]; // Return a PlayerId with the GameId and the new player identifier
    }

    public getGameId(): GameId {
        return this.gameId;
    }

    protected updateGameData(data: Partial<GD>): void {
        this.gameData = {...this.gameData, ...data};
        this.gameHandler.callEvent({
            type: GameEvents.GAME_DATA_CHANGED,
            data: this.gameData
        });
    }

    protected getGameData(): GD {
        return this.gameData as GD;
    }

    get gameId(): GameId {
        return this.gameData.gameId;
    }

    get state(): GameState {
        if(!this.gameData) return GameState.WAITING;
        return this.gameData.state || GameState.WAITING;
    }

    set state(state: GameState) {
        this.gameData.state = state;
    }

    get currentPlayer(): GamePlayer<PD> | null {
        return this.gameData.currentPlayerId ? this.players.find(player => player.getPlayerId() === this.gameData.currentPlayerId) || null : null;
    }

    get currentPlayerId(): PlayerId | null {
        return this.gameData.currentPlayerId || null;
    }

    set currentPlayerId(playerId: PlayerId) {
        this.gameData.currentPlayerId = playerId;
    }

    public getGameHandler(): GameHandler {
        return this.gameHandler;
    }

}