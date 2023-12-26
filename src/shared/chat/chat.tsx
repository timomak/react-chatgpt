'use client'

import { ChangeEvent, Fragment, ReactElement, useCallback, useMemo, useState } from "react";
import styles from './chat.module.css'
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import Image from "next/image";
import Icons from "../icons/icons";
import { useChatSettings } from "@/providers/chat-settings-provider/chat-settings-provider";
import OpenAI from "openai";

export interface TranslateChatMessagesProps { role: string, content: string, variant?: 'default' | 'variant-1' | 'variant-2' }
interface ChatProps {
    messages?: ChatCompletionMessageParam[];
    translateMessages?: TranslateChatMessagesProps[];
    title: string;
    onGenerateResponse?: () => void;
    inputText: string;
    onTextChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onClearChat?: () => void;
    onRead?: () => void;
    isHovering: boolean;
    setIsHovering: (anythingButChat: boolean) => void;
    onCreateNewThread?: () => void;
    currentBot?: OpenAI.Beta.Assistants.Assistant;
    isTranslatorView?: boolean;
    onTranslateFirstToSecond?: () => void;
    onTranslateSecondToFirst?: () => void;
    isRecordingFirstToSecond?: boolean;
    isRecordingSecondToFirst?: boolean;
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
    currentBot,
    isTranslatorView,
    translateMessages,
    onTranslateFirstToSecond,
    onTranslateSecondToFirst,
    isRecordingFirstToSecond,
    isRecordingSecondToFirst,
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
        if (isTranslatorView) {
            return (
                translateMessages?.map((message, index) => (
                    <div key={`new-message-id-${index}`} className={styles['message']}>
                        <div className={`${styles['sender-text']} ${styles[message.variant || 'default']}`}>{message.role}</div>
                        <div className={`${styles['receiver-text']} ${styles[message.variant || 'default']}`}>{message.content as string}</div>
                    </div>
                ))
            )
        }
        return (
            messages?.map((message, index) => {
                let messageContent = message.content as string
                if (messageContent.includes("[🔓JAILBREAK]") && index > 0) {
                    messageContent = (message.content as string).split("[🔓JAILBREAK]")[1]
                }
                return (
                    <div key={`new-message-id-${index}`} className={styles['message']}>
                        <div className={`${styles[`${message.role}`]} ${styles['sender-text']}`}>{replaceRoleWithName(message.role)}</div>
                        <div className={`${styles[`${message.role}`]} ${styles['receiver-text']}`}>{messageContent}</div>
                    </div>
                )
            })
        )
    }, [messages, currentBot, chatUsername, isTranslatorView, translateMessages])

    const onHover = () => {
        setIsHovering(true)
    }

    const onHoverEnded = () => {
        setIsHovering(false)
    }

    const renderCreateThreadButton = useCallback(() => {
        // return null;
        return (
            <Fragment key={`create-thread-button`}>
                <a className={`${styles['thread-button']}`} onClick={onCreateNewThread}>
                    <Image className={styles['thread-image']} priority alt={`threads-list-thread-create-thread-image`} src={Icons.AddBotIcon} />
                    <div className={styles['thread-text']}>{`Start new chat with ${currentBot?.name}`}</div>
                    {/* <div className={`hidden ${styles['hidden-description']}`}>test</div> */}
                </a>
            </Fragment>
        )
    }, [currentBot])

    return (
        <div className={`${styles['chat']} ${isSettingsMenuOpen ? styles['chat-open-settings'] : ''}`}>
            <div className={`${isHovering || isRecordingFirstToSecond || isRecordingSecondToFirst ? styles['response-area-glow'] : ''} ${styles['response-area']} ${isSettingsMenuOpen ? styles['response-area-open-settings'] : ''}`}>
                <div className={` ${styles['response-text']} ${isSettingsMenuOpen ? styles['response-text-open-settings'] : ''} ${messages?.length === 0 ? styles['response-text-hidden'] : ''}`}>{renderMessages}</div>
                {messages?.length === 0 && !isTranslatorView ? renderCreateThreadButton() : null}
            </div>
            <div onMouseEnter={onHover} onMouseLeave={onHoverEnded}>
                {isTranslatorView ? (
                    <div className={`${styles['inline-container']}`}>
                        <button
                            className={`${isRecordingFirstToSecond ? styles['record-button-active'] : 'glow-component'} ${isRecordingFirstToSecond ? styles['variant-1'] : ''} ${styles['record-toggle-button-container']}`}
                            onClick={onTranslateFirstToSecond}
                        >
                            Translate to English
                        </button>

                        <button
                            className={`${isRecordingSecondToFirst ? styles['record-button-active'] : 'glow-component'} ${isRecordingSecondToFirst ? styles['variant-2'] : ''} ${styles['record-toggle-button-container']}`}
                            onClick={onTranslateSecondToFirst}
                        >
                            Translate to French
                        </button>
                    </div>
                ) : (
                    <div className={`${styles['inline-container']}`}>
                        <div className={`glow-component ${styles['input-bar']}`}>
                            <input
                                className={styles['textarea']}
                                placeholder="Enter a prompt..."
                                value={inputText}
                                onChange={onTextChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && onGenerateResponse) onGenerateResponse()
                                }}
                            />
                        </div>
                        <button
                            className={`glow-component ${styles['send-prompt-button-container']}`}
                            onClick={onGenerateResponse}
                        >
                            <Image className={`${styles['send-prompt-button']}`} priority alt={`open-button`} src={Icons.SendIcon} />
                        </button>
                    </div>
                )}
            </div>
            {/* {onRead ? <button className={'button'} onClick={onRead}>Read</button> : null} */}
        </div>
    )
}