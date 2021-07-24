import { Graph } from '@vx/network';

export type NetworkProps = {
  width: number;
  height: number;
  nodes?: any[]; 
};

const nodes = [
  { x: 50, y: 20 },
  { x: 200, y: 300 },
  { x: 300, y: 40 },
];

// nodes[0]->nodes[1]->nodes[2]->nodes[0]
const links = [
  { source: nodes[0], target: nodes[1] },
  { source: nodes[1], target: nodes[2] },
  { source: nodes[2], target: nodes[0] },
];

const graph = {
  nodes,
  links,
};

export const background = '#272b4d';

export default function Example({ width, height }: NetworkProps) {
  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect width={width} height={height} rx={14} fill={background} />
      <Graph graph={graph} />
    </svg>
  );
} 