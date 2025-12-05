"use client";

import React, { useState, useEffect, useRef } from "react";

type Message = { text: string; sender: "user" | "bot" };

type ItemVariant = {
  id: number;
  name: string;
  image: string;
};

const HATS: ItemVariant[] = [
  { id: 1, name: "Классическая шапка", image: "/uniforms/hat-1.png" },
  { id: 2, name: "Современная шапка", image: "/uniforms/hat-2.png" },
];

const TOPS: ItemVariant[] = [
  { id: 1, name: "Классический китель", image: "/uniforms/top-1.png" },
  { id: 2, name: "Современный китель", image: "/uniforms/top-2.png" },
  { id: 3, name: "Минималистичный китель", image: "/uniforms/top-3.png" },
  { id: 4, name: "Узбекская кухня", image: "/uniforms/top-4.png" },
];

const APRONS: ItemVariant[] = [
  { id: 1, name: "Классический фартук", image: "/uniforms/apron-1.png" },
  { id: 2, name: "Нагрудный фартук", image: "/uniforms/apron-2.png" },
];

const PANTS: ItemVariant[] = [
  { id: 1, name: "Классические брюки", image: "/uniforms/pants-1.png" },
  { id: 2, name: "Джоггеры", image: "/uniforms/pants-2.png" },
];

type ChefLook = {
  hatId: number | null;
  topId: number | null;
  apronId: number | null;
  pantsId: number | null;
};

