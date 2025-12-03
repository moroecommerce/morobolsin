"use client";
import React, { useState, useEffect, useRef } from "react";

const MORO_COLOR = "#1f242b";
const ICON_SIZE = 23;
const borderRadius = 22;
const panelHeight = 62;
const maxWidth = 560;
const videoMaxWidth = 314;
const GRADIENT = "linear-gradient(135deg, #f4f5f7 0%, #e5e7eb 100%)";
const BABY_GRADIENT = "linear-gradient(135deg, #1f242b 0%, #3a4250 100%)";
const INPUT_BAR_HEIGHT = 68;
const PANEL_SIDE_PADDING = 15;
const BLOCK_SIDE_PADDING = 10;
const CARD_GAP = 10;

const IconShield = (
  <svg width="17" height="17" fill="none" viewBox="0 0 22 22">
    <path
      d="M11 3.3C7.1 5 4.6 5.5 3.7 5.7c-.1 0-.2 0-.2.2 0 6.8 2.6 11.2 7.1 12.7.2.1.4.1.6 0 4.5-1.5 7.1-5.8 7.1-12.7 0-.2-.1-.2-.2-.2-.9-.2-3.4-.7-7.1-2.4Z"
      stroke="#5a6573"
      strokeWidth="1.35"
      fill="#f2f7fe"
    />
  </svg>
);

const IconPartner = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <circle cx="10" cy="6.5" r="3.3" stroke="#5a6573" strokeWidth="1.5" fill="none" />
    <path
      d="M2.8 16c.9-2.5 3.4-4.2 7.2-4.2s6.2 1.7 7.2 4.2"
      stroke="#5a6573"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const IconContact = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <rect
      x="2.8"
      y="3.5"
      width="14.4"
      height="11"
      rx="2.2"
      stroke="#5a6573"
      strokeWidth="1.5"
    />
    <path
      d="M3.5 4l6.5 6.1c.3.2.8.2 1.1 0L17 4"
      stroke="#5a6573"
      strokeWidth="1.5"
    />
  </svg>
);

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/1946/1946547.png",
  trash: "https://cdn-icons-png.flaticon.com/512/1345/1345823.png",
  share: "https://cdn-icons-png.flaticon.com/512/535/535285.png",
  arrowRight: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M6 11H16M16 11L12 7M16 11L12 15"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const filterMoro =
  "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)";

const BENEFITS = [
  {
    emoji: "👨‍🍳",
    title: "Профессиональная униформа",
    text:
      "Помогаем подобрать форму для шефов, поваров, бариста и официантов под стиль вашего заведения.",
  },
  {
    emoji: "✨",
    title: "Современный дизайн",
    text:
      "Каждый комплект продуман до деталей: крой, посадка и материалы создают ощущение премиального сервиса.",
  },
  {
    emoji: "🧵",
    title: "Индивидуальный подход",
    text:
      "Наносим логотипы, подбираем цвета под бренд и собираем комплекты под ваш формат: кафе, ресторан, отель.",
  },
  {
    emoji: "🧺",
    title: "Практичные ткани",
    text:
      "Используем материалы, устойчивые к частым стиркам, пятнам и высокой нагрузке на кухне и в зале.",
  },
  {
    emoji: "🚚",
    title: "Быстрая комплектация",
    text: "Собираем и доставляем форму для всей команды в сжатые сроки.",
  },
];

const REVIEWS = [
  {
    name: "Navruz Hotel",
    badge: "Отель, Ташкент",
    problem: "Нужна единая форма для персонала",
    text:
      "Morobolsin разработали элегантную и практичную униiformу для ресепшн и ресторана. Гости сразу отмечают аккуратный внешний вид команды.",
  },
  {
    name: "Chef Aziz",
    badge: "Шеф‑повар",
    problem: "Форма для кухни и открытой линии",
    text:
      "Кителя удобные, не сковывают движения и хорошо выглядят в кадре. Для команды сделали разные модели под роли.",
  },
  {
    name: "Coffee Place",
    badge: "Кофейня",
    problem: "Единый стиль бариста",
    text:
      "Фартуки и рубашки в фирменных цветах помогают выделить бренд. Материалы выдерживают ежедневную нагрузку.",
  },
];

