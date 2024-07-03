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