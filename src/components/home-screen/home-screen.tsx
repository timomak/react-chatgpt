'use client'

import React, { useCallback, useEffect, useState } from 'react';
import OpenAI from "openai";
import { Chat } from '@/shared/chat/chat';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { PageWrapper } from '@/shared/page-wrapper/page-wrapper';
import { SettingsMenu } from '@/components/settings-menu/settings-menu';
import { useChatSettings } from '@/providers/chat-settings-provider/chat-settings-provider';
import { SettingsModal } from '@/components/settings-modal/settings-modal';
import { MainAIChat } from '@/components/main-ai-chat/main-ai-chat';

export default function HomeScreen() {
    const [isNotHoveringChat, setIsNotHoveringChat] = useState(false);
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);

    const {
        bots,
        setBots,
        openAI_apiKey,
        isSettingsMenuOpen,
        setIsSettingsMenuOpen,
        currentBot,
        setCurrentBot,
        currentThreadId,
        setCurrentThreadId,
    } = useChatSettings();

    const openai = new OpenAI({ apiKey: openAI_apiKey, dangerouslyAllowBrowser: true });


    const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setInputText(e.target.value);
    };

    const handleReadLastMessage = (currentMessages: ChatCompletionMessageParam[]) => {
        const tempMessages = currentMessages.slice()
        const lastElement = tempMessages.pop()
        if (lastElement && lastElement.content) {
            const msg = new SpeechSynthesisUtterance()
            msg.text = lastElement ? lastElement.content as string : 'No messages'
            speechSynthesis.getVoices()
            speechSynthesis.speak(msg)
        }
    }

    const retrieveThreadMessages = useCallback(async (threadId: string, readLastMessage?: boolean) => {
        const threadMessages = await openai.beta.threads.messages.list(threadId);

        if (threadMessages.data.length > 0) {
            const allMessages: ChatCompletionMessageParam[] = []

            threadMessages.data.forEach((messageInData) => {
                const newMessage: ChatCompletionMessageParam = { role: messageInData.role, content: (messageInData.content[0] as any).text.value }
                allMessages.push(newMessage)
            })
            setMessages(allMessages.reverse())
            setInputText('')

            // if (readLastMessage) {
            //     handleReadLastMessage(allMessages)
            // }
        } else {
            const newMessage: ChatCompletionMessageParam = { role: 'assistant', content: `My instructions: \n${currentBot?.instructions}` }
            setMessages([newMessage])
        }
    }, [currentBot])

    const handleThreadRunStatus = async (threadId: string, run: OpenAI.Beta.Threads.Runs.Run) => {
        let isComplete = false
        while (isComplete === false) {
            const threadMessages = await openai.beta.threads.runs.retrieve(threadId, run.id)
            if (threadMessages.status === 'completed') isComplete = true
        }

        retrieveThreadMessages(threadId, true)
    }


    const handleRunThread = useCallback(async (threadId: string) => {
        const runResponse = await openai.beta.threads.runs.create(threadId, {
            assistant_id: currentBot?.id,
        })
        handleThreadRunStatus(threadId, runResponse)

    }, [currentBot])

    const addMessageToThread = async () => {
        if (currentThreadId) {
            const threadMessages = await openai.beta.threads.messages.create(currentThreadId, {
                role: 'user',
                content: inputText
            });
            setInputText('')

            const addNewMessage = messages.slice(0);
            addNewMessage.push({ role: 'user', content: inputText })
            setMessages(addNewMessage)

            handleRunThread(currentThreadId)
        }
    }

    const createThread = async () => {
        const newThread = await openai.beta.threads.create();
        console.log("New thread: ", newThread)
        setCurrentThreadId(newThread.id)
    }

    const handleBotSelected = useCallback((bot: OpenAI.Beta.Assistants.Assistant) => {
        setCurrentBot(bot)
        handleClearChat()
    }, [])

    const handleClearChat = useCallback(() => {
        setMessages([])
        setCurrentThreadId(undefined)
    }, [])

    const retrieveAllAssistants = async () => {
        const assistants = await openai.beta.assistants.list();
        setBots(assistants.data)

        const swarmAI = assistants.data.find((assistant) => assistant.name?.toLocaleLowerCase().includes("swarm"))
        if (swarmAI) {
            setCurrentBot(swarmAI)
        }
    }

    useEffect(() => {
        if (currentBot && currentThreadId) retrieveThreadMessages(currentThreadId)
    }, [currentBot, currentThreadId])

    useEffect(() => {
        retrieveAllAssistants()
    }, [])

    return (
        <PageWrapper>
            <SettingsMenu
                isHovering={isNotHoveringChat}
                setIsHovering={setIsNotHoveringChat}
                onSelectedBot={handleBotSelected}
                isHomeView
                hideTopChevronButton
            />
            {/* {currentBot ? (
                <Chat
                    messages={messages}
                    title={"Enora Alpha v0.0.1"}
                    onGenerateResponse={addMessageToThread}
                    inputText={inputText}
                    onTextChange={handleInputChange}
                    onRead={() => handleReadLastMessage(messages)}
                    isHovering={isNotHoveringChat}
                    setIsHovering={setIsNotHoveringChat}
                    onCreateNewThread={createThread}
                    currentBot={currentBot}
                />
            ) : <div />} */}
            <SettingsModal />
            <MainAIChat />
        </PageWrapper>
    );
}