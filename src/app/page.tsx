'use client'

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import OpenAI from "openai";

// Load environment variables from .env.local
require('dotenv').config();

const apiKeyENV = process.env.OPENAI_API_KEY
const openai = new OpenAI({ apiKey: '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', dangerouslyAllowBrowser: true });

const DEFAULT_CHAT_MESSAGE = [
  { "role": "system", "content": "You are a helpful assistant." },
]

function Home() {

  const [inputText, setInputText] = useState('');

  const [messages, setMessages] = useState(DEFAULT_CHAT_MESSAGE);


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


  const navigateToAssistant = async () => {
  }



  const renderMessages = () => {
    return (
      messages.map((message, index) => (
        <div key={`new-message-id-${index}`} className='message'>
          <div className={`${message.role}`}>{`${message.role}:`}</div>
          <div>{message.content}</div>
        </div>
      ))
    )
  }

  return (
    <div className='main-page'>
      <h1>OpenAI CHAT GPT-5</h1>
      <textarea
        className='textarea'
        placeholder="Enter a prompt..."
        value={inputText}
        onChange={handleInputChange}
      />
      <button className='button' onClick={generateResponse}>Generate Response</button>
      <button className='button' onClick={clearChat}>Clear</button>
      <button className='button' onClick={navigateToAssistant}>Go To Assistant</button>

      <div className='response-area'>
        <strong>Response:</strong>
        <div>{renderMessages()}</div>
      </div>
    </div>
  );
}

export default Home;