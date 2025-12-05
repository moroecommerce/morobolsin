'use client';

import { useEffect, useRef, useState, FormEvent } from 'react';
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
  { id: 'chef', label: 'Шеф‑кители' },
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
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();

  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryId>('chef');
  const [selectedProductId, setSelectedProductId] =
    useState<string>('chef-classic');
  const [chefName, setChefName] = useState<string>('');

  const chatRef = useRef<HTMLDivElement | null>(null);

  const filteredProducts = products.filter(
    (p) => p.category === selectedCategory,
  );
  const selectedProduct =
    products.find((p) => p.id === selectedProductId) ?? filteredProducts[0];

  useEffect(() => {
    if (!filteredProducts.find((p) => p.id === selectedProductId)) {
      if (filteredProducts[0]) {
        setSelectedProductId(filteredProducts[0].id);
      }
    }
  }, [selectedCategory, filteredProducts, selectedProductId]);

  const scrollToChat = () => {
    chatRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const startChat = () => {
    setShowWelcome(false);
    setTimeout(scrollToChat, 50);
  };

  const onSubmit = (e: FormEvent) => {
    if (showWelcome) {
      setShowWelcome(false);
      setTimeout(scrollToChat, 50);
    }
    handleSubmit(e);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {showWelcome && (
        <div className="px-4 py-8 md:py-12">
          
          <header className="mx-auto mb-6 flex max-w-5xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
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

          
          <section className="mx-auto mb-6 max-w-5xl">
            <div className="flex flex-col gap-4 rounded-3xl bg-slate-900 px-5 py-5 text-white md:flex-row md:items-center md:justify-between md:px-8 md:py-6">
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                  онлайн‑примерка формы
                </p>
                <h1 className="mb-2 text-xl font-semibold md:text-2xl">
                  Подберите форму Morobolsin в 3 шага
                </h1>
                <p className="text-sm text-slate-200">
                  Выберите категорию и модель, посмотрите, как она смотрится
                  на 3D‑манекене и обсудите детали с ассистентом.
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

          
          <section className="mx-auto grid max-w-5xl items-start gap-6 md:grid-cols-[1.1fr,0.9fr]">
            
            <div className="space-y-5">
              
              <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                <p className="mb-3 text-xs font-medium text-slate-500">
                  1. Категория формы
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`rounded-2xl border px-3 py-1.5 text-xs font-medium transition ${
                        selectedCategory === cat.id
                          ? 'border-slate-900 bg-s
