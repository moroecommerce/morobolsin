"use client";

import React, { useState, useEffect, useRef } from "react";

type Message = { text: string; sender: "user" | "bot" };

type ItemVariant = {
  id: number;
  name: string;
  image: string;
};

// Файлы должны лежать в /public/images
const HERO_BG = "/images/chef-hero.jpg";
const DEFAULT_TOP = "/images/chef-3d.png";

const HATS: ItemVariant[] = [
  { id: 1, name: "Классическая шапка", image: "/images/hat-1.png" },
  { id: 2, name: "Высокая шапка", image: "/images/hat-2.png" },
  { id: 3, name: "Бандана", image: "/images/hat-3.png" },
];

const TOPS: ItemVariant[] = [
  { id: 1, name: "Классический китель", image: "/images/top-1.png" },
  { id: 2, name: "Современный китель", image: "/images/top-2.png" },
  { id: 3, name: "Минималистичный китель", image: "/images/top-3.png" },
];

const APRONS: ItemVariant[] = [
  { id: 1, name: "Классический фартук", image: "/images/apron-1.png" },
  { id: 2, name: "Нагрудный фартук", image: "/images/apron-2.png" },
  { id: 3, name: "Бариста фартук", image: "/images/apron-3.png" },
];

const PANTS: ItemVariant[] = [
  { id: 1, name: "Классические брюки", image: "/images/pants-1.png" },
  { id: 2, name: "Джоггеры", image: "/images/pants-2.png" },
  { id: 3, name: "Узкие брюки", image: "/images/pants-3.png" },
];

// Тематические иконки по прямым HTTPS‑ссылкам
const ICON_HAT =
  "https://img.icons8.com/ios-filled/100/000000/chef-hat.png";      // шапка [web:160]
const ICON_TOP =
  "https://img.icons8.com/ios-filled/100/000000/t-shirt.png";        // верх/китель [web:163]
const ICON_APRON =
  "https://img.icons8.com/ios-filled/100/000000/apron.png";          // фартук [web:165]
const ICON_PANTS =
  "https://img.icons8.com/ios-filled/100/000000/trousers.png";       // брюки [web:163]

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
  const modelRef = useRef<HTMLDivElement | null>(null);

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
      { text, sender: "user" },
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
    scrollTo(modelRef);
  };

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

  const currentTopImage = look.top?.image || DEFAULT_TOP;

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
            padding: "14px 16px",
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

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                border: "1px solid #d1d5db",
                background: "#ffffff",
                fontSize: 22,
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
                    padding: "6px 12px",
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
          borderRadius: 26,
          padding: "24px 20px",
          color: "#f9fafb",
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "center",
          backgroundImage: `linear-gradient(135deg,rgba(17,24,39,0.9),rgba(75,85,99,0.9)), url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
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
              lineHeight: 1.7,
              maxWidth: 480,
            }}
          >
            {lang === "ru"
              ? "Подберите шапку, верх и фартук — ассистент поможет собрать комплект под ваш бренд."
              : "Shapka, yuqori kiyim va fartukni tanlang — assistent brendingizga mos to‘plamni taklif qiladi."}
          </p>
        </div>
      </section>

      {/* 3D + категории */}
      <section
        ref={modelRef}
        style={{
          maxWidth: 960,
          margin: "0 auto 24px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        {/* ЛЕВАЯ КОЛОНКА – 3D модель */}
        <div
          style={{
            borderRadius: 22,
            background: "#ffffff",
            boxShadow: "0 4px 16px rgba(148,163,184,0.16)",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            minHeight: 380,
          }}
        >
          <div
            style={{
              flex: 1,
              borderRadius: 18,
              background: "#f9fafb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src={currentTopImage}
              alt="3D модель в форме"
              style={{
                width: "98%",
                maxWidth: 500,
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
                color: "#111827",
                textShadow: "0 1px 2px rgba(0,0,0,0.18)",
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

        {/* ПРАВАЯ КОЛОНКА – выбор категорий */}
        <div
          style={{
            borderRadius: 22,
            background: "#ffffff",
            boxShadow: "0 4px 16px rgba(148,163,184,0.16)",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 380,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <IconSelectRow
              icon={ICON_HAT}
              alt="Шапка"
              items={HATS}
              activeIndex={hatIndex}
              onChange={setHatIndex}
            />
            <IconSelectRow
              icon={ICON_TOP}
              alt="Верх"
              items={TOPS}
              activeIndex={topIndex}
              onChange={setTopIndex}
            />
            <IconSelectRow
              icon={ICON_APRON}
              alt="Фартук"
              items={APRONS}
              activeIndex={apronIndex}
              onChange={setApronIndex}
            />
            <IconSelectRow
              icon={ICON_PANTS}
              alt="Брюки"
              items={PANTS}
              activeIndex={pantsIndex}
              onChange={setPantsIndex}
            />
          </div>

          <div style={{ marginTop: 12 }}>
            <input
              type="text"
              value={chefName}
              onChange={(e) => setChefName(e.target.value)}
              placeholder={lang === "ru" ? "Имя шефа" : "Oshpaz nomi"}
              style={{
                width: "100%",
                height: 40,
                borderRadius: 999,
                border: "1px solid #d1d5db",
                padding: "0 16px",
                fontSize: 13,
                outline: "none",
                marginBottom: 12,
              }}
            />

            <button
              onClick={handleDone}
              style={{
                width: "100%",
                height: 44,
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
            paddingTop: 8,
            paddingBottom: 8,
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
                ? "Сообщение ассистенту..."
                : "Assistentga xabar yozing..."
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

type IconSelectRowProps = {
  icon: string;
  alt: string;
  items: ItemVariant[];
  activeIndex: number;
  onChange: (index: number) => void;
};

// Иконка маленькая, без серого фона, стоит слева внутри строки категории
const IconSelectRow: React.FC<IconSelectRowProps> = ({
  icon,
  alt,
  items,
  activeIndex,
  onChange,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
    }}
  >
    <img
      src={icon}
      alt={alt}
      style={{
        width: 20,
        height: 20,
        objectFit: "contain",
        filter: "grayscale(100%) brightness(0.3)",
        flexShrink: 0,
      }}
    />
    <select
      value={items[activeIndex]?.id ?? ""}
      onChange={(e) => {
        const id = Number(e.target.value);
        const index = items.findIndex((it) => it.id === id);
        if (index >= 0) onChange(index);
      }}
      style={{
        flex: 1,
        height: 38,
        borderRadius: 999,
        border: "1px solid #d1d5db",
        padding: "0 14px",
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

export default ChatPage;
