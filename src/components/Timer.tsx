import { useRef, useState, useEffect } from 'react';
import { History } from './History';
import { formatTime } from '../utils/formatTime';
import { useLocalStorage } from '@uidotdev/usehooks';
import { TimerProps } from '../types.ts';

export function Timer() {
    const [active, setActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [time, setTime] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [input, setInput] = useState('');
    const [storedInput, setStoredInput] = useLocalStorage<TimerProps[]>('input', []);

    const handleClick = () => {
        setActive(!active);
    };

    const handleBreak = () => {
        setIsBreak(!isBreak);
    };

    useEffect(() => {
        if (active && !isBreak) {
            intervalRef.current = setInterval(() => {
                setTime((prev) => prev + 1);
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [active, isBreak]);

    const handleStop = () => {
        const newEntry = {
            activity: input,
            duration: time,
            date: new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }),
        };
        setStoredInput([...storedInput, newEntry]);
        setActive(false);
        setIsBreak(false);
        setTime(0);
        setInput('');
    };

    interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {
        target: HTMLFormElement & { [key: number]: HTMLInputElement };
    }

    const handleSubmit = (event: HandleSubmitEvent): void => {
        event.preventDefault();
        const inputValue: string = event.target[0].value;
        if (inputValue) {
            setInput(inputValue);
            event.target[0].value = '';
        }
    };

    const clearStorage = () => {
        window.localStorage.clear();
        window.location.reload();
    };

    const handleDelete = (index: number) => {
        const newStoredInput = [...storedInput];
        newStoredInput.splice(index, 1);
        setStoredInput(newStoredInput);
    };

    return (
        <>
            <div className="flex flex-col items-center p-6 bg-layout-600 rounded-2xl shadow-xl w-100 my-10">
                {input && (
                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-bold">{input}</h2>
                    </div>
                )}
                <div className="text-4xl font-mono mb-6 text-white">{formatTime(time)}</div>
                <div className="flex flex-row gap-x-5 items-center justify-center">
                    {!active && (
                        <button
                            className={` bg-button-500 px-10 py-1 rounded-sm cursor-pointer  transition-all ease-in ${input ? 'hover:bg-button-550' : 'bg-gray-400 cursor-default'}`}
                            onClick={handleClick}
                            disabled={!input}
                        >
                            Start
                        </button>
                    )}
                    {active && (
                        <>
                            <button
                                onClick={handleBreak}
                                className={`${!isBreak ? 'bg-button-600 hover:bg-button-650' : 'bg-button-500 hover:bg-button-550'} rounded-sm px-10 py-1 cursor-pointer transition-all ease-in`}
                            >
                                {isBreak ? 'Resume' : 'Take a break'}
                            </button>
                            <button
                                onClick={handleStop}
                                className="bg-button-700 hover:bg-button-750 rounded-sm px-10 py-1 cursor-pointer transition-all ease-in"
                            >
                                Stop
                            </button>
                        </>
                    )}
                </div>
            </div>

            {!input && (
                <>
                    <form className="flex flex-col mb-5 gap-5 items-center" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="text-white bg-layout-600 w-[500px] p-2 rounded-sm "
                            placeholder="Work, Study, Research"
                        />
                    </form>
                </>
            )}

            {storedInput.length > 0 ? (
                <>
                    <History storedInput={storedInput} handleDelete={handleDelete} />
                    <button
                        className="bg-button-600 px-10 py-1 rounded-sm cursor-pointer mt-10"
                        onClick={clearStorage}
                    >
                        Clear History
                    </button>
                </>
            ) : (
                <h3 className="font-bold">No history recorded</h3>
            )}
        </>
    );
}
