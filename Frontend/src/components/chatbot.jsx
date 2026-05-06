import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Chatbot.module.css";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [open, setOpen] = useState(false);

  const sendMessage = async () => {
    if (!message) return;

    const userMsg = message;

    setChat((prev) => [...prev, { user: userMsg, bot: "Typing..." }]);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();

      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].bot = data.reply;
        return updated;
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* 🤖 ONLY ONE ICON (CLICKABLE CHAT ENTRY) */}
      <motion.div
        className={styles.aiBadge}
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        onClick={() => setOpen(true)}
      >
        📚 AI Chat
      </motion.div>

      {/* 🟣 CHAT WINDOW */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.chatbotContainer}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* HEADER */}
            <div className={styles.header}>
              Book Assistant 💬
              <span className={styles.closeBtn} onClick={() => setOpen(false)}>
                ✖
              </span>
            </div>

            {/* CHAT BOX */}
            <div className={styles.chatBox}>
              {chat.map((c, i) => (
                <div key={i}>
                  <div className={styles.userMessage}>
                    <span className={styles.userBubble}>{c.user}</span>
                  </div>

                  <div className={styles.botMessage}>
                    <span className={styles.botBubble}>{c.bot}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* INPUT */}
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about books..."
              />
              <button className={styles.button} onClick={sendMessage}>
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Chatbot;