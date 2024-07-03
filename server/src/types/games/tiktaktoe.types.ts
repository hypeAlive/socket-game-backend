import {GameActions, GameData} from "../base/game.type.js";

export type TikTakToeAction = GameActions & {
    x: number,
    y: number
}

export type TikTakToeGameData = GameData & {
    board: (boolean | null)[][]
}