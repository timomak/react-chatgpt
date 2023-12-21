import OpenAI from 'openai';
import styles from './bot-item.module.css'

interface BotItemProps {
    label?: string;
    onDelete?: (botId: string) => void;
    bot: OpenAI.Beta.Assistant;
}

export function BotItem({
    label,
    onDelete,
    bot
}: BotItemProps) {

    return (
        <div className={styles['bot-item']}>
            <div className={styles['label']}>{label ? label : bot.name}</div>
            <button type='button' className={styles['button']} onClick={() => onDelete ? onDelete(bot.id) : null}>Delete</button>
        </div>
    )
}