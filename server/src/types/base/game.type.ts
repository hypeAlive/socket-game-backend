import BaseGame from "../../base/game/BaseGame.js";

/**
 * Typdefinition für ein Spiel.
 * Wird benutzt, um ein Spiel zu registrieren.
 *
 * @namespace - eindeutiger Namespace des Spiels
 * @gameClass - Funktion, die eine Instanz des Spiels erstellt
 */
export interface GameType<PD extends PlayerData, GD extends GameData, GA extends GameActions> {
    namespace: string;
    creation: () => BaseGame<PD, GD, GA>;
}

export type PlayerData = {
    playerId: string,

}

export type GameData = {
    gameId: GameId,
    playerIds: string[],
    currentPlayerId: string,
    winnerId: string | null,
}

export enum GameState {
    WAITING = 'WAITING',
    STARTED = 'STARTED',
    ENDED = 'ENDED'
}

export type GameActions = {

}

export type GameId = [gameNamespace: string, identifier: number];