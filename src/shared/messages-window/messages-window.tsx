import { Fragment, useEffect, useRef } from "react";
import { MessageView, MessageViewProps } from "../message-view/message-view"
import styles from './messages-window.module.css'
import { useChatSettings } from "@/providers/chat-settings-provider/chat-settings-provider";
import { timeout } from "@/utlis/timeout";

interface MessageWindowProps {
    messages?: MessageViewProps[];
}

export function MessageWindow({
    messages,
}: MessageWindowProps) {
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const {
        isMainChatModalVisible,
    } = useChatSettings();

    const scrollToBottom = async () => {
        if (isMainChatModalVisible && messagesEndRef && messagesEndRef.current) {
            const lastChildElement = messagesEndRef.current?.lastElementChild;
            await timeout(350); // wait for modal animation to transition from css animation.

            lastChildElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, isMainChatModalVisible]);

    return (
        <div className={styles['container']}>
            <div ref={messagesEndRef} className={styles['lower-container']}>
                {messages?.map((current, index) => {
                    return (
                        <Fragment key={`message-window-key-index-${index}`}>
                            <MessageView variant={current.variant} text={current.text} />
                        </Fragment>
                    )
                })}
            </div>
        </div>
    )
}