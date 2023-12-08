'use client'

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import OpenAI from "openai";
import Link from 'next/link';
import { Chat } from '@/shared/chat/chat';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { PageWrapper } from '@/shared/page-wrapper/page-wrapper';
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