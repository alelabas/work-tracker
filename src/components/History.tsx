import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { TimerProps } from '../types';
import { formatTime } from '../utils/formatTime';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
    storedInput: TimerProps[];
    handleDelete: (index: number) => void;
}

export const History: React.FC<Props> = ({ storedInput, handleDelete }) => {
    const historyArray = storedInput.map((el, index) => {
        return (
            <div
                key={index}
                className="group bg-list-500 w-[500px] rounded-sm h-[60px] my-5 flex flex-row items-center px-5 justify-between"
            >
                <h3>{el.activity}</h3>
                <span className="flex flex-row items-center gap-x-5">
                    <h3>{formatTime(el.duration)}</h3>
                    <h4 className="text-xs">{el.date}</h4>
                    <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => handleDelete(index)}
                    >
                        <FaRegTrashAlt />
                    </button>
                </span>
            </div>
        );
    });

    return (
        <ScrollArea className="h-62 rounded-md mt-10">
            <div className="p-2">{historyArray.reverse()}</div>
        </ScrollArea>
    );
};
