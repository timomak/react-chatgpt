import { MessageView, MessageViewProps } from "../message-view/message-view"
import styles from './messages-window.module.css'

interface MessageWindowProps {
    messages?: MessageViewProps[];
}

export function MessageWindow({
    messages
}: MessageWindowProps) {
    return (
        <div className={styles['container']}>
            {messages?.map((current) => {
                return (
                    <MessageView variant={current.variant} text={current.text} />
                )
            })}
        </div>
    )
}