"use client";

import React, {
  useState,
  useEffect,
  useRef,
  CSSProperties,
} from "react";
import Image from "next/image";
import chefPhoto from "/12.png";

type Message = { text: string; sender: "user" | "bot" };

type ItemVariant = {
  id: number;
  name: string;
  image: string;
};

type Gender = "male" | "female";

const HERO_BG =
  "https://images.pexels.com/photos/3298637/pexels-photo-3298637.jpeg";

const HATS: ItemVariant[] = [
  {
    id: 1,
    name: "Классическая шапка",
    image:
      "https://images.pexels.com/photos/3754678/pexels-photo-3754678.jpeg",
  },
  {
    id: 2,
    name: "Высокая шапка",
    image:
      "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg",
  },
  {
    id: 3,
    name: "Бандана",
    image:
      "https://images.pexels.com/photos/6027504/pexels-photo-6027504.jpeg",
  },
];

const TOPS: ItemVariant[] = [
  {
    id: 1,
    name: "Классический китель",
    image:
      "https://images.pexels.com/photos/3298637/pexels-photo-3298637.jpeg",
  },
  {
    id: 2,
    name: "Современный китель",
    image:
      "https://images.pexels.com/photos/4252139/pexels-photo-4252139.jpeg",
  },
  {
    id: 3,
    name: "Минималистичный китель",
    image:
      "https://images.pexels.com/photos/845812/pexels-photo-845812.jpeg",
  },
];

const APRONS: ItemVariant[] = [
  {
    id: 1,
    name: "Классический фартук",
    image:
      "https://images.pexels.com/photos/952478/pexels-photo-952478.jpeg",
  },
  {
    id: 2,
    name: "Нагрудный фартук",
    image:
      "https://images.pexels.com/photos/887827/pexels-photo-887827.jpeg",
  },
  {
    id: 3,
    name: "Бариста фартук",
    image:
      "https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg",
  },
];

const PANTS: ItemVariant[] = [
  {
    id: 1,
    name: "Классические брюки",
    image:
      "https://images.pexels.com/photos/3738082/pexels-photo-3738082.jpeg",
  },
  {
    id: 2,
    name: "Джоггеры",
    image:
      "https://images.pexels.com/photos/7691088/pexels-photo-7691088.jpeg",
  },
  {
    id: 3,
    name: "Узкие брюки",
    image:
      "https://images.pexels.com/photos/7691186/pexels-photo-7691186.jpeg",
  },
];

const ICON_HAT =
  "https://img.icons8.com/ios-filled/100/000000/chef-hat.png";
const ICON_TOP =
  "https://img.icons8.com/ios-filled/100/000000/t-shirt.png";
const ICON_APRON =
  "https://img.icons8.com/ios-filled/100/000000/apron.png";
const ICON_PANTS =
  "https://img.icons8.com/ios-filled/100/000000/trousers.png";

const ICON_GENDER_MALE =
  "https://img.icons8.com/ios-filled/100/000000/user-male.png";
const ICON_GENDER_FEMALE =
  "https://img.icons8.com/ios-filled/100/000000/user-female.png";
const ICON_HEIGHT =
  "https://img.icons8.com/ios-filled/100/000000/height.png";
const ICON_WEIGHT =
  "https://img.icons8.com/ios-filled/100/000000/scale.png";

const commonSelectStyle: CSSProperties = {
  flex: 1,
  height: 38,
  borderRadius: 999,
  border: "1px solid #d1d5db",
  padding: "0 14px",
  fontSize: 12,
  outline: "none",
  background: "#f9fafb",
  boxSizing: "border-box",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const commonRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  width: "100%",
};

type ChefLook = {
  hat: ItemVariant | null;
  top: ItemVariant | null;
  apron: ItemVariant | null;
  pants: ItemVariant | null;
};

const CURRENT_URL = "https://morobolsin.vercel.app";
const SHARE_TEXT = "Подбор формы для команды Morobolsin";

const getItemName = (item: ItemVariant, lang: "ru" | "uz"): string => {
  if (lang === "ru") return item.name;

  switch (item.name) {
    case "Классическая шапка":
      return "Classic shapka";
    case "Высокая шапка":
      return "Balandi shapka";
    case "Бандана":
      return "Bandana";
    case "Классический китель":
      return "Classic kitel";
    case "Современный китель":
      return "Zamonaviy kitel";
    case "Минималистичный китель":
      return "Minimalistik kitel";
    case "Классический фартук":
      return "Classic fartuk";
    case "Нагрудный фартук":
      return "Ko‘krak fartugi";
    case "Бариста фартук":
      return "Barista fartuk";
    case "Классические брюки":
      return "Classic shimlar";
    case "Джоггеры":
      return "Jogger shimlar";
    case "Узкие брюки":
      return "Yupqa shimlar";
    default:
      return item.name;
  }
};

