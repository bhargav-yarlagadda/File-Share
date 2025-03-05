import React from "react";
import { FaUsers } from "react-icons/fa";

// Define the type for a receiver object
interface Receiver {
  id: number;
  joinedAt: string;
}

// Define the props type
interface ShowRecipientsProps {
  receivers: Receiver[];
}

const ShowRecipients = ({ receivers }: ShowRecipientsProps) => {
  return (
    <div className="mt-6 w-full max-w-md bg-gray-800/80 backdrop-blur-lg rounded-lg p-4 border border-blue-400 shadow-lg">
      <div className="flex items-center gap-2 text-lg font-semibold text-blue-200">
        <FaUsers />
        <span>Receivers Joined ({receivers.length})</span>
      </div>
      <ul className="mt-2 text-gray-300">
        {receivers.map((receiver,idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span>Receiver {receiver.id}</span>
            <span className="text-sm text-gray-500">({receiver.joinedAt})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowRecipients;