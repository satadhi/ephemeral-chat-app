'use client';

import { useState } from 'react';

type Props = {
  onSubmit: (userId: string) => void;
};

export default function UserEntry({ onSubmit }: Props) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input.trim());
    }
  };

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-semibold mb-4">Enter your user ID</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="User ID or Name"
        className="p-2 border border-gray-300 rounded w-52"
      />
      <button
        onClick={handleSubmit}
        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Join
      </button>
    </div>
);
}