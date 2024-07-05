import {GameActions, GameData} from "../base/game.types.js";

export const TikTakToeNamespace = 'tiktaktoe';

export type TikTakToeAction = GameActions & {
    x: number,
    y: number
}

export type TikTakToeGameData = GameData & {
    board: (boolean | null)[][]
}