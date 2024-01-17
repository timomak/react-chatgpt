import { useChatSettings } from '@/providers/chat-settings-provider/chat-settings-provider';
import styles from './main-ai-chat.module.css'
import OpenAI from 'openai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TextInput } from '../../shared/text-input/text-input';
import { BotItem } from '../../shared/bot-item/bot-item';


interface MainAIChatProps {

}

export function MainAIChat({ }: MainAIChatProps) {
    const {
        bots,
        setBots,
        chatUsername,
        setChatUsername,
        openAI_apiKey,
        setOpenAI_apiKey,
        isMainChatModalVisible,
        setIsMainChatModalVisible,
        currentThreadId,
        setCurrentThreadId,

    } = useChatSettings();

    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const [apiKey, setApiKey] = useState(openAI_apiKey);
    const [newThreadId, setNewThreadId] = useState(currentThreadId);

    const openai = new OpenAI({ apiKey: openAI_apiKey, dangerouslyAllowBrowser: true });

    // const handleDeleteAssistant = async (botId: string) => {
    //     await openai.beta.assistants.del(botId);
    //     const allBots = bots?.filter((bot) => bot.id !== botId)
    //     setBots(allBots || [])
    // }

    // const botsTab = useMemo(() => {
    //     return (
    //         <div className={`${styles['tab-page-container']}`}>
    //             <div>
    //                 {/* <div className={`${styles['section-title']}`}>Default Bots</div> */}

    //                 <div className={`${styles['section-title']}`}>All Bots</div>
    //                 {bots?.map((bot) => (
    //                     <BotItem bot={bot} onDelete={handleDeleteAssistant} />
    //                 ))}
    //             </div>
    //         </div>
    //     )
    // }, [bots, handleDeleteAssistant])

    // const generalTab = useMemo(() => {
    //     return (
    //         <div className={`${styles['tab-page-container']}`}>
    //             <TextInput
    //                 title='Username'
    //                 value={chatUsername}
    //                 setValue={setChatUsername}
    //                 placeholder='Enter Username'
    //                 onSubmit={() => null}
    //                 buttonText='Save'
    //             />

    //             <TextInput
    //                 title='Open AI API Key'
    //                 value={apiKey}
    //                 setValue={setApiKey}
    //                 placeholder='Enter Api key'
    //                 onSubmit={() => apiKey ? setOpenAI_apiKey(apiKey) : null}
    //                 onCancel={() => openAI_apiKey ? setApiKey(openAI_apiKey) : setApiKey('')}
    //                 buttonText='Save'
    //             />


    //         </div>
    //     )
    // }, [apiKey, setApiKey, setOpenAI_apiKey, chatUsername, setChatUsername])

    // const advancedTab = useMemo(() => {
    //     return (
    //         <div className={`${styles['tab-page-container']}`}>
    //             <TextInput
    //                 title='Message Thread ID'
    //                 value={newThreadId}
    //                 setValue={setNewThreadId}
    //                 placeholder='Enter current thread ID...'
    //                 onSubmit={() => newThreadId ? setCurrentThreadId(newThreadId) : null}
    //                 onCancel={() => currentThreadId ? setNewThreadId(currentThreadId) : setCurrentThreadId('')}
    //                 buttonText='Save'
    //             />


    //         </div>
    //     )
    // }, [setCurrentThreadId, currentThreadId, newThreadId, setNewThreadId])

    // const tabsData = useMemo(() => {
    //     return [
    //         {
    //             title: 'General',
    //             component: generalTab
    //         },
    //         {
    //             title: 'Bots',
    //             component: botsTab
    //         },
    //         {
    //             title: 'Advanced',
    //             component: advancedTab
    //         },
    //     ]
    // }, [generalTab, botsTab])

    const horizontalTabs = useCallback(() => {
        return (
            <div className={`${styles['tabs']}`}>
                {/* <div className={`${styles['tabs-buttons']}`}>
                    {tabsData.map((tabData, index) => (
                        <button type='button' onClick={() => setCurrentTabIndex(index)} className={`${styles['tab-button']} ${index === currentTabIndex ? styles['tab-button-current'] : ''}`}>{tabData.title}</button>
                    ))}
                </div>
                {tabsData[currentTabIndex].component} */}
            </div>
        )
    }, [currentTabIndex])

    useEffect(() => {
        setNewThreadId(currentThreadId)
    }, [currentThreadId])


    return (
        <div >
            <div className={`${styles['modal-background']} ${isMainChatModalVisible ? styles['modal-background-open'] : ''}`} />
            <div className={`${styles['sliding-container']} ${isMainChatModalVisible ? styles['sliding-container-open'] : ''}`}>
                <button type='button' onClick={() => setIsMainChatModalVisible(false)} className={`${styles['clickable-background']}`} />
                <div className={`${styles['main-chat-content']}`}>
                    <div className={`${styles['close-button-container']}`}>
                        <button type='button' onClick={() => setIsMainChatModalVisible(false)} className={`${styles['close-button']}`}>+</button>
                    </div>
                    {/* {horizontalTabs()} */}
                </div>
            </div>

        </div>
    )
}