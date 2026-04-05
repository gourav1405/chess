import type { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({ board, socket, setboard, chess }: {
    board: (
        {
            square: Square;
            type: PieceSymbol;
            color: Color;
        } | null)[][];
    socket: WebSocket;
    setboard: any
    chess: any
}) => {

    const [from, setfrom] = useState<Square | null>(null)
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    function getSquare(i: number, j: number): Square {
        return `${files[j]}${8 - i}` as Square;
    }

    return (
        <div className="text-white-200">
            {
                board.map((row, i) => {
                    return <div key={i} className="flex">
                        {
                            row.map((square, j) => {
                                return <div onClick={() => {
                                    const clickedSquare = getSquare(i, j);
                                    if (!from) {
                                        setfrom(clickedSquare);
                                    } else {
                                        socket.send(JSON.stringify({
                                            type: MOVE,
                                            move: {
                                                from,
                                                to: clickedSquare
                                            }
                                        }));
                                        setfrom(null);
                                        chess.move({
                                            from,
                                            to: clickedSquare
                                        })
                                        setboard(chess.board())
                                        console.log({
                                            from,
                                            to: clickedSquare
                                        });
                                    }

                                }} key={j} className={`w-16 h-16 ${(i + j) % 2 == 0 ? 'bg-green-500' : 'bg-white'}`}>
                                    <div className="w-full justify-center flex h-full">
                                        <div className="h-full justify-center flex flex-col">
                                            {square ? <img className="rotate-17 w-14" src={`/${square?.color === "b" ? square?.type : `${square?.type?.toUpperCase()} C`}.png`} /> : ''}
                                        </div>

                                    </div>
                                </div>
                            })
                        }


                    </div>
                })
            }
        </div>
    )
}