const ChatPage: React.FC = () => {
  const [lang, setLang] = useState<"ru" | "uz">("ru");

  const [gender, setGender] = useState<Gender>("male");
  const [height, setHeight] = useState<string>("170");
  const [weight, setWeight] = useState<string>("70");

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
  const rolesUz = [
    "Oshpazlar uchun forma",
    "Ofitsiantlar uchun forma",
    "Barmenlar uchun forma",
  ];
  const roles = lang === "ru" ? rolesRu : rolesUz;

  const [roleIndex, setRoleIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  const TYPE_SPEED = 120;
  const WORD_DELAY = 5000;

  const handleShareTelegram = () => {
    const url = encodeURIComponent(CURRENT_URL);
    const text = encodeURIComponent(SHARE_TEXT);
    const shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
    window.open(shareUrl, "_blank", "noreferrer");
  };

  const handleOpenTelegramChannel = () => {
    window.open("https://t.me/YOUR_TELEGRAM_CHANNEL", "_blank", "noreferrer");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

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
    const typeLabelUz =
      "oshpaz uchun forma to‘plami: shapka, ustki kiyim, fartuk va shimlar";
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
      `Пол: ${gender === "male" ? "мужской" : "женский"}\n` +
      `Рост: ${height} см\n` +
      `Вес: ${weight} кг\n` +
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

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={handleShareTelegram}
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                border: "1px solid #d1d5db",
                background: "#ffffff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                color: "#111827",
              }}
            >
              ♥
            </button>

            <button
              onClick={handleOpenTelegramChannel}
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                border: "1px solid #d1d5db",
                background: "#ffffff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#111827",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M23.91 3.79L20.3 20.84c-.26 1.16-.95 1.44-1.93.9l-5.34-3.94-2.58 2.49c-.29.29-.54.54-1.11.54л.4-5.7 10.38-9.39c.45-.4-.1-.63-.7-.23L7.2 13.26 1.7 11.54C.5 11.18.48 10.38 1.93 9.79л21.26-8.2c.97-.43 1.9.24 1.53 1.73z"
                  fill="currentColor"
                />
              </svg>
            </button>

            <div style={{ display: "flex", gap: 4 }}>
              {["ru", "uz"].map((lng) => (
                <button
                  key={lng}
                  onClick={() => setLang(lng as "ru" | "uz")}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    border:
                      lang === lng
                        ? "1px solid #111827"
                        : "1px solid #e5e7eb",
                    background: lang === lng ? "#111827" : "#ffffff",
                    color: lang === lng ? "#f9fafb" : "#111827",
                    fontSize: 12,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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
            {lang === "ru" ? "Форма для " : ""}
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
              ? "Подберите пол, параметры и комплект формы — ассистент поможет собрать образ под ваш бренд."
              : "Jins, parametrlar va forma to‘plamini tanlang — yordamchi brendingizga mos ko‘rinish topishda yordam beradi."}
          </p>
        </div>
      </section>

      {/* Фото + категории */}
      <section
        ref={modelRef}
        style={{
          maxWidth: 960,
          margin: "0 auto 16px",
          display: "grid",
          gridTemplateColumns: "minmax(0,0.85fr) minmax(0,1.15fr)",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        {/* ЛЕВЫЙ БЛОК – ФОТО */}
        <div
          style={{
            borderRadius: 22,
            padding: 0,
            boxShadow: "none",
            background: "transparent",
            display: "flex",
            flexDirection: "column",
            minHeight: 360,
          }}
        >
          <div
            style={{
              flex: 1,
              borderRadius: 18,
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Image
              src={chefPhoto}
              alt="Шеф Morobolsin"
              style={{
                height: "100%",
                width: "auto",
                maxHeight: 360,
                objectFit: "contain",
                borderRadius: 18,
              }}
            />
          </div>
        </div>

        {/* ПРАВЫЙ БЛОК – параметры */}
        <div
          style={{
            borderRadius: 22,
            background: "#ffffff",
            boxShadow: "0 4px 16px rgba(148,163,184,0.16)",
            padding: 18,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 360,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {/* Пол / Jins */}
            <IconSelectRowSimple
              icon={gender === "male" ? ICON_GENDER_MALE : ICON_GENDER_FEMALE}
              label={lang === "ru" ? "Пол" : "Jins"}
            >
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                style={commonSelectStyle}
              >
                {lang === "ru" ? (
                  <>
                    <option value="male">Мужская одежда</option>
                    <option value="female">Женская одежда</option>
                  </>
                ) : (
                  <>
                    <option value="male">Erkaklar kiyimi</option>
                    <option value="female">Ayollar kiyimi</option>
                  </>
                )}
              </select>
            </IconSelectRowSimple>

            {/* Рост / Bo‘y */}
            <IconSelectRowSimple
              icon={ICON_HEIGHT}
              label={lang === "ru" ? "Рост" : "Bo‘y (balandlik)"}
            >
              <select
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                style={commonSelectStyle}
              >
                {[
                  "165",
                  "170",
                  "175",
                  "180",
                  "185",
                  "190",
                  "195",
                  "200",
                  "205",
                  "210",
                ].map((h) => (
                  <option key={h} value={h}>
                    {h} {lang === "ru" ? "см" : "sm"}
                  </option>
                ))}
              </select>
            </IconSelectRowSimple>

            {/* Вес / Vazn */}
            <IconSelectRowSimple
              icon={ICON_WEIGHT}
              label={lang === "ru" ? "Вес" : "Vazn"}
            >
              <select
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                style={commonSelectStyle}
              >
                {[
                  "50",
                  "60",
                  "70",
                  "80",
                  "90",
                  "100",
                  "110",
                  "120",
                  "130",
                  "140",
                ].map((w) => (
                  <option key={w} value={w}>
                    {w} {lang === "ru" ? "кг" : "kg"}
                  </option>
                ))}
              </select>
            </IconSelectRowSimple>

            <IconSelectRow
              icon={ICON_HAT}
              alt="Шапка"
              items={HATS}
              activeIndex={hatIndex}
              onChange={setHatIndex}
              lang={lang}
            />
            <IconSelectRow
              icon={ICON_TOP}
              alt="Верх"
              items={TOPS}
              activeIndex={topIndex}
              onChange={setTopIndex}
              lang={lang}
            />
            <IconSelectRow
              icon={ICON_APRON}
              alt="Фартук"
              items={APRONS}
              activeIndex={apronIndex}
              onChange={setApronIndex}
              lang={lang}
            />
            <IconSelectRow
              icon={ICON_PANTS}
              alt="Брюки"
              items={PANTS}
              activeIndex={pantsIndex}
              onChange={setPantsIndex}
              lang={lang}
            />
          </div>
        </div>
      </section>

      {/* Имя + кнопка */}
      <section
        style={{
          maxWidth: 960,
          margin: "0 auto 24px",
          borderRadius: 22,
          background: "#ffffff",
          boxShadow: "0 4px 16px rgba(148,163,184,0.16)",
          padding: 18,
          boxSizing: "border-box",
        }}
      >
        <p
          style={{
            fontSize: 13,
            margin: "8px 0 10px",
            color: "#4b5563",
            textAlign: "center",
          }}
        >
          {lang === "ru"
            ? "Напишите имя повара, которое будет нанесено на форму."
            : "Oshpazning forma ustiga yoziladigan ismini kiriting."}
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <input
            type="text"
            value={chefName}
            onChange={(e) => setChefName(e.target.value)}
            placeholder={lang === "ru" ? "Имя шефа" : "Oshpaz ismi"}
            style={{
              width: "100%",
              height: 38,
              borderRadius: 999,
              border: "1px solid #d1d5db",
              padding: "0 16px",
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <button
            onClick={handleDone}
            style={{
              width: "100%",
              height: 42,
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

type IconSelectRowSimpleProps = {
  icon: string;
  label: string;
  children: React.ReactNode;
};

const IconSelectRowSimple: React.FC<IconSelectRowSimpleProps> = ({
  icon,
  label,
  children,
}) => (
  <div style={commonRowStyle}>
    <img
      src={icon}
      alt={label}
      style={{
        width: 20,
        height: 20,
        objectFit: "contain",
        filter: "grayscale(100%) brightness(0.3)",
        flexShrink: 0,
      }}
    />
    {children}
  </div>
);

type IconSelectRowProps = {
  icon: string;
  alt: string;
  items: ItemVariant[];
  activeIndex: number;
  onChange: (index: number) => void;
  lang: "ru" | "uz";
};

const IconSelectRow: React.FC<IconSelectRowProps> = ({
  icon,
  alt,
  items,
  activeIndex,
  onChange,
  lang,
}) => (
  <div style={commonRowStyle}>
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
      style={commonSelectStyle}
    >
      {items.map((it) => (
        <option key={it.id} value={it.id}>
          {getItemName(it, lang)}
        </option>
      ))}
    </select>
  </div>
);

export default ChatPage;
