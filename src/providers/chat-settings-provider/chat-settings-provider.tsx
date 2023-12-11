'use client'

import { ReactNode, createContext, useContext, useMemo, useState } from "react";

export interface ChatSettingsContextProperties {
    isSettingsMenuOpen: boolean;
    setIsSettingsMenuOpen: (anonymous: boolean) => void;
}

export const UserSettingsContext = createContext<ChatSettingsContextProperties>({} as ChatSettingsContextProperties);

export interface ChatSettingsProviderProps {
    children: ReactNode;
}

export function ChatSettingsProvider({ children }: ChatSettingsProviderProps) {
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

    const value = useMemo<ChatSettingsContextProperties>(
        () => ({
            isSettingsMenuOpen,
            setIsSettingsMenuOpen,
        }),
        [isSettingsMenuOpen, setIsSettingsMenuOpen]
    );

    return <UserSettingsContext.Provider value={value}>{children}</UserSettingsContext.Provider>;
}

export function useChatSettings() {
    const context = useContext(UserSettingsContext);
    return context;
}
