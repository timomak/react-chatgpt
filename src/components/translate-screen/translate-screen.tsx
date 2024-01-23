'use client'

import React, { useCallback, useEffect, useState } from 'react';
import OpenAI from "openai";
import { Chat, TranslateChatMessagesProps } from '@/shared/chat/chat';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { PageWrapper } from '@/shared/page-wrapper/page-wrapper';
import { SettingsMenu } from '@/components/settings-menu/settings-menu';
import { useChatSettings } from '@/providers/chat-settings-provider/chat-settings-provider';
import { SettingsModal } from '@/components/settings-modal/settings-modal';
import MicRecorder from 'mic-recorder-to-mp3';
import { MainAIChat } from '../main-ai-chat/main-ai-chat';

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

    const {
        bots,
        setBots,
        openAI_apiKey,
        isSettingsMenuOpen,
        setIsSettingsMenuOpen,
        setIsMainChatModalVisible,
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
                    prompt: 'Detect Any language and transcribe the translation to English.'
                }).then((res) => {
                    console.log('whisper response', res)
                    const newText = res.text
                    const cloneMessages = messages.slice()
                    cloneMessages.push({ role: 'Translated to English', content: newText, variant: 'variant-1' })
                    setMessages(cloneMessages)

                }).catch((err) => {
                    console.log('whisper error', err)

                })
                // MARK: Play audio
                // const player = new Audio(URL.createObjectURL(file));
                // player.play();


            }).catch((e) => {
                alert('We could not retrieve your message');
                console.log(e);
            });


    }, [recorder, openai, setMessages]);

    const handleTranslateFirstToSecond = useCallback(() => {
        if (isRecordingSecondToFirst) return;
        if (isRecordingFirstToSecond) {
            setIsRecordingFirstToSecond(false)

            // STOP RECORDING
            stopTranslateFirstToSecond();
        } else {
            // START RECORDING
            setIsRecordingFirstToSecond(true)
            recorder.start().then(() => {
                // something else
                console.log('recording!!')
            }).catch((e) => {
                console.error(e);
            });
            // Every 0.25 seconds it should translate / transcribe

        }
    }, [isRecordingFirstToSecond, stopTranslateFirstToSecond, isRecordingSecondToFirst]);

    // TRANSLATOR FUNCTIONS
    const stopTranslateSecondToFirst = useCallback(async () => {
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

                openai.audio.transcriptions.create({
                    file,
                    model: 'whisper-1',
                    prompt: 'Translate from English to French.'
                }).then((res) => {

                    console.log('whisper response', res)
                    const newText = res.text

                    console.log("Chat GPT PROMPT: ", `Translate the following prompt to French: ${newText}`)
                    openai.chat.completions.create({
                        // prompt: `Translate the following prompt to French: ${newText}`,
                        model: 'gpt-3.5-turbo',
                        messages: [
                            { "role": "system", "content": "You are the perfect translator program. You can take any text in any language and translate it to French. You only translate to the French language. You will take whatever input you're given and translate it as most accurately as possible without adding any text that isn't necessary to the translation " },
                            { "role": "user", "content": `Translate the following prompt to French: ${newText}` }
                        ]
                    }).then((response) => {
                        console.log('gpt-3.5-turbo response', response)

                        const translatedText = response.choices[0].message.content

                        const cloneMessages = messages.slice()
                        cloneMessages.push({ role: 'Translated to French', content: translatedText || `TRANSLATION ERROR | ORIGINAL PROMPT: Translate the following prompt to French: ${newText}`, variant: 'variant-2' })
                        setMessages(cloneMessages)

                    }).catch((error) => {
                        console.log('gpt-3.5-turbo error', error)

                    })
                }).catch((err) => {
                    console.log('whisper error', err)

                })
                // MARK: Play audio
                // const player = new Audio(URL.createObjectURL(file));
                // player.play();


            }).catch((e) => {
                alert('We could not retrieve your message');
                console.log(e);
            });
    }, [recorder, openai, setMessages]);

    const handleTranslateSecondToFirst = useCallback(() => {
        if (isRecordingFirstToSecond) return;
        if (isRecordingSecondToFirst) {
            setIsRecordingSecondToFirst(false)

            // STOP RECORDING
            stopTranslateSecondToFirst();
        } else {
            // START RECORDING
            setIsRecordingSecondToFirst(true)
            recorder.start().then(() => {
                // something else
                console.log('recording!!')
            }).catch((e) => {
                console.error(e);
            });
            // TODO: Every 0.25 seconds it should translate / transcribe

        }
    }, [isRecordingFirstToSecond, stopTranslateFirstToSecond, isRecordingSecondToFirst])

    useEffect(() => {
        setIsSettingsMenuOpen(false);
        setIsMainChatModalVisible(false);
    }, [])

    useEffect(() => {
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

    return (
        <PageWrapper>
            <SettingsMenu
                isHovering={isNotHoveringChat}
                setIsHovering={setIsNotHoveringChat}
                isTranslatorView
                hasReturnHomeButton
            />
            <Chat
                translateMessages={messages}
                title={"Translator"}
                inputText={inputText}
                isHovering={isNotHoveringChat}
                setIsHovering={setIsNotHoveringChat}
                onTranslateFirstToSecond={handleTranslateFirstToSecond}
                onTranslateSecondToFirst={handleTranslateSecondToFirst}
                isRecordingFirstToSecond={isRecordingFirstToSecond}
                isRecordingSecondToFirst={isRecordingSecondToFirst}
                currentBot={currentBot}
                isTranslatorView
            />

            <SettingsModal />
            <MainAIChat />
        </PageWrapper>
    );
}