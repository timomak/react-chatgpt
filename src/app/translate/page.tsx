import React, { } from 'react';
import HomeScreen from '@/components/home-screen/home-screen';
import TranslateScreen from '@/components/translate-screen/translate-screen';
// Load environment variables from .env.local
require('dotenv').config();

function Translate() {
    return (
        <>
            <TranslateScreen />
        </>
    );
}

export default Translate;