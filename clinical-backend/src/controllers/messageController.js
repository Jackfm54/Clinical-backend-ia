const Message = require("../models/Message");
const User = require("../models/User");
const { sendNotification } = require("../services/socketService");

const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (!sender || !receiver) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const message = new Message({ senderId, receiverId, content });
    await message.save();

    sendNotification({
      userId: receiverId,
      message: `Nouveau message de ${sender.name}`,
    });

    res.status(201).json({ message: "Message envoyé avec succès", data: message });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;

    if (!userId || !otherUserId) {
      return res.status(400).json({ message: "User ID et Other User ID sont requis" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Erreur lors de la récupération des messages :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { sendMessage, getMessages };
