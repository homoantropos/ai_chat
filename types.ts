export enum MessageType {
  TEXT = 'text',
  CODE = 'code',
  FILE = 'file',
  AUDIO = 'audio',
}

export enum Sender {
  USER = 'user',
  AI = 'ai',
}

export interface User {
  name: string;
  tagline?: string;
  avatarColor?: string;
  avatarText?: string;
}

export interface MessagePart {
  type: 'text' | 'code-block';
  content: string;
  language?: string;
}

export interface FileData {
  name: string;
  size: string;
  type: string;
}

export interface Message {
  id: string;
  sender: Sender;
  timestamp: string;
  type?: MessageType;
  content?: string | MessagePart[]; // String for simple text, array for mixed content
  file?: FileData;
  audioDuration?: string;
  isTyping?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  date: string; // e.g., "Today", "Yesterday", "Tuesday"
  preview: string;
  isPinned?: boolean;
  type?: 'text' | 'audio' | 'image';
  unread?: boolean;
}