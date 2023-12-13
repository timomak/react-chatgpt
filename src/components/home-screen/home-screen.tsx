'use client'

import React, { useEffect, useState } from 'react';
import OpenAI from "openai";
import { Chat } from '@/shared/chat/chat';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { PageWrapper } from '@/shared/page-wrapper/page-wrapper';
import { SettingsMenu } from '@/shared/settings-menu/settings-menu';
import { useChatSettings } from '@/providers/chat-settings-provider/chat-settings-provider';


const apiKey = process.env.OPENAI_API_KEY
const openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });

const assistantId = 'asst_d1Pin7e2l00X3KyHQxPUmSY3'
const messageThreadId = "thread_2pKwpnNoVpT7SYrBtetkuuaI"

export default function HomeScreen() {
    const [isNotHoveringChat, setIsNotHoveringChat] = useState(false);
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
    const [bots, setBots] = useState<OpenAI.Beta.Assistants.Assistant[] | undefined>([]);
    const { isSettingsMenuOpen, setIsSettingsMenuOpen } = useChatSettings()

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

    const retrieveThreadMessages = async (threadId: string, readLastMessage?: boolean) => {
        const threadMessages = await openai.beta.threads.messages.list(threadId);

        if (threadMessages.data.length > 0) {
            const allMessages: ChatCompletionMessageParam[] = []

            threadMessages.data.forEach((messageInData) => {
                const newMessage: ChatCompletionMessageParam = { role: messageInData.role, content: (messageInData.content[0] as any).text.value }
                allMessages.push(newMessage)
            })
            setMessages(allMessages.reverse())
            setInputText('')

            if (readLastMessage) {
                handleReadLastMessage(allMessages)
            }
        } else {
            console.log("No messages yet!")
        }
    }

    const handleThreadRunStatus = async (threadId: string, run: OpenAI.Beta.Threads.Runs.Run) => {
        let isComplete = false
        while (isComplete === false) {
            const threadMessages = await openai.beta.threads.runs.retrieve(threadId, run.id)
            if (threadMessages.status === 'completed') isComplete = true
        }

        retrieveThreadMessages(threadId, true)
    }


    const handleRunThread = async (threadId: string) => {
        const runResponse = await openai.beta.threads.runs.create(threadId, {
            assistant_id: assistantId,
        })
        handleThreadRunStatus(threadId, runResponse)
    }

    const addMessageToThread = async () => {
        const threadMessages = await openai.beta.threads.messages.create(messageThreadId, {
            role: 'user',
            content: inputText
        });
        setInputText('')

        const addNewMessage = messages.slice(0);
        addNewMessage.push({ role: 'user', content: inputText })
        setMessages(addNewMessage)

        handleRunThread(messageThreadId)
    }

    const retrieveThread = async (threadId: string) => {
        const thread = await openai.beta.threads.retrieve(threadId);
    }

    const createThread = async (userName: string, assistantName = 'sky') => {
        const assistants = await openai.beta.assistants.list();
        const currentAssistant = assistants.data.find((aiAssistant) => aiAssistant.name?.toLowerCase() === assistantName)

        const newThread = await openai.beta.threads.create({ metadata: { 'assistantId': currentAssistant?.id, currentUser: userName } });
        console.log("newThread", newThread)
    }

    const retrieveAllAssistants = async () => {
        const assistants = await openai.beta.assistants.list();
        setBots(assistants.data)
    }


    useEffect(() => {
        retrieveAllAssistants()
        // createThread("Timo")
        retrieveThreadMessages(messageThreadId)
    }, [])

    return (
        <PageWrapper>
            <SettingsMenu
                isOpen={isSettingsMenuOpen}
                setIsOpen={setIsSettingsMenuOpen}
                bots={bots}
                isHovering={isNotHoveringChat}
                setIsHovering={setIsNotHoveringChat}
            />
            <Chat
                messages={messages}
                title={"Enora Alpha v0.0.1"}
                onGenerateResponse={addMessageToThread}
                inputText={inputText}
                onTextChange={handleInputChange}
                onRead={() => handleReadLastMessage(messages)}
                isHovering={isNotHoveringChat}
                setIsHovering={setIsNotHoveringChat}
            />
        </PageWrapper>
    );
}