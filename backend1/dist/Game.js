import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./Messages.js";
export class Game {
    player1;
    player2;
    board;
    startTime;
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(player, move) {
        if (this.board.turn() === "w" && player !== this.player1)
            return;
        if (this.board.turn() === "b" && player !== this.player2)
            return;
        let result;
        try {
            result = this.board.move(move);
        }
        catch {
            return;
        }
        if (!result)
            return;
        if (this.board.isGameOver()) {
            const winner = this.board.isCheckmate()
                ? this.board.turn() === "w"
                    ? "black"
                    : "white"
                : "draw";
            this.player1.send(JSON.stringify({ type: GAME_OVER, payload: { winner } }));
            this.player2.send(JSON.stringify({ type: GAME_OVER, payload: { winner } }));
        }
        if (this.board.turn() === "w") {
            this.player1.send(JSON.stringify({ type: MOVE, payload: result }));
        }
        else {
            this.player2.send(JSON.stringify({ type: MOVE, payload: result }));
        }
    }
}
//# sourceMappingURL=Game.js.map