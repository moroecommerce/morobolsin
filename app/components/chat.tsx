"use client";
import React, { useState, useEffect, useRef } from "react";

const NORA_COLOR = "#2e2e2e";
const ICON_SIZE = 23;
const borderRadius = 22;
const panelHeight = 62;
const maxWidth = 560;
const videoMaxWidth = 314;
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
const BABY_GRADIENT = "linear-gradient(90deg, #e39290 0%, #efb1b6 100%)";
const INPUT_BAR_HEIGHT = 68;
const PANEL_SIDE_PADDING = 15;
const BLOCK_SIDE_PADDING = 10;
const CARD_GAP = 10;

const IconShield = (
  <svg width="17" height="17" fill="none" viewBox="0 0 22 22">
    <path d="M11 3.3C7.1 5 4.6 5.5 3.7 5.7c-.1 0-.2 0-.2.2 0 6.8 2.6 11.2 7.1 12.7.2.1.4.1.6 0 4.5-1.5 7.1-5.8 7.1-12.7 0-.2-.1-.2-.2-.2-.9-.2-3.4-.7-7.1-2.4Z" stroke="#5a6573" strokeWidth="1.35" fill="#f2f7fe"/>
  </svg>
);

const IconPartner = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <circle cx="10" cy="6.5" r="3.3" stroke="#5a6573" strokeWidth="1.5"/>
    <path d="M2.8 16c.9-2.5 3.4-4.2 7.2-4.2s6.2 1.7 7.2 4.2"
      stroke="#5a6573" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconContact = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <rect x="2.8" y="3.5" width="14.4" height="11" rx="2.2"
      stroke="#5a6573" strokeWidth="1.5"/>
    <path d="M3.5 4l6.5 6.1c.3.2.8.2 1.1 0L17 4"
      stroke="#5a6573" strokeWidth="1.5"/>
  </svg>
);
const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/1946/1946547.png",
  trash: "https://cdn-icons-png.flaticon.com/512/1345/1345823.png",
  share: "https://cdn-icons-png.flaticon.com/512/535/535285.png",
  arrowRight: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M6 11H16M16 11L12 7M16 11L12 15"
        stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};
const filterNora = "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)";

const BENEFITS = [
  { emoji: "🩺", title: "Медицинская точность", text: "Советы основаны на рекомендациях британской службы NHS и адаптированы под ваш регион." },
  { emoji: "🤝", title: "Поддержка 24/7", text: "Ассистент всегда на связи для заботы и помощи в любой ситуации." },
  { emoji: "⏰", title: "Напоминания о важных делах", text: "Следим, чтобы вы ничего не забыли — анализы, витамины, визиты." },
  { emoji: "🔒", title: "Конфиденциальность", text: "Личные данные остаются только у вас — никакой передачи сторонним." },
  { emoji: "⚡️", title: "Быстрые решения", text: "Полезные советы и поддержка сразу, когда это нужно." },
];
const REVIEWS = [
  { name: "Анна", badge: "2 месяц беременности", problem: "Токсикоз", text: "Nora Plus подсказала, как справиться с утренней тошнотой. Благодаря рекомендациям по питанию и режиму дня симптомы стали гораздо легче." },
  { name: "Дилноза", badge: "3 месяц беременности", problem: "Тошнота", text: "Советы Nora Plus помогли справиться с тошнотой и легче переносить беременность. Все подсказки приходят вовремя." },
  { name: "Елена", badge: "4 месяц беременности", problem: "Слабость и усталость", text: "Теперь я знаю, какие витамины нужно пить, сколько отдыхать и как выстроить день. Чувствую себя значительно лучше!" },
  { name: "Шахноза", badge: "5 месяц беременности", problem: "Плохое настроение", text: "Благодаря мотивационным словам и советам Nora Plus моё настроение заметно улучшилось." },
  { name: "Ирина", badge: "5 месяц беременности", problem: "Тревожность", text: "Советы Nora Plus помогли мне больше отдыхать, заботиться о себе и избавиться от лишних переживаний за малыша." },
  { name: "Мария", badge: "7 месяц беременности", problem: "Бессонница", text: "Благодаря советам Nora Plus я стала лучше спать и спокойно жду появления малыша." },
  { name: "Виктория", badge: "3 месяц беременности", problem: "Страхи", text: "Nora Plus помогла справиться с тревогами и поддержала советами, теперь я чувствую себя увереннее." },
  { name: "Екатерина", badge: "6 месяц беременности", problem: "Питание", text: "Ассистент напомнил о важных витаминах и правильном режиме, теперь питаюсь грамотно и чувствую себя энергичной." },
  { name: "Гульнора", badge: "2 месяц беременности", problem: "Нарушение сна", text: "Проконсультировавшись с Nora, я восстановила сон и теперь хорошо встречаю утро." },
  { name: "Малика", badge: "8 месяц беременности", problem: "Раздражительность", text: "Во время беременности стала нервной, но советы от Nora помогли и настроение улучшилось." },
  { name: "Лола", badge: "4 месяц беременности", problem: "Недостаток белка", text: "Советы по питанию очень полезные, теперь у меня больше энергии." }
];

