export type PlayerData = {
    playerId: PlayerId,

}

export type GameData = {
    gameId: GameId,
    playerIds: PlayerId[],
    state: GameState,
    currentPlayerId?: PlayerId,
    winnerId?: PlayerId,
}

export enum GameState {
    WAITING = 'WAITING',
    STARTED = 'STARTED',
    ENDED = 'ENDED'
}

export type GameActions = {
    playerId: PlayerId,

}

export type GameId = [gameNamespace: string, identifier: number];

export type PlayerId = [gameId: GameId, identifier: number];