import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../services/api";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL);

const Message = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const patientEmail = params.get("email");
  const [receiver, setReceiver] = useState(null);

  useEffect(() => {
    const fetchReceiver = async () => {
      try {
        if (!patientEmail) return;
        const response = await api.get(`/users?email=${patientEmail}`);
        if (response.data.length > 0) {
          setReceiver(response.data[0]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du patient :", error);
      }
    };

    fetchReceiver();
  }, [patientEmail]);

  useEffect(() => {
    if (!receiver || !user) return;
    fetchMessages();

    socket.emit("join", user.id);

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [receiver, user]);

  const fetchMessages = async () => {
    if (!receiver || !user) return;
    try {
      const response = await api.get(`/chat/${user.id}/${receiver.id}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !receiver) return;

    try {
      const messageData = { senderId: user.id, receiverId: receiver.id, content: newMessage };
      await api.post("/chat/send", messageData);
      socket.emit("sendMessage", messageData);
      setMessages((prev) => [...prev, messageData]);
      setNewMessage("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  };

  return (
    <div className="chat-container">
      {receiver ? (
        <>
          <h2>Chat avec {receiver.name}</h2>
          <div className="chat-box">
            {messages.map((msg, index) => (
              <div key={index} className={msg.senderId === user.id ? "message user" : "message doctor"}>
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrivez votre message..."
            />
            <button onClick={handleSendMessage}>Envoyer</button>
          </div>
        </>
      ) : (
        <p>Chargement du chat...</p>
      )}
    </div>
  );
};

export default Message;
