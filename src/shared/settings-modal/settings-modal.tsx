import { useChatSettings } from '@/providers/chat-settings-provider/chat-settings-provider';
import styles from './settings-modal.module.css'
import OpenAI from 'openai';
import { useCallback, useMemo, useState } from 'react';
import { TextInput } from '../text-input/text-input';


interface SettingsModalProps {

}

export function SettingsModal({ }: SettingsModalProps) {
    const {
        chatUsername,
        setChatUsername,
        openAI_apiKey,
        setOpenAI_apiKey,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
    } = useChatSettings();

    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const [apiKey, setApiKey] = useState(openAI_apiKey)

    const generalTab = useMemo(() => {
        return (
            <div className={`${styles['tab-page-container']}`}>
                <TextInput
                    title='Username'
                    value={chatUsername}
                    setValue={setChatUsername}
                    placeholder='Enter Username'
                    onSubmit={() => null}
                    buttonText='Save'
                />

                <TextInput
                    title='Open AI API Key'
                    value={apiKey}
                    setValue={setApiKey}
                    placeholder='Enter Api key'
                    onSubmit={() => apiKey ? setOpenAI_apiKey(apiKey) : null}
                    onCancel={() => openAI_apiKey ? setApiKey(openAI_apiKey) : setApiKey('')}
                    buttonText='Save'
                />


            </div>
        )
    }, [apiKey, setApiKey, setOpenAI_apiKey, chatUsername, setChatUsername])

    const tabsData = useMemo(() => {
        return [
            {
                title: 'General',
                component: generalTab
            },
            {
                title: 'Bots',
                component: generalTab
            },
            {
                title: 'Advanced',
                component: generalTab
            },
        ]
    }, [generalTab])

    const horizontalTabs = useCallback(() => {
        return (
            <div className={`${styles['tabs']}`}>
                <div className={`${styles['tabs-buttons']}`}>
                    {tabsData.map((tabData, index) => (
                        <button type='button' onClick={() => setCurrentTabIndex(index)} className={`${styles['tab-button']} ${index === currentTabIndex ? styles['tab-button-current'] : ''}`}>{tabData.title}</button>
                    ))}
                </div>
                {tabsData[currentTabIndex].component}

            </div>
        )
    }, [tabsData, currentTabIndex])

    return (
        <div className={`${styles['settings-modal']} ${isSettingsModalOpen ? styles['settings-modal-open'] : ''}`} >
            <div className={`${styles['modal-background']} ${isSettingsModalOpen ? styles['modal-background-open'] : ''}`} />

            <div className={`${styles['sliding-container']} ${isSettingsModalOpen ? styles['sliding-container-open'] : ''}`}>
                <button type='button' onClick={() => setIsSettingsModalOpen(false)} className={`${styles['clickable-background']}`} />
                <div className={`${styles['settings-content']}`}>
                    <div className={`${styles['close-button-container']}`}>
                        <button type='button' onClick={() => setIsSettingsModalOpen(false)} className={`${styles['close-button']}`}>+</button>
                    </div>
                    {horizontalTabs()}
                </div>
            </div>

        </div>
    )
}