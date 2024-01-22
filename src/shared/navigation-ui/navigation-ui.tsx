import { ReactElement, useCallback, useMemo } from 'react'
import styles from './navigation-ui.module.css'
import Image from 'next/image';
import Icons from '../icons/icons';

interface NavigationUIProps {
    leftActionElement?: 'back-button' | string | ReactElement;
    onLeftActionPressed?: () => void;
    centerActionElement?: string | 'down-chevron' | ReactElement;
    onCenterActionPressed?: () => void;
    rightActionElement?: string | ReactElement;
    onRightActionPressed?: () => void;
}

export function NavigationUI({
    leftActionElement,
    onLeftActionPressed,
    centerActionElement,
    onCenterActionPressed,
    rightActionElement,
    onRightActionPressed,
}: NavigationUIProps) {

    const renderRightElement = useMemo(() => {
        if (rightActionElement === undefined) {
            return (
                <div />
            )
        }

        if (String(rightActionElement)) {
            switch (rightActionElement) {
                default:
                    return (
                        <button className={styles['right-action-container']} onClick={onRightActionPressed}>
                            <div className={styles['right-action-text']}>
                                {rightActionElement}
                            </div>
                        </button>
                    )
            }
        }

        return (
            <button className={styles['right-action-container']} onClick={onRightActionPressed}>
                {rightActionElement}
            </button>
        )
    }, [onRightActionPressed, rightActionElement]);

    const renderLeftElement = useMemo(() => {
        if (leftActionElement === undefined) {
            return (
                <div />
            )
        }

        if (String(leftActionElement)) {
            switch (leftActionElement) {
                case 'back-button':

                    return (
                        // <button onClick={onLeftActionPressed}>
                        //     <Image className={styles['navigation-ui-left-button']} priority alt={`navigation-ui-left-button-image`} src={Icons.ChevronUp} />
                        // </button>
                        <div className={`${styles['close-button-container']}`}>
                            <button type='button' onClick={onLeftActionPressed} className={`${styles['close-button']}`}>+</button>
                        </div>
                    )

                default:
                    return (
                        <button className={styles['left-action-container']} onClick={onLeftActionPressed}>
                            <div className={styles['left-action-text']}>
                                {leftActionElement}
                            </div>
                        </button>
                    )
            }
        }

        return (
            <button className={styles['left-action-container']} onClick={onLeftActionPressed}>
                {leftActionElement}
            </button>
        )
    }, [onLeftActionPressed, leftActionElement]);

    const renderCenterElement = useMemo(() => {
        if (centerActionElement === undefined) {
            return (
                <div />
            )
        }

        if (String(centerActionElement)) {
            switch (centerActionElement) {
                case 'down-chevron':

                    return (
                        <button onClick={onCenterActionPressed}>
                            <Image className={styles['navigation-ui-center-button-chevron']} priority alt={`navigation-ui-center-button-image`} src={Icons.Bot1} />
                        </button>
                    )

                default:
                    return (
                        <button className={styles['center-action-container']} onClick={onCenterActionPressed}>
                            <div className={styles['center-action-text']}>
                                {centerActionElement}
                            </div>
                        </button>
                    )
            }
        }

        return (
            <button className={styles['center-action-container']} onClick={onCenterActionPressed}>
                {centerActionElement}
            </button>
        )
    }, [onCenterActionPressed, centerActionElement]);

    return (
        <div className={styles['navigation-ui-container']}>
            {renderLeftElement}
            {renderCenterElement}
            {renderRightElement}
        </div>
    )
}
