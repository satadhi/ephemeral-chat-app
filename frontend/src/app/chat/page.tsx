'use client';

import { useEffect, useState } from 'react';
import UserEntry from '@/components/UserEntry';
import RoomList from '@/components/RoomList';
import ChatSection from '@/components/ChatSection';
import SocketSingleton from '@/libs/socket';
import ChatStatusBar from '@/components/ChatStatusBar'
import { IMessagePayload } from '@/types';
import { useRef } from 'react';

export default function ChatPage() {
  const [userId, setUserId] = useState('');
  const [rooms, setRooms] = useState<string[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [roomMessages, setRoomMessages] = useState<Record<string, IMessagePayload[]>>({});
  const [subscribedRooms, setSubscribedRooms] = useState<string[]>([]);
  const [birdView, setBirdView] = useState<IMessagePayload>({
    messageValue: '',
    roomId: '',
    createdBy: '',
    event: '',
  });
  const messageInputRef = useRef<HTMLTextAreaElement>(null);


  useEffect(() => {
    const storedUserId = localStorage.getItem('uniqueUsername');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const socketInstance = SocketSingleton.getInstance();
    const socket = socketInstance.getSocket(userId);

    const handleMessages = (messages: IMessagePayload) => {
      setBirdView(messages);
      console.log('Room added:', messages);
      switch (messages.event) {
        case 'room_added':
          setRooms((prev) => [...prev, messages.roomId]);
          break
        case 'send_message':
          setRoomMessages((prev) => {
            const roomId = messages.roomId;
            if (prev[roomId]) {
              return {
                ...prev,
                [roomId]: [...prev[roomId], messages],
              };
            } else {
              return {
                ...prev,
                [roomId]: [messages],
              };
            }
          });
          break;
        default:
          console.log('Unknown event:', messages.event);
      }
    };

    socket.on('get_messages', handleMessages);
  }, [userId]);

  const addRoomHandler = (roomName: string) => {
    if (!roomName.trim()) return;

    const socketInstance = SocketSingleton.getInstance();
    const socket = socketInstance.getSocket(userId);

    socket.emit('create_room', { roomId: roomName });

  };

  const sendMessageHandler = () => {
    if (!currentRoom || !userId) return;
    const socketInstance = SocketSingleton.getInstance();
    const socket = socketInstance.getSocket(userId);
    const messagePayload: Partial<IMessagePayload> = {
      messageValue: messageInputRef.current?.value,
      roomId: currentRoom,
      createdBy: userId,
      event: 'send_message',
    }

    socket.emit('send_message', messagePayload);

    if (messageInputRef.current) {
      messageInputRef.current.value = '';
    }
  }

  const setCurrentRoomHandler = (roomId: string) => {
    setCurrentRoom(roomId);
    const socketInstance = SocketSingleton.getInstance();
    const socket = socketInstance.getSocket(userId);
    setSubscribedRooms((prev) => {
      if (roomId in prev) {
        socket.emit('seek_room_history', { roomId })
        return prev;
      } else {
        socket.emit('join_room', { roomId });
        return [...prev, roomId];
      }
    });
  }

  if (!userId) return <UserEntry onSubmit={setUserId} />;

  return (
    <div className="w-full h-screen">
      <div className="bg-pink-100/50 backdrop-blur-md flex justify-center items-center min-h-screen">
        <div className="bg-white text-[#181028] h-[80vh] px-8 pt-8 space-y-4 rounded-xl w-full max-w-max shadow-[50px_20px_16px_rgba(0,0,0,0.20)]">
          <div className="main-body container w-[90vw] flex flex-col h-full">
            <ChatStatusBar myName={userId} birdView={birdView} onAddRoom={addRoomHandler} />

            <div className="main flex flex-col flex-1">
              <div className="flex-1 flex h-full">
                <div className="sidebar hidden md:flex w-[25%] h-full  flex-col pr-6 flex-shrink-0">

                  <div className="flex-1 h-full overflow-auto px-2">
                    <RoomList rooms={rooms} currentRoom={currentRoom!} onSelectRoom={setCurrentRoomHandler} />
                  </div>
                </div>

                <div className="chat-area flex lg:w-[75%] w-full h-full flex-col">
                  <div className="">
                    <h2 className="text-xl py-1 mb-8 border-b-2 border-gray-200">Gossip is on for: <b>{currentRoom || 'Nothingness :('}</b></h2>
                  </div>
                  <div className="messages flex flex-col justify-end flex-1">
                    {currentRoom && <ChatSection roomId={currentRoom} messagesList={roomMessages[currentRoom]} userId={userId} />}
                  </div>
                  <div className="pt-4 pb-5">
                    <div className="write bg-white shadow flex rounded-lg">
                      <div className="flex content-center items-center text-center p-4 pr-0">
                        <span className="block text-center text-gray-400 hover:text-gray-800">
                          <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" className="h-6 w-6"><path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </span>
                      </div>
                      <div className="flex-1">
                        <textarea
                          name="message"
                          className="w-full block outline-none py-4 px-4 bg-transparent"
                          rows={1}
                          placeholder="Type a message..."
                          autoFocus
                          ref={messageInputRef}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessageHandler();
                            }
                          }}
                        />
                      </div>
                      <div className="p-2 flex content-center items-center justify-end">
                        <div className="">
                          <button className="animate-bounce bg-blue-400 w-10 h-10 rounded-full inline-block" onClick={() => sendMessageHandler()}>
                            <span className="inline-block align-text-bottom">
                              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" className="w-4 h-4 text-white"><path d="M5 13l4 4L19 7"></path></svg>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
