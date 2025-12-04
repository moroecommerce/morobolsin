"use client";

import React, { useState, useEffect, useRef } from "react";

type Message = { text: string; sender: "user" | "bot" };

const Chat: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const sendMessageToGPT = async (text: string) => {
    setLoading(true);
    const newHistory: Message[] = [...chatHistory, { text, sender: "user" }];
    setChatHistory(newHistory);

    try {
      const res = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      const data = await res.json();
      const botReply =
        typeof data.reply === "string" && data.reply.length > 0
          ? data.reply
          : "Ассистент сейчас недоступен. Попробуйте ещё раз чуть позже.";

      setChatHistory((prev) => [...prev, { text: botReply, sender: "bot" }]);
    } catch (e) {
      setChatHistory((prev) => [
        ...prev,
        {
          text: "Произошла ошибка при обращении к ассистенту. Попробуйте ещё раз.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!message.trim() || loading) return;
    sendMessageToGPT(message.trim());
    setMessage("");
  };

  // ЛЕНДИНГ
  if (showWelcome) {
    return (
      <div
        style={{
          fontFamily: "Manrope, Arial, sans-serif",
          background: "#f8fdff",
          minHeight: "100vh",
          padding: "20px 16px 40px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: 560,
            margin: "0 auto",
            background: "linear-gradient(135deg,#f4f5f7,#e5e7eb)",
            borderRadius: 22,
            padding: "20px 18px 22px",
            boxShadow: "0 6px 20px rgba(150,175,205,0.12)",
          }}
        >
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              margin: "0 0 10px",
              color: "#1f242b",
            }}
          >
            Подбор формы для вашей команды
          </h1>
          <p
            style={{
              fontSize: 14,
              margin: "0 0 18px",
              color: "#4b5563",
              lineHeight: 1.6,
            }}
          >
            Расскажите об уровне заведения, стиле кухни и задачах персонала —
            ассистент подберёт комплекты одежды для шефов, кухни и зала.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "12px 12px",
                boxShadow: "0 2px 10px rgba(150,175,205,0.12)",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  marginBottom: 4,
                  color: "#111827",
                }}
              >
                Быстрый подбор по параметрам
              </div>
              <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5 }}>
                Учитываем формат заведения, сезон, цвет бренда и бюджет, чтобы
                не тратить время на бесконечный каталог.
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "12px 12px",
                boxShadow: "0 2px 10px rgba(150,175,205,0.12)",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  marginBottom: 4,
                  color: "#111827",
                }}
              >
                Комплекты для всей команды
              </div>
              <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5 }}>
                Ассистент сразу предлагает наборы для шефа, линии, пиццаёлов,
                кондитеров и официантов в одном стиле.
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "12px 12px",
                boxShadow: "0 2px 10px rgba(150,175,205,0.12)",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  marginBottom: 4,
                  color: "#111827",
                }}
              >
                Практичность и безопасность
              </div>
              <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5 }}>
                Подбираем ткани под жаркую кухню, открытый огонь, частые стирки
                и требования по безопасности.
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowWelcome(false)}
            style={{
              width: "100%",
              marginTop: 6,
              background:
                "linear-gradient(135deg, #1f242b 0%, #3a4250 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 18,
              padding: "14px 0",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 3px 16px rgba(0,0,0,0.25)",
            }}
          >
            Выбрать одежду для поваров
          </button>

          <p
            style={{
              fontSize: 11,
              color: "#6b7280",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Чат подберёт модели и отправит вам список с артикулами для заказа в
            Morobolsin.
          </p>
        </div>
      </div>
    );
  }

  // ЭКРАН С ЧАТОМ
  return (
    <div
      style={{
        fontFamily: "Manrope, Arial, sans-serif",
        background: "#f8fdff",
        minHeight: "100vh",
        padding: "20px 0 90px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 560,
          margin: "0 auto",
          padding: "0 16px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg,#f4f5f7,#e5e7eb)",
            borderRadius: 20,
            padding: "10px 14px",
            marginBottom: 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 4px 14px rgba(150,175,205,0.16)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "#1f242b",
                marginBottom: 3,
              }}
            >
              Morobolsin Assistant
            </span>
            <span style={{ fontSize: 12, color: "#6b7280" }}>
              Подбор формы для HoReCa
            </span>
          </div>
          <button
            onClick={() => setShowWelcome(true)}
            style={{
              fontSize: 11,
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid #d1d5db",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Вернуться на лендинг
          </button>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 18,
            padding: "14px 12px 16px",
            marginBottom: 12,
            boxShadow: "0 2px 10px rgba(150,175,205,0.10)",
            fontSize: 13,
            color: "#4b5563",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 6, color: "#111827" }}>
            Как начать:
          </div>
          <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.6 }}>
            <li>Напишите, для какого заведения подбираете форму.</li>
            <li>Укажите количество людей и роли (шеф, су‑шеф, линия, зал).</li>
            <li>Добавьте бюджет и пожелания к стилю / цветам.</li>
          </ul>
        </div>

        <div
          style={{
            background: "#f9fafb",
            borderRadius: 18,
            padding: "10px 10px 14px",
            marginBottom: 10,
            fontSize: 12,
            color: "#6b7280",
          }}
        >
          Примеры запросов:{" "}
          <span style={{ color: "#111827" }}>
            «Нужна форма для команды в итальянском ресторане, 8 человек, тёмные
            цвета, средний бюджет»
          </span>
        </div>

        <div
          style={{
            marginTop: 10,
            marginBottom: 70,
            minHeight: 120,
          }}
        >
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "10px 12px",
                  borderRadius:
                    msg.sender === "user"
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                  background:
                    msg.sender === "user" ? "#1f2937" : "#e5f0ff",
                  color: msg.sender === "user" ? "#fff" : "#111827",
                  fontSize: 14,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 16,
            padding: "0 16px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              maxWidth: 560,
              margin: "0 auto",
              display: "flex",
              gap: 8,
              background: "transparent",
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="Опишите заведение и задачу, например: форма для новой команды кафе..."
              style={{
                flex: 1,
                height: 44,
                borderRadius: 999,
                border: "1px solid #d1d5db",
                padding: "0 14px",
                fontSize: 14,
                outline: "none",
              }}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !message.trim()}
              style={{
                width: 46,
                height: 44,
                borderRadius: 999,
                border: "none",
                background:
                  "linear-gradient(135deg,#1f242b 0%,#3a4250 100%)",
                color: "#fff",
                fontSize: 18,
                cursor:
                  loading || !message.trim() ? "not-allowed" : "pointer",
                opacity: loading || !message.trim() ? 0.6 : 1,
              }}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
