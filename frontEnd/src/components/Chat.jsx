import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { userId: receiverId } = useParams();
  const currentUser = useSelector((store) => store.user);
  const connections = useSelector((store) => store.connections);

  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchReceiverInfo = async () => {
      const foundInConnections = connections?.find((c) => c._id === receiverId);
      if (foundInConnections) {
        setReceiver(foundInConnections);
        return;
      }
      try {
        const res = await axios.get(`${BASE_URL}/user/${receiverId}`, {
          withCredentials: true,
        });
        setReceiver(res.data);
      } catch (error) {
        console.error("Failed to fetch receiver info", error);
      }
    };

    if (receiverId) {
      fetchReceiverInfo();
    }
  }, [connections, receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!currentUser?._id || !receiverId) return;

    socket.current = io("http://localhost:7777");
    socket.current.emit("joinRoom", currentUser._id);

    socket.current.on("receiveMessage", (message) => {
      if (
        (message.senderId === currentUser._id &&
          message.receiverId === receiverId) ||
        (message.senderId === receiverId &&
          message.receiverId === currentUser._id)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/chat/messages/${receiverId}`, {
          withCredentials: true,
        });
        setMessages(res.data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    return () => {
      socket.current.disconnect();
    };
  }, [currentUser, receiverId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !currentUser?._id) return;

    const messageData = {
      senderId: currentUser._id,
      receiverId,
      message: newMessage,
      createdAt: new Date().toISOString(),
    };

    socket.current.emit("sendMessage", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setNewMessage("");
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="px-4 lg:px-0 mb-3 mt-4">
      <div className="flex flex-col h-[calc(100vh-10.5rem)] max-w-4xl mx-auto bg-base-200 shadow-xl rounded-lg">
        {/* Chat Header */}
        {receiver ? (
          <div className="flex items-center p-3 border-b border-base-300">
            <div className="avatar mr-4">
              <div className="w-12 rounded-full">
                <img src={receiver.photoUrl} alt={receiver.firstName} />
              </div>
            </div>
            <h2 className="text-xl font-bold">
              {receiver.firstName} {receiver.lastName}
            </h2>
          </div>
        ) : (
          <div className="p-3 border-b border-base-300 h-[73px] flex items-center">
            <div className="animate-pulse flex items-center w-full">
              <div className="rounded-full bg-base-300 h-12 w-12 mr-4"></div>
              <div className="h-6 bg-base-300 rounded w-1/4"></div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-base-content/60">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat ${
                    msg.senderId === currentUser?._id
                      ? "chat-end"
                      : "chat-start"
                  }`}
                >
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="User Avatar"
                        src={
                          msg.senderId === currentUser?._id
                            ? currentUser.photoUrl
                            : receiver?.photoUrl
                        }
                      />
                    </div>
                  </div>
                  <div className="chat-bubble flex flex-col">
                    <span>{msg.message}</span>
                    <span className="text-xs opacity-50 text-right mt-1">
                      {formatTimestamp(msg.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input Form */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-base-300 flex items-center gap-4"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Type a message..."
            aria-label="Message Input"
          />
          <button
            type="submit"
            className="btn btn-primary btn-circle"
            aria-label="Send Message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
