import React from "react";
import clsx from "clsx";
import "./App.css";
import Graph from "./graph/Graph";
import * as ParseUtils from "./parser/parseUtils";
import { InputType, } from "./parser/inputTypes";
import { LayoutType } from "./layout/layoutTypes";
import {
  Typography,
  Slider
} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useStyles } from "./styles/useStyles";
import { TreeNode } from "./layout/treeLayout";
import Topbar from "./components/Topbar/Topbar";

const DEFAULT_INPUT_TYPE = InputType.AdjacencyList;
const DEFAULT_LAYOUT_TYPE = LayoutType.Tree;
const DEFAULT_GRAPH_INPUT = ``;
const DEFAULT_CUSTOM_NODES_INPUT = "[]";

export type MyGraphNodeType = { id: string; label: string; x?: number; y?: number };
export type MyGraphLinkType = { source: string; target: string; label?: string };
export type MyDataType = {
  nodes: Array<MyGraphNodeType>;
  links: Array<MyGraphLinkType>;
  startNode?: string;
  directed?: boolean;
  tree?: TreeNode;
  idToTreeNode?: { [key: string]: TreeNode };
};

function App() {
  const classes = useStyles();
  // layout
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  // input data
  const [inputValue, setInputValue] = React.useState(DEFAULT_GRAPH_INPUT);
  const [comboValue, setComboValue] = React.useState(DEFAULT_INPUT_TYPE);
  const [directed, setDirected] = React.useState(true);
  const [oneIndexed, setOneIndexed] = React.useState(false); // used for adjacency lists
  const [reverseEdges, setReverseEdges] = React.useState(false); // used for edge pairs
  const [customNodes, setCustomNodes] = React.useState(DEFAULT_GRAPH_INPUT);

  const [allNodes, setAllNodes] = React.useState<Array<string>>([]);
  const [startNode, setStartNode] = React.useState<string | null>(null);

  // error handling
  const [graphInputError, setGraphInputError] = React.useState("");
  const [customNodesInputError, setCustomNodesInputError] = React.useState("");

  // graph payload (with minimalist structure)
  const [customNodeSet, setCustomNodeSet] = React.useState(new Set<string>());
  const [data, setData] = React.useState<MyDataType>({
    nodes: [],
    links: []
  });

  // layout
  const [selectedLayout, setSelectedLayout] = React.useState(DEFAULT_LAYOUT_TYPE);
  const [searchInputValue, setSearchInputValue] = React.useState("");
  const [searchText, setSearchText] = React.useState("");

  const reverseRef = React.useRef(false);

  const [verticalSlider, setVerticalSlider] = React.useState<number>(2);
  const [horizontalSlider, setHorizontalSlider] = React.useState<number>(2);

  // handle changes to graph input, input type, associated options (i.e. 1-indexed)
  React.useEffect(() => {
    if (!inputValue) return;

    let parsedValue: any;
    try {
      parsedValue = ParseUtils.processInput(inputValue, comboValue, {
        oneIndexed,
        reverseEdges
      });

      if (parsedValue.nodeSet.size === 0) {
        setGraphInputError("There are no valid nodes in the input.");
        return;
      }
    } catch (error) {
      setGraphInputError(error.message);
      return;
    }

    let reverseChanged = false;
    if (reverseEdges !== reverseRef.current) {
      reverseChanged = true;
      reverseRef.current = reverseEdges;
    }

    const nodeToLabel = parsedValue.nodeToLabel ? parsedValue.nodeToLabel : {};

    parsedValue.nodes = Array.from(parsedValue.nodeSet).map(nodeId => {
      return {
        id: nodeId as string,
        label: nodeToLabel.hasOwnProperty(nodeId) ? nodeToLabel[nodeId as string] : nodeId
      };
    });
    if (parsedValue.startNode) {
      setStartNode(parsedValue.startNode);
    } else {
      if (!reverseChanged) {
        setStartNode(null);
      }
    }

    setGraphInputError("");
    setData(parsedValue);
  }, [inputValue, comboValue, oneIndexed, reverseEdges]);

  // handle changes to custom nodes input ()
  React.useEffect(() => {
    if (!customNodes) return;

    let parsedValue: Set<string>;
    try {
      parsedValue = ParseUtils.parseNodes(customNodes);
    } catch (ex) {
      setCustomNodesInputError(ex.message);
      return;
    }
    setCustomNodesInputError("");
    setCustomNodeSet(parsedValue);
  }, [customNodes]);

  React.useEffect(() => {
    let allNodesSet = new Set();
    for (let n of data.nodes) {
      allNodesSet.add(n.id);
    }
    for (let nodeId of Array.from(customNodeSet)) {
      allNodesSet.add(nodeId);
    }
    let tempAllNodes = Array.from(allNodesSet) as Array<string>;
    tempAllNodes.sort();

    setAllNodes(tempAllNodes);
  }, [customNodeSet, data]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Topbar />

      <main
        className={clsx(classes.mainContent, {
          [classes.contentShift]: drawerOpen
        })}
      >
        <div className={classes.drawerHeader} />
        <Graph
          id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
          inputType={comboValue}
          directed={directed}
          customNodes={customNodeSet}
          startNode={startNode}
          data={data}
          selectedLayout={selectedLayout}
          drawerOpen={drawerOpen}
          searchText={searchText}
          horizontalSpacing={horizontalSlider}
          verticalSpacing={verticalSlider}
        />
        <div className={classes.sliders}>
          {selectedLayout !== LayoutType.ForceLayout && selectedLayout !== LayoutType.Random && (
            <>
              <Typography id="continuous-slider" gutterBottom>
                Horizontal Spacing
              </Typography>
              <Slider
                value={horizontalSlider}
                onChange={(event, newValue) => {
                  setHorizontalSlider(newValue as number);
                }}
                aria-labelledby="discrete-slider"
                step={1}
                marks
                min={0}
                max={4}
              />
            </>
          )}
          {selectedLayout !== LayoutType.ForceLayout &&
            selectedLayout !== LayoutType.Random &&
            selectedLayout !== LayoutType.Arc && (
              <>
                <Typography id="continuous-slider" gutterBottom>
                  Vertical Spacing
                </Typography>
                <Slider
                  value={verticalSlider}
                  onChange={(event, newValue) => {
                    setVerticalSlider(newValue as number);
                  }}
                  aria-labelledby="discrete-slider"
                  step={1}
                  marks
                  min={0}
                  max={4}
                />
              </>
            )}
        </div>
      </main>
    </div >
  );
}

export default App;
