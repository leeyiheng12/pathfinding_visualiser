import React from "react";

import classes from "./App.module.css";

import Grid from "./components/Grid";
import Node from "./components/Node";
import {bfs, bestFirstSearch, aStar} from "./Algorithms/PathfindingAlgorithms";
import {manhattanDistance, euclideanDistance} from "./Algorithms/PathfindingAlgorithms";
import {aldousBroder, backtracking, binaryTree, growingTree, huntAndKill, kruskal,
  randomTree, CAMaze, CAMazeCetric, fillDeadEnds, CATest} from "./Algorithms/MazeGeneratingAlgorithms";

import Button from "./components/Button";
import Modal from "./components/Modal";


const ROWS = 31;
const COLUMNS = 61;

const allNodesB = [];
for (let i = 0; i < ROWS; i++) {
    const newRow = [];
    for (let j = 0; j < COLUMNS; j++) {
        newRow.push(new Node(ROWS, COLUMNS, i, j));
    }
    allNodesB.push(newRow);
}

// function deepCopy(allNodes) {
//   return allNodes.map(i => i.map(n => n.makeCopy()));
// }

function App() {

  const [enableInput, setEnableInput] = React.useState(true);
  const [allNodes, setAllNodes] = React.useState(allNodesB);
  const [startNode, setStartNode] = React.useState(null);
  const [endNode, setEndNode] = React.useState(null);

  const [speed, setSpeed] = React.useState(10);  
  // speed = [1, 10]
  // 10*speed = [10, 100]
  // 1000 / 10*speed = [100, 10]

  const DURATION = 100/speed;

  function updateSingleNode(node) {
    const newAll = allNodes.slice();
    newAll[node.rowNum][node.colNum] = node;
    setAllNodes(newAll);
  }

  function updateFrameNodes(frameOfNodes) {  // takes in a frame of nodes
    // console.log(frameOfNodes);
    if (!frameOfNodes) return;
    // console.log(frameOfNodes.getNodes());
    if (frameOfNodes.instruction) {
      frameOfNodes.execute();
    }
    const newAll = allNodes.slice();
    const nodesToUpdate = frameOfNodes.getNodes().slice();
    for (const n of nodesToUpdate) {
        newAll[n.rowNum][n.colNum] = n;
    }
    setAllNodes(newAll);
  }

  function clearAll(event) {
    if (!enableInput) return;
    const newAll = allNodes.slice();
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLUMNS; j++) {
        newAll[i][j].reset();
      }
    }
    setAllNodes(newAll);
    setStartNode(null);
    setEndNode(null);
  }

  function clearWalls() {
    const newAll = allNodes.slice();
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLUMNS; j++) {
        newAll[i][j].setWall(false);
      }
    }
    setAllNodes(newAll);
  }

  function clearPaths() {
    const newAll = allNodes.slice();
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLUMNS; j++) {
        newAll[i][j].unpath();
      }
    }
    setAllNodes(newAll);
  }

  function generateNeighbours(diag) {
    const newNodes = allNodes.slice();
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLUMNS; j++) {
        newNodes[i][j].generateNeighbours(newNodes, diag);
      }
    }
    setAllNodes(newNodes);
  }

  function startPathfinding(event) {
    if (!enableInput) return;
    if (startNode && endNode) {
      clearPaths();
      generateNeighbours(allowDiagonal);
      startNode.generateNeighbours(allNodes, allowDiagonal);  // ZZZZZZ
      const [searchFrames, pathFrames] = selectedAlgo(startNode, endNode, allNodes, selectedHf);
      visualise(searchFrames, pathFrames);
    }
  } 

  function visualise(searchFrames, pathFrames) {
    const numFrames = searchFrames.length;
    for (let i = 0; i < numFrames; i++) {  // for each frame
      setTimeout(() => {
        updateFrameNodes(searchFrames[i]);
        setEnableInput(false);
      }, i*DURATION);
    }

    if (!pathFrames) pathFrames = [];

    for (let i = 0; i < pathFrames.length; i++) {
      setTimeout(
      () => {
        setEnableInput(false); 
        updateFrameNodes(pathFrames[i]);
      }, 
      (searchFrames.length + i) * DURATION
      );
    }
    setTimeout(
      () => setEnableInput(true), 
      DURATION * (searchFrames.length + pathFrames.length)
    );
  }

  const [selectedAlgoName, setAlgo] = React.useState("Best First Search");
  const pfNameToFunc = {
    "BFS": bfs,
    "Best First Search": bestFirstSearch,
    "A* Search": aStar
  }
  const selectedAlgo = pfNameToFunc[selectedAlgoName];
  
  const [selectedHfName, setHf] = React.useState("Manhattan Distance");
  const hfNameToFunc = {
    "Manhattan Distance": manhattanDistance,
    "Euclidean Distance": euclideanDistance,
  }
  const selectedHf = hfNameToFunc[selectedHfName];

  const [allowDiagonal, setAllowDiagonal] = React.useState(false);

  const [showModal, setShowModal] = React.useState(false);

  const genMaze = genFunc => {
    if (!enableInput) return;
    clearWalls();
    clearPaths();

    const displayFrames = genFunc(allNodes);
    let result = displayFrames.next();
    let i;
    for (i = 0; !result.done; i++) {
      ((r, iter) => 
        setTimeout(() => {
          updateFrameNodes(r.value);
          setEnableInput(false);
        }, iter * DURATION)
      )(result, i);
      result = displayFrames.next();
    }
    
    setTimeout(
      () => {setEnableInput(true);}, 
      DURATION * i
    );
  }

  const fillDead = event => {
    if (!enableInput) return;
    clearPaths();
    const displayFrames = fillDeadEnds(allNodes);
    let result = displayFrames.next();
    let i;
    for (i = 0; !result.done; i++) {

      ((r, iter) => 
        setTimeout(() => {
          updateFrameNodes(r.value);
          setEnableInput(false);
        }, iter * DURATION)
      )(result, i);
      result = displayFrames.next();

      if (result.done) {
        setTimeout(
          () => {setEnableInput(true);}, 
          DURATION * i
        );
        return;
      }
    }
  
  }

  return (
    <div className={classes.mainDiv}>

      {showModal && <Modal onConfirm={e => setShowModal(false)} title="Instructions" speed={speed} setSpeed={setSpeed} />}

      <div className={classes.topDiv}>
       
        <div className={classes.section}>
          <Button onClick={e => setShowModal(true)} width="5vw" value="Instructions"></Button>
          <Button onClick={clearAll} value="Clear All" disabled={!enableInput}></Button>
        </div>

        <div className={classes.section}>
          {Object.keys(pfNameToFunc).map(name => <Button 
            onClick={() => setAlgo(name)}
            value={name} 
            key={name}
            selected={selectedAlgoName===name} />)
          }
        </div>
        
        <div className={classes.section}>
          {Object.keys(hfNameToFunc).map(name => <Button 
            onClick={() => setHf(name)}
            value={name} 
            key={name}
            selected={selectedHfName===name} />)
          }
        </div>

        <div className={classes.section}>
          <Button 
            onClick={() => setAllowDiagonal(p=>!p)} 
            width="7vw"
            value="Diagonal Travel"
            selected={allowDiagonal}/>
        </div>

        <div className={classes.section}>
          <Button onClick={startPathfinding} value="Start" disabled={!enableInput}></Button>
        </div>

      </div>

      <Grid
        ROWS={ROWS}
        COLUMNS={COLUMNS}

        enableInput={enableInput}

        allNodes={allNodes}
        startNode={startNode}
        setStartNode={setStartNode}
        endNode={endNode}
        setEndNode={setEndNode}

        updateNode={updateSingleNode}
        />

      <div className={classes.topDiv}>
        <div className={classes.section}>
          <Button onClick={e => genMaze(aldousBroder)} value="Aldous-Broder" disabled={!enableInput}></Button>
          <Button onClick={e => genMaze(backtracking)} value="Backtracking" disabled={!enableInput}></Button>
          <Button onClick={e => genMaze(binaryTree)} value="Binary Tree" disabled={!enableInput}></Button>
          <Button onClick={e => genMaze(growingTree)} value="Growing Tree" disabled={!enableInput}></Button>
          <Button onClick={e => genMaze(huntAndKill)} value="Hunt and Kill" disabled={!enableInput}></Button>
          <Button onClick={e => genMaze(kruskal)} value="Kruskal" disabled={!enableInput}></Button>
          <Button onClick={e => genMaze(randomTree)} value="Random Tree" disabled={!enableInput}></Button>
          <Button onClick={e => genMaze(CAMaze)} width="5vw" value="Maze (CA)" disabled={!enableInput}></Button>
          <Button onClick={e => genMaze(CAMazeCetric)} width="8vw" value="MazeCetric (CA)" disabled={!enableInput}></Button>
          <Button onClick={e => genMaze(CATest)} width="6vw" value="Another CA" disabled={!enableInput}></Button>
        </div>

        <div className={classes.section}>
          <Button onClick={fillDead} value="Fill Dead Ends" disabled={!enableInput}></Button>
        </div>
      </div>


    </div>

  );
}

export default App;
