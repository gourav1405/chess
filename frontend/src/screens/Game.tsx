import { useEffect, useState } from "react";
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { Chess } from 'chess.js'

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";


export const Game = () => {
    const socket = useSocket()
    const [chess, setchess] = useState(new Chess())
    const [board, setboard] = useState(chess.board())
    const [started, setstarted] = useState(false)

    useEffect(() => {
        if (!socket) return;
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('message', message);
            switch (message.type) {
                case INIT_GAME:
                    setboard(chess.board())
                    setstarted(true)
                    break
                case MOVE:
                    const move = message.payload
                    chess.move(move)
                    setboard(chess.board())
                    break
                case GAME_OVER:
                    break
                default:
                    console.warn("Unknown message type:", message.type);
            }
        };
    }, [socket])


    if (!socket) {
        return <div>Connecting to server...</div>
    }
    return (
        <div className="justify-center flex">
            <div className="pt-8 max-w-5xl w-full">
                <div className="grid grid-cols-6 gap-4 w-full">
                    <div className="col-span-4 flex justify-center">
                        <ChessBoard board={board} socket={socket} setboard={setboard} chess={chess} />
                    </div>
                    <div className="col-span-2 bg-slate-900 w-full flex justify-center">
                        <div className="pt-8">
                            {!started && (
                                <Button onClick={() => {
                                    socket?.send(JSON.stringify({ type: INIT_GAME }))
                                }}>
                                    Play
                                </Button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}