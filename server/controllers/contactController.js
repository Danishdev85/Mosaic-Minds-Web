const { pool } = require("../config/db");

const submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required.",
      });
    }

    const [result] = await pool.execute(
      "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [name, email, subject || null, message]
    );

    res.status(201).json({
      success: true,
      message: "Your message has been sent. We'll get back to you soon.",
      messageId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const { unread_only } = req.query;
    let query = "SELECT * FROM contact_messages";
    if (unread_only === "true") query += " WHERE is_read = FALSE";
    query += " ORDER BY created_at DESC";

    const [messages] = await pool.execute(query);
    res.status(200).json({ success: true, count: messages.length, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch messages." });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute("UPDATE contact_messages SET is_read = TRUE WHERE id = ?", [id]);
    res.status(200).json({ success: true, message: "Marked as read." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update message." });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute("DELETE FROM contact_messages WHERE id = ?", [id]);
    res.status(200).json({ success: true, message: "Message deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete message." });
  }
};

module.exports = { submitMessage, getAllMessages, markAsRead, deleteMessage };