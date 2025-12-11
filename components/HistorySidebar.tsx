import React, { useState } from 'react';
import { ChatSession } from '../types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (chatId: string) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, onSelectChat }) => {
  const [filter, setFilter] = useState<'all' | 'pinned' | 'recent'>('all');

  const pinnedChats: ChatSession[] = [
    {
      id: '1',
      title: 'План проекту UI',
      date: '14:30',
      preview: 'Ось структура для дизайн-системи, яку ми обговорювали. Вона включає кольорову палітру...',
      isPinned: true,
      type: 'text'
    },
    {
      id: '2',
      title: 'Аналіз JSON структури',
      date: 'Вчора',
      preview: "Перевірив твій файл. Там є помилка в масиві об'єктів на рядку 42. Ось виправлений варіант.",
      isPinned: true,
      type: 'code' as any // simulating icon type logic
    }
  ];

  const recentChats: ChatSession[] = [
    {
      id: '3',
      title: 'Рецепт борщу',
      date: 'Вівторок',
      preview: "Вам знадобиться буряк, капуста, картопля, морква, цибуля та м'ясо на кістці для бульйону.",
      unread: true,
      type: 'text'
    },
    {
      id: '4',
      title: 'Без назви',
      date: '23 жовт.',
      preview: "[Голосове повідомлення] Транскрипція: Як мені налаштувати оточення для Python проекту на Mac M1?",
      type: 'audio'
    },
    {
      id: '5',
      title: 'Ідеї для логотипу',
      date: '20 жовт.',
      preview: "Згенерував 4 варіанти логотипу в стилі кіберпанк. Який з них вам більше подобається?",
      type: 'image'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <main 
        className="relative flex flex-col h-full w-full max-w-md bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden" 
        role="complementary"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <header className="flex-none bg-background-light dark:bg-background-dark pt-4 px-4 pb-2 z-10 safe-top">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={onClose}
              aria-label="Закрити" 
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-900 dark:text-white"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
            <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center text-slate-900 dark:text-white">Історія діалогів</h2>
            
            {/* User Badge */}
            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700/50">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-[10px] font-bold text-white uppercase overflow-hidden">
                HA
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:block max-w-[80px] truncate">
                homoantropos
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-3">
            <label className="relative flex w-full items-center">
              <div className="absolute left-3 flex items-center justify-center text-slate-400 dark:text-slate-500 pointer-events-none">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input 
                className="w-full bg-surface-light dark:bg-surface-dark border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-sm" 
                placeholder="Пошук у діалогах…" 
                type="text" 
              />
            </label>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <FilterButton label="Усі" active={filter === 'all'} onClick={() => setFilter('all')} />
            <FilterButton label="Закріплені" icon="keep" active={filter === 'pinned'} onClick={() => setFilter('pinned')} />
            <FilterButton label="Останні 7 днів" active={filter === 'recent'} onClick={() => setFilter('recent')} />
          </div>
        </header>

        {/* Scrollable List Area */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 custom-scrollbar">
          {/* Pinned Section */}
          {(filter === 'all' || filter === 'pinned') && (
            <>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-2 mb-1 px-1">
                Закріплені
              </div>
              {pinnedChats.map(chat => (
                <HistoryCard key={chat.id} chat={chat} />
              ))}
            </>
          )}

          {/* Recent Section */}
          {(filter === 'all' || filter === 'recent') && (
            <>
               <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-4 mb-1 px-1">
                Цього тижня
              </div>
              {recentChats.map(chat => (
                <HistoryCard key={chat.id} chat={chat} />
              ))}
            </>
          )}
          
          <div className="h-10"></div>
        </div>

        {/* Footer Action Area */}
        <div className="flex-none p-4 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 safe-bottom">
          <button className="w-full group flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 transition-all shadow-sm">
            <span className="material-symbols-outlined text-primary text-[20px] group-hover:scale-110 transition-transform">ios_share</span>
            <span className="text-sm font-semibold text-primary">Імпортувати / Експортувати історію</span>
          </button>
        </div>
      </main>
    </div>
  );
};

const FilterButton: React.FC<{ label: string; icon?: string; active?: boolean; onClick: () => void }> = ({ label, icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex h-8 shrink-0 items-center justify-center px-4 rounded-full text-xs font-medium transition-all ${
      active 
        ? 'bg-primary text-white shadow-md shadow-primary/20' 
        : 'bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-slate-600 dark:text-gray-300'
    }`}
  >
    {icon && <span className="material-symbols-outlined text-[16px] mr-1">{icon}</span>}
    {label}
  </button>
);

const HistoryCard: React.FC<{ chat: ChatSession }> = ({ chat }) => {
  let icon = 'chat_bubble';
  if (chat.type === 'code') icon = 'code';
  if (chat.type === 'audio') icon = 'mic';
  if (chat.type === 'image') icon = 'image';

  return (
    <div className="group relative flex flex-col bg-surface-light dark:bg-surface-dark rounded-2xl p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#23303d] transition-all border border-transparent hover:border-primary/20 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-1">
        <div className="flex items-center gap-2 overflow-hidden">
          {chat.unread ? (
             <div className="w-2 h-2 rounded-full bg-primary shrink-0" title="Непрочитане"></div>
          ) : (
            <span className={`material-symbols-outlined text-[20px] shrink-0 ${chat.type === 'text' && !chat.isPinned ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
              {icon}
            </span>
          )}
          
          <h3 className={`font-semibold text-sm text-slate-900 dark:text-white truncate ${chat.type === 'audio' ? 'italic opacity-80' : ''}`}>
            {chat.title}
          </h3>
        </div>
        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 shrink-0">{chat.date}</span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed pr-8">
        {chat.preview}
      </p>
      
      {/* Actions */}
      <div className={`absolute bottom-3 right-3 flex items-center gap-1 ${chat.isPinned ? '' : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100'} transition-opacity`}>
        <button 
          className={`p-1.5 rounded-lg transition-colors ${chat.isPinned ? 'text-primary hover:bg-primary/10' : 'text-slate-400 dark:text-slate-500 hover:text-primary hover:bg-primary/10'}`} 
          title={chat.isPinned ? "Відкріпити" : "Закріпити"}
        >
          <span className={`material-symbols-outlined text-[18px] ${chat.isPinned ? 'filled' : ''}`}>star</span>
        </button>
        <button className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors" title="Меню">
          <span className="material-symbols-outlined text-[18px]">more_horiz</span>
        </button>
      </div>
    </div>
  );
};

export default HistorySidebar;