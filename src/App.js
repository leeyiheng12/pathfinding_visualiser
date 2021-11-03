import React from "react";

import classes from "./App.module.css";

import Grid from "./components/Grid";
import Node from "./components/Node";
import {bfs, bestFirstSearch, aStar} from "./Algorithms/PathfindingAlgorithms";
import {manhattanDistance, euclideanDistance} from "./Algorithms/PathfindingAlgorithms";
import {binaryTree, randomTree, CAMaze, CAMazeCetric, fillDeadEnds, CATest} from "./Algorithms/MazeGeneratingAlgorithms";

import Button from "./components/Button";
import Modal from "./components/Modal";


const ROWS = 31;
const COLUMNS = 41;
const SPEED = 10;

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
      }, i*SPEED);
    }

    if (!pathFrames) pathFrames = [];

    for (let i = 0; i < pathFrames.length; i++) {
      setTimeout(
      () => {
        setEnableInput(false); 
        updateFrameNodes(pathFrames[i]);
      }, 
      (searchFrames.length + i) * SPEED
      );
    }
    setTimeout(
      () => setEnableInput(true), 
      SPEED * (searchFrames.length + pathFrames.length)
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

  const modalMessage = `
  Click on a grid square to set the start and end points. \n
  Start -> Green \n
  End -> Red \n
  Wall -> Black \n
  To reset a grid square, click on it again.  \n
  You can also left-click and drag to draw walls quickly, or right-click and drag to delete walls quickly. 
  `;

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
        }, iter * SPEED)
      )(result, i);
      result = displayFrames.next();
    }
    
    setTimeout(
      () => {setEnableInput(true);}, 
      SPEED * i
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
        }, iter * SPEED)
      )(result, i);
      result = displayFrames.next();

      if (result.done) {
        setTimeout(
          () => {setEnableInput(true);}, 
          SPEED * i
        );
        return;
      }
    }
   

  }

  return (
    <div className={classes.mainDiv}>

      {showModal && <Modal onConfirm={e => setShowModal(false)} title="Instructions" message={modalMessage} />}

      <div className={classes.topDiv}>
       
        <div className={classes.section}>
          <Button onClick={e => setShowModal(true)} width="100px" value="Instructions"></Button>
          <Button onClick={clearAll} value="Clear All" disabled={!enableInput}></Button>
        </div>

        <div className={classes.section}>
          {Object.keys(pfNameToFunc).map(name => <Button 
            onClick={() => setAlgo(name)}
            width="100px"
            value={name} 
            key={name}
            selected={selectedAlgoName===name} />)
          }
        </div>
        
        <div className={classes.section}>
          {Object.keys(hfNameToFunc).map(name => <Button 
            onClick={() => setHf(name)}
            width="120px"
            height="60px" 
            value={name} 
            key={name}
            selected={selectedHfName===name} />)
          }
        </div>

        <div className={classes.section}>
          <Button 
            onClick={() => setAllowDiagonal(p=>!p)} 
            width="120px"
            height="60px" 
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
          <Button onClick={e => genMaze(binaryTree)} value="Binary Tree" disabled={!enableInput}></Button>
          <Button onClick={e => genMaze(randomTree)} value="Random Tree" disabled={!enableInput}></Button>
          <Button onClick={e => genMaze(CAMaze)} width="100px" value="Maze (CA)" disabled={!enableInput}></Button>
          <Button onClick={e => genMaze(CAMazeCetric)} width="100px" value="MazeCetric (CA)" disabled={!enableInput}></Button>
          <Button onClick={e => genMaze(CATest)} width="100px" value="Another CA" disabled={!enableInput}></Button>
        </div>

        <div className={classes.section}>
          <Button onClick={fillDead} value="Fill Dead Ends" disabled={!enableInput}></Button>
        </div>
      </div>


    </div>

  );
}

export default App;
