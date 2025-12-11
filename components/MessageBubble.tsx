import React from 'react';
import { Message, Sender, MessageType } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.USER;
  
  if (message.isTyping) {
    return (
      <div className="flex justify-start items-end gap-3 group animate-fade-in">
        <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-primary flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white dark:ring-0">
          AI
        </div>
        <div className="flex flex-col items-start">
          <div className="px-4 py-3 bg-surface-light dark:bg-bubble-ai-dark text-slate-800 dark:text-gray-100 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-transparent flex items-center gap-1 h-[46px]">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing [animation-delay:-0.32s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing [animation-delay:-0.16s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing"></div>
          </div>
          <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 ml-2">AI друкує...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2 group w-full mb-6`}>
      {/* User Content */}
      {isUser && (
        <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
           {renderUserContent(message)}
           <MessageMeta time={message.timestamp} isUser={true} />
        </div>
      )}

      {/* Avatar */}
      {isUser ? (
        <div className="shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 shadow-sm border border-white dark:border-gray-600">
          <span className="material-symbols-outlined text-[18px]">face</span>
        </div>
      ) : (
        <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-primary flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white dark:ring-0">
          AI
        </div>
      )}

      {/* AI Content */}
      {!isUser && (
        <div className="flex flex-col items-start max-w-[90%] sm:max-w-[85%] overflow-hidden">
          <div className="px-4 py-3 bg-surface-light dark:bg-bubble-ai-dark text-slate-800 dark:text-gray-100 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-transparent w-full">
            {Array.isArray(message.content) ? (
              message.content.map((part, index) => {
                if (part.type === 'code-block') {
                   return <CodeBlock key={index} code={part.content} language={part.language} />;
                }
                return <p key={index} className="text-[15px] leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: part.content }}></p>;
              })
            ) : (
              <p className="text-[15px] leading-relaxed">{message.content as string}</p>
            )}
          </div>
          <AIActionButtons time={message.timestamp} />
        </div>
      )}
    </div>
  );
};

const renderUserContent = (message: Message) => {
    // File Message
    if (message.file) {
        return (
            <div className="p-1 bg-primary text-white rounded-2xl rounded-tr-sm shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors cursor-pointer border border-white/10">
                    <div className="w-10 h-10 rounded-lg bg-white text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">description</span>
                    </div>
                    <div className="flex flex-col overflow-hidden min-w-[140px]">
                        <p className="text-sm font-bold truncate">{message.file.name}</p>
                        <p className="text-xs text-blue-100">{message.file.size} • {message.file.type}</p>
                    </div>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-white shrink-0">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                    </button>
                </div>
                {message.content && (
                    <div className="px-3 py-2">
                        <p className="text-[15px]">{message.content as string}</p>
                    </div>
                )}
            </div>
        );
    }

    // Audio Message
    if (message.audioDuration) {
        return (
            <div className="pl-3 pr-4 py-3 bg-primary text-white rounded-2xl rounded-tr-sm shadow-sm flex items-center gap-3">
                <button className="w-8 h-8 flex items-center justify-center bg-white text-primary rounded-full hover:bg-blue-50 transition-colors shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[20px] fill-current ml-0.5">play_arrow</span>
                </button>
                <div className="flex flex-col gap-1 w-[120px]">
                    <div className="flex items-center gap-[2px] h-6 items-center opacity-90">
                        {[2, 4, 3, 5, 3, 6, 4, 2, 3, 2, 2, 1].map((h, i) => (
                            <div 
                                key={i} 
                                className={`w-1 rounded-full ${i > 8 ? 'bg-white/60' : 'bg-white'}`} 
                                style={{ height: `${h * 3}px` }}
                            ></div>
                        ))}
                    </div>
                </div>
                <span className="text-xs font-medium tabular-nums opacity-90">{message.audioDuration}</span>
            </div>
        );
    }

    // Standard Text
    return (
        <div className="px-4 py-3 bg-primary text-white rounded-2xl rounded-tr-sm shadow-sm">
            <p className="text-[15px] leading-relaxed">
                {message.content as string}
            </p>
        </div>
    );
};

const MessageMeta: React.FC<{ time: string; isUser: boolean }> = ({ time, isUser }) => (
  <div className={`flex flex-wrap items-center justify-end gap-x-1.5 mt-1 mr-1 text-right ${!isUser ? 'ml-2 justify-start' : ''}`}>
    <span className="text-[10px] text-gray-400 dark:text-gray-500">{time}</span>
    {isUser && (
      <>
        {/* Only show extra info in user meta if desired, keeping minimal for now */}
      </>
    )}
  </div>
);

const AIActionButtons: React.FC<{ time: string }> = ({ time }) => (
    <div className="flex items-center gap-3 mt-1 ml-2">
        <span className="text-[11px] text-gray-400 dark:text-gray-500">{time}</span>
        <button className="text-gray-400 hover:text-primary transition-colors" title="Скопіювати">
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
        </button>
        <button className="text-gray-400 hover:text-primary transition-colors" title="Повторити">
            <span className="material-symbols-outlined text-[16px]">refresh</span>
        </button>
        <div className="flex items-center gap-1">
            <button className="text-gray-400 hover:text-green-500 transition-colors">
                <span className="material-symbols-outlined text-[16px]">thumb_up</span>
            </button>
        </div>
    </div>
);

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language }) => (
  <div className="rounded-lg overflow-hidden bg-gray-50 dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 my-2">
    <div className="flex items-center justify-between px-3 py-1.5 bg-gray-100 dark:bg-[#2d2d2d] border-b border-gray-200 dark:border-gray-700">
      <span className="text-xs text-slate-500 dark:text-gray-400 font-mono font-bold">{language || 'code'}</span>
      <button className="flex items-center gap-1 text-xs text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition-colors">
        <span className="material-symbols-outlined text-[14px]">content_copy</span>
        Скопіювати
      </button>
    </div>
    <div className="p-3 overflow-x-auto custom-scrollbar bg-[#fafafa] dark:bg-transparent">
      <pre className="font-mono text-[13px] leading-relaxed text-slate-700 dark:text-gray-300">
        <code dangerouslySetInnerHTML={{ __html: code }}></code>
      </pre>
    </div>
  </div>
);

export default MessageBubble;