import {GameEvent, GameEvents, GameEventSubscription} from "./GameEvents.js";
import BaseGame from "./BaseGame.js";
import {GameType} from "../../types/base/game.type.js";
import {GameId} from "socket-game-types";


export class GameHandler {

    private registeredGames: Map<string, GameType<any, any, any>> = new Map();
    private createdGames: Map<GameId, BaseGame<any, any, any>> = new Map();
    private eventSubscriber: Map<GameEvents, GameEventSubscription[]> = new Map();

    /**
     * Erstellt ein neues Spiel eines bestimmten typs, anhand seines namespaces.
     *
     * @param gameNamespace - Namespace des Spiels
     * @throws Error, wenn das Spiel nicht registriert wurde.
     */
    create(gameNamespace: string): void {
        const gameType = this.registeredGames.get(gameNamespace);
        if(!gameType){
            throw new Error("Game not registered");
        }
        const game: BaseGame<any, any, any> = gameType.creation();
        game.init(this);

        this.createdGames.set(this.createGameId(gameNamespace), game);
    }

    public subscribe(event: GameEvents, callback: (event: GameEvent<any>) => void): GameEventSubscription {
        const subscription: GameEventSubscription = new GameEventSubscription(event, callback, this);
        if (!this.eventSubscriber.has(event)) {
            this.eventSubscriber.set(event, []);
        }
        this.eventSubscriber.get(event)?.push(subscription);

        return subscription;
    }

    unsubscribe(subscription: GameEventSubscription): void {
        this.eventSubscriber.forEach((subscriptions, event) => {
            const filteredSubscriptions = subscriptions.filter(sub => sub !== subscription);
            this.eventSubscriber.set(event, filteredSubscriptions);
        });
    }

    public callEvent(event: GameEvent<any>): void {
        this.eventSubscriber.get(event.type)?.forEach(subscription => subscription.getCallback()(event));
        if (event.type !== GameEvents.ALL) {
            this.eventSubscriber.get(GameEvents.ALL)?.forEach(subscription => subscription.getCallback()(event));
        }
    }

    /**
     * Überprüft, ob ein Spiel erstellt wurde im GameHandler
     *
     * @param game - SpielInstanz
     * @returns true, wenn das Spiel erstellt wurde, sonst false
     */
    public isCreated(game: BaseGame<any, any, any>): boolean {
        return this.getGameId(game) !== undefined;
    }

    join(): void {
    }

    leave(): void {
    }

    /**
     * Registriert ein neues Spiel.
     *
     * @param gameType - SpielTyp definition
     * @throws Error, wenn das Spiel bereits registriert wurde.
     */
    register(gameType: GameType<any, any, any>): void {

        if(this.registeredGames.has(gameType.namespace)){
            throw new Error("Game already registered");
        }

        this.registeredGames.set(gameType.namespace, gameType);

    }

    public sendAction(gameId: GameId, playerId: string, action: object): void {
        const game = this.createdGames.get(gameId);
        if (!game) {
            throw new Error("Game not found");
        }
        game.handleAction(playerId, action);
    }

    /**
     * Gibt die GameId für ein Spiel zurück.
     *
     * @param game - SpielInstanz
     * @returns GameId oder undefined, wenn das Spiel nicht gefunden wurde.
     */
    public getGameId(game: BaseGame<any, any, any>): GameId | undefined {
        return Array.from(this.createdGames.entries())
            .find(([, value]) => value === game)?.[0];
    }

    /**
     * Erzeugt eine neue GameId für ein Spiel.
     *
     * @param gameNamespace
     * @private
     */
    private createGameId(gameNamespace: string): GameId {
        const gameIds = Array.from(this.createdGames.keys())
            .filter(([id]) => id === gameNamespace)
            .map(([, number]) => number)
            .sort((a, b) => a - b);
        let nextNumber = 0;
        for (const number of gameIds) {
            if (number !== nextNumber) {
                break;
            }
            nextNumber++;
        }
        return [gameNamespace, nextNumber];
    }

}