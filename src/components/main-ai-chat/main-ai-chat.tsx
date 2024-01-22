import { useChatSettings } from '@/providers/chat-settings-provider/chat-settings-provider';
import styles from './main-ai-chat.module.css'
import OpenAI from 'openai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TextInput } from '../../shared/text-input/text-input';
import { BotItem } from '../../shared/bot-item/bot-item';
import { InputMessage } from '@/shared/input-message/input-message';
import { MessageWindow } from '@/shared/messages-window/messages-window';
import { MessageViewProps } from '@/shared/message-view/message-view';
import MicRecorder from 'mic-recorder-to-mp3';
import { NavigationUI } from '@/shared/navigation-ui/navigation-ui';
interface MainAIChatProps {

}

const recorder = new MicRecorder({ bitRate: 128 });

export function MainAIChat({ }: MainAIChatProps) {
    const default_message: MessageViewProps = { variant: 'bot-text', text: 'Hello, how can I help you today?' };

    const {
        bots,
        setBots,
        chatUsername,
        setChatUsername,
        openAI_apiKey,
        setOpenAI_apiKey,
        isMainChatModalVisible,
        setIsMainChatModalVisible,
        currentThreadId,
        currentBot,
        setCurrentBot,
        setCurrentThreadId,

    } = useChatSettings();
    const openai = new OpenAI({ apiKey: openAI_apiKey, dangerouslyAllowBrowser: true });

    const [isRecording, setIsRecording] = useState(false)

    const [allMessages, setAllMessages] = useState<MessageViewProps[]>([
        {
            variant: 'loading-response',
        }
    ]);

    // MARK: Threads Logic
    // --------------------------------------

    const retrieveThreadMessages = useCallback(async (threadId: string, readLastMessage?: boolean) => {
        const threadMessages = await openai.beta.threads.messages.list(threadId);

        if (threadMessages.data.length > 0) {
            const tempMessages: MessageViewProps[] = []

            threadMessages.data.forEach((messageInData) => {
                const newMessage: MessageViewProps = { 'variant': messageInData.role === 'assistant' ? 'bot-text' : 'user-text', text: (messageInData.content[0] as any).text.value }
                tempMessages.push(newMessage)
            })
            tempMessages.push(default_message)
            setAllMessages(tempMessages.reverse())
        } else {
            setAllMessages([default_message])
        }
    }, [currentBot]);

    const handleThreadRunStatus = async (threadId: string, run: OpenAI.Beta.Threads.Runs.Run) => {
        let isComplete = false
        while (isComplete === false) {
            const threadMessages = await openai.beta.threads.runs.retrieve(threadId, run.id)
            if (threadMessages.status === 'completed') isComplete = true
        }

        retrieveThreadMessages(threadId, true)
    };

    const handleRunThread = useCallback(async (threadId: string) => {
        const runResponse = await openai.beta.threads.runs.create(threadId, {
            assistant_id: currentBot?.id || '',
        })
        handleThreadRunStatus(threadId, runResponse)

    }, [currentBot])

    const addMessageToThread = useCallback(async (newPromptInput: string) => {
        if (currentThreadId) {
            const addNewMessage = allMessages.slice();

            // MARK: Remove loading animation on chat
            const lastMessage = addNewMessage[addNewMessage.length - 1];
            if (lastMessage?.variant === 'loading-question') {
                addNewMessage.pop()
            }

            // Add new message from voice to chat.
            addNewMessage.push({ text: newPromptInput, variant: 'user-text' })
            addNewMessage.push({ variant: 'loading-response', text: newPromptInput })
            setAllMessages(addNewMessage)

            const threadMessages = await openai.beta.threads.messages.create(currentThreadId, {
                role: 'user',
                content: newPromptInput
            });

            handleRunThread(currentThreadId)
        }
    }, [currentThreadId, handleRunThread, allMessages, setAllMessages, openai])

    const createThread = async () => {
        const newThread = await openai.beta.threads.create();
        setCurrentThreadId(newThread.id)
    };

    // MARK: Recording Logic
    // --------------------------------------
    const handleStartRecording = useCallback(() => {
        // START RECORDING
        recorder.start().then(() => {
            const cloneMessages = allMessages.slice();

            // Add new message from voice to chat.
            cloneMessages.push({ text: '', variant: 'loading-question' })
            setAllMessages(cloneMessages)
        }).catch((e) => {
            console.error(e);
        });
    }, [allMessages, setAllMessages]);

    const handleStopRecording = useCallback(async () => {
        recorder
            .stop()
            .getMp3().then((props) => {
                const [buffer, blob] = props
                // do what ever you want with buffer and blob
                // Example: Create a mp3 file and play
                const file = new File(buffer, 'me-at-thevoice.mp3', {
                    type: blob.type,
                    lastModified: Date.now()
                });

                openai.audio.transcriptions.create({
                    file,
                    model: 'whisper-1',
                    // prompt: 'Detect Any language and transcribe the translation to English.'
                }).then((res) => {
                    const newText = res.text

                    addMessageToThread(newText);
                }).catch((err) => {
                    console.log('whisper error', err)

                })
            }).catch((e) => {
                alert('We could not retrieve your message');
                console.log(e);
            });
    }, [recorder, openai, setAllMessages, allMessages, addMessageToThread]);

    const handleToggleIsRecording = () => {
        if (isRecording) {
            handleStopRecording();
        } else {
            handleStartRecording();
        }
        setIsRecording((prevState) => !prevState)
    };

    useEffect(() => {
        if (currentBot && currentThreadId) retrieveThreadMessages(currentThreadId)

        else if (currentBot && currentThreadId === undefined) createThread();
    }, [currentBot, currentThreadId]);

    return (
        <div >
            <div className={`${styles['modal-background']} ${isMainChatModalVisible ? styles['modal-background-open'] : ''}`} />
            <div className={`${styles['sliding-container']} ${isMainChatModalVisible ? styles['sliding-container-open'] : ''}`}>
                <button type='button' onClick={() => setIsMainChatModalVisible(false)} className={`${styles['clickable-background']}`} />
                <div className={`${styles['main-chat-content']}`}>
                    <NavigationUI leftActionElement={'back-button'} onLeftActionPressed={() => setIsMainChatModalVisible(false)} />
                    <MessageWindow messages={allMessages} />
                    <InputMessage isRecording={isRecording} onToggleIsRecording={handleToggleIsRecording} />
                </div>
            </div>

        </div>
    )
}