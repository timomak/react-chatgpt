'use client'

import OpenAI from "openai";
import { ReactNode, createContext, useContext, useMemo, useState } from "react";

export interface ChatSettingsContextProperties {
    isSettingsMenuOpen: boolean;
    setIsSettingsMenuOpen: (anonymous: boolean) => void;
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
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(true);
    const [currentBot, setCurrentBot] = useState<OpenAI.Beta.Assistants.Assistant>();
    const [currentThreadId, setCurrentThreadId] = useState<string>();


    const value = useMemo<ChatSettingsContextProperties>(
        () => ({
            isSettingsMenuOpen,
            setIsSettingsMenuOpen,
            currentBot,
            setCurrentBot,
            currentThreadId,
            setCurrentThreadId
        }),
        [isSettingsMenuOpen, setIsSettingsMenuOpen]
    );

    return <UserSettingsContext.Provider value={value}>{children}</UserSettingsContext.Provider>;
}

export function useChatSettings() {
    const context = useContext(UserSettingsContext);
    return context;
}
