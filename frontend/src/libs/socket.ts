import { io, Socket } from 'socket.io-client';

class SocketSingleton {
    private static instance: SocketSingleton;
    private socket: Socket | null = null;

    private constructor() { }

    public static getInstance(): SocketSingleton {
        if (!SocketSingleton.instance) {
            SocketSingleton.instance = new SocketSingleton();
        }
        return SocketSingleton.instance;
    }

    public getSocket(userId: string): Socket {
        if (!this.socket) {
            this.socket = io(`ws://localhost:3001`, {
                query: { userId },
            });
        }
        return this.socket;
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export default SocketSingleton;