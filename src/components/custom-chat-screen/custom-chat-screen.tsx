'use client'

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import OpenAI from "openai";
import Link from 'next/link';
import { Chat } from '@/shared/chat/chat';
import { ChatCompletionCreateParamsBase, ChatCompletionMessageParam } from 'openai/resources/chat/completions.mjs';
import { PageWrapper } from '@/shared/page-wrapper/page-wrapper';

// Load environment variables from .env.local
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY
const openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });

export interface CustomChatScreenProps {
    model: ChatCompletionCreateParamsBase['model'];
    instructionsPrompt: string,
}

function CustomChatScreen({
    model,
    instructionsPrompt,
}: CustomChatScreenProps) {
    const [inputText, setInputText] = useState('');
    const defaultPrompt: ChatCompletionMessageParam[] = [{ "role": "system", "content": instructionsPrompt }]
    const [messages, setMessages] = useState<ChatCompletionMessageParam[]>(defaultPrompt);

    const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setInputText(e.target.value);
    };

    const generateResponse = async () => {
        const addNewMessage = messages.slice(0);
        addNewMessage.push({ role: 'user', content: inputText })
        setInputText('')


        const completion = await openai.chat.completions.create({
            messages: addNewMessage as any,
            model: model,
        });

        const addResponseMessage = addNewMessage.slice(0);
        addResponseMessage.push({ role: 'assistant', content: `${completion.choices[0].message.content}` })
        setMessages(addResponseMessage)
    };

    const clearChat = async () => {
        setMessages(defaultPrompt)
    }

    return (
        <PageWrapper>
            <Link href="/assistant">
                <div className='button'>Go To Assistant</div>
            </Link>
            <Chat
                messages={messages}
                title={"OpenAI CHAT GPT-5"}
                onGenerateResponse={generateResponse}
                inputText={inputText}
                onTextChange={handleInputChange}
                onClearChat={clearChat} />
        </PageWrapper>
    );
}

export default CustomChatScreen;