const PREMADE_THEMES = [
  {
    emoji: "👨‍🍳",
    title: "Форма для шефа",
    desc: "Подбор кителя и брюк под концепцию кухни.",
    question:
      "Помогите подобрать китель и брюки для шеф‑повара в ресторане европейской кухни.",
  },
  {
    emoji: "🥂",
    title: "Униформа официантов",
    desc: "Фартуки и рубашки для зала.",
    question:
      "Нужна форма для официантов в ресторане: какие варианты лучше подобрать?",
  },
  {
    emoji: "☕️",
    title: "Форма для бариста",
    desc: "Современные фартуки и рубашки.",
    question: "Посоветуйте стильную форму для бариста в кофейне.",
  },
  {
    emoji: "🧵",
    title: "Логотип и брендинг",
    desc: "Вышивка логотипа и фирменные цвета.",
    question:
      "Как лучше разместить логотип ресторана на кителе и фартуке, чтобы это выглядело аккуратно и премиально?",
  },
  {
    emoji: "👥",
    title: "Форма для всей команды",
    desc: "Комплектация под разный персонал.",
    question:
      "Нужна униформа сразу для кухни, официантов и хостес. С чего начать подбор?",
  },
];

const WhyMoroBlock = () => (
  <div
    style={{
      width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
      maxWidth,
      margin: "0 auto 38px auto",
      background: GRADIENT,
      borderRadius: borderRadius,
      boxShadow: "0 6px 20px 0 rgba(150, 175, 205, 0.10)",
      boxSizing: "border-box" as const,
      padding: 0,
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
    }}
  >
    <div style={{ padding: `21px 0 20px 0` }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: "20px",
          color: MORO_COLOR,
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Почему Morobolsin?
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: CARD_GAP,
          padding: `0 ${BLOCK_SIDE_PADDING}px`,
        }}
      >
        {BENEFITS.map(({ emoji, title, text }, idx) => (
          <div
            key={idx}
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 2px 18px 0 rgba(150,180,220,0.07)",
              padding: "19px 15px 19px 15px",
              overflow: "hidden",
              minHeight: 56,
              textAlign: "left",
            }}
          >
            <span
              style={{
                position: "absolute",
                right: 12,
                top: 14,
                fontSize: 62,
                opacity: 0.14,
                pointerEvents: "none",
                userSelect: "none",
                lineHeight: 1,
                zIndex: 0,
              }}
              aria-hidden="true"
            >
              {emoji}
            </span>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: MORO_COLOR,
                  marginBottom: 7,
                  textAlign: "left",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#3a3a3a",
                  lineHeight: "1.64",
                  textAlign: "left",
                }}
              >
                {text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ReviewBlock = () => (
  <div
    style={{
      width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
      maxWidth,
      margin: "0 auto 38px auto",
      background: GRADIENT,
      borderRadius: borderRadius,
      boxShadow: "0 6px 20px 0 rgba(150, 175, 205, 0.10)",
      boxSizing: "border-box" as const,
      padding: 0,
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
    }}
  >
    <div style={{ padding: "21px 0 20px 0" }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: "20px",
          color: MORO_COLOR,
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Отзывы наших клиентов
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: CARD_GAP,
          padding: `0 ${BLOCK_SIDE_PADDING}px`,
        }}
      >
        {REVIEWS.map(({ name, badge, problem, text }, idx) => (
          <div
            key={idx}
            style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 2px 18px 0 rgba(150,180,220,0.07)",
              padding: "19px 15px 19px 15px",
              overflow: "hidden",
              textAlign: "left",
            }}
          >
            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 7,
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#222",
                  }}
                >
                  {name}
                </span>
                <span
                  style={{
                    fontWeight: 500,
                    fontSize: 13,
                    color: "#1681f5",
                    padding: "4px 9px",
                    borderRadius: 12,
                    background: "#f3f7fe",
                    whiteSpace: "nowrap",
                  }}
                >
                  {badge}
                </span>
              </div>
              <div
                style={{
                  fontWeight: 500,
                  fontSize: 13,
                  color: "#acb5bd",
                  marginBottom: 9,
                }}
              >
                {problem}
              </div>
              <div style={{ fontSize: 13, color: "#3a3a3a", lineHeight: "1.64" }}>
                {text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Footer = () => (
  <div
    style={{
      width: `calc(100% - 40px)`,
      maxWidth,
      margin: "0 auto",
      background: GRADIENT,
      borderRadius: "22px",
      boxShadow: "0 -4px 14px 0 rgba(155,175,205,0.06)",
      boxSizing: "border-box" as const,
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 22,
      paddingBottom: 22,
      display: "flex",
      flexDirection: "column",
      gap: 18,
      alignItems: "center",
    }}
  >
    <div
      style={{
        fontSize: 12,
        color: "#263540",
        fontWeight: 600,
        textAlign: "center",
        width: "100%",
      }}
    >
      Ташкент, Юнусабадский район, массив Кашгар 26
    </div>
    <div
      style={{
        display: "flex",
        gap: 11,
        width: "100%",
        justifyContent: "center",
      }}
    >
      <a
        href="#"
        style={{
          background: "#fff",
          width: "63%",
          borderRadius: 13,
          color: "#495062",
          fontWeight: 400,
          fontSize: 14,
          padding: "9px 0",
          textDecoration: "none",
          textAlign: "center",
          border: "1px solid #e1e9f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          marginRight: 5,
        }}
      >
        {IconPartner} Стать партнёром
      </a>
      <a
        href="#"
        style={{
          background: "#fff",
          width: "37%",
          borderRadius: 13,
          color: "#495062",
          fontWeight: 400,
          fontSize: 14,
          padding: "9px 0",
          textDecoration: "none",
          textAlign: "center",
          border: "1px solid #e1e9f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
        }}
      >
        {IconContact} Контакты
      </a>
    </div>
    <a
      href="#"
      style={{
        background: "#fff",
        padding: "9px 0",
        width: "100%",
        borderRadius: 14,
        color: "#556",
        fontWeight: 400,
        fontSize: 14,
        textDecoration: "none",
        border: "1px solid #e1e9f5",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {IconShield} Политика конфиденциальности
    </a>
    <div
      style={{
        marginTop: 8,
        fontSize: 12,
        color: "#8a97a0",
        textAlign: "center",
        width: "100%",
      }}
    >
      © {new Date().getFullYear()} Morobolsin — униформа для HoReCa
    </div>
  </div>
);

const FooterGap = () => <div style={{ height: 20 }} />;

const THREAD_KEY = "moro_thread_id";

function splitBotTextTwoBlocks(text: string) {
  if (!text) return [];
  let cleaned = text.replace(/[*_]/g, "");
  const match = cleaned.match(/^([^.!?]+[.!?])\s*(.*)$/s);
  if (match) {
    const first = match[1].trim();
    const rest = match[2].trim();
    return [
      { text: first, bold: true },
      { text: rest, bold: false },
    ];
  } else {
    return [{ text: cleaned, bold: true }];
  }
}

const HowItWorks = () => {
  const EXAMPLES = [
    {
      q: "Открываем новый ресторан, нужна форма для кухни и зала.",
      a:
        "Расскажите о концепции заведения, количестве персонала и основных ролях. Предложу варианты кителей, фартуков и рубашек, которые будут гармонировать со стилем интерьера и брендом.",
    },
    {
      q: "Хотим обновить форму официантов под новый стиль меню.",
      a:
        "Опишите цвета бренда и общий тон заведения. Подберём фартуки и рубашки так, чтобы они подчёркивали атмосферу и выглядели современно на фото и видео.",
    },
    {
      q: "Нужна практичная форма для бариста.",
      a:
        "Уточните загрузку точки и формат кофейни. Подскажу ткани и модели фартуков, которые выдержат частые стирки и сохранят аккуратный вид.",
    },
    {
      q: "Хотим добавить логотип на форму.",
      a:
        "Пришлите логотип и основные цвета бренда. Посоветуем оптимальное размещение и тип нанесения, чтобы логотип выглядел чётко и не мешал в работе.",
    },
  ];

  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"q" | "a" | "next">("q");
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  useEffect(() => {
    let t: ReturnType<typeof setInterval> | ReturnType<typeof setTimeout>;
    if (phase === "q") {
      setQ("");
      let i = 0;
      t = setInterval(() => {
        setQ(EXAMPLES[step].q.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].q.length) {
          clearInterval(t as ReturnType<typeof setInterval>);
          setTimeout(() => setPhase("a"), 350);
        }
      }, 35);
    } else if (phase === "a") {
      setA("");
      let i = 0;
      t = setInterval(() => {
        setA(EXAMPLES[step].a.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].a.length) {
          clearInterval(t as ReturnType<typeof setInterval>);
          setTimeout(() => setPhase("next"), 6900);
        }
      }, 17);
    } else if (phase === "next") {
      t = setTimeout(() => {
        setStep((s) => (s + 1) % EXAMPLES.length);
        setPhase("q");
      }, 350);
    }
    return () => {
      if (typeof t === "number") clearTimeout(t as number);
      else clearInterval(t as ReturnType<typeof setInterval>);
    };
  }, [phase, step]);

  const bubbleUser = (text: string) => (
    <div
      style={{
        alignSelf: "flex-end",
        background: "#fff",
        borderRadius: "19px 19px 4px 19px",
        padding: "20px 22px",
        marginBottom: 26,
        maxWidth: 400,
        textAlign: "right",
        fontSize: 15.5,
        lineHeight: 1.7,
        boxShadow: "0 1px 8px rgba(200,180,200,0.12)",
      }}
    >
      {text}
    </div>
  );

  const bubbleBot = (text: string) => (
    <div
      style={{
        alignSelf: "flex-start",
        background: "#f7fafd",
        borderRadius: "19px 19px 19px 4px",
        padding: "22px 24px",
        marginBottom: 26,
        maxWidth: 420,
        textAlign: "left",
        fontSize: 15.5,
        lineHeight: 1.7,
        boxShadow: "0 1px 8px rgba(200,180,200,0.12)",
      }}
    >
      {text}
    </div>
  );

  return (
    <div
      style={{
        width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
        maxWidth,
        margin: "0 auto 38px auto",
        background: GRADIENT,
        borderRadius: 22,
        boxShadow: "0 6px 20px rgba(150,175,205,0.1)",
        padding: "21px 0 20px 0",
        fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "20px",
          color: MORO_COLOR,
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Как работает Morobolsin Assistant
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `0 ${BLOCK_SIDE_PADDING}px`,
        }}
      >
        {q && bubbleUser(q)}
        {a && bubbleBot(a)}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "#7b8590",
          textAlign: "center",
          marginTop: 8,
        }}
      >
        Просто опишите ваше заведение — Morobolsin подберёт форму для команды!
      </div>
    </div>
  );
};

