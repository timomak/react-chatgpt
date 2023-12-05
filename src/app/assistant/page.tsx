'use client'

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import OpenAI from "openai";
import Link from 'next/link';
import { Chat, Message } from '@/shared/chat/chat';

// Load environment variables from .env.local
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY
const openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });

const assistantId = 'asst_d1Pin7e2l00X3KyHQxPUmSY3'
const messageThread = 'thread_3pcIx0DB7MDv9Dy8TH1glrDj'

export default function Page() {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);

    const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setInputText(e.target.value);
    };


    const retrieveThreadMessages = async (threadId: string) => {
        const threadMessages = await openai.beta.threads.messages.list(threadId, { limit: 5 });

        if (threadMessages.data.length > 0) {
            const allMessages: Message[] = []

            threadMessages.data.forEach((messageInData) => {
                const newMessage: Message = { role: messageInData.role, content: (messageInData.content[0] as any).text.value }
                allMessages.push(newMessage)
            })
            setMessages(allMessages.reverse())
            setInputText('')
        }
    }

    const handleThreadRunStatus = async (threadId: string, run: OpenAI.Beta.Threads.Runs.Run) => {
        let isComplete = false
        while (isComplete === false) {
            const threadMessages = await openai.beta.threads.runs.retrieve(threadId, run.id)
            if (threadMessages.status === 'completed') isComplete = true
        }

        retrieveThreadMessages(threadId)
    }


    const handleRunThread = async (threadId: string) => {
        const runResponse = await openai.beta.threads.runs.create(threadId, {
            assistant_id: assistantId,
        })

        console.log("Thread runResponse:", runResponse)
        handleThreadRunStatus(threadId, runResponse)
        // retrieveThreadMessages(messageThread)
    }

    const addMessageToThread = async () => {
        const threadMessages = await openai.beta.threads.messages.create(messageThread, {
            role: 'user',
            content: inputText
        });

        const addNewMessage = messages.slice(0);
        addNewMessage.push({ role: 'user', content: inputText })
        setMessages(addNewMessage)

        handleRunThread(messageThread)
    }

    const retrieveThread = async (threadId: string) => {
        const thread = await openai.beta.threads.retrieve(threadId);
    }

    const createThread = async (userName: string, assistantName = 'sky') => {
        const assistants = await openai.beta.assistants.list();
        const currentAssistant = assistants.data.find((aiAssistant) => aiAssistant.name?.toLowerCase() === assistantName)

        const newThread = await openai.beta.threads.create({ metadata: { 'assistantId': currentAssistant?.id, currentUser: userName } });
    }


    useEffect(() => {
        // createThread('Timo')
        // retrieveThread("thread_3pcIx0DB7MDv9Dy8TH1glrDj")
        retrieveThreadMessages(messageThread)
    }, [])


    const generateResponse = async () => {
        const addNewMessage = messages.slice(0);
        addNewMessage.push({ role: 'user', content: inputText })

        const completion = await openai.chat.completions.create({
            messages: addNewMessage as any,
            model: 'gpt-4',
        });

        const addResponseMessage = addNewMessage.slice(0);
        addResponseMessage.push({ role: 'assistant', content: `${completion.choices[0].message.content}` })
        setMessages(addResponseMessage)
    };

    const clearChat = async () => {
        setMessages([])
    }

    return (
        <>
            <Link href="/">
                <div className='button'>Go To DEFAULT CHAT</div>
            </Link>
            <Chat
                messages={messages}
                title={"Assistant"}
                onGenerateResponse={addMessageToThread}
                inputText={inputText}
                onTextChange={handleInputChange}
                onClearChat={clearChat} />
        </>
    );
}