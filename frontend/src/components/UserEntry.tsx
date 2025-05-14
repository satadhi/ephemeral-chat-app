'use client';

import { useState } from 'react';

type Props = {
  onSubmit: (userId: string) => void;
};

export default function UserEntry({ onSubmit }: Props) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    const trimmedInput = input.trim();
    if (trimmedInput) {
      localStorage.setItem('uniqueUsername', trimmedInput); // Save username in localStorage
      onSubmit(trimmedInput);
    }
  };

  return (
    <div className="bg-pink-100/50 backdrop-blur-md flex justify-center items-center min-h-screen">
      <div className="bg-white text-[#181028] px-8 pt-8 space-y-4 rounded-xl w-full max-w-max shadow-[50px_20px_16px_rgba(0,0,0,0.20)]">
        <div className="main-body container w-[20vw] flex flex-col h-full">
          <h2 className="text-2xl font-semibold mb-4 text-center">Enter Your Unique Name</h2>
          <div className="pt-4 pb-5">
            <div className="write bg-white shadow flex rounded-lg">

              <div className="flex-1">
                <textarea
                  name="username"
                  className="w-full block outline-none py-4 px-4 bg-transparent"
                  rows={1}
                  placeholder="Enter your unique name..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  autoFocus
                ></textarea>
              </div>
              <div className="p-2 flex content-center items-center justify-end ">
                <div className="">
                  <button
                    className="bg-blue-400 w-10 h-10 rounded-full inline-block hover:bg-blue-600 hover:cursor-pointer active:scale-90 transition duration-200"
                    onClick={handleSubmit}
                  >
                    <span className="inline-block align-text-bottom">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                        className="w-4 h-4 text-white"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}