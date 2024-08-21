import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createChatRoom } from "@/components/_service/admin/admin.service";
import ChatRoom from "./ChatRoom"; // Import the ChatRoom

interface ChatListProps {
  lawyers: Array<{ id: string; name: string }>;
  currentUser: string;
}

const ChatList: React.FC<ChatListProps> = ({ lawyers, currentUser }) => {
  const [selectedRoom, setSelectedRoom] = useState<{
    roomId: string;
    receiver: string;
  } | null>(null);
  console.log("/chat?roomId="+selectedRoom?.roomId+"&currentUser="+currentUser+"&receiver="+selectedRoom?.receiver);

  const router = useRouter();

  const handleChatStart = async (receiver: string) => {
    const { roomId } = await createChatRoom(currentUser, receiver);
    setSelectedRoom({ roomId, receiver });
  };

  const handleCloseChat = () => {
    setSelectedRoom(null);
  };

  return (
    <div className="relative">
      <div className="flex flex-col absolute top-0 right-0 w-full bg-white border border-gray-200 shadow-lg">
        <ul className="list-none">
          {lawyers.map((lawyer) => (
            <li key={lawyer.id} className="border-b last:border-b-0">
              <button
                onClick={() => handleChatStart(lawyer.id)}
                className="block hover:bg-gray-100 w-full text-center"
              >
                {lawyer.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selectedRoom && (
        <ChatRoom
          roomId={selectedRoom.roomId}
          currentUser={currentUser}
          receiver={selectedRoom.receiver}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
};

export default ChatList;
