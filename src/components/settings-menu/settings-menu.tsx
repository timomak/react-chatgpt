'use client'

import { Fragment, useCallback, useMemo } from 'react';
import Icons from '../../shared/icons/icons';
import styles from './settings-menu.module.css'
import OpenAI from 'openai';
import Image from 'next/image';
import { useChatSettings } from '@/providers/chat-settings-provider/chat-settings-provider';
import Link from 'next/link';

interface SettingsMenuProps {
    isHovering: boolean;
    setIsHovering: (anythingButChat: boolean) => void;
    onSelectedBot?: (bot: OpenAI.Beta.Assistants.Assistant) => void;
    isTranslatorView?: boolean;
    hasReturnHomeButton?: boolean;
    isHomeView?: boolean;
}

export function SettingsMenu({
    setIsHovering,
    onSelectedBot,
    isTranslatorView,
    hasReturnHomeButton = false,
    isHomeView = false,
}: SettingsMenuProps) {

    const {
        currentBot,
        bots,
        setIsMainChatModalVisible,
        isSettingsMenuOpen: isOpen,
        setIsSettingsMenuOpen: setIsOpen,
    } = useChatSettings();

    const {
        setIsSettingsModalOpen
    } = useChatSettings();

    const onToggleOpenCloseMenu = () => {
        if (isOpen) setIsOpen(false)
        else setIsOpen(true)
    }

    const onHover = () => {
        setIsHovering(true)
    }

    const onHoverEnded = () => {
        setIsHovering(false)
    }

    const renderReturnHomeButton = useCallback(() => {
        return (
            <Fragment key={`bots-list-bot-translate-screen`}>
                <Link className={`glow-component ${styles['bot']}`} href='/'>
                    <Image className={styles['bot-image']} priority alt={`bots-list-bot-translate-screen-image`} src={Icons.ReturnHomeIcon} />

                    <div className={styles['bot-name']}>{"Home"}</div>
                </Link>
            </Fragment>
        )
    }, [])

    const renderTranslatorBotButton = useCallback(() => {
        return (
            <Fragment key={`bots-list-bot-translator-bot`}>
                <Link className={`glow-component ${styles['bot']}`} href='/translate'>
                    <Image className={styles['bot-image']} priority alt={`bots-list-bot-translator-bot-image`} src={Icons.TranslatorIcon} />

                    <div className={styles['bot-name']}>{"Translator"}</div>
                </Link>
            </Fragment>
        )
    }, [])

    const renderOpenSettingsButton = useCallback(() => {
        return (
            <Fragment key={`bots-list-bot-open-settings`}>
                <a className={`glow-component ${styles['bot']}`} onClick={() => setIsSettingsModalOpen(true)}>
                    <Image className={styles['bot-image']} priority alt={`bots-list-bot-open-settings-image`} src={Icons.SettingsIcon} />
                    <div className={styles['bot-name']}>{"Settings"}</div>
                </a>
            </Fragment>
        )
    }, [])

    const renderCreateBotButton = useCallback(() => {
        return (
            <Fragment key={`bots-list-bot-manage-bot`}>
                <button className={`glow-component ${styles['bot']}`} onClick={() => setIsMainChatModalVisible(true)}>
                    <Image className={styles['bot-image']} priority alt={`bots-list-bot-manage-bot-image`} src={Icons.Bot1} />
                    <div className={styles['bot-name']}>{"Main Chat"}</div>
                </button>
            </Fragment>
        )
    }, [setIsMainChatModalVisible])

    const renderBots = useMemo(() => {
        return bots?.map((bot, index) => (
            <Fragment key={`bots-list-bot-${bot.id}`}>
                <button className={`glow-component ${styles['bot']} ${currentBot?.id === bot.id ? styles['glow-bot'] : ''}`} onClick={() => onSelectedBot ? onSelectedBot(bot) : () => null}>
                    <Image className={styles['bot-image']} priority alt={`bots-list-bot-${bot.name}-${index}`} src={Icons.Bot1} />

                    <div className={styles['bot-name']}>{bot.name}</div>
                    {/* <div className={styles['bot-description']}>{bot.model}</div> */}
                </button>
            </Fragment>
        )
        )
    }, [bots, currentBot])

    return (
        <div
            className={`${styles['settings-menu']} ${isOpen ? '' : styles['settings-menu-closed']}`}
            onMouseEnter={() => {
                onHover();
                setIsOpen(true);
            }} onMouseLeave={() => {
                onHoverEnded();
                setIsOpen(false);
            }}>
            <button onClick={onToggleOpenCloseMenu} className={styles['open-button-container']} >
                <Image className={`${styles['open-button']} ${isOpen ? styles['open-button--open'] : ''} ${currentBot || isTranslatorView ? '' : styles['open-button--hidden']}`} priority alt={`open-button`} src={Icons.ChevronUp} />

            </button>

            <div className={`${isHomeView ? styles['bots-list-home-view'] : styles['bots-list']}`}>
                {renderCreateBotButton()}
                {hasReturnHomeButton ? renderReturnHomeButton() : null}

                {renderOpenSettingsButton()}
                {isTranslatorView ? null : renderTranslatorBotButton()}
                {isHomeView ? renderBots : null}
            </div>
        </div>
    )
}