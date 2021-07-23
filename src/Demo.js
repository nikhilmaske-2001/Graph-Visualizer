import React from 'react';
import { letterFrequency } from '@vx/mock-data';
import { scaleBand, scaleLinear } from "@vx/scale";
import { Group } from "@vx/group";
import { Bar } from "@vx/shape";

// Using mock data from vx/mock-data
const data = letterFrequency;

// Define the graph dimensions
const width = 800;
const height = 500;
const margin = { top: 20, bottom: 20, left: 20, right: 20};

// Making a bounds
const xMax = width - margin.left - margin.right;
const yMax = height - margin.top - margin.bottom;

// Helpers to get data we want
const x = d => d.letter;
// Multiplying by 100 as the data from letterfrequency is like 0.02678
const y = d => +d.frequency * 100;

// Scale the graph by our data
const xScale = scaleBand({
    range: [0, xMax],
    round: true,
    domain: data.map(x),
    padding: 0.4,
});

const yScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, Math.max(...data.map(y))],
});

// Compose together the scale and accessor functions to get point functions
const compose = (scale, accessor) => data => scale(accessor(data));
const xPoint = compose(xScale, x);
const yPoint = compose(yScale, y);

// Embeding the above all data in an SVG
export function BarGraph() {
    return (
        <svg width = {width} height = {height}>
            {data.map((d, i) => {
                const barHeight = yMax - yPoint(d);
                return (
                    <Group key = {`bar-${i}`}>
                        <Bar
                            x = {xPoint(d)}
                            y = {yMax - barHeight}
                            height = {barHeight}
                            width = {xScale.bandwidth()}
                            fill = "#fc2e1c"
                        />
                    </Group>
                );
            })}
        </svg>
    );
}