const PremadeThemesPanel = ({
  disabled,
  onSend,
}: {
  disabled: boolean;
  onSend: (q: string) => void;
}) => (
  <div
    style={{
      width: "100%",
      maxWidth: maxWidth,
      margin: "18px auto 18px auto",
      padding: "0 15px",
      boxSizing: "border-box" as const,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: maxWidth,
        boxSizing: "border-box" as const,
        display: "flex",
        flexDirection: "column",
        gap: 15,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "17px",
          color: MORO_COLOR,
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        Часто задаваемые запросы
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 11,
        }}
      >
        {PREMADE_THEMES.map(({ emoji, title, desc, question }, idx) => (
          <button
            key={idx}
            style={{
              background: "#fff",
              borderRadius: 19,
              border: "1px solid #e1e9f5",
              boxShadow: "0 1px 10px rgba(155,155,175,0.06)",
              padding: "16px 16px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.55 : 1,
              transition: "opacity 0.13s",
            }}
            disabled={disabled}
            onClick={() => onSend(question)}
          >
            <span style={{ fontSize: 29, marginRight: 2, flexShrink: 0 }}>
              {emoji}
            </span>
            <div style={{ textAlign: "left", flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: MORO_COLOR,
                  marginBottom: 2,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontWeight: 400,
                  fontSize: 13,
                  color: "#7c8792",
                }}
              >
                {desc}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [preloading, setPreloading] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { text: string; sender: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [botProgress, setBotProgress] = useState("");
  const [isMobile, setIsMobile] = useState(true);
  const [focused, setFocused] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function checkScreen() {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 640);
      }
    }
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(THREAD_KEY);
    if (saved) setThreadId(saved);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setPreloading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, botProgress]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Morobolsin — униформа для HoReCa",
        text:
          "Профессиональная униформа для шефов, поваров, бариста и официантов.",
        url: window.location.href,
      });
    } else {
      alert("Ваш браузер не поддерживает Web Share API");
    }
  };

  const sendMessageToGPT = async (text: string) => {
    setLoading(true);
    const newHistory = [...chatHistory, { text, sender: "user" }];
    setChatHistory(newHistory);
    setBotProgress("");
    try {
      const res = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory, thread_id: threadId }),
      });
      const data = await res.json();
      if (data.thread_id) {
        setThreadId(data.thread_id);
        window.localStorage.setItem(THREAD_KEY, data.thread_id);
      }
      let botReply = data.reply;
      if (res.status !== 200 || !botReply) {
        botReply = data.error
          ? typeof data.error === "string"
            ? `Ошибка сервера: ${data.error}`
            : `Ассистент не ответил (ошибка сервера)`
          : "Извините, нет ответа от ассистента.";
      }
      let i = 0;
      setBotProgress("");
      const interval = setInterval(() => {
        setBotProgress(botReply.slice(0, i));
        i++;
        if (i > botReply.length) {
          clearInterval(interval);
          setChatHistory((prev) => [...prev, { text: botReply, sender: "bot" }]);
          setBotProgress("");
          setLoading(false);
        }
      }, 18);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { text: "Ошибка: не удалось получить ответ.", sender: "bot" },
      ]);
      setLoading(false);
      setBotProgress("");
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && !loading && !botProgress) {
      sendMessageToGPT(message.trim());
      setMessage("");
    }
  };

  const clearChatAll = () => {
    setChatHistory([]);
    setThreadId(null);
    window.localStorage.removeItem(THREAD_KEY);
    setShowWelcome(true);
    setBotProgress("");
  };

  const userMessageStyle: React.CSSProperties = {
    background: GRADIENT,
    padding: "13px 14px",
    borderRadius: 16,
    fontSize: 16,
    display: "inline-block",
    maxWidth: "95vw",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
    marginBottom: 18,
    marginTop: 2,
    boxSizing: "border-box",
    lineHeight: "1.77",
    minWidth: 60,
    textAlign: "right",
    whiteSpace: "pre-line",
  };

  if (!isMobile) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#f8fdff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 10000,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "21px",
            textAlign: "center",
            color: MORO_COLOR,
            background: "#fff",
            borderRadius: 24,
            padding: "35px 28px",
            boxShadow: "0 6px 36px 0 rgba(155, 175, 205, 0.12)",
          }}
        >
          Morobolsin Assistant — доступен только
          <br /> на мобильных устройствах
        </div>
      </div>
    );
  }

  if (preloading) {
    return (
      <div
        style={{
          background: "#f8fdff",
          width: "100vw",
          height: "100vh",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 10000,
          margin: 0,
          padding: 0,
        }}
      >
        <span
          style={{
            fontWeight: 800,
            fontSize: "38px",
            color: MORO_COLOR,
            letterSpacing: "0.07em",
            animation: "moroPulse 1.4s infinite linear",
          }}
        >
          Morobolsin
        </span>
        <style>{`
          @keyframes moroPulse {
            0% { opacity: 0.30; }
            50% { opacity: 1; }
            100% { opacity: 0.30; }
          }
        `}</style>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div
        style={{
          fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
          background: "#f8fdff",
          width: "100vw",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            width: `calc(100% - ${PANEL_SIDE_PADDING * 2}px)`,
            maxWidth,
            minHeight: panelHeight,
            background: GRADIENT,
            color: MORO_COLOR,
            margin: "20px auto 0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: borderRadius,
            paddingLeft: PANEL_SIDE_PADDING,
            paddingRight: PANEL_SIDE_PADDING,
            paddingTop: 5,
            paddingBottom: 5,
            boxSizing: "border-box" as const,
            zIndex: 1,
            fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              flex: 1,
              paddingLeft: 5,
            }}
          >
            <span
              style={{
                fontWeight: 800,
                fontSize: "19px",
                lineHeight: 1.06,
                whiteSpace: "nowrap",
                marginBottom: 7,
              }}
            >
              Morobolsin
            </span>
            <span
              style={{
                fontWeight: 400,
                fontSize: "13px",
                color: "#565656",
                lineHeight: 1.04,
                whiteSpace: "nowrap",
              }}
            >
              Ассистент по униформе HoReCa
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginLeft: 16,
            }}
          >
            <button
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                width: 38,
                height: 38,
                borderRadius: 19,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={handleShare}
            >
              <img
                src={ICONS.share}
                alt="Share"
                style={{
                  width: ICON_SIZE,
                  height: ICON_SIZE,
                  filter: filterMoro,
                }}
              />
            </button>
            <button
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                width: 38,
                height: 38,
                borderRadius: 19,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => window.open("https://t.me/morobolsin", "_blank")}
            >
              <img
                src={ICONS.telegram}
                alt="Telegram"
                style={{
                  width: ICON_SIZE,
                  height: ICON_SIZE,
                  filter: filterMoro,
                }}
              />
            </button>
            <button
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                width: 38,
                height: 38,
                borderRadius: 19,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={clearChatAll}
            >
              <img
                src={ICONS.trash}
                alt="Trash"
                style={{
                  width: ICON_SIZE,
                  height: ICON_SIZE,
                  filter: filterMoro,
                }}
              />
            </button>
          </div>
        </div>

        <div style={{ height: 20 }} />
        <div style={{ height: 20 }} />

        <div
          style={{
            width: "100%",
            maxWidth: maxWidth,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <video
            src="/morobolsin.mp4"
            style={{
              width: "100%",
              maxWidth: videoMaxWidth,
              display: "block",
              borderRadius: 24,
            }}
            autoPlay
            playsInline
            muted
            loop
            preload="auto"
          />
        </div>

        <div style={{ height: 20 }} />
        <div style={{ height: 20 }} />

        <div
          style={{
            width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
            maxWidth,
            textAlign: "center",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: "22px",
              color: MORO_COLOR,
              marginBottom: 14,
            }}
          >
            Ждёте идеальную форму для команды?
          </div>
          <div
            style={{
              fontWeight: 400,
              fontSize: "15px",
              margin: "0 auto 0 auto",
              maxWidth: 400,
              padding: "0 18px",
              lineHeight: 1.75,
              color: MORO_COLOR,
              display: "inline-block",
            }}
          >
            Morobolsin помогает ресторанам, кафе и отелям подобрать
            профессиональную униiformу: кителя, фартуки, брюки и рубашки для
            всей команды — от шефа до официанта.
          </div>

          <div style={{ height: 40 }} />
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <div style={{ width: "100%", textAlign: "center" }}>
              <button
                style={{
                  width: "100%",
                  maxWidth: 290,
                  background: BABY_GRADIENT,
                  color: "#fff",
                  border: "none",
                  borderRadius: borderRadius,
                  fontWeight: 700,
                  fontSize: "17px",
                  padding: "15px 0",
                  margin: "0 auto",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 18px 0 rgba(0, 0, 0, 0.18)",
                }}
                onClick={() => setShowWelcome(false)}
              >
                Начать подбор формы&nbsp;
                <span
                  style={{
                    marginLeft: 8,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {ICONS.arrowRight}
                </span>
              </button>
              <div style={{ height: 13 }} />
              <div style={{ fontSize: 13, color: "#7c8792" }}>
                Ответьте на несколько вопросов — подберём варианты под ваш формат
              </div>
            </div>
          </div>

          <div style={{ height: 40 }} />

          <HowItWorks />
          <WhyMoroBlock />
          <ReviewBlock />
          <Footer />
          <FooterGap />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f8fdff",
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: `calc(100% - ${PANEL_SIDE_PADDING * 2}px)`,
          maxWidth,
          minHeight: panelHeight,
          background: GRADIENT,
          color: MORO_COLOR,
          margin: "20px auto 0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: borderRadius,
          paddingLeft: PANEL_SIDE_PADDING,
          paddingRight: PANEL_SIDE_PADDING,
          paddingTop: 5,
          paddingBottom: 5,
          boxSizing: "border-box" as const,
          zIndex: 1,
          fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flex: 1,
            paddingLeft: 5,
          }}
        >
          <span
            style={{
              fontWeight: 800,
              fontSize: "19px",
              lineHeight: 1.06,
              whiteSpace: "nowrap",
              marginBottom: 7,
            }}
          >
            Morobolsin
          </span>
          <span
            style={{
              fontWeight: 400,
              fontSize: "13px",
              color: "#565656",
              lineHeight: 1.04,
              whiteSpace: "nowrap",
            }}
          >
            Ассистент по униформе HoReCa
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginLeft: 16,
          }}
        >
          <button
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              width: 38,
              height: 38,
              borderRadius: 19,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={handleShare}
          >
            <img
              src={ICONS.share}
              alt="Share"
              style={{
                width: ICON_SIZE,
                height: ICON_SIZE,
                filter: filterMoro,
              }}
            />
          </button>
          <button
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              width: 38,
              height: 38,
              borderRadius: 19,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => window.open("https://t.me/morobolsin", "_blank")}
          >
            <img
              src={ICONS.telegram}
              alt="Telegram"
              style={{
                width: ICON_SIZE,
                height: ICON_SIZE,
                filter: filterMoro,
              }}
            />
          </button>
          <button
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              width: 38,
              height: 38,
              borderRadius: 19,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={clearChatAll}
          >
            <img
              src={ICONS.trash}
              alt="Trash"
              style={{
                width: ICON_SIZE,
                height: ICON_SIZE,
                filter: filterMoro,
              }}
            />
          </button>
        </div>
      </div>

      <PremadeThemesPanel
        disabled={loading || !!botProgress}
        onSend={(q) => {
          if (!loading && !botProgress) {
            sendMessageToGPT(q);
          }
        }}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: maxWidth,
            margin: "0 auto",
            padding: "24px 0 110px 0",
          }}
        >
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              style={{
                textAlign: msg.sender === "user" ? "right" : "left",
                margin: "8px 20px",
              }}
            >
              {msg.sender === "user"
                ? (
                  <span style={userMessageStyle}>{msg.text}</span>
                )
                : splitBotTextTwoBlocks(msg.text).map((part, sIdx) =>
                    part.text ? (
                      <div
                        key={sIdx}
                        style={{
                          background: "#f7fafd",
                          borderRadius: 12,
                          padding: "10px 15px",
                          marginBottom: sIdx === 0 ? 18 : 30,
                          color: MORO_COLOR,
                          fontSize: 16,
                          lineHeight: 1.7,
                          fontWeight: part.bold ? "bold" : "normal",
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {part.text}
                      </div>
                    ) : null
                  )}
            </div>
          ))}

          {botProgress &&
            splitBotTextTwoBlocks(botProgress).map((part, sIdx) =>
              part.text ? (
                <div
                  key={sIdx}
                  style={{
                    background: "#f7fafd",
                    borderRadius: 12,
                    padding: "10px 15px",
                    margin: "0 20px 10px 20px",
                    color: MORO_COLOR,
                    fontSize: 16,
                    lineHeight: 1.7,
                    fontWeight: part.bold ? "bold" : "normal",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {part.text}
                </div>
              ) : null
            )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div
        style={{
          width: "calc(100% - 40px)",
          margin: "0 20px",
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box" as const,
          maxWidth: maxWidth,
          height: INPUT_BAR_HEIGHT,
          position: "fixed",
          left: 0,
          bottom: 25,
          background: "transparent",
          borderRadius: borderRadius,
          zIndex: 20,
          boxShadow: "none",
        }}
      >
        <input
          type="text"
          value={message}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Опишите вашу задачу по униформе..."
          style={{
            flex: 1,
            height: 48,
            fontSize: "16px",
            borderRadius: borderRadius,
            borderWidth: focused ? 2 : 1,
            borderStyle: "solid",
            borderColor: focused ? "transparent" : "#e5e8ed",
            borderImage: focused ? GRADIENT + " 1" : undefined,
            padding: "0 18px",
            background: "#fff",
            color: MORO_COLOR,
            boxSizing: "border-box" as const,
            marginRight: 8,
            transition: "border 0.22s",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          disabled={loading || !!botProgress}
        />
        <button
          style={{
            width: 48,
            height: 48,
            background: BABY_GRADIENT,
            color: "#fff",
            border: "none",
            borderRadius: borderRadius,
            fontWeight: 700,
            fontSize: "17px",
            cursor: loading || !!botProgress ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 14px 0 rgba(0,0,0,0.18)",
          }}
          onClick={handleSendMessage}
          disabled={loading || !!botProgress}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {ICONS.arrowRight}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Chat;
