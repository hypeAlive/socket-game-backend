import BaseGame from "../../base/game/BaseGame.js";
import {GameActions, GameData, PlayerData} from "socket-game-types";

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