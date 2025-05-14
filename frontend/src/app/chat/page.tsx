'use client';

import { useEffect, useState } from 'react';
import UserEntry from '@/components/UserEntry';
import RoomList from '@/components/RoomList';
import ChatSection from '@/components/ChatSection';
import { getSocket } from '@/libs/socket';
import ChatStatusBar from '@/components/ChatStatusBar'

export default function ChatPage() {
  const [userId, setUserId] = useState('QQQ-345-1234');
  const [rooms, setRooms] = useState<string[]>(['Gaming', 'Foods', 'Paradise']);
  const [currentRoom, setCurrentRoom] = useState<string | null>('Foods');

  useEffect(() => {
    if (!userId) return;

    const socket = getSocket(userId);

    socket.emit('get-rooms');

    const handleRoomList = (roomList: string[]) => {
      setRooms(roomList);
      if (!currentRoom && roomList.length > 0) {
        setCurrentRoom(roomList[0]); // default to first room
      }
    };

    socket.on('room-list', handleRoomList);

    return () => {
      socket.off('room-list', handleRoomList);
    };
  }, [userId]);

  // if (!userId) return <UserEntry onSubmit={setUserId} />;

  return (
    // <div style={{ display: 'flex', height: '100vh' }}>
    //   <RoomList rooms={rooms} currentRoom={currentRoom!} onSelectRoom={setCurrentRoom} />
    //   {currentRoom && <ChatSection roomId={currentRoom} userId={userId} />}
    // </div>
    <div className="w-full h-screen">
      <div className="bg-pink-100/50 backdrop-blur-md flex justify-center items-center min-h-screen">
        <div className="bg-white text-[#181028] p-8 space-y-4 rounded-xl w-full max-w-max shadow-[50px_20px_16px_rgba(0,0,0,0.20)]">
          <div className="main-body container w-[90vw] flex flex-col h-full">
            <ChatStatusBar />

            <div className="main flex flex-col">
              <div className="hidden lg:block heading flex-2">
                <h1 className="text-3xl text-gray-700 mb-4">Chat</h1>
              </div>

              <div className="flex-1 flex h-full">
                <div className="sidebar hidden lg:flex w-1/3  flex-col pr-6">

                  <div className="flex-1 h-full overflow-auto px-2">
                    <RoomList rooms={rooms} currentRoom={currentRoom!} onSelectRoom={setCurrentRoom} />
                  </div>
                </div>

                <div className="chat-area flex lg:w-2/3 w-full flex-col">
                  <div className="">
                    <h2 className="text-xl py-1 mb-8 border-b-2 border-gray-200">Chatting with <b>Mercedes Yemelyan</b></h2>
                  </div>
                  <div className="messages flex-1 overflow-auto">
                    {currentRoom && <ChatSection roomId={currentRoom} userId={userId} />}
                  </div>
                  <div className="pt-4 pb-10">
                    <div className="write bg-white shadow flex rounded-lg">
                      <div className="flex content-center items-center text-center p-4 pr-0">
                        <span className="block text-center text-gray-400 hover:text-gray-800">
                          <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" className="h-6 w-6"><path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </span>
                      </div>
                      <div className="flex-1">
                        <textarea name="message" className="w-full block outline-none py-4 px-4 bg-transparent" rows={1} placeholder="Type a message..." autoFocus></textarea>
                      </div>
                      <div className="p-2 flex content-center items-center justify-end">
                        <div className="">
                          <button className="bg-blue-400 w-10 h-10 rounded-full inline-block">
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