const PREMADE_THEMES = [
  {
    emoji: "🤢",
    title: "Как справиться с токсикозом?",
    desc: "Подскажу способы и витамины для уменьшения тошноты.",
    question: "Что делать при токсикозе?"
  },
  {
    emoji: "🩺",
    title: "Обязательные анализы",
    desc: "Какие обследования пройти и когда сдавать анализы.",
    question: "Какие анализы надо сдать в начале беременности?"
  },
  {
    emoji: "🥗",
    title: "Питание и витамины",
    desc: "Лучшие рекомендации для рациона будущей мамы.",
    question: "Какие витамины и продукты полезны беременной?"
  },
  {
    emoji: "😴",
    title: "Борьба с бессонницей",
    desc: "Ритуалы, советы и продукты для спокойного сна.",
    question: "Что поможет мне лучше спать во время беременности?"
  },
  {
    emoji: "🏃‍♀️",
    title: "Физическая активность",
    desc: "Можно ли спорт, какие упражнения безопасны.",
    question: "Какие упражнения подходят беременным?"
  },
  {
    emoji: "😌",
    title: "Контроль тревожности",
    desc: "Как снизить тревоги и справиться с волнениями.",
    question: "Как побороть тревогу во время беременности?"
  },
];

const WhyNoraBlock = () => (
  <div style={{
    width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
    maxWidth,
    margin: "0 auto 38px auto",
    background: GRADIENT,
    borderRadius: borderRadius,
    boxShadow: "0 6px 20px 0 rgba(150, 175, 205, 0.10)",
    boxSizing: 'border-box' as const,
    padding: 0,
    fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
  }}>
    <div style={{ padding: `21px 0 20px 0` }}>
      <div style={{
        fontWeight: 700,
        fontSize: "20px",
        color: NORA_COLOR,
        marginBottom: 20,
        textAlign: "center"
      }}>
        Почему Nora Plus?
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: CARD_GAP,
        padding: `0 ${BLOCK_SIDE_PADDING}px`
      }}>
        {BENEFITS.map(({ emoji, title, text }, idx) => (
          <div key={idx} style={{
            position: "relative",
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 2px 18px 0 rgba(150,180,220,0.07)",
            padding: "19px 15px 19px 15px",
            overflow: "hidden",
            minHeight: 56,
            textAlign: "left"
          }}>
            <span style={{
              position: "absolute",
              right: 12,
              top: 14,
              fontSize: 62,
              opacity: 0.14,
              pointerEvents: "none",
              userSelect: "none",
              lineHeight: 1,
              zIndex: 0,
            }} aria-hidden="true">
              {emoji}
            </span>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: NORA_COLOR, marginBottom: 7, textAlign: "left" }}>
                {title}
              </div>
              <div style={{ fontSize: 13, color: "#3a3a3a", lineHeight: "1.64", textAlign: "left" }}>
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
  <div style={{
    width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
    maxWidth,
    margin: "0 auto 38px auto",
    background: GRADIENT,
    borderRadius: borderRadius,
    boxShadow: "0 6px 20px 0 rgba(150, 175, 205, 0.10)",
    boxSizing: 'border-box' as const,
    padding: 0,
    fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
  }}>
    <div style={{ padding: "21px 0 20px 0" }}>
      <div style={{
        fontWeight: 700,
        fontSize: "20px",
        color: NORA_COLOR,
        marginBottom: 20,
        textAlign: "center"
      }}>
        Отзывы будущих мам
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: CARD_GAP,
        padding: `0 ${BLOCK_SIDE_PADDING}px`
      }}>
        {REVIEWS.map(({ name, badge, problem, text }, idx) => (
          <div key={idx} style={{
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 2px 18px 0 rgba(150,180,220,0.07)",
            padding: "19px 15px 19px 15px",
            overflow: "hidden",
            textAlign: "left"
          }}>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <span style={{
                  fontWeight: 700, fontSize: 15, color: "#222"
                }}>{name}</span>
                <span style={{
                  fontWeight: 500, fontSize: 13, color: "#1681f5",
                  padding: "4px 9px", borderRadius: 12, background: "#f3f7fe", whiteSpace: "nowrap"
                }}>{badge}</span>
              </div>
              <div style={{ fontWeight: 500, fontSize: 13, color: "#acb5bd", marginBottom: 9 }}>
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
  <div style={{
    width: `calc(100% - 40px)`,
    maxWidth,
    margin: "0 auto",
    background: GRADIENT,
    borderRadius: "22px",
    boxShadow: "0 -4px 14px 0 rgba(155,175,205,0.06)",
    boxSizing: 'border-box' as const,
    fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 22,
    paddingBottom: 22,
    display: "flex",
    flexDirection: "column",
    gap: 18,
    alignItems: "center"
  }}>
    <div style={{
      fontSize: 12,
      color: "#263540",
      fontWeight: 600,
      textAlign: "center",
      width: "100%"
    }}>
      Ташкент, Юнусабадский район, массив Кашгар 26
    </div>
    <div style={{
      display: "flex",
      gap: 11,
      width: "100%",
      justifyContent: "center"
    }}>
      <a href="#" style={{
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
        marginRight: 5
      }}>{IconPartner} Стать партнёром</a>
      <a href="#" style={{
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
        gap: 7
      }}>{IconContact} Контакты</a>
    </div>
    <a href="#" style={{
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
      gap: 8
    }}>
      {IconShield} Политика конфиденциальности
    </a>
    <div style={{
      marginTop: 8,
      fontSize: 12,
      color: "#8a97a0",
      textAlign: "center",
      width: "100%"
    }}>
      © {new Date().getFullYear()} Nora Plus — забота и поддержка будущих мам
    </div>
  </div>
);

const FooterGap = () => <div style={{height: 20}} />;

const THREAD_KEY = "nora_thread_id";
function splitBotTextTwoBlocks(text: string) {
  if (!text) return [];
  let cleaned = text.replace(/[*_]/g, "");
  const match = cleaned.match(/^([^.!?]+[.!?])\s*(.*)$/s);
  if (match) {
    const first = match[1].trim();
    const rest = match[2].trim();
    return [
      { text: first, bold: true },
      { text: rest, bold: false }
    ];
  } else {
    return [{ text: cleaned, bold: true }];
  }
}

const HowItWorks = () => {
  const EXAMPLES = [
    {
      q: "Я часто волнуюсь без причины.",
      a: "🤗 Это очень распространено у беременных! Эмоции усиливаются из-за гормонов. Прогулки на свежем воздухе, дыхательные упражнения и доверительные разговоры с близкими — хорошие помощники. Сильно беспокоит — расскажу, как снизить тревожность."
    },
    {
      q: "Болит спина и поясница.",
      a: "💆 Чаще всего это нормальная реакция организма на изменение центра тяжести. Помогает отдых на боку с подушкой между ног, отказ от тяжелых сумок и плавные растяжки. Если боли сильные — скажи, подскажу, что ещё важно проверить."
    },
    {
      q: "Плохо сплю последние дни.",
      a: "😴 Лёгкие вечерние прогулки, проветривание комнаты и комфортная подушка часто решают проблему. Если проблемы с засыпанием затяжные, обсуди это со мной — найдем подходящий ритуал отдыха!"
    },
    {
      q: "Можно ли заниматься спортом?",
      a: "🏃‍♀️ Движение всегда полезно, если нет противопоказаний. Лучше остановиться на специальных занятиях для беременных: йога, плавание, пешие прогулки. Хочешь — предложу простой комплекс легких упражнений."
    }
  ];
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("q");
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  useEffect(() => {  
    let t: NodeJS.Timeout;
    if (phase === "q") {
      setQ("");
      let i = 0;
      t = setInterval(() => {
        setQ(EXAMPLES[step].q.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].q.length) { clearInterval(t); setTimeout(() => setPhase("a"), 350); }
      }, 35);
    } else if (phase === "a") {
      setA(""); let i = 0;
      t = setInterval(() => {
        setA(EXAMPLES[step].a.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].a.length) { clearInterval(t); setTimeout(() => setPhase("next"), 6900); }
      }, 17);
    } else if (phase === "next") {
      t = setTimeout(() => { setStep((s) => (s + 1) % EXAMPLES.length); setPhase("q"); }, 350);
    }
    return () => clearInterval(t);
  }, [phase, step]);

  const bubbleUser = (text: string) => (
    <div style={{
      alignSelf: "flex-end",
      background: "#fff",
      borderRadius: "19px 19px 4px 19px",
      padding: "20px 22px",
      marginBottom: 26,
      maxWidth: 400,
      textAlign: "right",
      fontSize: 15.5,
      lineHeight: 1.7,
      boxShadow: "0 1px 8px rgba(200,180,200,0.12)"
    }}>{text}</div>
  );
  const bubbleBot = (text: string) => (
    <div style={{
      alignSelf: "flex-start",
      background: "#f7fafd",
      borderRadius: "19px 19px 19px 4px",
      padding: "22px 24px",
      marginBottom: 26,
      maxWidth: 420,
      textAlign: "left",
      fontSize: 15.5,
      lineHeight: 1.7,
      boxShadow: "0 1px 8px rgba(200,180,200,0.12)"
    }}>{text}</div>
  );

  return (
    <div style={{
      width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
      maxWidth,
      margin: "0 auto 38px auto",
      background: GRADIENT,
      borderRadius: 22,
      boxShadow: "0 6px 20px rgba(150,175,205,0.1)",
      padding: "21px 0 20px 0",
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
    }}>
      <div style={{
        fontWeight: 700,
        fontSize: "20px",
        color: "#2e2e2e",
        marginBottom: 20,
        textAlign: "center"
      }}>
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        padding: `0 ${BLOCK_SIDE_PADDING}px`
      }}>
        {q && bubbleUser(q)}
        {a && bubbleBot(a)}
      </div>
      <div style={{
        fontSize: 13,
        color: "#7b8590",
        textAlign: "center",
        marginTop: 8
      }}>
        Просто задайте вопрос — Нора найдёт ответ!
      </div>
    </div>
  );
};

