'use client';

import { useEffect, useRef, useState } from 'react';
import { getSocket } from '@/libs/socket';
import type { Message } from '@/types/index';

type Props = {
  roomId: string;
  userId: string;
};

export default function ChatSection({ roomId, userId }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'user1',
      content: 'Hey there. We would like to invite you over to our office for a visit. How about it?',
      timestamp: Date.now() - 60000,
    },
    {
      sender: userId,
      content: "It's like a dream come true",
      timestamp: Date.now() - 30000,
    },
  ]);
  const [input, setInput] = useState('');
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = getSocket(userId);
    socketRef.current = socket;

    socket.emit('join-room', roomId);

    const handleIncoming = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('receive-message', handleIncoming);

    return () => {
      socket.off('receive-message', handleIncoming);
      socket.emit('leave-room', roomId);
    };
  }, [roomId, userId]);

  const sendMessage = () => {
    const message: Message = {
      sender: userId,
      content: input,
      timestamp: Date.now(),
    };
    socketRef.current.emit('send-message', { roomId, message });
    setMessages((prev) => [...prev, message]);
    setInput('');
  };

  return (
    <div className="chat-section">
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message mb-4 flex ${message.sender === userId ? 'text-right flex-row-reverse' : ''
              }`}
          >
            <div className="flex">
              <div className="w-12 h-12 relative">
                <img
                  className="w-12 h-12 rounded-full mx-auto"
                  src={`https://avatar.iran.liara.run/public?username=${message.sender}`}
                  alt="chat-user"
                />
                <span
                  className={`absolute w-4 h-4 rounded-full right-0 bottom-0 border-2 border-white ${message.sender === userId ? 'bg-blue-400' : 'bg-gray-400'
                    }`}
                ></span>
              </div>
            </div>
            <div className="flex-1 px-2">
              <div
                className={`inline-block rounded-full p-2 px-6 ${message.sender === userId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-700'
                  }`}
              >
                <span>{message.content}</span>
              </div>
              <div className={`${message.sender === userId ? 'pr-4' : 'pl-4'}`}>
                <small className="text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}