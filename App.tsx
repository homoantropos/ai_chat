import React, { useState, useEffect, useRef } from 'react';
import HistorySidebar from './components/HistorySidebar';
import MessageBubble from './components/MessageBubble';
import { Message, MessageType, Sender } from './types';

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: Sender.USER,
    type: MessageType.TEXT,
    timestamp: '10:23',
    content: 'Привіт! Мені потрібно написати скрипт на Python, який парсить PDF файл і витягує з нього текст. Можеш допомогти?'
  },
  {
    id: '2',
    sender: Sender.AI,
    type: MessageType.TEXT,
    timestamp: '10:24',
    content: [
      {
        type: 'text',
        content: `Звісно! Для роботи з PDF у Python найчастіше використовують бібліотеку <code class="bg-gray-100 dark:bg-black/30 px-1.5 py-0.5 rounded text-sm font-mono text-primary font-medium">PyPDF2</code> або <code class="bg-gray-100 dark:bg-black/30 px-1.5 py-0.5 rounded text-sm font-mono text-primary font-medium">pdfplumber</code>. Ось простий приклад використання <code class="bg-gray-100 dark:bg-black/30 px-1.5 py-0.5 rounded text-sm font-mono text-primary font-medium">pdfplumber</code>, оскільки він краще справляється зі складними макетами:`
      },
      {
        type: 'code-block',
        language: 'python',
        content: `<span class="text-purple-600 dark:text-purple-400">import</span> pdfplumber
<span class="text-purple-600 dark:text-purple-400">def</span> <span class="text-blue-600 dark:text-blue-400 font-bold">extract_text_from_pdf</span>(pdf_path):
    <span class="text-purple-600 dark:text-purple-400">with</span> pdfplumber.open(pdf_path) <span class="text-purple-600 dark:text-purple-400">as</span> pdf:
        text = <span class="text-green-600 dark:text-green-400">""</span>
        <span class="text-purple-600 dark:text-purple-400">for</span> page <span class="text-purple-600 dark:text-purple-400">in</span> pdf.pages:
            text += page.extract_text() + <span class="text-green-600 dark:text-green-400">"\\n"</span>
    <span class="text-purple-600 dark:text-purple-400">return</span> text
<span class="text-slate-400 dark:text-slate-500 italic"># Використання</span>
pdf_text = extract_text_from_pdf(<span class="text-green-600 dark:text-green-400">"document.pdf"</span>)
<span class="text-purple-600 dark:text-purple-400">print</span>(pdf_text)`
      },
      {
        type: 'text',
        content: `Вам потрібно буде встановити бібліотеку командою <code class="bg-gray-100 dark:bg-black/30 px-1.5 py-0.5 rounded text-sm font-mono text-primary font-medium">pip install pdfplumber</code>.`
      }
    ]
  },
  {
    id: '3',
    sender: Sender.USER,
    type: MessageType.FILE,
    timestamp: '10:25',
    content: 'Ось файл, про який я казав.',
    file: {
        name: 'tech_specs_v2.pdf',
        size: '1.4 MB',
        type: 'PDF'
    }
  },
  {
    id: '4',
    sender: Sender.USER,
    type: MessageType.AUDIO,
    timestamp: '10:26',
    audioDuration: '0:14'
  },
  {
      id: '5',
      sender: Sender.AI,
      timestamp: '',
      isTyping: true
  }
];

export default function App() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Theme Toggle Effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = '24px';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  return (
    <>
      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        onSelectChat={() => setIsHistoryOpen(false)} 
      />
      
      {/* Header */}
      <header className="shrink-0 h-16 bg-surface-light dark:bg-background-dark border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 z-20">
        <button 
          onClick={() => setIsHistoryOpen(true)}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-slate-600 dark:text-gray-300"
        >
          <span className="material-symbols-outlined">history</span>
        </button>
        
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">AI Chat</h1>
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 -mt-1">@homoantropos</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-slate-600 dark:text-gray-300"
          >
            <span className="material-symbols-outlined text-[20px]">
                {theme === 'light' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <button className="p-2 rounded-full bg-primary hover:bg-primary-dark transition-colors text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6 custom-scrollbar scroll-smooth pb-4 bg-background-light dark:bg-background-dark">
        <div className="flex justify-center py-2 sticky top-0 z-10 pointer-events-none">
            <span className="bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-slate-600 dark:text-gray-400 border border-transparent dark:border-gray-700 shadow-sm">
                Сьогодні
            </span>
        </div>
        
        {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
        ))}

        <div className="h-2"></div>
      </main>

      {/* Footer / Input Area */}
      <footer className="shrink-0 bg-surface-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 p-2 sm:p-4 pb-6 sm:pb-6 z-20">
        {/* File Preview Chip (Static Mock) */}
        <div className="flex gap-2 mb-2 px-1 overflow-x-auto no-scrollbar">
            <div className="relative group flex items-center gap-2 bg-gray-50 dark:bg-[#1a2632] pl-2 pr-8 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shrink-0 shadow-sm animate-fade-in-up">
                <span className="material-symbols-outlined text-red-500 text-[18px]">picture_as_pdf</span>
                <span className="text-xs text-slate-700 dark:text-gray-300 max-w-[120px] truncate font-medium">data_struct...pdf</span>
                <button className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
            </div>
        </div>

        {/* Input Bar */}
        <div className="flex items-end gap-2 max-w-4xl mx-auto w-full">
            <button className="shrink-0 p-3 text-slate-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors mb-[2px]">
                <span className="material-symbols-outlined text-[24px]">attach_file</span>
            </button>
            
            <div className="flex-1 bg-gray-100 dark:bg-[#1a2632] rounded-2xl border border-transparent focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all flex items-center min-h-[52px]">
                <textarea 
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 resize-none py-3 px-4 text-slate-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 text-[15px] max-h-[120px] overflow-y-auto custom-scrollbar"
                    placeholder="Напишіть повідомлення..."
                    rows={1}
                    style={{ minHeight: '24px' }}
                />
            </div>

            <button className="shrink-0 p-3 text-slate-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors mb-[2px]">
                <span className="material-symbols-outlined text-[24px]">mic</span>
            </button>
            
            <button 
                className={`shrink-0 h-[48px] w-[48px] flex items-center justify-center rounded-full transition-all shadow-md mb-[2px] shadow-primary/20 ${
                    inputText.trim() 
                    ? 'bg-primary hover:bg-primary-dark text-white cursor-pointer' 
                    : 'bg-primary hover:bg-primary-dark text-white disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed'
                }`}
                disabled={!inputText.trim()}
            >
                <span className="material-symbols-outlined text-[20px] ml-0.5">arrow_upward</span>
            </button>
        </div>
      </footer>
    </>
  );
}