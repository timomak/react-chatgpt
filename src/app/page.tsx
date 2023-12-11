import React, { } from 'react';
import HomeScreen from '@/components/home-screen/home-screen';

// Load environment variables from .env.local
require('dotenv').config();

function Home() {
  return (
    <>
      <HomeScreen />
    </>
  );
}

export default Home;