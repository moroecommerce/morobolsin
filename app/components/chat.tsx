"use client";

import React, { useState, useEffect, useRef } from "react";

type Message = { text: string; sender: "user" | "bot" };

type ItemVariant = {
  id: number;
  name: string;
};

const HATS: ItemVariant[] = [
  { id: 1, name: "Классическая шапка" },
  { id: 2, name: "Высокая шапка" },
  { id: 3, name: "Бандана" },
];

const TOPS: ItemVariant[] = [
  { id: 1, name: "Классический китель" },
  { id: 2, name: "Современный китель" },
  { id: 3, name: "Минималистичный китель" },
];

const APRONS: ItemVariant[] = [
  { id: 1, name: "Классический фартук" },
  { id: 2, name: "Нагрудный фартук" },
  { id: 3, name: "Бариста фартук" },
];

const PANTS: ItemVariant[] = [
  { id: 1, name: "Классические брюки" },
  { id: 2, name: "Джоггеры" },
  { id: 3, name: "Узкие брюки" },
];

type ChefLook = {
  hat: ItemVariant | null;
  top: ItemVariant | null;
  apron: ItemVariant | null;
  pants: ItemVariant | null;
};

const ChatPage: React.FC = () => {
  const [lang, setLang] = useState<"ru" | "uz">("ru");

  const [hatIndex, setHatIndex] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  const [apronIndex, setApronIndex] = useState(0);
  const [pantsIndex, setPantsIndex] = useState(0);

  const [look, setLook] = useState<ChefLook>({
    hat: HATS[0],
    top: TOPS[0],
    apron: APRONS[0],
    pants: PANTS[0],
  });

  const [chefName, setChefName] = useState<string>("Шеф Алиджан");

  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // анимация заголовка
  const rolesRu = ["поваров", "официантов", "барменов"];
  const rolesUz = ["oshpazlar", "ofitsiantlar", "barmenlar"];
  const roles = lang === "ru" ? rolesRu : rolesUz;

  const [roleIndex, setRoleIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  const TYPE_SPEED = 120;
  const WORD_DELAY = 5000;

  useEffect(() => {
    const currentWord = roles[roleIndex] ?? "";
    setTypedText("");
    setCharIndex(0);

    let typeInterval: number | undefined;

    typeInterval = window.setInterval(() => {
      setCharIndex((prev) => {
        if (prev < currentWord.length) {
          setTypedText(currentWord.slice(0, prev + 1));
          return prev + 1;
        }
        if (typeInterval !== undefined) clearInterval(typeInterval);
        return prev;
      });
    }, TYPE_SPEED);

    const wordTimeout = window.setTimeout(
      () => setRoleIndex((prev) => (prev + 1) % roles.length),
      WORD_DELAY
    );

    return () => {
      if (typeInterval !== undefined) clearInterval(typeInterval);
      clearTimeout(wordTimeout);
    };
  }, [roleIndex, roles.length]);

  // автоскролл чата
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const buildContextIntro = () => {
    const typeLabelRu =
      "комплект формы: шапка, верх, фартук и брюки для шеф-повара";
    const typeLabelUz = typeLabelRu;
    const typeLabel = lang === "ru" ? typeLabelRu : typeLabelUz;

    return `Контекст: клиент выбирает ${typeLabel}. Подбирай комплекты одежды для HoReCa с учётом этого.`;
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
    const text =
      `Готовый комплект:\n` +
      `Шапка: ${look.hat?.name ?? "не выбрана"}\n` +
      `Верх: ${look.top?.name ?? "не выбран"}\n` +
      `Фартук: ${look.apron?.name ?? "не выбран"}\n` +
      `Брюки: ${look.pants?.name ?? "не выбраны"}\n` +
      `Имя на форме: ${chefName || "не указано"}`;

    const withContext = chatHistory.length === 0;
    sendMessageToGPT(text, { withContext });
  };

  // синхронизация look при смене индексов
  useEffect(() => {
    setLook((prev) => ({ ...prev, hat: HATS[hatIndex] ?? null }));
  }, [hatIndex]);
  useEffect(() => {
    setLook((prev) => ({ ...prev, top: TOPS[topIndex] ?? null }));
  }, [topIndex]);
  useEffect(() => {
    setLook((prev) => ({ ...prev, apron: APRONS[apronIndex] ?? null }));
  }, [apronIndex]);
  useEffect(() => {
    setLook((prev) => ({ ...prev, pants: PANTS[pantsIndex] ?? null }));
  }, [pantsIndex]);

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

      {/* HERO */}
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
        </div>
      </section>

      {/* БЛОК ВЫБОРА + КНОПКА */}
      <section
        style={{
          maxWidth: 960,
          margin: "0 auto 24px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr)",
          gap: 16,
        }}
      >
        <div
          style={{
            borderRadius: 22,
            background: "#ffffff",
            boxShadow: "0 4px 16px rgba(148,163,184,0.16)",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <SelectRow
            label={lang === "ru" ? "Шапка" : "Shapka"}
            items={HATS}
            activeIndex={hatIndex}
            onChange={setHatIndex}
          />
          <SelectRow
            label={lang === "ru" ? "Верхняя одежда" : "Yuqori kiyim"}
            items={TOPS}
            activeIndex={topIndex}
            onChange={setTopIndex}
          />
          <SelectRow
            label={lang === "ru" ? "Фартук" : "Fartuk"}
            items={APRONS}
            activeIndex={apronIndex}
            onChange={setApronIndex}
          />
          <SelectRow
            label={lang === "ru" ? "Брюки" : "Shimlar"}
            items={PANTS}
            activeIndex={pantsIndex}
            onChange={setPantsIndex}
          />

          <input
            type="text"
            value={chefName}
            onChange={(e) => setChefName(e.target.value)}
            placeholder={
              lang === "ru"
                ? "Имя шефа"
                : "Oshpaz nomi"
            }
            style={{
              width: "100%",
              height: 36,
              borderRadius: 999,
              border: "1px solid #d1d5db",
              padding: "0 12px",
              fontSize: 13,
              outline: "none",
              marginTop: 8,
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
            {lang === "ru" ? "Готово" : "Tayyor"}
          </button>
        </div>
      </section>

      {/* ЧАТ */}
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

type SelectRowProps = {
  label: string;
  items: ItemVariant[];
  activeIndex: number;
  onChange: (index: number) => void;
};

const SelectRow: React.FC<SelectRowProps> = ({
  label,
  items,
  activeIndex,
  onChange,
}) => {
  return (
    <div
      style={{
        borderRadius: 14,
        border: "1px solid #e5e7eb",
        padding: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#4b5563",
          minWidth: 90,
        }}
      >
        {label}
      </span>
      <select
        value={items[activeIndex]?.id ?? ""}
        onChange={(e) => {
          const id = Number(e.target.value);
          const index = items.findIndex((it) => it.id === id);
          if (index >= 0) onChange(index);
        }}
        style={{
          flex: 1,
          height: 32,
          borderRadius: 999,
          border: "1px solid #d1d5db",
          padding: "0 10px",
          fontSize: 12,
          outline: "none",
          background: "#f9fafb",
        }}
      >
        {items.map((it) => (
          <option key={it.id} value={it.id}>
            {it.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChatPage;
