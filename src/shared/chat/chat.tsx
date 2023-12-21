'use client'

import { ChangeEvent, Fragment, ReactElement, useCallback, useMemo, useState } from "react";
import styles from './chat.module.css'
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import Image from "next/image";
import Icons from "../icons/icons";
import { useChatSettings } from "@/providers/chat-settings-provider/chat-settings-provider";
import OpenAI from "openai";

interface ChatProps {
    messages: ChatCompletionMessageParam[]
    title: string;
    onGenerateResponse: () => void;
    inputText: string;
    onTextChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onClearChat?: () => void;
    onRead?: () => void;
    isHovering: boolean;
    setIsHovering: (anythingButChat: boolean) => void;
    onCreateNewThread: () => void;
    currentBot?: OpenAI.Beta.Assistants.Assistant;
}

export function Chat({
    messages,
    title,
    onGenerateResponse,
    inputText,
    onTextChange,
    onClearChat,
    onRead,
    isHovering,
    setIsHovering,
    onCreateNewThread,
    currentBot
}: ChatProps) {
    const { isSettingsMenuOpen, chatUsername } = useChatSettings()
    const replaceRoleWithName = useCallback((role: ChatCompletionMessageParam['role']) => {
        switch (role) {
            case 'user':
                return chatUsername || "You"
            case 'assistant':
                if (currentBot) return currentBot.name
                return 'Bot'
            default:
                return role
        }
    }, [currentBot, chatUsername])

    const renderMessages = useMemo(() => {
        return (
            messages.map((message, index) => (
                <div key={`new-message-id-${index}`} className={styles['message']}>
                    <div className={`${styles[`${message.role}`]} ${styles['sender-text']}`}>{replaceRoleWithName(message.role)}</div>
                    <div className={`${styles[`${message.role}`]} ${styles['receiver-text']}`}>{message.content as string}</div>
                </div>
            ))
        )
    }, [messages, currentBot, chatUsername])

    const onHover = () => {
        setIsHovering(true)
    }

    const onHoverEnded = () => {
        setIsHovering(false)
    }

    const renderCreateBotButton = useCallback(() => {
        // return null;
        return (
            <Fragment key={`create-thread-button`}>
                <a className={`${styles['thread-button']}`} onClick={onCreateNewThread}>
                    <Image className={styles['thread-image']} priority alt={`threads-list-thread-create-thread-image`} src={Icons.AddBotIcon} />
                    <div className={styles['thread-text']}>{`Start new chat with ${currentBot?.name} AI`}</div>
                    {/* <div className={`hidden ${styles['hidden-description']}`}>test</div> */}
                </a>
            </Fragment>
        )
    }, [currentBot])

    return (
        <div className={`${styles['chat']} ${isSettingsMenuOpen ? styles['chat-open-settings'] : ''}`}>
            {/* {onClearChat ? <button className={'button'} onClick={onClearChat}>Clear</button> : null} */}
            {/* glow-component ${isHovering ? '' : styles['response-area-glow']} */}
            <div className={`${isHovering ? styles['response-area-glow'] : ''} ${styles['response-area']} ${isSettingsMenuOpen ? styles['response-area-open-settings'] : ''}`}>
                <div className={` ${styles['response-text']} ${isSettingsMenuOpen ? styles['response-text-open-settings'] : ''} ${messages.length === 0 ? styles['response-text-hidden'] : ''}`}>{renderMessages}</div>
                {messages.length === 0 ? renderCreateBotButton() : null}
            </div>
            <div className={`${styles['inline-container']}`}>
                <div className={`glow-component ${styles['input-bar']}`} onMouseEnter={onHover} onMouseLeave={onHoverEnded}>
                    <input
                        className={styles['textarea']}
                        placeholder="Enter a prompt..."
                        value={inputText}
                        onChange={onTextChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onGenerateResponse()
                        }}
                    />
                </div>
                <button
                    className={`glow-component ${styles['send-prompt-button-container']}`}
                    onClick={onGenerateResponse}
                    onMouseEnter={onHover}
                    onMouseLeave={onHoverEnded}
                >
                    <Image className={`${styles['send-prompt-button']}`} priority alt={`open-button`} src={Icons.SendIcon} />
                </button>
            </div>
            {/* {onRead ? <button className={'button'} onClick={onRead}>Read</button> : null} */}
        </div>

    )
}