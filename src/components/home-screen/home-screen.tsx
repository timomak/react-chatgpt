'use client'

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import OpenAI from "openai";
import Link from 'next/link';
import { Chat } from '@/shared/chat/chat';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { PageWrapper } from '@/shared/page-wrapper/page-wrapper';

// Load environment variables from .env.local
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY
const openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });

const assistantId = 'asst_d1Pin7e2l00X3KyHQxPUmSY3'
const messageThreadId = 'thread_xy6I8n0Ot8G8P6Dod1DXa32R'

export default function HomeScreen() {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);

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

        console.log("Thread runResponse:", runResponse)
        handleThreadRunStatus(threadId, runResponse)
    }

    const addMessageToThread = async () => {
        const threadMessages = await openai.beta.threads.messages.create(messageThreadId, {
            role: 'user',
            content: inputText
        });

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


    useEffect(() => {
        retrieveThreadMessages(messageThreadId)
    }, [])

    return (
        <PageWrapper>
            <Link href="/">
                <div className='button'>Go To DEFAULT CHAT</div>
            </Link>
            <Chat
                messages={messages}
                title={"Assistant"}
                onGenerateResponse={addMessageToThread}
                inputText={inputText}
                onTextChange={handleInputChange}
                onRead={() => handleReadLastMessage(messages)}
            />
        </PageWrapper>
    );
}