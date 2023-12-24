'use client'

import React, { useCallback, useEffect, useState } from 'react';
import OpenAI from "openai";
import { Chat, TranslateChatMessagesProps } from '@/shared/chat/translate-chat';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { PageWrapper } from '@/shared/page-wrapper/page-wrapper';
import { SettingsMenu } from '@/shared/settings-menu/translate-settings-menu';
import { useChatSettings } from '@/providers/chat-settings-provider/chat-settings-provider';
import { SettingsModal } from '@/shared/settings-modal/settings-modal';
import MicRecorder from 'mic-recorder-to-mp3';

const recorder = new MicRecorder({ bitRate: 128 });


export default function TranslateScreen() {
    const [isNotHoveringChat, setIsNotHoveringChat] = useState(false);
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<TranslateChatMessagesProps[]>([
        { 'role': 'System', 'content': 'Welcome to the best and newest translator powered by AI' }
    ]);

    // RECORDING SETTINGS: 
    const [isRecordingFirstToSecond, setIsRecordingFirstToSecond] = useState(false);
    const [isRecordingSecondToFirst, setIsRecordingSecondToFirst] = useState(false);
    const [state, setState] = React.useState({
        isRecording: false,
        blobURL: '',
        isBlocked: false,
        trackProgress: 0,
    });
    let musicRef = React.useRef(null);
    let intervalRef = React.useRef(null);

    React.useEffect(() => {
        navigator.mediaDevices.getUserMedia(
            { audio: true },
        ).then(() => {
            console.log('Permission Granted');
            // setState((prevState) => { ...prevState, isBlocked: false });
        }).catch(() => {
            console.log('Permission Denied');
            // setState({ isBlocked: true });
        })

    }, []);

    const {
        bots,
        setBots,
        openAI_apiKey,
        isSettingsMenuOpen,
        setIsSettingsMenuOpen,
        currentBot,
        setCurrentBot,
        currentThreadId,
        setCurrentThreadId,
    } = useChatSettings();

    const openai = new OpenAI({ apiKey: openAI_apiKey, dangerouslyAllowBrowser: true });

    // TRANSLATOR FUNCTIONS

    const stopTranslateFirstToSecond = useCallback(async () => {
        recorder
            .stop()
            .getMp3().then((props) => {
                const [buffer, blob] = props
                console.log('stopped', props)
                // do what ever you want with buffer and blob
                // Example: Create a mp3 file and play
                const file = new File(buffer, 'me-at-thevoice.mp3', {
                    type: blob.type,
                    lastModified: Date.now()
                });

                openai.audio.translations.create({
                    file,
                    model: 'whisper-1',
                    prompt: 'Translate from English to French.'
                }).then((res) => {
                    console.log('whisper response', res)
                    const newText = res.text
                    const cloneMessages = messages.slice()
                    cloneMessages.push({ role: 'French to English', content: newText })
                    setMessages(cloneMessages)

                }).catch((err) => {
                    console.log('whisper error', err)

                })
                const player = new Audio(URL.createObjectURL(file));
                player.play();


            }).catch((e) => {
                alert('We could not retrieve your message');
                console.log(e);
            });


    }, [recorder, openai]);

    const handleTranslateFirstToSecond = useCallback(() => {
        // setMessages([])
        // setCurrentThreadId(undefined)
        if (isRecordingFirstToSecond) {
            setIsRecordingFirstToSecond(false)

            // STOP RECORDING
            stopTranslateFirstToSecond()
            // .then(() => console.log('stopped')).catch(() => console.log("Error trying to stop"))


            // Translate
            // Save Message
        } else {
            setIsRecordingFirstToSecond(true)
            // START RECORDING
            recorder.start().then(() => {
                // something else
                console.log('recording!!')
            }).catch((e) => {
                console.error(e);
            });



            // Every 0.25 seconds it should translate / transcribe

        }
    }, [isRecordingFirstToSecond, stopTranslateFirstToSecond])

    const handleTranslateSecondToFirst = useCallback(() => {
        // setMessages([])
        // setCurrentThreadId(undefined)
    }, [])

    return (
        <PageWrapper>
            <SettingsMenu
                isOpen={isSettingsMenuOpen}
                setIsOpen={setIsSettingsMenuOpen}
                bots={bots}
                isHovering={isNotHoveringChat}
                setIsHovering={setIsNotHoveringChat}
                // onSelectedBot={() => null}
                currentBot={currentBot}
            />
            {/* {currentBot ? ( */}
            <Chat
                translateMessages={messages}
                title={"Enora Alpha v0.0.1"}
                // onGenerateResponse={addMessageToThread}
                inputText={inputText}
                // onTextChange={handleInputChange}
                // onRead={() => handleReadLastMessage(messages)}
                isHovering={isNotHoveringChat}
                setIsHovering={setIsNotHoveringChat}
                // onCreateNewThread={createThread}
                onTranslateFirstToSecond={handleTranslateFirstToSecond}
                currentBot={currentBot}
                isTranslatorView
            />
            {/* ) : <div />} */}

            <SettingsModal />

        </PageWrapper>
    );
}