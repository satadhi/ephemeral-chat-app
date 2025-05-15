'use client';

import { IMessagePayload } from "@/types";

type Props = {
    myName: string;
    onAddRoom: (roomName: string) => void; // Updated to accept a room name
    birdView: IMessagePayload
};

export default function ChatStatusBar({ myName, onAddRoom, birdView }: Props) {
    const handleAddRoom = () => {
        const roomName = prompt('Enter the name of the new room:');
        if (roomName && roomName.trim()) {
            onAddRoom(roomName.trim());
        }
    };

    return (
        <div className="py-2 flex flex-row">
            <div className="flex items-center justify-between mb-2">
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
                    onClick={handleAddRoom}
                >
                    <span>Add Room</span>
                    <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                    >
                        <path d="M12 4v16m8-8H4"></path>
                    </svg>
                </button>
            </div>
            <div className="flex-1 flex items-center justify-center space-x-2 overflow-x-auto">
                {birdView?.roomId && (
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        {birdView.roomId}
                    </span>
                )}
                {birdView?.createdBy && (
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        {birdView.createdBy}
                    </span>
                )}
                {birdView?.event && (
                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                        {birdView.event}
                    </span>
                )}
                {birdView?.messageValue && (
                    <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold">
                        {birdView.messageValue}
                    </span>
                )}
            </div>
            <div className="text-right pr-8">
                <span className="inline-block text-gray-700">
                    <span className="inline-block align-text-bottom w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span>{' '}
                    <b>{myName}</b>
                    <span className="inline-block align-text-bottom"></span>
                </span>
            </div>
        </div>
    );
}