'use client'

import OpenAI from "openai";
import { ReactNode, createContext, useContext, useMemo, useState } from "react";

export interface ChatSettingsContextProperties {
    chatUsername: string | undefined;
    setChatUsername: (username: string) => void;
    openAI_apiKey: string | undefined;
    setOpenAI_apiKey: (key: string) => void;
    isSettingsMenuOpen: boolean;
    setIsSettingsMenuOpen: (anonymous: boolean) => void;
    isSettingsModalOpen: boolean;
    setIsSettingsModalOpen: (anonymous: boolean) => void;
    currentBot: OpenAI.Beta.Assistants.Assistant | undefined;
    setCurrentBot: (bot: OpenAI.Beta.Assistants.Assistant) => void;
    currentThreadId: string | undefined;
    setCurrentThreadId: (threadId?: string) => void;
}

export const UserSettingsContext = createContext<ChatSettingsContextProperties>({} as ChatSettingsContextProperties);

export interface ChatSettingsProviderProps {
    children: ReactNode;
}

export function ChatSettingsProvider({ children }: ChatSettingsProviderProps) {
    // General Settings
    const apiKey = process.env.OPENAI_API_KEY;
    const username = process.env.CHAT_USERNAME;
    const [openAI_apiKey, setOpenAI_apiKey] = useState(apiKey);
    const [chatUsername, setChatUsername] = useState(username);

    // Chat UI Settings
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(true);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [currentBot, setCurrentBot] = useState<OpenAI.Beta.Assistants.Assistant>();
    const [currentThreadId, setCurrentThreadId] = useState<string>();

    const value = useMemo<ChatSettingsContextProperties>(
        () => ({
            chatUsername,
            setChatUsername,
            openAI_apiKey,
            setOpenAI_apiKey,
            isSettingsMenuOpen,
            setIsSettingsMenuOpen,
            isSettingsModalOpen,
            setIsSettingsModalOpen,
            currentBot,
            setCurrentBot,
            currentThreadId,
            setCurrentThreadId
        }),
        [
            chatUsername,
            setChatUsername,
            isSettingsMenuOpen,
            setIsSettingsMenuOpen,
            isSettingsModalOpen,
            setIsSettingsMenuOpen,
            currentBot,
            setCurrentBot,
            currentThreadId,
            setCurrentThreadId
        ]
    );

    return <UserSettingsContext.Provider value={value}>{children}</UserSettingsContext.Provider>;
}

export function useChatSettings() {
    const context = useContext(UserSettingsContext);
    return context;
}
