import Image from 'next/image';
import Icons from '../icons/icons';
import styles from './audio-recording-animation.module.css'

export interface AudioRecordingAnimationProps {
    isRecording?: boolean;
    onToggleIsRecording?: () => void;
}

export function AudioRecordingAnimation({
    isRecording,
    onToggleIsRecording,
}: AudioRecordingAnimationProps) {
    return (
        <div className={styles["loader"]}>
            <button className={`${styles["record-container"]} ${isRecording ? styles["wave-container"] : styles["mic-container"]} glow-component ${isRecording ? styles['record-container-visible-glow'] : ''}`} onClick={onToggleIsRecording}>
                {isRecording ?
                    (
                        <svg id="wave" className={styles["wave"]} data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 38.05">
                            <title>Audio Wave</title>
                            <path id="Line_1" className={styles["line_1"]} data-name="Line 1" d="M0.91,15L0.78,15A1,1,0,0,0,0,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H0.91Z" />
                            <path id="Line_2" className={styles["line_2"]} data-name="Line 2" d="M6.91,9L6.78,9A1,1,0,0,0,6,10V28a1,1,0,1,0,2,0s0,0,0,0V10A1,1,0,0,0,7,9H6.91Z" />
                            <path id="Line_3" className={styles["line_3"]} data-name="Line 3" d="M12.91,0L12.78,0A1,1,0,0,0,12,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H12.91Z" />
                            <path id="Line_4" className={styles["line_4"]} data-name="Line 4" d="M18.91,10l-0.12,0A1,1,0,0,0,18,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H18.91Z" />
                            <path id="Line_5" className={styles["line_5"]} data-name="Line 5" d="M24.91,15l-0.12,0A1,1,0,0,0,24,16v6a1,1,0,0,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H24.91Z" />
                            <path id="Line_6" className={styles["line_6"]} data-name="Line 6" d="M30.91,10l-0.12,0A1,1,0,0,0,30,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H30.91Z" />
                            <path id="Line_7" className={styles["line_7"]} data-name="Line 7" d="M36.91,0L36.78,0A1,1,0,0,0,36,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H36.91Z" />
                            <path id="Line_8" className={styles["line_8"]} data-name="Line 8" d="M42.91,9L42.78,9A1,1,0,0,0,42,10V28a1,1,0,1,0,2,0s0,0,0,0V10a1,1,0,0,0-1-1H42.91Z" />
                            <path id="Line_9" className={styles["line_9"]} data-name="Line 9" d="M48.91,15l-0.12,0A1,1,0,0,0,48,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H48.91Z" />
                        </svg>
                    ) : (
                        <div>
                            <Image className={styles['record-icon']} priority alt={`recording-mic-icon`} src={Icons.MicIcon} />
                        </div>
                    )}

            </button>
        </div>
    )
}