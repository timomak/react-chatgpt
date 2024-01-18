import { useCallback } from "react";
import styles from './message-view.module.css';
import { LoadingMessageAnimation } from "../loading-message-animation/loading-message-animation";

export interface MessageViewProps {
    variant: 'context-title' | 'bot-text' | 'user-text' | 'analyzing' | 'loading-question' | 'loading-response';
    text?: string;
}

export function MessageView({
    variant = 'context-title',
    text
}: MessageViewProps) {

    const messageContent = useCallback(() => {
        switch (variant) {
            case 'context-title':

                return (
                    <>
                        <h1>{text}</h1>
                    </>
                )
            case 'loading-question':
            case 'loading-response':
                return (
                    <LoadingMessageAnimation />
                )
            default:
                return <>{text}</>
        }
    }, [variant, text])

    return (
        <div className={styles[`message-variant-${variant}`]}>
            {messageContent()}
        </div>
    )
}