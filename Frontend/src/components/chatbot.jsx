import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import styles from "./Chatbot.module.css";

function Chatbot() {
  const [message, setMessage] = useState("");

  const [chat, setChat] = useState([
    {
      bot: "Hello 👋 Welcome to Online Bookstore. Ask me about books, authors, or recommendations 📚",
    },
  ]);

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // ✅ Auto Scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMsg = message;

    setMessage("");

    setLoading(true);

    // ✅ Add User Message
    setChat((prev) => [
      ...prev,
      {
        user: userMsg,
        bot: "Typing...",
      },
    ]);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: userMsg,
          }),
        }
      );

      // ✅ Safe HTTP Error Handling
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const data = await res.json();

      setChat((prev) => {
        const updated = [...prev];

        updated[updated.length - 1].bot =
          data.reply || "No response";

        return updated;
      });
    } catch (error) {
      console.error("CHAT ERROR 👉", error);

      setChat((prev) => {
        const updated = [...prev];

        updated[updated.length - 1].bot =
          "Server unavailable ❌";

        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Enter Key Support
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* 🤖 FLOATING BUTTON */}
      <motion.div
        className={styles.aiBadge}
        animate={{ y: [0, -6, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        onClick={() => setOpen(true)}
      >
        📚 AI Chat
      </motion.div>

      {/* 💬 CHAT WINDOW */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.chatbotContainer}
            initial={{
              scale: 0.8,
              opacity: 0,
              y: 50,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            {/* HEADER */}
            <div className={styles.header}>
              Book Assistant 💬

              <span
                className={styles.closeBtn}
                onClick={() => setOpen(false)}
              >
                ✖
              </span>
            </div>

            {/* CHAT BODY */}
            <div className={styles.chatBox}>
              {chat.map((c, i) => (
                <div key={i}>
                  {c.user && (
                    <div className={styles.userMessage}>
                      <span className={styles.userBubble}>
                        {c.user}
                      </span>
                    </div>
                  )}

                  <div className={styles.botMessage}>
                    <span className={styles.botBubble}>
                      {c.bot}
                    </span>
                  </div>
                </div>
              ))}

              <div ref={chatEndRef} />
            </div>

            {/* INPUT */}
            <div className={styles.inputContainer}>
              <input
                type="text"
                className={styles.input}
                value={message}
                placeholder="Ask about books..."
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={handleKeyDown}
              />

              <button
                className={styles.button}
                onClick={sendMessage}
                disabled={loading}
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Chatbot;