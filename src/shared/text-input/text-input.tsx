import styles from './text-input.module.css'

interface TextInputProps {
    title?: string;
    value?: string;
    setValue: (text: string) => void;
    variant?: 'regular';
    onSubmit?: () => void;
    buttonText?: string;
    onCancel?: () => void;
    cancelButtonText?: string;
    placeholder?: string;
}

export function TextInput({
    title,
    value,
    setValue,
    variant = 'regular',
    onSubmit,
    buttonText = 'Enter',
    placeholder,
    onCancel,
    cancelButtonText = 'Cancel',
}: TextInputProps) {

    return (
        <div className={styles['text-input']}>
            {title ? <div className={styles['title']}>{title}</div> : null}

            <div className={styles['input-container']}>

                <input
                    placeholder={placeholder}
                    className={`${styles['input']} ${styles[`input-variant-${variant}`]}`}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && onSubmit) onSubmit()
                    }}
                />

                {onCancel ? (
                    <button
                        className={`${styles['button']}`}
                        type='button'
                        onClick={() => onCancel ? onCancel() : null}
                    >
                        {cancelButtonText}
                    </button>
                ) : null}

                {onSubmit ? (
                    <button
                        className={`${styles['button']}`}
                        type='button'
                        onClick={() => onSubmit ? onSubmit() : null}
                    >
                        {buttonText}
                    </button>
                ) : null}
            </div>

        </div>
    )
}