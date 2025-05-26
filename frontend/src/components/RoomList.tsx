'use client';

type Props = {
  rooms: string[];
  currentRoom: string;
  onSelectRoom: (roomId: string) => void;
  subRoomList: string[];
};

export default function RoomList({ rooms, subRoomList, currentRoom, onSelectRoom }: Props) {

  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        You are all alone :(
      </div>
    );
  }

  return (
    <div className="room-list">
      {rooms.map((room) => (
        <div
          key={room}
          className={`entry cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-white mb-4 rounded p-4 flex shadow-md ${room === currentRoom ? 'border-l-4 border-red-500' : ''
            }`}
          onClick={() => onSelectRoom(room)}
        >
          <div className="flex">
            <div className="w-12 h-12 relative">
              <img
                className="w-12 h-12 rounded-full mx-auto"
                src={`https://i.pravatar.cc/150?u=${room}`}
                alt="chat-user"
              />
              <span className="absolute w-4 h-4 bg-green-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
            </div>
          </div>
          <div className="flex-1/2 px-2">
            <div className="truncate w-32">
              <span className="text-gray-800">{room} {subRoomList?.hasOwnProperty(room)} {subRoomList.toString()}</span>
            </div>
            <div>
              <small className="text-gray-600">No Preview !</small>
            </div>
          </div>
          <div className="flex-1 text-right">
            <div>
              <small className="text-gray-500"> ?? </small>
            </div>
            <div>
              <small className={`text-xs ${subRoomList.includes(room) ? 'bg-green-500' : 'bg-gray-800'} text-white rounded-full h-4 w-4 leading-4 text-center inline-block`}>
              </small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}