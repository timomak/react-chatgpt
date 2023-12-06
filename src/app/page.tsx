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

const DEFAULT_CHAT_MESSAGE: ChatCompletionMessageParam[] = [
  { "role": "system", "content": "You are a helpful assistant." },
]

function Home() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>(DEFAULT_CHAT_MESSAGE);

  const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setInputText(e.target.value);
  };

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
    setMessages(DEFAULT_CHAT_MESSAGE)
  }

  return (
    <PageWrapper>
      <div className='vertical-list hard-center flex-align-center'>
        <Link href="/assistant">
          <div className='glow-button flex-align-center'>Assistants</div>
        </Link>
        <Link href="/chat">
          <div className='glow-button flex-align-center'>Chat with Expert</div>
        </Link>
      </div>
    </PageWrapper>
  );
}

export default Home;