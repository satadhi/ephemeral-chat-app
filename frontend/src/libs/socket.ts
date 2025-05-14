// /lib/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (userId: string): Socket => {
    if (!socket) {
        socket = io(`ws://localhost:3001`, {
            query: { userId },
        });
    }
    return socket;
};