const PremadeThemesPanel = ({ disabled, onSend }: { disabled: boolean, onSend: (q: string) => void }) => (
  <div style={{
    width: "100%",
    maxWidth: maxWidth,
    margin: "18px auto 18px auto",
    padding: "0 15px",
    boxSizing: 'border-box' as const,
    display: "flex",
    justifyContent: "center"
  }}>
    <div
      style={{
        width: "100%",
        maxWidth: maxWidth,
        boxSizing: 'border-box' as const,
        display: "flex",
        flexDirection: "column",
        gap: 15,
      }}>
      <div style={{ fontWeight: 700, fontSize: "17px", color: NORA_COLOR, marginBottom: 10, textAlign: "center" }}>
        Часто задаваемые темы
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 11,
      }}>
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
              transition: "opacity 0.13s"
            }}
            disabled={disabled}
            onClick={() => onSend(question)}
          >
            <span style={{ fontSize: 29, marginRight: 2, flexShrink: 0 }}>{emoji}</span>
            <div style={{ textAlign: "left", flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: NORA_COLOR, marginBottom: 2 }}>
                {title}
              </div>
              <div style={{ fontWeight: 400, fontSize: 13, color: "#7c8792" }}>
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
  const [chatHistory, setChatHistory] = useState<{ text: string, sender: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string|null>(null);
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
    return () => { document.body.style.overflow = "auto"; };
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
        title: "Nora Plus — Ассистент для будущих мам",
        text: "Современный ассистент для будущих мам на базе NHS — все рекомендации по беременности в одном месте.",
        url: window.location.href
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
          ? (typeof data.error === 'string'
            ? `Ошибка сервера: ${data.error}`
            : `Ассистент не ответил (ошибка сервера)`)
          : "Извините, нет ответа от ассистента.";
      }
      let i = 0;
      setBotProgress("");
      const interval = setInterval(() => {
        setBotProgress(botReply.slice(0, i));
        i++;
        if (i > botReply.length) {
          clearInterval(interval);
          setChatHistory(prev => [...prev, { text: botReply, sender: "bot" }]);
          setBotProgress("");
          setLoading(false);
        }
      }, 18);
    } catch (error) {
      setChatHistory(prev => [...prev, { text: "Ошибка: не удалось получить ответ.", sender: "bot" }]);
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
    boxSizing: 'border-box',
    lineHeight: "1.77",
    minWidth: 60,
    textAlign: "right",
    whiteSpace: "pre-line"
  };

  if (!isMobile) {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        background: "#f8fdff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 10000
      }}>
        <div style={{
          fontWeight: 700,
          fontSize: "21px",
          textAlign: "center",
          color: NORA_COLOR,
          background: "#fff",
          borderRadius: 24,
          padding: "35px 28px",
          boxShadow: "0 6px 36px 0 rgba(155, 175, 205, 0.12)"
        }}>
          Nora Plus — доступна только <br /> на мобильных устройствах
        </div>
      </div>
    );
  }

  if (preloading) {
    return (
      <div style={{
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
        margin: 0, padding: 0
      }}>
        <span style={{
          fontWeight: 800,
          fontSize: "38px",
          color: NORA_COLOR,
          letterSpacing: "0.07em",
          animation: "noraPulse 1.4s infinite linear"
        }}>Nora Plus</span>
        <style>{`
          @keyframes noraPulse {
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
      <div style={{
        fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
        background: "#f8fdff",
        width: "100vw",
        minHeight: "100vh"
      }}>
        <div style={{
          width: `calc(100% - ${PANEL_SIDE_PADDING * 2}px)`,
          maxWidth,
          minHeight: panelHeight,
          background: GRADIENT,
          color: NORA_COLOR,
          margin: "20px auto 0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: borderRadius,
          paddingLeft: PANEL_SIDE_PADDING, paddingRight: PANEL_SIDE_PADDING, paddingTop: 5, paddingBottom: 5,
          boxSizing: 'border-box' as const, zIndex: 1,
          fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flex: 1, paddingLeft: 5 }}>
            <span style={{
              fontWeight: 800, fontSize: "19px", lineHeight: 1.06, whiteSpace: "nowrap", marginBottom: 7
            }}>
              Nora Plus
            </span>
            <span style={{
              fontWeight: 400, fontSize: "13px", color: "#565656", lineHeight: 1.04, whiteSpace: "nowrap"
            }}>
              Ассистент для будущих мам
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 16 }}>
            <button style={{
              background: "transparent", border: "none", cursor: "pointer",
              width: 38, height: 38, borderRadius: 19,
              display: "flex", alignItems: "center", justifyContent: "center"
            }} onClick={handleShare}>
              <img src={ICONS.share} alt="Share"
                style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
            </button>
            <button style={{
              background: "transparent", border: "none", cursor: "pointer",
              width: 38, height: 38, borderRadius: 19,
              display: "flex", alignItems: "center", justifyContent: "center"
            }} onClick={() => window.open("https://t.me/norasmart", "_blank")}>
              <img src={ICONS.telegram} alt="Telegram"
                style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
            </button>
            <button style={{
              background: "transparent", border: "none", cursor: "pointer",
              width: 38, height: 38, borderRadius: 19,
              display: "flex", alignItems: "center", justifyContent: "center"
            }} onClick={clearChatAll}>
              <img src={ICONS.trash} alt="Trash"
                style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
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
            alignItems: "center"
          }}
        >
          <video
            src="/nora.mp4"
            style={{
              width: "100%",
              maxWidth: videoMaxWidth,
              display: "block",
              borderRadius: 24
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

        <div style={{
          width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
          maxWidth,
          textAlign: "center",
          margin: "0 auto"
        }}>
          <div style={{
            fontWeight: 700, fontSize: "22px", color: NORA_COLOR, marginBottom: 14
          }}>Ждёте малыша? Я помогу!</div>
          <div style={{
            fontWeight: 400, fontSize: "15px", margin: "0 auto 0 auto", maxWidth: 400,
            padding: "0 18px",
            lineHeight: 1.75, color: NORA_COLOR, display: "inline-block"
          }}>
            Я помогаю будущим мамам на каждом этапе беременности: отвечаю на вопросы, напоминаю о важных делах, слежу за самочувствием и даю советы, основанные на медицине Великобритании NHS.
          </div>
          <div style={{ height: 40 }} />
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <div style={{ width: "100%", textAlign: "center" }}>
              <button
                style={{
                  width: "100%", maxWidth: 290,
                  background: BABY_GRADIENT,
                  color: "#fff",
                  border: "none",
                  borderRadius: borderRadius,
                  fontWeight: 700,
                  fontSize: "17px",
                  padding: "15px 0",
                  margin: "0 auto",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 18px 0 rgba(200, 128, 140, 0.09)"
                }}
                onClick={() => setShowWelcome(false)}
              >
                Начать пользоваться&nbsp;
                <span style={{ marginLeft: 8, display: "flex", alignItems: "center" }}>{ICONS.arrowRight}</span>
              </button>
              <div style={{ height: 13 }} />
              <div style={{ fontSize: 13, color: "#7c8792" }}>
                Попробуйте — это быстро и бесплатно
              </div>
            </div>
          </div>
          <div style={{ height: 40 }} />

          <HowItWorks />
          <WhyNoraBlock />
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
        flexDirection: "column"
      }}
    >
      <div style={{
        width: `calc(100% - ${PANEL_SIDE_PADDING * 2}px)`,
        maxWidth,
        minHeight: panelHeight,
        background: GRADIENT,
        color: NORA_COLOR,
        margin: "20px auto 0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: borderRadius,
        paddingLeft: PANEL_SIDE_PADDING, paddingRight: PANEL_SIDE_PADDING, paddingTop: 5, paddingBottom: 5,
        boxSizing: 'border-box' as const, zIndex: 1,
        fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flex: 1, paddingLeft: 5 }}>
          <span style={{
            fontWeight: 800, fontSize: "19px", lineHeight: 1.06, whiteSpace: "nowrap", marginBottom: 7
          }}>
            Nora Plus
          </span>
          <span style={{
            fontWeight: 400, fontSize: "13px", color: "#565656", lineHeight: 1.04, whiteSpace: "nowrap"
          }}>
            Ассистент для будущих мам
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 16 }}>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            width: 38, height: 38, borderRadius: 19,
            display: "flex", alignItems: "center", justifyContent: "center"
          }} onClick={handleShare}>
            <img src={ICONS.share} alt="Share"
              style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
          </button>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            width: 38, height: 38, borderRadius: 19,
            display: "flex", alignItems: "center", justifyContent: "center"
          }} onClick={() => window.open("https://t.me/norasmart", "_blank")}>
            <img src={ICONS.telegram} alt="Telegram"
              style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
          </button>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            width: 38, height: 38, borderRadius: 19,
            display: "flex", alignItems: "center", justifyContent: "center"
          }} onClick={clearChatAll}>
            <img src={ICONS.trash} alt="Trash"
              style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
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

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{ width: "100%", maxWidth: maxWidth, margin: "0 auto", padding: "24px 0 110px 0" }}>
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              style={{
                textAlign: msg.sender === "user" ? "right" : "left",
                margin: "8px 20px"
              }}
            >
              {msg.sender === "user"
                ? <span style={userMessageStyle}>{msg.text}</span>
                : splitBotTextTwoBlocks(msg.text).map((part, sIdx) => (
                  part.text && (
                    <div
                      key={sIdx}
                      style={{
                        background: "#f7fafd",
                        borderRadius: 12,
                        padding: "10px 15px",
                        marginBottom: sIdx === 0 ? 18 : 30,
                        color: NORA_COLOR,
                        fontSize: 16,
                        lineHeight: 1.7,
                        fontWeight: part.bold ? "bold" : "normal",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere"
                      }}
                    >
                      {part.text}
                    </div>
                  )
                ))
              }
            </div>
          ))}
          {botProgress &&
            splitBotTextTwoBlocks(botProgress).map((part, sIdx) => (
              part.text && (
                <div
                  key={sIdx}
                  style={{
                    background: "#f7fafd",
                    borderRadius: 12,
                    padding: "10px 15px",
                    margin: "0 20px 10px 20px",
                    color: NORA_COLOR,
                    fontSize: 16,
                    lineHeight: 1.7,
                    fontWeight: part.bold ? "bold" : "normal",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere"
                  }}
                >
                  {part.text}
                </div>
              )
            ))
          }
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div style={{
        width: "calc(100% - 40px)",
        margin: "0 20px",
        display: "flex",
        alignItems: "center",
        boxSizing: 'border-box' as const,
        maxWidth: maxWidth,
        height: INPUT_BAR_HEIGHT,
        position: "fixed",
        left: 0,
        bottom: 25,
        background: "transparent",
        borderRadius: borderRadius,
        zIndex: 20,
        boxShadow: "none"
      }}>
        <input
          type="text"
          value={message}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={e => setMessage(e.target.value)}
          placeholder="Введите сообщение..."
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
            color: NORA_COLOR,
            boxSizing: 'border-box' as const,
            marginRight: 8,
            transition: "border 0.22s"
          }}
          onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
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
            cursor: (loading || !!botProgress) ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 14px 0 rgba(155,175,205,0.12)"
          }}
          onClick={handleSendMessage}
          disabled={loading || !!botProgress}
        >
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {ICONS.arrowRight}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Chat;
