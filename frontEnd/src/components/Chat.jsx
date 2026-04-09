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

    socket.current = io(import.meta.env.VITE_API_URL);
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
    <div className="grid gap-6 pb-4 xl:grid-cols-[0.86fr_1.14fr]">
      <section className="premium-card p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-base-content/45">
          Conversation
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-balance">
          A calmer space for real messages.
        </h1>
        <p className="mt-4 text-base leading-7 text-base-content/85">
          DevTinder chat has been reframed like a private lounge: fewer
          distractions, softer surfaces, and more room for thoughtful replies.
        </p>

        {receiver && (
          <div className="soft-surface mt-8 rounded-[30px] p-5">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-16 rounded-[22px]">
                  <img src={receiver.photoUrl} alt={receiver.firstName} />
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-base-content/80">
                  Talking with
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  {receiver.firstName} {receiver.lastName}
                </h2>
                <p className="mt-1 text-sm text-base-content/85">
                  Pick up where the connection started.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="premium-card flex h-[calc(100vh-11rem)] min-h-[640px] flex-col overflow-hidden">
        {receiver ? (
          <div className="border-b border-white/40 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-14 rounded-[20px]">
                  <img src={receiver.photoUrl} alt={receiver.firstName} />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {receiver.firstName} {receiver.lastName}
                </h2>
                <p className="text-sm text-base-content/80">
                  Real-time chat enabled
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-b border-white/40 px-5 py-5 sm:px-6">
            <div className="h-14 w-48 animate-pulse rounded-[22px] bg-white/50" />
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-3xl">
                ✉
              </div>
              <p className="mt-5 text-lg font-semibold">No messages yet</p>
              <p className="mt-2 max-w-sm text-sm leading-7 text-base-content/85">
                Start with something simple, thoughtful, and specific. Great
                conversations rarely need much more.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => {
                const isOwnMessage = msg.senderId === currentUser?._id;

                return (
                  <div
                    key={index}
                    className={`flex ${
                      isOwnMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-[28px] px-4 py-3 shadow-sm sm:max-w-[68%] ${
                        isOwnMessage
                          ? "bg-gradient-to-r from-primary to-secondary text-white"
                          : "soft-surface text-base-content"
                      }`}
                    >
                      <p className="text-sm leading-7">{msg.message}</p>
                      <p
                        className={`mt-2 text-right text-xs ${
                          isOwnMessage ? "text-white/70" : "text-base-content/80"
                        }`}
                      >
                        {formatTimestamp(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="border-t border-white/40 px-4 py-4 sm:px-6"
        >
          <div className="soft-surface flex items-center gap-3 rounded-[28px] p-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="input field-control h-12 flex-1 border-none bg-transparent shadow-none focus:outline-none"
              placeholder="Write something thoughtful..."
              aria-label="Message Input"
            />
            <button
              type="submit"
              className="btn h-12 min-h-12 rounded-full border-none bg-gradient-to-r from-primary to-secondary px-5 text-white"
              aria-label="Send Message"
            >
              Send
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Chat;
