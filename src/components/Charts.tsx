import { HorizontalBarChart } from '../graphics/BarChart';
import { AnimatedDonutChart } from '../graphics/PieChart';

export function Charts() {
    return (
        <div className="flex flex-row justify-around items-center w-full h-full p-4 mt-20 text-center">
            <div className="bg-layout-500 p-4 rounded-xl shadow-2xl w-[40%] h-[400px]">
                <h2 className="text-white text-3xl font-bold mb-10">Percentage of time spent</h2>
                <AnimatedDonutChart singleColor="purple" />
            </div>
            <div className="bg-layout-500 py-4 px-10 rounded-xl shadow-2xl w-[40%] h-[400px]">
                <h2 className="text-white text-3xl font-bold mb-10">Bar Graph</h2>
                <HorizontalBarChart />
            </div>
        </div>
    );
}
