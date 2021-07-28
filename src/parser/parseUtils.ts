import { InputType, getTypeConfig } from "./inputTypes";

export function processInput(input: string, type: number): any {
  const config = getTypeConfig(type);
  config.input = input;

  switch (type) {
    case InputType.EdgePairs:
    case InputType.WeightedEdgePairs:
      return parsePairs(config);
    case InputType.AdjacencyList:
    case InputType.AdjacencyList1Ind:
      return parseAdjacencyList(config);
    case InputType.AdjacencyMatrix:
      return "Adjacency Matrix";
    case InputType.GraphObject:
      return "Graph Object";
    default:
      break;
  }
}

// directed pairs
// [[2,1],[3,1],[1,4]]
export function parsePairs(config: {
  input: string;
  directed?: boolean;
  weighted?: boolean;
}): any {
    let {input, weighted = true} = config;
    // trim whitespace
    // TODO: Error handling
    input = input.trim();
    if(input.length < 2) throw new Error("Input too short");
    input = input.slice(1, input.length - 1);

    const links= [];
    const nodeSet = new Set<string>();

    let startInd = 0;
    let nextOpenBracket = input.indexOf("[", startInd);
    while(nextOpenBracket !== -1) {
      const nextCloseBracket = input.indexOf("]", nextOpenBracket);
      if(nextCloseBracket === -1) throw new Error("No matching closing bracket");

      try {
        const pair = getDirectedPair(
          input.slice(nextOpenBracket+1, nextCloseBracket),
          nodeSet,
          weighted
        );
        links.push(pair);
      } catch (error) {
        throw error;
      }

      startInd = nextCloseBracket;
      nextOpenBracket = input.indexOf("[", startInd);
    }

    if(links.length === 0) throw new Error("No pairs found");

    return {nodeSet: nodeSet, links: links};
  }

function getDirectedPair(s: string, nodeSet: Set<string>, weighted: boolean) {
  s = s.trim();

  if(s.length === 0 || s.indexOf(",") === -1) 
    throw new Error("Pair needs at least two arguments");

  const sp = s.split(",");
  const src = sp[0].trim();
  const trg = sp[1].trim();

  if(src.length === 0 || trg.length === 0) 
    throw new Error("src and trg needs to be non-empty");

  nodeSet.add(src);
  nodeSet.add(trg);

  const rtn: any = {source: src, target: trg};
  if(weighted && sp.length === 3) {
    rtn.label = sp[2].trim();
  }
  return rtn;
}
  
  // adjacency list
  // array where arr[i] is an array of adjacent nodes
  export function parseAdjacencyList(config: {
    input: string;
    directed?: boolean;
    oneIndexed?: boolean;
  }): any {
    let { input, oneIndexed } = config;
  
    // trim whitespace
    input = input.trim();
    if(input.length < 2) throw new Error("Input too short");
    input = input.slice(1, input.length-1);
    
    const links = [];
    const nodeSet = new Set<string>();

    let startInd = 0;
    let nextOpenBracket = input.indexOf("[", startInd);
    let srcNode = oneIndexed ? 1 : 0; //index of source node
    while (nextOpenBracket !== -1) {
      const nextCloseBracket = input.indexOf("]", nextOpenBracket);
      if (nextCloseBracket === -1) throw new Error("No matching close bracket");
  
      const src = srcNode.toString();
      nodeSet.add(src);
  
      try {
        const arr = parseArray(
          input.slice(nextOpenBracket + 1, nextCloseBracket),
          nodeSet
        );
        for (let trg of arr) {
          links.push({ source: src, target: trg });
        }
      } catch (ex) {
        throw ex;
      }
  
      startInd = nextCloseBracket;
      nextOpenBracket = input.indexOf("[", startInd);
      srcNode++;
  }
  return { nodeSet: nodeSet, links: links };
}

function parseArray(s: string, nodeSet: Set<string>): any[] {
    s = s.trim();
  
    const rtn: any[] = [];
  
    const sp = s.split(",");
    for (let elem of sp) {
      const toAdd = elem.trim();
      if (toAdd.length > 0) {
        rtn.push(toAdd);
      }
    }
  
    return rtn;
}
// adjacency matrix
// n x n binary matrix where arr[i][j] means there is a connection between i and j
export function parseAdjacencyMatrix(config: { input: string }): any {
  let { input } = config;
  input = input.trim();
  if (input.length < 2) throw new Error("Input too short");
  input = input.slice(1, input.length - 1);

  // TODO: parse each row of the matrix and add a connection between row i and column j when 1 is encountered
}

export function parseNodes(input: string) {
  const nodeSet = new Set<string>();
  input = input.trim();
  if (input.length < 2) {
    console.error("Input too short");
    return nodeSet;
  }
  input = input.slice(1, input.length - 1);
  if (input.length === 0 || input.indexOf(",") === -1) {
    console.error("Input too short");
    return nodeSet;
  }
  const sp = input.split(",");
  for (let s of sp) {
    s = s.trim();
    if (s.length) nodeSet.add(s);
  }
  return nodeSet;
}