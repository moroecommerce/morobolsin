"use client";

import React, { useState, useEffect, useRef } from "react";

type Message = { text: string; sender: "user" | "bot" };

type UniformVariant = {
  id: number;
  name: string;
  image: string;
};

const UNIFORMS: UniformVariant[] = [
  { id: 1, name: "Классический китель", image: "/uniforms/chef-1.png" },
  { id: 2, name: "Современный китель", image: "/uniforms/chef-2.png" },
  { id: 3, name: "Минималистичный", image: "/uniforms/chef-3.png" },
  { id: 4, name: "Узбекская кухня", image: "/uniforms/chef-4.png" },
  { id: 5, name: "Street-food", image: "/uniforms/chef-5.png" },
];

const Chat: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedType, setSelectedType] = useState<
    "chef" | "kitchen" | "waiter" | "bar"
  >("chef");
  const [selectedColor, setSelectedColor] = useState<
    "white" | "black" | "sand" | "brand"
  >("white");

  const [selectedUniformId, setSelectedUniformId] = useState<number>(1);
  const [chefName, setChefName] = useState<string>("Шеф Алиджан");

  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const heroRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<HTMLDivElement | null>(null);
  const chatSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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

    let historyToSend: Message[] = [
      ...chatHistory,
      {
        text,
        sender: "user",
      },
    ];

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

  // ЛЕНДИНГ + 3D + ФУТЕР
  if (showWelcome) {
    return (
      <div
        style={{
          fontFamily: "Manrope, Arial, sans-serif",
          background: "#f8fdff",
          minHeight: "100vh",
          padding: "0 16px 40px",
          boxSizing: "border-box",
        }}
      >
        {/* NAVBAR */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            background: "rgba(248,253,255,0.96)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid #e5e7eb",
            margin: "0 -16px 16px",
          }}
        >
          <div
            style={{
              maxWidth: 960,
              margin: "0 auto",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            {/* ЛОГО */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "#4b5563",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#f9fafb",
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                M
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  color: "#111827",
                  letterSpacing: "0.08em",
                }}
              >
                MOROBOLSIN
              </span>
            </div>

            {/* КАТЕГОРИИ */}
            <div
              style={{
                display: "flex",
                gap: 8,
                flex: 1,
                justifyContent: "center",
              }}
            >
              {[
                { id: "chef", label: "Шеф" },
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
                    padding: "6px 10px",
                    borderRadius: 999,
                    border:
                      selectedType === item.id
                        ? "1px solid #111827"
                        : "1px solid #e5e7eb",
                    background:
                      selectedType === item.id ? "#111827" : "transparent",
                    color:
                      selectedType === item.id ? "#f9fafb" : "#111827",
                    fontSize: 13,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* КНОПКИ СПРАВА */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "1px solid #d1d5db",
                  background: "#ffffff",
                  fontSize: 12,
                  cursor: "pointer",
                }}
                onClick={() => scrollTo(modelRef)}
              >
                3D‑примерка
              </button>
              <button
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "none",
                  background:
                    "linear-gradient(135deg,#1f242b 0%,#3a4250 100%)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => {
                  setShowWelcome(false);
                  setTimeout(() => scrollTo(chatSectionRef), 0);
                }}
              >
                Чат ассистент
              </button>
            </div>
          </div>
        </header>

              {/* HERO / БАННЕР */}
        <section
          ref={heroRef}
          style={{
            maxWidth: 960,
            margin: "0 auto 20px",
            background:
              "linear-gradient(135deg,#1f2937,#4b5563 45%,#e5e7eb 100%)",
            borderRadius: 26,
            padding: "24px 20px",
            color: "#f9fafb",
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
          }}
        >
          <div style={{ flex: "1 1 260px" }}>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                margin: "0 0 10px",
              }}
            >
              Форма для команды Morobolsin
            </h1>
            <p
              style={{
                fontSize: 14,
                margin: "0 0 14px",
                lineHeight: 1.6,
                maxWidth: 420,
              }}
            >
              Подберите форму для шефа, кухни, официантов и бара в едином стиле
              бренда. Ассистент соберёт комплекты под ваш формат заведения.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  border: "none",
                  background:
                    "linear-gradient(135deg,#fbbf24 0%,#f97316 100%)",
                  color: "#111827",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
                onClick={() => scrollTo(modelRef)}
              >
                Смотреть 3D‑примерку
              </button>
              <button
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  border: "1px solid rgba(249,250,251,0.7)",
                  background: "transparent",
                  color: "#f9fafb",
                  fontSize: 14,
                  cursor: "pointer",
                }}
                onClick={() => {
                  setShowWelcome(false);
                  setTimeout(() => scrollTo(chatSectionRef), 0);
                }}
              >
                Перейти к ассистенту
              </button>
            </div>
          </div>

          <div
            style={{
              flex: "1 1 220px",
              minWidth: 220,
              background: "rgba(17,24,39,0.36)",
              borderRadius: 22,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              Быстрая выгода
            </div>
            <ul
              style={{
                paddingLeft: 18,
                margin: 0,
                fontSize: 12,
                lineHeight: 1.5,
              }}
            >
              <li>Готовые комплекты по ролям и цвету.</li>
              <li>Ссылки и артикула для заказа.</li>
              <li>Учёт кухни, стиля и бюджета.</li>
            </ul>
          </div>
        </section>

        {/* БЛОК 3D-МОДЕЛИ И ТОВАРОВ */}
        <section
          ref={modelRef}
          style={{
            maxWidth: 960,
            margin: "0 auto 24px",
            display: "grid",
            gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)",
            gap: 16,
          }}
        >
          {/* 3D ЗАГЛУШКА */}
          <div
            style={{
              borderRadius: 22,
              background: "#ffffff",
              boxShadow: "0 4px 16px rgba(148,163,184,0.16)",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              minHeight: 260,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  3D‑модель в форме
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                  }}
                >
                  При выборе модели кителя и цвета обновляйте образ.
                </div>
              </div>
              <div
                style={{
                  fontSize: 11,
                  padding: "4px 8px",
                  borderRadius: 999,
                  border: "1px solid #e5e7eb",
                  color: "#4b5563",
                }}
              >
                demo / placeholder
              </div>
            </div>

            <div
              style={{
                flex: 1,
                borderRadius: 18,
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
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Здесь потом можно встроить реальный 3D‑viewer */}
              <img
                src={
                  UNIFORMS.find((u) => u.id === selectedUniformId)?.image ??
                  "/uniforms/chef-1.png"
                }
                alt="3D модель в форме"
                style={{
                  width: "70%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 14,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color:
                    selectedColor === "white" || selectedColor === "sand"
                      ? "#111827"
                      : "#f9fafb",
                  textShadow:
                    selectedColor === "white" || selectedColor === "sand"
                      ? "0 1px 2px rgba(0,0,0,0.18)"
                      : "0 1px 2px rgba(0,0,0,0.45)",
                  padding: "0 6px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {chefName || "Имя шефа"}
              </div>
            </div>
          </div>

          {/* СПИСОК ВАРИАНТОВ / ПРОДУКТОВ */}
          <div
            style={{
              borderRadius: 22,
              background: "#ffffff",
              boxShadow: "0 4px 16px rgba(148,163,184,0.16)",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#111827",
                marginBottom: 4,
              }}
            >
              Варианты формы ({selectedType === "chef"
                ? "шеф"
                : selectedType === "kitchen"
                ? "кухня"
                : selectedType === "waiter"
                ? "зал"
                : "бар"}
              )
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#6b7280",
                marginBottom: 8,
              }}
            >
              Нажмите на модель кителя, чтобы показать её на 3D‑фигуре.
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                maxHeight: 260,
                overflowY: "auto",
              }}
            >
              {UNIFORMS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => setSelectedUniformId(u.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: 8,
                    borderRadius: 14,
                    border:
                      selectedUniformId === u.id
                        ? "2px solid #111827"
                        : "1px solid #e5e7eb",
                    background:
                      selectedUniformId === u.id ? "#f3f4ff" : "#f9fafb",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 54,
                      borderRadius: 12,
                      background: "#e5e7eb",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={u.image}
                      alt={u.name}
                      style={{
                        width: "90%",
                        height: "auto",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#111827",
                        marginBottom: 2,
                      }}
                    >
                      {u.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#6b7280",
                      }}
                    >
                      Нажмите, чтобы примерить на 3D‑модели.
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* ИМЯ ШЕФА ПОД 3D */}
            <div style={{ marginTop: 6 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#4b5563",
                  marginBottom: 4,
                }}
              >
                Имя шеф‑повара
              </div>
              <input
                type="text"
                value={chefName}
                onChange={(e) => setChefName(e.target.value)}
                placeholder="Например, Шеф Алиджан"
                style={{
                  width: "100%",
                  height: 36,
                  borderRadius: 999,
                  border: "1px solid #d1d5db",
                  padding: "0 12px",
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>
          </div>
        </section>

        {/* ФУТЕР + CTA К ЧАТУ */}
        <footer
          style={{
            maxWidth: 960,
            margin: "0 auto",
            paddingTop: 16,
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
              fontSize: 12,
              color: "#6b7280",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: 4,
                }}
              >
                Morobolsin
              </div>
              <div>Форма для шефов, кухни и зала.</div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 14,
                alignItems: "center",
              }}
            >
              <button
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "1px solid #d1d5db",
                  background: "#ffffff",
                  cursor: "pointer",
                  fontSize: 12,
                }}
                onClick={() =>
                  window.open("https://t.me/morobolsin", "_blank")
                }
              >
                Telegram
              </button>
              <button
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "none",
                  background:
                    "linear-gradient(135deg,#1f242b 0%,#3a4250 100%)",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
                onClick={() => {
                  setShowWelcome(false);
                  setTimeout(() => scrollTo(chatSectionRef), 0);
                }}
              >
                Открыть чат‑ассистент
              </button>
            </div>
          </div>

          <div
            style={{
              fontSize: 11,
              color: "#9ca3af",
              marginTop: 4,
            }}
          >
            © {new Date().getFullYear()} Morobolsin. Все права защищены.
          </div>
        </footer>
      </div>
    );
  }

  // ЭКРАН С ЧАТОМ (оставь твой существующий код ниже)
  return (
    <div
      ref={chatSectionRef}
      style={{
        fontFamily: "Manrope, Arial, sans-serif",
        background: "#f8fdff",
        minHeight: "100vh",
        padding: "20px 0 90px",
        boxSizing: "border-box",
      }}
    >
      {/* дальше идёт твой исходный код чата */}
      {/* ... */}
      <div ref={messagesEndRef} />
      {/* ... */}
    </div>
  );
};

export default Chat;
