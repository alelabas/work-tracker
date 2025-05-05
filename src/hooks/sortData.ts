import { useState, useEffect } from 'react';
import { TimerProps } from '../types';

export function useData() {
    const [data, setData] = useState<TimerProps[]>([]);

    useEffect(() => {
        const loadData = () => {
            const storedData = localStorage.getItem('input');
            const rawData: TimerProps[] = storedData ? JSON.parse(storedData) : [];

            // Agrupar tareas y sumar duraciones
            const groupedData = rawData.reduce((acc: TimerProps[], current) => {
                const existingTask = acc.find((item) => item.activity.toLowerCase() === current.activity.toLowerCase());
                if (existingTask) {
                    existingTask.duration += current.duration;
                } else {
                    acc.push({ ...current });
                }
                return acc;
            }, []);

            setData(groupedData);
        };

        loadData();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'input') {
                loadData();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return data;
}