const ChatPage: React.FC = () => {
  const [lang, setLang] = useState<"ru" | "uz">("ru");

  // tanlovlar
  const [hatIndex, setHatIndex] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  const [apronIndex, setApronIndex] = useState(0);
  const [pantsIndex, setPantsIndex] = useState(0);

  const [look, setLook] = useState<ChefLook>({
    hatId: HATS[0]?.id ?? null,
    topId: TOPS[0]?.id ?? null,
    apronId: APRONS[0]?.id ?? null,
    pantsId: PANTS[0]?.id ?? null,
  });

  const [chefName, setChefName] = useState<string>("Шеф Алиджан");

  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<HTMLDivElement | null>(null);

  // typewriter rollar
  const rolesRu = ["поваров", "официантов", "барменов"];
  const rolesUz = ["oshpazlar", "ofitsiantlar", "barmenlar"];
  const roles = lang === "ru" ? rolesRu : rolesUz;

  const [roleIndex, setRoleIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  const TYPE_SPEED = 120; // harf tezligi
  const WORD_DELAY = 5000; // so‘z almashtirish

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
        if (typeInterval !== undefined) {
          clearInterval(typeInterval);
        }
        return prev;
      });
    }, TYPE_SPEED);

    const wordTimeout = window.setTimeout(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, WORD_DELAY);

    return () => {
      if (typeInterval !== undefined) clearInterval(typeInterval);
      clearTimeout(wordTimeout);
    };
  }, [roleIndex, roles.length]);

  // avtoscroll chat
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
    const typeLabelRu = "комплект формы для шеф-повара";
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
    const hat = HATS[hatIndex];
    const top = TOPS[topIndex];
    const apron = APRONS[apronIndex];
    const pants = PANTS[pantsIndex];

    const text =
      `Готовый комплект:\n` +
      `Шапка: ${hat?.name ?? "не выбрана"}\n` +
      `Верх: ${top?.name ?? "не выбран"}\n` +
      `Фартук: ${apron?.name ?? "не выбран"}\n` +
      `Брюки: ${pants?.name ?? "не выбраны"}\n` +
      `Имя на форме: ${chefName || "не указано"}`;

    const withContext = chatHistory.length === 0;
    sendMessageToGPT(text, { withContext });
    scrollTo(modelRef);
  };

  // helperlar: chap-o‘ng
  const cycleIndex = (len: number, idx: number) =>
    (idx + len) % len;

  const nextHat = () =>
    setHatIndex((prev) => cycleIndex(HATS.length, prev + 1));
  const prevHat = () =>
    setHatIndex((prev) => cycleIndex(HATS.length, prev - 1));

  const nextTop = () =>
    setTopIndex((prev) => cycleIndex(TOPS.length, prev + 1));
  const prevTop = () =>
    setTopIndex((prev) => cycleIndex(TOPS.length, prev - 1));

  const nextApron = () =>
    setApronIndex((prev) => cycleIndex(APRONS.length, prev + 1));
  const prevApron = () =>
    setApronIndex((prev) => cycleIndex(APRONS.length, prev - 1));

  const nextPants = () =>
    setPantsIndex((prev) => cycleIndex(PANTS.length, prev + 1));
  const prevPants = () =>
    setPantsIndex((prev) => cycleIndex(PANTS.length, prev - 1));

  // tanlov o‘zgarganda look state yangilash
  useEffect(() => {
    setLook((prev) => ({ ...prev, hatId: HATS[hatIndex]?.id ?? null }));
  }, [hatIndex]);
  useEffect(() => {
    setLook((prev) => ({ ...prev, topId: TOPS[topIndex]?.id ?? null }));
  }, [topIndex]);
  useEffect(() => {
    setLook((prev) => ({ ...prev, apronId: APRONS[apronIndex]?.id ?? null }));
  }, [apronIndex]);
  useEffect(() => {
    setLook((prev) => ({ ...prev, pantsId: PANTS[pantsIndex]?.id ?? null }));
  }, [pantsIndex]);

  const currentTopImage = TOPS[topIndex]?.image ?? "/uniforms/top-1.png";

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
              ? "Подберите шапку, китель, фартук и брюки — ассистент поможет собрать комплекты под ваш бренд и задачи."
              : "Shapka, kitel, fartuk va shimlarni tanlang — assistent brendingizga mos to‘plamlarni taklif qiladi."}
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
                Выберите шапку, верх, фартук и брюки — образ обновится.
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
            <img
              src={currentTopImage}
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

        {/* ВАРИАНТЫ: 4 КАТЕГОРИИ */}
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
              ? "Выберите элементы формы"
              : "Forma elementlarini tanlang"}
          </div>

          {/* ШАПКА */}
          <CategoryRow
            title={lang === "ru" ? "Шапка" : "Shapka"}
            item={HATS[hatIndex]}
            onPrev={prevHat}
            onNext={nextHat}
          />

          {/* ВЕРХ */}
          <CategoryRow
            title={lang === "ru" ? "Верхняя одежда" : "Yuqori kiyim"}
            item={TOPS[topIndex]}
            onPrev={prevTop}
            onNext={nextTop}
          />

          {/* ФАРТУК */}
          <CategoryRow
            title={lang === "ru" ? "Фартук" : "Fartuk"}
            item={APRONS[apronIndex]}
            onPrev={prevApron}
            onNext={nextApron}
          />

          {/* БРЮКИ */}
          <CategoryRow
            title={lang === "ru" ? "Брюки" : "Shimlar"}
            item={PANTS[pantsIndex]}
            onPrev={prevPants}
            onNext={nextPants}
          />

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

        {/* ВВОД */}
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

type CategoryRowProps = {
  title: string;
  item: ItemVariant | undefined;
  onPrev: () => void;
  onNext: () => void;
};

const CategoryRow: React.FC<CategoryRowProps> = ({
  title,
  item,
  onPrev,
  onNext,
}) => {
  if (!item) return null;

  return (
    <div
      style={{
        borderRadius: 14,
        border: "1px solid #e5e7eb",
        padding: 8,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#4b5563",
          width: 90,
        }}
      >
        {title}
      </div>
      <button
        onClick={onPrev}
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          border: "1px solid #d1d5db",
          background: "#ffffff",
          cursor: "pointer",
        }}
      >
        ‹
      </button>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 8,
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
            src={item.image}
            alt={item.name}
            style={{
              width: "90%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          {item.name}
        </div>
      </div>
      <button
        onClick={onNext}
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          border: "1px solid #d1d5db",
          background: "#ffffff",
          cursor: "pointer",
        }}
      >
        ›
      </button>
    </div>
  );
};

export default ChatPage;
