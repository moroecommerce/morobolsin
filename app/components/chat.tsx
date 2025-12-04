'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';

type CategoryId = 'chef' | 'kitchen' | 'hall' | 'bar';

interface Product {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  image: string; // временно вместо 3D
}

const categories: { id: CategoryId; label: string }[] = [
  { id: 'chef', kitchen: 'chef', label: 'Шеф‑кители' },
  { id: 'kitchen', label: 'Кухня' },
  { id: 'hall', label: 'Зал / официанты' },
  { id: 'bar', label: 'Бар / бариста' },
];

const products: Product[] = [
  {
    id: 'chef-classic',
    name: 'Китель Morobolsin Classic',
    category: 'chef',
    description: 'Базовый шеф‑китель для горячего цеха.',
    image: '/3d/chef-classic-placeholder.png',
  },
  {
    id: 'chef-premium',
    name: 'Китель Morobolsin Premium',
    category: 'chef',
    description: 'Премиальный китель для бренд‑шефа.',
    image: '/3d/chef-premium-placeholder.png',
  },
  {
    id: 'kitchen-basic',
    name: 'Комплект кухни Basic',
    category: 'kitchen',
    description: 'Китель + штаны для поваров линии.',
    image: '/3d/kitchen-basic-placeholder.png',
  },
  {
    id: 'hall-smart',
    name: 'Форма для зала Smart',
    category: 'hall',
    description: 'Рубашка, фартук и брюки для официантов.',
    image: '/3d/hall-smart-placeholder.png',
  },
  {
    id: 'barista-set',
    name: 'Бариста‑сет',
    category: 'bar',
    description: 'Фартук и рубашка для бариста.',
    image: '/3d/barista-set-placeholder.png',
  },
];

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat();

  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('chef');
  const [selectedProductId, setSelectedProductId] = useState<string>('chef-classic');
  const [chefName, setChefName] = useState<string>('');
  const chatRef = useRef<HTMLDivElement | null>(null);

  const filteredProducts = products.filter(
    (p) => p.category === selectedCategory,
  );
  const selectedProduct =
    products.find((p) => p.id === selectedProductId) ?? filteredProducts[0];

  useEffect(() => {
    if (!filteredProducts.find((p) => p.id === selectedProductId)) {
      setSelectedProductId(filteredProducts[0]?.id ?? '');
    }
  }, [selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const startChat = () => {
    setShowWelcome(false);
    setTimeout(() => {
      chatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {showWelcome && (
        <div className="px-4 py-8 md:py-12">
          {/* HEADER */}
          <header className="max-w-5xl mx-auto mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-900">
                {/* логотип‑иконка Morobolsin */}
                <img
                  src="/logo-morobolsin.svg"
                  alt="Morobolsin"
                  className="h-6 w-auto"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Morobolsin
                </span>
                <span className="text-sm font-medium text-slate-900">
                  Подбор униформы для HoReCa
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white px-3 py-1 hover:bg-slate-50"
              >
                ❤ Нравится
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white px-3 py-1 hover:bg-slate-50"
              >
                ↗ Поделиться
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white px-3 py-1 hover:bg-slate-50"
              >
                💬 Написать
              </button>
            </div>
          </header>

          {/* BANNER */}
          <section className="max-w-5xl mx-auto mb-6">
            <div className="rounded-3xl bg-slate-900 px-5 py-5 md:px-8 md:py-6 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-300 mb-1">
                  онлайн‑примерка формы
                </p>
                <h1 className="text-xl md:text-2xl font-semibold mb-2">
                  Подберите форму Morobolsin в 3 шага
                </h1>
                <p className="text-sm text-slate-200">
                  Выберите категорию и модель, посмотрите, как она смотрится на
                  3D‑манекене и обсудите детали с ассистентом.
                </p>
              </div>
              <button
                type="button"
                onClick={startChat}
                className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2 text-xs font-semibold text-slate-900 shadow-sm hover:bg-slate-100"
              >
                Сразу к ассистенту
              </button>
            </div>
          </section>

          {/* MAIN GRID: left – выбор, right – 3D */}
          <section className="max-w-5xl mx-auto grid gap-6 md:grid-cols-[1.1fr,0.9fr] items-start">
            {/* LEFT: CATEGORY + PRODUCT + NAME */}
            <div className="space-y-5">
              {/* Категории */}
              <div className="rounded-3xl bg-white p-4 shadow-sm border border-slate-100">
                <p className="text-xs font-medium text-slate-500 mb-3">
                  1. Категория формы
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`rounded-2xl px-3 py-1.5 text-xs font-medium border transition ${
                        selectedCategory === cat.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Продукты */}
              <div className="rounded-3xl bg-white p-4 shadow-sm border border-slate-100">
                <p className="text-xs font-medium text-slate-500 mb-3">
                  2. Выберите модель
                </p>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => setSelectedProductId(product.id)}
                      className={`w-full rounded-2xl border px-3 py-2 text-left text-xs transition ${
                        selectedProduct?.id === product.id
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-semibold">
                        {product.name}
                      </div>
                      <div className="text-[11px] opacity-80">
                        {product.description}
                      </div>
                    </button>
                  ))}
                  {filteredProducts.length === 0 && (
                    <p className="text-xs text-slate-500">
                      Для этой категории пока нет
