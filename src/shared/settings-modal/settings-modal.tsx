import { useChatSettings } from '@/providers/chat-settings-provider/chat-settings-provider';
import styles from './settings-modal.module.css'
import OpenAI from 'openai';


interface SettingsModalProps {

}

export function SettingsModal({ }: SettingsModalProps) {
    const {
        openAI_apiKey,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
    } = useChatSettings();

    return (
        <div className={`${styles['settings-modal']} ${isSettingsModalOpen ? styles['settings-modal-open'] : ''}`} >
            <div className={`${styles['modal-background']} ${isSettingsModalOpen ? styles['modal-background-open'] : ''}`} />

            <div className={`${styles['sliding-container']} ${isSettingsModalOpen ? styles['sliding-container-open'] : ''}`}>
                <button type='button' onClick={() => setIsSettingsModalOpen(false)} className={`${styles['clickable-background']}`} />
                <div className={`${styles['settings-content']}`}>
                    <div className={`${styles['close-button-container']}`}>
                        <button type='button' onClick={() => setIsSettingsModalOpen(false)} className={`${styles['close-button']}`}>+</button>
                    </div>
                </div>
            </div>

        </div>
    )
}