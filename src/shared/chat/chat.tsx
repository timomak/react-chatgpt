import { ChangeEvent, ReactElement } from "react";
import styles from './chat.module.css'
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

interface ChatProps {
    messages: ChatCompletionMessageParam[]
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
                    <div>{message.content as string}</div>
                </div>
            ))
        )
    }

    return (
        <div className={'main-page'}>
            <h1 className={'h1'}>{title}</h1>
            {onClearChat ? <button className={'button'} onClick={onClearChat}>Clear</button> : null}
            <div className={styles['response-area']}>
                <strong>Response:</strong>
                <div>{renderMessages()}</div>
            </div>

            <textarea
                className={'textarea'}
                placeholder="Enter a prompt..."
                value={inputText}
                onChange={onTextChange}
            />
            <button className={'button'} onClick={onGenerateResponse}>Generate Response</button>
            {onRead ? <button className={'button'} onClick={onRead}>Read</button> : null}
        </div>

    )
}