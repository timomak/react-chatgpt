import { ChangeEvent, ReactElement } from "react";
import styles from './chat.module.css'

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface ChatProps {
    messages: Message[]
    title: string;
    onGenerateResponse: () => void;
    inputText: string;
    onTextChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    onClearChat?: () => void;
    onRead?: () => void;
}

export function Chat({
    messages,
    title,
    onGenerateResponse,
    inputText,
    onTextChange,
    onClearChat,
    onRead
}: ChatProps) {


    const renderMessages = () => {
        return (
            messages.map((message, index) => (
                <div key={`new-message-id-${index}`} className={styles['message']}>
                    <div className={styles[`${message.role}`]}>{`${message.role}:`}</div>
                    <div>{message.content}</div>
                </div>
            ))
        )
    }

    return (
        <div className={styles['main-page']}>
            <h1 className={styles['h1']}>{title}</h1>
            {onClearChat ? <button className={styles['button']} onClick={onClearChat}>Clear</button> : null}
            <div className={styles['response-area']}>
                <strong>Response:</strong>
                <div>{renderMessages()}</div>
            </div>

            <textarea
                className={styles['textarea']}
                placeholder="Enter a prompt..."
                value={inputText}
                onChange={onTextChange}
            />
            <button className={styles['button']} onClick={onGenerateResponse}>Generate Response</button>
            {onRead ? <button className={styles['button']} onClick={onRead}>Read</button> : null}
        </div>

    )
}