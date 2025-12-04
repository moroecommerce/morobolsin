"use client";

import React, { useState, useEffect, useRef } from "react";

type Message = { text: string; sender: "user" | "bot" };

const Chat: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedType, setSelectedType] = useState<
    "chef" | "kitchen" | "waiter" | "bar"
  >("chef");
  const [selectedColor, setSelectedColor] = useState<
    "white" | "black" | "sand" | "brand"
  >("white");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const buildContextIntro = () => {
    const typeLabel =
      selectedType === "chef"
        ? "форма для шеф-повара"
        : selectedType === "kitchen"
        ? "форма для поваров кухни"
        : selectedType === "waiter"
        ? "форма для официантов"
        : "форма для бариста / бара";

    const colorLabel =
      selectedColor === "white"
        ? "в светлых тонах"
        : selectedColor === "black"
        ? "в тёмных тонах"
        : selectedColor === "sand"
        ? "в бежевых / тёплых тонах"
        : "в фирменных цветах бренда";

    return `Контекст: клиент выбирает ${typeLabel}, ${colorLabel}. Подбирай комплекты одежды для HoReCa с учётом этого.`;
  };

  const sendMessageToGPT = async (text: string, withContext = false) => {
    setLoading(true);

    let historyToSend: Message[] = [...chatHistory, {
      text,
      sender: "user",
    }];

    if (withContext && chatHistory.length === 0) {
      historyToSend = [
        { text: buildContextIntro(), sender: "user" },
        ...historyToSend,
      ];
    }

    setChatHistory(historyToSend);

    try {
      const res = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyToSend.map((m) => ({
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
    const withContext = chatHistory.length === 0;
    sendMessageToGPT(message.trim(), withContext);
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
        {/* ШАПКА */}
        <div
          style={{
            maxWidth: 560,
            margin: "0 auto 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontWeight: 800,
                fontSize: 18,
                color: "#111827",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Morobolsin
            </span>
            <span style={{ fontSize: 12, color: "#6b7280" }}>
              умный подбор формы для HoReCa
            </span>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                border: "1px solid #e5e7eb",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 16,
              }}
              onClick={() => alert("Спасибо за оценку!")}
            >
              👍
            </button>
            <button
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                border: "1px solid #e5e7eb",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 16,
              }}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "Morobolsin — подбор формы",
                    text: "Помощник для подбора формы для команды HoReCa",
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Ссылка скопирована в буфер обмена");
                }
              }}
            >
              ↗
            </button>
            <button
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                border: "1px solid #e5e7eb",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 16,
              }}
              onClick={() => window.open("https://t.me/morobolsin", "_blank")}
            >
              ✉
            </button>
          </div>
        </div>

        {/* ВЫБОР ТИПА И ЦВЕТА */}
        <div
          style={{
            maxWidth: 560,
            margin: "0 auto 16px",
            background: "#ffffff",
            borderRadius: 22,
            padding: "14px 14px 16px",
            boxShadow: "0 4px 16px rgba(148,163,184,0.16)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
              gap: 10,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: 4,
                }}
              >
                Выберите тип формы
              </div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                Ассистент учтёт это в подборе комплектов
              </div>
            </div>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                background:
                  selectedColor === "white"
                    ? "#f9fafb"
                    : selectedColor === "black"
                    ? "#030712"
                    : selectedColor === "sand"
                    ? "#f5e7d6"
                    : "#111827",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color:
                  selectedColor === "white" || selectedColor === "sand"
                    ? "#111827"
                    : "#f9fafb",
                fontWeight: 700,
                fontSize: 11,
                textAlign: "center",
                padding: "0 6px",
              }}
            >
              {selectedType === "chef"
                ? "ШЕФ-ПОВАР"
                : selectedType === "kitchen"
                ? "КУХНЯ"
                : selectedType === "waiter"
                ? "ЗАЛ"
                : "БАР / КОФЕ"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            {[
              { id: "chef", label: "Шеф-повар" },
              { id: "kitchen", label: "Кухня" },
              { id: "waiter", label: "Официанты" },
              { id: "bar", label: "Бар / бариста" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() =>
                  setSelectedType(
                    item.id as "chef" | "kitchen" | "waiter" | "bar"
                  )
                }
                style={{
                  flex: "1 1 40%",
                  minWidth: 110,
                  borderRadius: 999,
                  border:
                    selectedType === item.id
                      ? "1px solid #111827"
                      : "1px solid #e5e7eb",
                  background: selectedType === item.id ? "#111827" : "#ffffff",
                  color: selectedType === item.id ? "#f9fafb" : "#111827",
                  fontSize: 13,
                  padding: "8px 10px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#4b5563",
              marginBottom: 8,
            }}
          >
            Цвет формы
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {[
              { id: "white", label: "Светлая", bg: "#f9fafb", border: "#e5e7eb" },
              { id: "black", label: "Тёмная", bg: "#030712", border: "#030712" },
              { id: "sand", label: "Бежевая", bg: "#f5e7d6", border: "#eabf7a" },
              { id: "brand", label: "Фирменный", bg: "#111827", border: "#4f46e5" },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() =>
                  setSelectedColor(
                    c.id as "white" | "black" | "sand" | "brand"
                  )
                }
                style={{
                  flex: 1,
                  borderRadius: 16,
                  border:
                    selectedColor === c.id
                      ? `2px solid ${c.border}`
                      : "1px solid #e5e7eb",
                  background: c.bg,
                  height: 42,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color:
                    c.id === "white" || c.id === "sand"
                      ? "#111827"
                      : "#f9fafb",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* ЛЕНДИНГ-БЛОК */}
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
            Укажите формат заведения, роли сотрудников и выбранный стиль —
            ассистент подберёт комплекты формы под бренд и задачи кухни.
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
                Вместо долгого поиска по каталогу вы сразу получаете готовые
                наборы с артикулами и ссылками.
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
                В едином стиле бренда
              </div>
              <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5 }}>
                Ассистент подбирает форму для шефа, кухни и зала так, чтобы вся
                команда выглядела как единая концепция.
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
                Учитываем жаркую кухню, открытый огонь, частые стирки и
                специфику смен, чтобы форма жила долго.
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
            Выбрать комплекты и перейти к ассистенту
          </button>

          <p
            style={{
              fontSize: 11,
              color: "#6b7280",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Чат подберёт модели и сформирует список позиций Morobolsin для
            заказа.
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
            <li>Опишите заведение (формат, кухня, уровень цен).</li>
            <li>
              Укажите количество людей и роли (шеф, кухня, официанты, бар).
            </li>
            <li>
              Добавьте бюджет и пожелания по стилю, крою и посадке формы.
            </li>
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
          Пример запроса:{" "}
          <span style={{ color: "#111827" }}>
            «Новый ресторан узбекской кухни, 12 человек (шеф, кухня, зал), нужен
            современный тёмный стиль, средний бюджет»
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
              placeholder="Опишите заведение и задачу, например: форма для команды нового кафе..."
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
