import React, { useEffect, useState, useRef } from "react";
import ChatMessage from "./ChatMessage";
import {
  getChatHistory,
  getMessages,
  sendMessage,
} from "@/components/_service/admin/admin.service";

interface ChatRoomProps {
  roomId: string;
  currentUser: string;
  receiver: string;
  onClose: () => void; // For closing the modal
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  roomId,
  currentUser,
  receiver,
  onClose,
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getChatHistory(roomId);
        setMessages(history);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    fetchHistory();

    const eventSource = getMessages(roomId);
    eventSource.onopen = () => {
      console.log("EventSource connected");
    };
    eventSource.onmessage = (event: any) => {
      const newChatMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newChatMessage]);
    };
    eventSource.onerror = (error: any) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [roomId]);

  const handleSendMessage = async () => {
    try {
      await sendMessage({
        roomId,
        sender: currentUser,
        message: newMessage,
        receiver,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="fixed inset-0 top-1 right-12 p-12 flex items-start justify-end z-50">
      <div className="bg-white shadow-lg w-[370px] h-[500px] flex flex-col border">
        <div className="flex justify-between items-center p-2 border">
          <h2 className="text-lg ">{receiver}님과의 채팅</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            ✕
          </button>
        </div>
        <div className="flex-grow overflow-y-scroll p-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              currentUser={currentUser}
            />
          ))}
          <div ref={messageEndRef} />
        </div>
        <div className="flex items-center p-2 border-t bg-white">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-grow h-[5vh] border border-[var(--color-Harbor-firth)] p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-Harbor-firth)]"
            placeholder="메시지를 입력하세요."
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 px-4 py-2 bg-white border border-[var(--color-Harbor-firth)] hover:bg-[var(--color-Harbor-firth)] focus:outline-none focus:ring-2 focus:ring-[var(--color-Harbor-firth)]"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
