import { useState } from "react";
import { AudioRecordingAnimation, AudioRecordingAnimationProps } from "../audio-recording-animation/audio-recording-animation";

interface InputMessageProps extends AudioRecordingAnimationProps {

}

export function InputMessage({
    isRecording,
    onToggleIsRecording
}: InputMessageProps) {


    return (
        <AudioRecordingAnimation isRecording={isRecording} onToggleIsRecording={onToggleIsRecording} />
    )
}