'use client';

import { useEffect, useRef, useState } from 'react';
import SocketSingleton from '@/libs/socket';
import { IMessagePayload } from '@/types';

type Props = {
  roomId: string;
  userId: string;
  messagesList: IMessagePayload[];
};

export default function ChatSection({ roomId, messagesList, userId }: Props) {

  if (!messagesList || messagesList.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No messages yet!
      </div>
    );
  }
  return (
    <div className="chat-section">
      <div className="messages">
        {messagesList.map((message, index) => (
          <div
            key={index}
            className={`message mb-4 flex ${message.createdBy === userId ? 'text-right flex-row-reverse' : ''
              }`}
          >
            <div className="flex">
              <div className="w-12 h-12 relative">
                <img
                  className="w-12 h-12 rounded-full mx-auto"
                  src={`https://avatar.iran.liara.run/public?username=${message.createdBy}`}
                  alt="chat-user"
                />
                <span
                  className={`absolute w-4 h-4 rounded-full right-0 bottom-0 border-2 border-white ${message.createdBy === userId ? 'bg-blue-400' : 'bg-gray-400'
                    }`}
                ></span>
              </div>
            </div>
            <div className="flex-1 px-2">
              <div
                className={`inline-block rounded-full p-2 px-6 ${message.createdBy === userId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-700'
                  }`}
              >
                <span>{message.messageValue}</span>
              </div>
              <div className={`${message.createdBy === userId ? 'pr-4' : 'pl-4'}`}>
                <small className="text-gray-500">
                  {message.createdBy} {new Date(message.createdAt ?? 0).toLocaleTimeString()}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}