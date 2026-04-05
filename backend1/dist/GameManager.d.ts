import type WebSocket from "ws";
export declare class GameManager {
    private games;
    private pendingUser;
    private users;
    constructor();
    addUser(socket: WebSocket): void;
    removerUser(socket: WebSocket): void;
    private addhandler;
}
//# sourceMappingURL=GameManager.d.ts.map