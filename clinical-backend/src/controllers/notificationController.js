const Notification = require("../models/notification");
const User = require("../models/User");

const getNotificationsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID est requis" });
    }

    // Buscar notificaciones y poblar el campo `patientId`
    const notifications = await Notification.find({ doctorId })
      .sort({ createdAt: -1 })
      .populate("patientId", "email name");

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

/**
 * Supprimer une notification spécifique
 */
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification introuvable" });
    }

    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: "Notification supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la notification :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { getNotificationsByDoctor, deleteNotification };
