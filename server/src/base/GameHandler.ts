import AbstractGame from "./AbstractGame.js";

export default class GameHandler {
    private games: Map<string, AbstractGame<any>> = new Map();

    createGame(game: AbstractGame<any>) {
        this.games.set(game.gameUUID, game);
    }

    joinGame(gameUUID: string, player: any) {
        const game = this.games.get(gameUUID);
        if (game) {
            game.addPlayer(player);
        }
    }

    leaveGame(gameUUID: string, playerId: string) {
        const game = this.games.get(gameUUID);
        if (game) {
            game.removePlayer(playerId);
        }
    }

    getGame(gameUUID: string): AbstractGame<any> | undefined {
        return this.games.get(gameUUID);
    }
}