import { Timer } from './Timer';

export function Main() {
    return (
        <main className="flex flex-col items-center justify-center my-5 w-full text-white">
            <section className="flex flex-col items-center justify-center w-[600px] h-auto p-5 bg-layout-500 rounded-lg shadow-lg shadow-black">
                <Timer />
            </section>
        </main>
    );
}
