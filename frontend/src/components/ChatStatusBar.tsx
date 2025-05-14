'use client';

type Props = {
    myName: string;
    onAddRoom: (roomName: string) => void; // Updated to accept a room name
};

export default function ChatStatusBar({ myName, onAddRoom }: Props) {
    const handleAddRoom = () => {
        const roomName = prompt('Enter the name of the new room:');
        if (roomName && roomName.trim()) {
            onAddRoom(roomName.trim());
        }
    };

    return (
        <div className="py-4 flex flex-row">
            <div className="flex items-center justify-between mb-4">
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
            <div className="flex-1">
                <span className="lg:hidden inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom">
                    <span className="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </span>
                </span>
            </div>
            <div className="flex-1 text-right pr-8">
                <span className="inline-block text-gray-700">
                    <span className="inline-block align-text-bottom w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span>{' '}
                    <b>{myName}</b>
                    <span className="inline-block align-text-bottom"></span>
                </span>
            </div>
        </div>
    );
}