import { pie, arc, PieArcDatum } from 'd3';
import { AnimatedSlice } from './PieChartAnimatedSlice';
import { TimerProps } from '../types';
import { formatTime } from '../utils/formatTime';
import { useData } from '../hooks/sortData';

export function AnimatedDonutChart({
    singleColor,
}: {
    singleColor?: 'purple' | 'blue' | 'fuchsia' | 'yellow';
}) {
    const data = useData();

    let totalTime = 0;

    data.forEach((el) => {
        totalTime += el.duration;
    });

    const radius = 300; // Chart base dimensions
    const gap = 0.01; // Gap between slices
    const lightStrokeEffect = 10; // 3d light effect around the slice

    // Pie layout and arc generator
    const pieLayout = pie<TimerProps>()
        .value((d) => d.duration)
        .padAngle(gap); // Creates a gap between slices

    // Adjust innerRadius to create a donut shape
    const innerRadius = radius / 1.625;
    const arcGenerator = arc<PieArcDatum<TimerProps>>()
        .innerRadius(innerRadius)
        .outerRadius(radius)
        .cornerRadius(lightStrokeEffect + 2); // Apply rounded corners

    const labelRadius = radius * 0.825;
    const arcLabel = arc<PieArcDatum<TimerProps>>()
        .innerRadius(labelRadius)
        .outerRadius(labelRadius);

    const arcs = pieLayout(data);

    // Calculate the angle for each slice
    function computeAngle(d: PieArcDatum<TimerProps>) {
        return ((d.endAngle - d.startAngle) * 180) / Math.PI;
    }

    // Minimum angle to display text
    const minAngle = 20; // Adjust this value as needed

    const colors = {
        purple: ['#7e4cfe', '#895cfc', '#956bff', '#a37fff', '#b291fd', '#b597ff'],
        blue: ['#73caee', '#73caeeee', '#73caeedd', '#73caeecc', '#73caeebb', '#73caeeaa'],
        fuchsia: ['#f6a3ef', '#f6a3efee', '#f6a3efdd', '#f6a3efcc', '#f6a3efbb', '#f6a3efaa'],
        yellow: ['#f6e71f', '#f6e71fee', '#f6e71fdd', '#f6e71fcc', '#f6e71fbb', '#f6e71faa'],
    };

    return (
        <div className="relative mt-4">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <p className={`text-lg text-white`}>Total</p>
                    <p className={`text-2xl transition-colors duration-300 font-bold text-white`}>
                        {formatTime(totalTime)}
                    </p>
                </div>
            </div>
            <svg
                viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}
                className="max-w-[16rem] mx-auto overflow-visible"
            >
                {/* Sectors with Gradient Fill and Stroke */}
                {arcs.map((d, i) => {
                    const angle = computeAngle(d);
                    const centroid = arcLabel.centroid(d);
                    if (d.endAngle > Math.PI) {
                        centroid[0] += 10;
                        centroid[1] += 10;
                    } else {
                        centroid[0] -= 10;
                        centroid[1] -= 0;
                    }
                    return (
                        <AnimatedSlice key={i} index={i}>
                            <path
                                stroke="#ffffff33" // Lighter stroke for a 3D effect
                                strokeWidth={lightStrokeEffect} // Adjust stroke width for the desired effect
                                fill={singleColor ? colors[singleColor][i] : colors.purple[i]}
                                d={arcGenerator(d) || undefined}
                            />
                            {/* Labels with conditional rendering */}
                            <g opacity={angle > minAngle ? 1 : 0}>
                                <text
                                    transform={`translate(${centroid})`}
                                    textAnchor="middle"
                                    fontSize={33}
                                >
                                    <tspan
                                        y="-0.4em"
                                        fontWeight="600"
                                        fill={singleColor === 'purple' ? '#eee' : '#444'}
                                    >
                                        {d.data.activity}
                                    </tspan>
                                    {angle > minAngle && (
                                        <tspan
                                            x={0}
                                            y="0.7em"
                                            fillOpacity={0.7}
                                            fill={singleColor === 'purple' ? '#eee' : '#444'}
                                        >
                                            {Math.floor((d.data.duration * 100) / totalTime)}%
                                        </tspan>
                                    )}
                                </text>
                            </g>
                        </AnimatedSlice>
                    );
                })}
            </svg>
        </div>
    );
}
