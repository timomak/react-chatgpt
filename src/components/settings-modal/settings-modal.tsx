import { useChatSettings } from '@/providers/chat-settings-provider/chat-settings-provider';
import styles from './settings-modal.module.css'
import OpenAI from 'openai';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { TextInput } from '../../shared/text-input/text-input';
import { BotItem } from '../../shared/bot-item/bot-item';


interface SettingsModalProps {

}

export function SettingsModal({ }: SettingsModalProps) {
    const {
        bots,
        setBots,
        chatUsername,
        setChatUsername,
        openAI_apiKey,
        setOpenAI_apiKey,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isMainChatModalVisible,
        currentThreadId,
        setCurrentThreadId,
    } = useChatSettings();

    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const [apiKey, setApiKey] = useState(openAI_apiKey);
    const [newThreadId, setNewThreadId] = useState(currentThreadId);

    const openai = new OpenAI({ apiKey: openAI_apiKey, dangerouslyAllowBrowser: true });

    const handleDeleteAssistant = async (botId: string) => {
        await openai.beta.assistants.del(botId);
        const allBots = bots?.filter((bot) => bot.id !== botId)
        setBots(allBots || [])
    }

    const botsTab = useMemo(() => {
        return (
            <div className={`${styles['tab-page-container']}`} key={'settings-modal--bots-tab'}>
                <div>
                    <div className={`${styles['section-title']}`}>All Bots</div>
                    {bots?.map((bot) => (
                        <Fragment key={`settings-modal--bots-tab--${bot.id}`}>
                            <BotItem bot={bot} onDelete={handleDeleteAssistant} />
                        </Fragment>
                    ))}
                </div>
            </div>
        )
    }, [bots, handleDeleteAssistant])

    const generalTab = useMemo(() => {
        return (
            <div className={`${styles['tab-page-container']}`} key={'settings-modal--general-tab'}>
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

    const advancedTab = useMemo(() => {
        return (
            <div className={`${styles['tab-page-container']}`} key={'settings-modal--advanced-tab'}>
                <TextInput
                    title='Message Thread ID'
                    value={newThreadId}
                    setValue={setNewThreadId}
                    placeholder='Enter current thread ID...'
                    onSubmit={() => newThreadId ? setCurrentThreadId(newThreadId) : null}
                    onCancel={() => currentThreadId ? setNewThreadId(currentThreadId) : setCurrentThreadId('')}
                    buttonText='Save'
                />


            </div>
        )
    }, [setCurrentThreadId, currentThreadId, newThreadId, setNewThreadId])

    const tabsData = useMemo(() => {
        return [
            {
                title: 'General',
                component: generalTab
            },
            {
                title: 'Bots',
                component: botsTab
            },
            {
                title: 'Advanced',
                component: advancedTab
            },
        ]
    }, [generalTab, botsTab])

    const horizontalTabs = useCallback(() => {
        return (
            <div className={`${styles['tabs']}`}>
                <div className={`${styles['tabs-buttons']}`}>
                    {tabsData.map((tabData, index) => (
                        <button key={`settings-modal--tab-button--${tabData.title}`} type='button' onClick={() => setCurrentTabIndex(index)} className={`${styles['tab-button']} ${index === currentTabIndex ? styles['tab-button-current'] : ''}`}>{tabData.title}</button>
                    ))}
                </div>
                {tabsData[currentTabIndex].component}
            </div>
        )
    }, [tabsData, currentTabIndex])

    useEffect(() => {
        setNewThreadId(currentThreadId)
    }, [currentThreadId])

    if (isMainChatModalVisible) return null;

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