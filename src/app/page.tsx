import React, { } from 'react';
import HomeScreen from '@/components/home-screen/home-screen';
import { ChatSettingsProvider } from '@/providers/chat-settings-provider/chat-settings-provider';
// Load environment variables from .env.local
require('dotenv').config();

function Home() {
  return (
    <>
      <ChatSettingsProvider>
        <HomeScreen />
      </ChatSettingsProvider>
    </>
  );
}

export default Home;