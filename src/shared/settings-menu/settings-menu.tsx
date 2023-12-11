

import { Fragment } from 'react';
import Icons from '../icons/icons';
import styles from './settings-menu.module.css'
import OpenAI from 'openai';
import Image from 'next/image';

interface SettingsMenuProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    bots?: OpenAI.Beta.Assistants.Assistant[];
    isHovering: boolean;
    setIsHovering: (anythingButChat: boolean) => void;
}

export function SettingsMenu({
    isOpen,
    setIsOpen,
    bots,
    isHovering,
    setIsHovering
}: SettingsMenuProps) {
    console.log("bots", bots)
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

    const renderCreateBotButton = () => {
        return (
            <Fragment key={`bots-list-bot-create-bot`}>
                <div className={`glow-component ${styles['bot']}`} onMouseEnter={onHover} onMouseLeave={onHoverEnded}>
                    {/* <div className={styles['bot-image']}><img src={'../../assets/bots/bot-1.png'} /></div> */}
                    <Image className={styles['bot-image']} priority alt={`bots-list-bot-create-bot-image`} src={Icons.AddBotIcon} />

                    <div className={styles['bot-name']}>{"Create Bot"}</div>
                    <div className={`hidden ${styles['hidden-description']}`}>test</div>

                    {/* <div className={styles['bot-name']}>{bot.model}</div> */}
                </div>
            </Fragment>
        )
    }

    const renderBots = () => {
        return bots?.map((bot, index) => (
            <Fragment key={`bots-list-bot-${bot.id}`}>
                <div className={`glow-component ${styles['bot']}`} onMouseEnter={onHover} onMouseLeave={onHoverEnded}>
                    {/* <div className={styles['bot-image']}><img src={'../../assets/bots/bot-1.png'} /></div> */}
                    <Image className={styles['bot-image']} priority alt={`bots-list-bot-${bot.name}-${index}`} src={Icons.Bot1} />

                    <div className={styles['bot-name']}>{bot.name}</div>
                    <div className={styles['bot-description']}>{bot.model}</div>
                </div>
            </Fragment>
        ))
    }
    return (
        <div className={`${styles['settings-menu']} ${isOpen ? '' : styles['settings-menu-closed']}`} >
            <button onClick={onToggleOpenCloseMenu} className={styles['open-button-container']} >
                <Image className={`${styles['open-button']} ${isOpen ? styles['open-button--open'] : ''}`} priority alt={`open-button`} src={Icons.ChevronUp} />

                {/* <button className={`button ${styles['open-button']}`} onClick={onToggleOpenCloseMenu}>OPEN SETTINGS</button> */}
            </button>

            <div className={styles['menu-container']}>
                {renderCreateBotButton()}
                {renderBots()}
            </div>
        </div>
    )
}