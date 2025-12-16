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

const FONT_OPTIONS = [
  {
    value: "system",
    label: "System (Sans)",
    css: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
  },
  {
    value: "arial",
    label: "Arial",
    css: "Arial, Helvetica, sans-serif",
  },
  {
    value: "verdana",
    label: "Verdana",
    css: "Verdana, Geneva, sans-serif",
  },
  {
    value: "tahoma",
    label: "Tahoma",
    css: "Tahoma, Geneva, sans-serif",
  },
  {
    value: "trebuchet",
    label: "Trebuchet MS",
    css: "'Trebuchet MS', Tahoma, sans-serif",
  },
  {
    value: "times",
    label: "Times New Roman",
    css: "'Times New Roman', Times, serif",
  },
  {
    value: "georgia",
    label: "Georgia",
    css: "Georgia, 'Times New Roman', serif",
  },
  {
    value: "courier",
    label: "Courier New (Mono)",
    css: "'Courier New', Courier, monospace",
  },
  {
    value: "handwritten",
    label: "Handwritten",
    css: "'Brush Script MT', 'Comic Sans MS', cursive",
  },
];

const COLOR_OPTIONS = [
  { value: "#111827", label: "Темный" },
  { value: "#DC2626", label: "Красный" },
  { value: "#2563EB", label: "Синий" },
  { value: "#16A34A", label: "Зелёный" },
  { value: "#F59E0B", label: "Оранжевый" },
  { value: "#F97316", label: "Ярко‑оранжевый" },
  { value: "#6B21A8", label: "Фиолетовый" },
  { value: "#000000", label: "Чёрный" },
  { value: "#E11D48", label: "Малиновый" },
  { value: "#0EA5E9", label: "Голубой" },
];

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
  const [selectedFont, setSelectedFont] = useState<string>("system");
  const [selectedColor, setSelectedColor] = useState<string>("#111827");

  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const [typingText, setTypingText] = useState<string>("");

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
  }, [chatHistory, typingText]);

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
    setTypingText("");

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

      setTypingText("");
      let index = 0;
      const speed = 15; // мс на символ

      const intervalId = window.setInterval(() => {
        index += 1;
        setTypingText(botReply.slice(0, index));

        if (index >= botReply.length) {
          window.clearInterval(intervalId);
          setTypingText("");
        }
      }, speed);
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
      `Имя на форме: ${chefName || "не указано"}\n` +
      `Шрифт: ${selectedFont}\n` +
      `Цвет: ${selectedColor}`;

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
        padding: "0 16px 16px", // ← 90px o‘rniga 16px
        boxSizing: "border-box",
      }}
    >
      {/* NAVBAR */}
      {/* ... NAVBAR, HERO, FOTO + KATEGORIYA, 4 LINIYA bloklarni o‘zgartirmay tashlab ketdim
          (sendagi kod bilan aynan bir xil) ... */}

      {/* bu yerga sen yuborgan NAVBAR, HERO, foto/kategoriya, 4-qatorli blok
          o‘zimizdagi kabi aynan shu tartibda turadi — o‘zgartirish shart emas */}

      {/* ЧАТ – как в GPT */}
      <section
        style={{
          maxWidth: 960,
          margin: "0 auto 40px",
          borderRadius: 0,
          background: "transparent",
          padding: "0 0 16px", // ← 90px o‘rniga 16px
          position: "relative",
        }}
      >
        {/* qolgan chat kodi sendagi bilan bir xil */}
        {/* ... sen yuborgan chatHistory.map(...) va input bloki ... */}
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
