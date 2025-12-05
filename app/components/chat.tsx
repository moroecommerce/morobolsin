"use client";

import React, { useState, useEffect, useRef } from "react";

type Message = { text: string; sender: "user" | "bot" };

type ItemVariant = {
  id: number;
  name: string;
  icon: string;
};

const HATS: ItemVariant[] = [
  { id: 1, name: "Классическая шапка", icon: "/icons/hat-1.svg" },
  { id: 2, name: "Высокая шапка", icon: "/icons/hat-2.svg" },
  { id: 3, name: "Бандана", icon: "/icons/hat-3.svg" },
];

const TOPS: ItemVariant[] = [
  { id: 1, name: "Классический китель", icon: "/icons/top-1.svg" },
  { id: 2, name: "Современный китель", icon: "/icons/top-2.svg" },
  { id: 3, name: "Минималистичный", icon: "/icons/top-3.svg" },
];

const APRONS: ItemVariant[] = [
  { id: 1, name: "Классический фартук", icon: "/icons/apron-1.svg" },
  { id: 2, name: "Нагрудный фартук", icon: "/icons/apron-2.svg" },
  { id: 3, name: "Бариста", icon: "/icons/apron-3.svg" },
];

const PANTS: ItemVariant[] = [
  { id: 1, name: "Классические брюки", icon: "/icons/pants-1.svg" },
  { id: 2, name: "Джоггеры", icon: "/icons/pants-2.svg" },
  { id: 3, name: "Узкие брюки", icon: "/icons/pants-3.svg" },
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
  const modelRef = useRef<HTMLDivElement | null>(null);

  // animated header roles
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

  // chat autoscroll
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
    scrollTo(modelRef);
  };

  // indexlar o`zgarganda lookni yangilash
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
              ? "Свайпайте шапку, верх, фартук и брюки — ассистент соберёт комплект под ваш бренд."
              : "Shapka, ustki, fartuk va shimlarni swipe qilib tanlang — assistent mos to‘plam tuzadi."}
          </p>
        </div>
      </section>

      {/* EDITOR + PREVIEW */}
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
        {/* PREVIEW (chapdagi “3D”) */}
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
                3D‑модель в форме (иконки)
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                }}
              >
                Пока условно: шапка, верх, фартук и брюки как слои иконок.
              </div>
            </div>
          </div>

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
            {/* pants */}
            {look.pants && (
              <img
                src={look.pants.icon}
                alt={look.pants.name}
                style={{
                  position: "absolute",
                  bottom: 12,
                  width: "32%",
                  opacity: 0.9,
                }}
              />
            )}

            {/* apron */}
            {look.apron && (
              <img
                src={look.apron.icon}
                alt={look.apron.name}
                style={{
                  position: "absolute",
                  bottom: 40,
                  width: "40%",
                  opacity: 0.95,
                }}
              />
            )}

            {/* top */}
            {look.top && (
              <img
                src={look.top.icon}
                alt={look.top.name}
                style={{
                  position: "absolute",
                  bottom: 80,
                  width: "45%",
                  opacity: 0.95,
                }}
              />
            )}

            {/* hat */}
            {look.hat && (
              <img
                src={look.hat.icon}
                alt={look.hat.name}
                style={{
                  position: "absolute",
                  bottom: 150,
                  width: "26%",
                  opacity: 0.95,
                }}
              />
            )}

            {/* name */}
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

        {/* KATEGORIYALAR – SWIPE SCROLL */}
        <div
          style={{
            borderRadius: 22,
            background: "#ffffff",
            boxShadow: "0 4px 16px rgba(148,163,184,0.16)",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
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
            {lang === "ru"
              ? "Свайпните элементы формы"
              : "Forma elementlarini swipe qiling"}
          </div>

          <SwipeRow
            title={lang === "ru" ? "Шапка" : "Shapka"}
            items={HATS}
            activeIndex={hatIndex}
            onActiveChange={setHatIndex}
          />

          <SwipeRow
            title={lang === "ru" ? "Верхняя одежда" : "Yuqori kiyim"}
            items={TOPS}
            activeIndex={topIndex}
            onActiveChange={setTopIndex}
          />

          <SwipeRow
            title={lang === "ru" ? "Фартук" : "Fartuk"}
            items={APRONS}
            activeIndex={apronIndex}
            onActiveChange={setApronIndex}
          />

          <SwipeRow
            title={lang === "ru" ? "Брюки" : "Shimlar"}
            items={PANTS}
            activeIndex={pantsIndex}
            onActiveChange={setPantsIndex}
          />

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

      {/* CHAT */}
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

type SwipeRowProps = {
  title: string;
  items: ItemVariant[];
  activeIndex: number;
  onActiveChange: (index: number) => void;
};

const SwipeRow: React.FC<SwipeRowProps> = ({
  title,
  items,
  activeIndex,
  onActiveChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // aktiv elementga taxminan o‘rtaga “scroll” qilish
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const child = el.children[activeIndex] as HTMLElement | undefined;
    if (!child) return;
    const offset =
      child.offsetLeft - el.clientWidth / 2 + child.clientWidth / 2;
    el.scrollTo({ left: offset, behavior: "smooth" });
  }, [activeIndex]);

  return (
    <div
      style={{
        borderRadius: 14,
        border: "1px solid #e5e7eb",
        padding: 8,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#4b5563",
        }}
      >
        {title}
      </div>

      <div
        ref={containerRef}
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 4,
          WebkitOverflowScrolling: "touch",
        }}
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onActiveChange(index)}
              style={{
                minWidth: 84,
                maxWidth: 84,
                borderRadius: 14,
                border: isActive
                  ? "2px solid #111827"
                  : "1px solid #e5e7eb",
                background: isActive ? "#eef2ff" : "#f9fafb",
                padding: 6,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 999,
                  background: "#e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  style={{
                    width: "70%",
                    height: "70%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#111827",
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                {item.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChatPage;
