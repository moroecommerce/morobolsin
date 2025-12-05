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

const ChatPage: React.FC = () => {
  const [lang, setLang] = useState<"ru" | "uz">("ru");

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
  const modelRef = useRef<HTMLDivElement | null>(null);

  // слова для анимации
  const rolesRu = ["поваров", "официантов", "барменов"];
  const rolesUz = ["oshpazlar", "ofitsiantlar", "barmenlar"];
  const roles = lang === "ru" ? rolesRu : rolesUz;

  const [roleIndex, setRoleIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  // typewriter‑эффект + смена слова
 // harfni sekinroq yozish (masalan, 180 ms)
const TYPE_SPEED = 180;
// so‘zni 5 sekundda bir almashtirish
const WORD_DELAY = 5000;

useEffect(() => {
  const currentWord = roles[roleIndex];
  setTypedText("");
  setCharIndex(0);

  const typeInterval = setInterval(() => {
    setCharIndex((prev) => {
      if (prev < currentWord.length) {
        setTypedText(currentWord.slice(0, prev + 1));
        return prev + 1;
      }
      clearInterval(typeInterval);
      return prev;
    });
  }, TYPE_SPEED);

  const wordTimeout = setTimeout(() => {
    setRoleIndex((prev) => (prev + 1) % roles.length);
  }, WORD_DELAY);

  return () => {
    clearInterval(typeInterval);
    clearTimeout(wordTimeout);
  };
}, [roleIndex, roles]);


  // автоскролл чата
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
    const typeLabelRu =
      selectedType === "chef"
        ? "форма для шеф-повара"
        : selectedType === "kitchen"
        ? "форма для поваров кухни"
        : selectedType === "waiter"
        ? "форма для официантов"
        : "форма для бариста / бара";

    const colorLabelRu =
      selectedColor === "white"
        ? "в светлых тонах"
        : selectedColor === "black"
        ? "в тёмных тонах"
        : selectedColor === "sand"
        ? "в бежевых / тёплых тонах"
        : "в фирменных цветах бренда";

    const typeLabelUz = typeLabelRu;
    const colorLabelUz = colorLabelRu;

    const typeLabel = lang === "ru" ? typeLabelRu : typeLabelUz;
    const colorLabel = lang === "ru" ? colorLabelRu : colorLabelUz;

    return `Контекст: клиент выбирает ${typeLabel}, ${colorLabel}. Подбирай комплекты одежды для HoReCa с учётом этого.`;
  };

  const sendMessageToGPT = async (
    text: string,
    options?: { withContext?: boolean }
  ) => {
    const withContext = options?.withContext ?? false;
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
    } catch {
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
    sendMessageToGPT(message.trim(), { withContext });
    setMessage("");
  };

  const handleDone = () => {
    const uniform = UNIFORMS.find((u) => u.id === selectedUniformId);
    const text =
      `Готовый комплект:\n` +
      `Тип: ${selectedType}\n` +
      `Цвет: ${selectedColor}\n` +
      `Модель кителя: ${uniform?.name ?? "не выбрана"}\n` +
      `Имя на кителе: ${chefName || "не указано"}`;
    const withContext = chatHistory.length === 0;
    sendMessageToGPT(text, { withContext });
    scrollTo(modelRef); // остаёмся рядом с редактором/чатом
  };

  return (
    <div
      style={{
        fontFamily: "Manrope, Arial, sans-serif",
        background: "#f8fdff",
        minHeight: "100vh",
        padding: "0 16px 90px",
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

          {/* СЕРДЕЧКО + ЯЗЫК */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                border: "1px solid #d1d5db",
                background: "#ffffff",
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => alert("Спасибо за лайк!")}
            >
              ♥
            </button>
            <div style={{ display: "flex", gap: 4 }}>
              {["ru", "uz"].map((lng) => (
                <button
                  key={lng}
                  onClick={() => setLang(lng as "ru" | "uz")}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    border:
                      lang === lng
                        ? "1px solid #111827"
                        : "1px solid #e5e7eb",
                    background: lang === lng ? "#111827" : "#ffffff",
                    color: lang === lng ? "#f9fafb" : "#111827",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {lng === "ru" ? "RU" : "UZ"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* HERO / БАННЕР */}
      <section
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
        <div
          style={{
            flex: "1 1 100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              margin: "0 0 10px",
              textAlign: "center",
            }}
          >
            {lang === "ru" ? "Форма для " : "Forma uchun "}
            <span
              style={{
                display: "inline-block",
                borderRight: "2px solid rgba(249,250,251,0.8)",
                paddingRight: 4,
                whiteSpace: "nowrap",
              }}
            >
              {typedText}
            </span>
          </h1>
          <p
            style={{
              fontSize: 14,
              margin: "0 0 14px",
              lineHeight: 1.6,
              maxWidth: 480,
              textAlign: "center",
            }}
          >
            {lang === "ru"
              ? "Подберите форму под кухню, зал и бар — ассистент поможет собрать комплекты под ваш бренд и задачи."
              : "Oshxona, zal va bar uchun formani tanlang — assistent brendingizga mos to‘plamlarni taklif qiladi."}
          </p>
        </div>
      </section>

      {/* РЕДАКТОР ОДЕЖДЫ + 3D */}
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
                Выберите модель, цвет и имя — образ обновится.
              </div>
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
            {lang === "ru" ? "Варианты формы" : "Forma variantlari"}
          </div>

          {/* выбор цвета (можно донастроить под себя) */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 8,
            }}
          >
            {[
              { id: "white", label: lang === "ru" ? "Светлая" : "Och" },
              { id: "black", label: lang === "ru" ? "Тёмная" : "Tund" },
              { id: "sand", label: lang === "ru" ? "Бежевая" : "Bej" },
              { id: "brand", label: lang === "ru" ? "Фирменный" : "Brend" },
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
                  borderRadius: 999,
                  border:
                    selectedColor === c.id
                      ? "2px solid #111827"
                      : "1px solid #e5e7eb",
                  background:
                    c.id === "white"
                      ? "#f9fafb"
                      : c.id === "black"
                      ? "#030712"
                      : c.id === "sand"
                      ? "#f5e7d6"
                      : "#111827",
                  color:
                    c.id === "white" || c.id === "sand"
                      ? "#111827"
                      : "#f9fafb",
                  fontSize: 11,
                  padding: "6px 6px",
                  cursor: "pointer",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* список моделей */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              maxHeight: 220,
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
                    {lang === "ru"
                      ? "Нажмите, чтобы примерить на 3D‑модели."
                      : "3D modelda ko‘rish uchun bosing."}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* имя + Готово */}
          <div style={{ marginTop: 6 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#4b5563",
                marginBottom: 4,
              }}
            >
              {lang === "ru" ? "Имя шеф‑повара" : "Oshpaz nomi"}
            </div>
            <input
              type="text"
              value={chefName}
              onChange={(e) => setChefName(e.target.value)}
              placeholder={
                lang === "ru"
                  ? "Например, Шеф Алиджан"
                  : "Masalan, Shef Alijon"
              }
              style={{
                width: "100%",
                height: 36,
                borderRadius: 999,
                border: "1px solid #d1d5db",
                padding: "0 12px",
                fontSize: 13,
                outline: "none",
                marginBottom: 8,
              }}
            />
            <button
              onClick={handleDone}
              style={{
                width: "100%",
                height: 40,
                borderRadius: 999,
                border: "none",
                background:
                  "linear-gradient(135deg,#1f242b 0%,#3a4250 100%)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {lang === "ru"
                ? "Готово — отправить ассистенту"
                : "Tayyor — assistentga yuborish"}
            </button>
          </div>
        </div>
      </section>

      {/* ЧАТ ПОД РЕДАКТОРОМ */}
      <section
        style={{
          maxWidth: 960,
          margin: "0 auto",
          borderRadius: 22,
          background: "#ffffff",
          boxShadow: "0 4px 16px rgba(148,163,184,0.16)",
          padding: "16px 14px 70px",
          position: "relative",
        }}
      >
        <div
          style={{
            marginBottom: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
              Morobolsin Assistant
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              {lang === "ru"
                ? "Уточнит детали и поможет с заказом."
                : "Buyurtma tafsilotlarini aniqlaydi va yordam beradi."}
            </div>
          </div>
        </div>

        <div
          style={{
            maxHeight: 260,
            overflowY: "auto",
            marginBottom: 10,
          }}
        >
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "8px 10px",
                  borderRadius:
                    msg.sender === "user"
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                  background:
                    msg.sender === "user" ? "#1f2937" : "#e5f0ff",
                  color: msg.sender === "user" ? "#fff" : "#111827",
                  fontSize: 13,
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

        {/* ВВОД СООБЩЕНИЯ */}
        <div
          style={{
            position: "absolute",
            left: 14,
            right: 14,
            bottom: 16,
            display: "flex",
            gap: 8,
          }}
        >
                  <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder={
              lang === "ru"
                ? "Опишите заведение и вопросы по форме..."
                : "Zavod va forma bo‘yicha savolingizni yozing..."
            }
            style={{
              flex: 1,
              height: 42,
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
              height: 42,
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
      </section>
    </div>
  );
};

export default ChatPage;

