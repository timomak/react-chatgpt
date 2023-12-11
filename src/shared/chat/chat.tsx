import { ChangeEvent, ReactElement, useState } from "react";
import styles from './chat.module.css'
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import Image from "next/image";
import Icons from "../icons/icons";

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
    setIsHovering
}: ChatProps) {
    const replaceRoleWithName = (role: ChatCompletionMessageParam['role']) => {
        switch (role) {
            case 'user':

                return 'Timo'

            case 'assistant':

                return 'Enora'

            default:
                return role
        }
    }

    const renderMessages = () => {
        return (
            messages.map((message, index) => (
                <div key={`new-message-id-${index}`} className={styles['message']}>
                    <div className={`${styles[`${message.role}`]} ${styles['sender-text']}`}>{replaceRoleWithName(message.role)}</div>
                    <div className={`${styles[`${message.role}`]} ${styles['receiver-text']}`}>{message.content as string}</div>
                </div>
            ))
        )
    }

    const onHover = () => {
        setIsHovering(true)
    }

    const onHoverEnded = () => {
        setIsHovering(false)
    }

    return (
        <div className={styles['chat']}>
            {onClearChat ? <button className={'button'} onClick={onClearChat}>Clear</button> : null}
            <div className={` glow-component ${isHovering ? '' : styles['response-area-glow']} ${styles['response-area']}`}>
                <div className={`${styles['response-text']}`}>{renderMessages()}</div>
            </div>
            <div className={`${styles['inline-container']}`}>
                <div className={`glow-component ${styles['input-bar']}`} onMouseEnter={onHover} onMouseLeave={onHoverEnded}>
                    <input
                        className={styles['textarea']}
                        placeholder="Enter a prompt..."
                        value={inputText}
                        onChange={onTextChange}
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