import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { userId: receiverId } = useParams();
  const user = useSelector((store) => store.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef(null);

  useEffect(() => {
    // Establish socket connection
    socket.current = io("http://localhost:7777"); // Replace with your server URL

    // Join a room specific to the user
    if (user?._id) {
      socket.current.emit("joinRoom", user._id);
    }

    // Listen for incoming messages
    socket.current.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/chat/messages/${receiverId}`, {
          withCredentials: true,
        });
        setMessages(res.data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };

    if (receiverId) {
      fetchMessages();
    }

    return () => {
      socket.current.disconnect();
    };
  }, [user, receiverId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const messageData = {
      senderId: user._id,
      receiverId,
      message: newMessage,
    };

    socket.current.emit("sendMessage", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 bg-base-200">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              msg.senderId === user._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-bubble">{msg.message}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 bg-base-300 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="input input-bordered flex-1"
          placeholder="Type a message..."
        />
        <button type="submit" className="btn btn-primary ml-2">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
