import Frame from "./Frame";
import Stack from "./Stack";
// import Queue from "./Queue";
import UnionFind from "./UnionFind";

const MAX_LOAD = 100;


function shuffleArray(array) {
    let temp;
    for (let i = array.length - 1; i > 0; i--) {
        // Generate random number
        let j = Math.floor(Math.random() * (i + 1));         
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
        
    return array;
}

function randBetween(a, b) {
    return Math.floor(Math.random() * (b-a)) + a;
}

function fewRandBetween(a, b, n) {
    const results = [];
    for (let i = 0; i < n; i++) {
        let r = randBetween(a, b);
        while (results.includes(r)) {
            r = randBetween(a, b);
        }
        results.push(r);
    }
    return results;
}

function between(a, b) {
    return Math.floor((b-a)/2);
}

function genAll(nodes) {  // generate all wall neighbours for each node
    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes[0].length; j++) {
            nodes[i][j].genWallNeighbours(nodes, true);
        }
    }
    return nodes;
}

function * genGrid(allNodes) {  // generates the grid, returning the empty walkable nodes
    const borders = [];
    let allWalkable = [];
    const allNodesCopy = allNodes.map(i => i.map(n => n.makeCopy()));
    for (let i = 0; i < allNodesCopy.length; i++) {
        for (let j = 0; j < allNodesCopy[0].length; j++) {
            if (i % 2 === 0 || j % 2 === 0) {
                allNodesCopy[i][j].setWall(true);
                borders.push(allNodesCopy[i][j]);
            } else {
                allNodesCopy[i][j].genMazeNeighbours(allNodesCopy, false);
                allWalkable.push(allNodesCopy[i][j]);
            }
        }
    }
    yield new Frame(borders);
    return allWalkable;
}

function * genAllWalls(allNodes) {  // generates all walls, returning the empty walkable nodes
    const borders = [];
    let allWalkable = [];
    const allNodesCopy = allNodes.map(i => i.map(n => n.makeCopy()));
    for (let i = 0; i < allNodesCopy.length; i++) {
        for (let j = 0; j < allNodesCopy[0].length; j++) {
            allNodesCopy[i][j].setWall(true);
            if (i % 2 !== 0 && j % 2 !== 0) {
                allNodesCopy[i][j].genMazeNeighbours(allNodesCopy, false);
                allWalkable.push(allNodesCopy[i][j]);
            }
            borders.push(allNodesCopy[i][j]);
        }
    }
    yield new Frame(borders);
    return allWalkable;
}

export function * aldousBroder(allNodes) {

    const numRows = allNodes.length;
    const numCols = allNodes[0].length;

   const genGridFunc = genGrid(allNodes);
   yield genGridFunc.next().value;
   const allWalkable = genGridFunc.next().value;

    const visited = [];
    for (let i = 0; i < numRows; i++) visited.push(new Array(numCols).fill(false));

    const totalNumToVisit = allWalkable.length;
    let curNode = allWalkable[randBetween(0, allWalkable.length)];
    let visitedNum = 1;
    let randNeighbour, wall;

    while (visitedNum !== totalNumToVisit) {
        randNeighbour = curNode.mazeNeighbours[randBetween(0, curNode.mazeNeighbours.length)];
        if (!visited[randNeighbour.rowNum][randNeighbour.colNum]) {
            visited[randNeighbour.rowNum][randNeighbour.colNum] = true;
            visitedNum++;
            wall = curNode.nodeBetween(allNodes, randNeighbour);
            wall.setWall(false);
            yield new Frame([wall]);
        }
        curNode = randNeighbour;
    }
    
}

export function * backtracking(allNodes) {

    const numRows = allNodes.length;
    const numCols = allNodes[0].length;

    const genGridFunc = genGrid(allNodes);
    yield genGridFunc.next().value;
    const allWalkable = genGridFunc.next().value;

    const visited = [];
    for (let i = 0; i < numRows; i++) visited.push(new Array(numCols).fill(false));
    
    let stack = new Stack();
    let randNeighbour;
    let curNode = allWalkable[randBetween(0, allWalkable.length)];
    shuffleArray(curNode.mazeNeighbours);
    for (randNeighbour of curNode.mazeNeighbours) {
        stack.enqueue([randNeighbour, curNode]);
    }

    visited[curNode.rowNum][curNode.colNum] = true;
    let wall;
    while (stack.length() > 0) {
        [randNeighbour, curNode] = stack.dequeue();
        if (visited[randNeighbour.rowNum][randNeighbour.colNum]) continue;
        visited[randNeighbour.rowNum][randNeighbour.colNum] = true;

        // break wall
        wall = randNeighbour.nodeBetween(allNodes, curNode);
        wall.setWall(false);
        yield new Frame([wall]);

        curNode = randNeighbour;
        shuffleArray(curNode.mazeNeighbours);
        for (randNeighbour of curNode.mazeNeighbours) {
            stack.enqueue([randNeighbour, curNode]);
        }
    }
}

export function * binaryTree(allNodes) {

    // ======================== grids ========================
 
    const genGridFunc = genGrid(allNodes);
    yield genGridFunc.next().value;
    const allWalkable = genGridFunc.next().value;
 
     for (let i = 0; i < allWalkable.length; i++) {
         const curNode = allWalkable[i];
         let n;
 
         // north or west
         let w = randBetween(1, 3) % 2;
         if (w === 0) {  // north
             if (curNode.rowNum > 1) n = allNodes[curNode.rowNum-1][curNode.colNum];
         }  // west
         if (w === 1) {
             if (curNode.colNum > 1) n = allNodes[curNode.rowNum][curNode.colNum-1]
         }
 
         if (n) {
             n.setWall(false);
             yield new Frame([n]);
         }
     }
}

export function * growingTree(allNodes) {

    const numRows = allNodes.length;
    const numCols = allNodes[0].length;

   // ======================== grids ========================

    const genGridFunc = genAllWalls(allNodes);
    yield genGridFunc.next().value;
    const allWalkable = genGridFunc.next().value;

    const visited = [];
    for (let i = 0; i < numRows; i++) visited.push(new Array(numCols).fill(false));

    let curNode = allWalkable[randBetween(0, allWalkable.length)];
    let listOfCells = [curNode];

    let noNeighbour;
    let randNeighbour, randNeighbourCopy;
    let wall;

    visited[curNode.rowNum][curNode.colNum] = true;
    curNode.setWall(false);
    yield new Frame([curNode]);

    let filterFuncGen = node => x => x!==node;

    while (true) {
        noNeighbour = true;
        curNode = listOfCells[randBetween(0, listOfCells.length)];

        shuffleArray(curNode.mazeNeighbours);
        for (randNeighbour of curNode.mazeNeighbours) {
            if (!visited[randNeighbour.rowNum][randNeighbour.colNum]) {

                visited[randNeighbour.rowNum][randNeighbour.colNum] = true;

                // remove walls, make paths
                wall = curNode.nodeBetween(allNodes, randNeighbour);
                wall.setWall(false);

                randNeighbourCopy = randNeighbour.makeCopy();
                randNeighbourCopy.setWall(false);

                yield new Frame([wall.makeCopy(), randNeighbourCopy.makeCopy()]);

                // add to list
                listOfCells.push(randNeighbour);

                noNeighbour = false;
                break;
            }
        }
        if (noNeighbour) {  // remove from array
            listOfCells = listOfCells.filter(filterFuncGen(curNode));
        }
        if (listOfCells.length === 0) {
            break;
        }
    }
}

export function * huntAndKill(allNodes) {

    const numRows = allNodes.length;
    const numCols = allNodes[0].length;

   // ======================== grids ========================

    const genGridFunc = genGrid(allNodes);
    yield genGridFunc.next().value;
    const allWalkable = genGridFunc.next().value;

    const visited = [];
    for (let i = 0; i < numRows; i++) visited.push(new Array(numCols).fill(false));

    const numNodesToVisit = allWalkable.length;
    let numNodesVisited = 0;

    let curNode = allWalkable[randBetween(0, allWalkable.length)];
    let noNeighbour;
    let wall;
    let randNeighbour;

    while (true) {

        if (!visited[curNode.rowNum][curNode.colNum]) {
            visited[curNode.rowNum][curNode.colNum] = true;
            numNodesVisited++;
        }

        noNeighbour = true;
        shuffleArray(curNode.mazeNeighbours);

        for (randNeighbour of curNode.mazeNeighbours) {
            if (!visited[randNeighbour.rowNum][randNeighbour.colNum]) {
                noNeighbour = false;
                
                wall = curNode.nodeBetween(allNodes, randNeighbour);
                wall.setWall(false);
                yield new Frame([wall]);
                
                // this is next curNode
                curNode = randNeighbour;
                break;
            }
        }

        if (noNeighbour) {
            while (true) {
                curNode = allWalkable[randBetween(0, allWalkable.length)];
                if (visited[curNode.rowNum][curNode.colNum]) break;
            } 
        }

        if (numNodesVisited === numNodesToVisit) break;
    }
}

export function * kruskal(allNodes) {

    const numRows = allNodes.length;
    const numCols = allNodes[0].length;

   // ======================== grids ========================

    const genGridFunc = genGrid(allNodes);
    yield genGridFunc.next().value;
    // const allWalkable = genGridFunc.next().value;

    const visited = [];
    for (let i = 0; i < numRows; i++) visited.push(new Array(numCols).fill(false));

    // contains a bunch of arrays
    // each array has 3 nodes: a wall, and the 2 nodes it divides
    let allWalls = [];  
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (i !== 0 && i !== numRows -1) {
                if (j !== 0 && j !== numCols - 1) {
                    
                    if (i % 2 === 1 && j % 2 === 0) {  // its left and right are paths
                        allWalls.push([allNodes[i][j], allNodes[i][j-1], allNodes[i][j+1]]);
                    } else if (i % 2 === 0 && j % 2 === 1) {  // its up and down are paths
                        allWalls.push([allNodes[i][j], allNodes[i-1][j], allNodes[i+1][j]]);
                    }

                }
            }
        }
    }

    const allSpaces = new Set();
    for (let i = 0; i < allWalls.length; i++) {
        allSpaces.add(allWalls[i][1]);  // spaces
        allSpaces.add(allWalls[i][2]);  // spaces
    }
    const UFDS = new UnionFind(Array.from(allSpaces));
    allWalls = shuffleArray(allWalls);

    let wall, space1, space2;

    for (let i = 0; i < allWalls.length; i++) {
        [wall, space1, space2] = allWalls[i];
        if (!UFDS.isSameSet(space1, space2)) {
            UFDS.unionSet(space1, space2);
            wall.setWall(false);
            yield new Frame([wall]);
        }
    }
}

export function * prim(allNodes) {

    const numRows = allNodes.length;
    const numCols = allNodes[0].length;

   // ======================== grids ========================

    const genGridFunc = genAllWalls(allNodes);
    yield genGridFunc.next().value;
    const allWalkable = genGridFunc.next().value;

    // contains a bunch of arrays
    // each array has 3 nodes: a wall, and the 2 nodes it divides
    let allWalls = [];  
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (i !== 0 && i !== numRows -1) {
                if (j !== 0 && j !== numCols - 1) {
                    
                    if (i % 2 === 1 && j % 2 === 0) {  // its left and right are paths
                        allWalls.push([allNodes[i][j], allNodes[i][j-1], allNodes[i][j+1]]);
                    } else if (i % 2 === 0 && j % 2 === 1) {  // its up and down are paths
                        allWalls.push([allNodes[i][j], allNodes[i-1][j], allNodes[i+1][j]]);
                    }

                }
            }
        }
    }

    const visited = [];
    for (let i = 0; i < numRows; i++) visited.push(new Array(numCols).fill(false));
    
    const visitedNodes = new Set();

    allWalls = shuffleArray(allWalls);
    let [wall, space1, space2] = allWalls.pop();
    space1.setWall(false);
    visitedNodes.add(space1);
    yield new Frame([space1]);

    while (visitedNodes.size !== allWalkable.length) {
        [wall, space1, space2] = allWalls.pop();
        if (visitedNodes.has(space1) && !visitedNodes.has(space2)) {
            visitedNodes.add(space2);
            space2.setWall(false);
            wall.setWall(false);
            yield new Frame([wall, space2]);
        } else if (!visitedNodes.has(space1) && visitedNodes.has(space2)) {
            visitedNodes.add(space1);
            space1.setWall(false);
            wall.setWall(false);
            yield new Frame([wall, space1]);
        } else {
            allWalls.unshift([wall, space1, space2]);
        }
    }

  

}

export function * wrongGrowingTree(allNodes) {

    const numRows = allNodes.length;
    const numCols = allNodes[0].length;

   // ======================== grids ========================

    const genGridFunc = genGrid(allNodes);
    yield genGridFunc.next().value;
    const allWalkable = genGridFunc.next().value;

    const visited = [];
    for (let i = 0; i < numRows; i++) visited.push(new Array(numCols).fill(false));

    let curNode = allWalkable[randBetween(0, allWalkable.length)];
    let listOfCells = [curNode];

    let noNeighbour;
    let randNeighbour;
    let wall;

    let filterFuncGen = node => x => x!==node;

    while (true) {
        noNeighbour = true;
        curNode = listOfCells[randBetween(0, listOfCells.length)];
        visited[curNode.rowNum][curNode.colNum] = true;

        shuffleArray(curNode.mazeNeighbours);
        for (randNeighbour of curNode.mazeNeighbours) {
            if (!visited[randNeighbour.rowNum][randNeighbour.colNum]) {

                wall = curNode.nodeBetween(allNodes, randNeighbour);
                wall.setWall(false);
                yield new Frame([wall]);

                // add to list
                listOfCells.push(randNeighbour);

                noNeighbour = false;
                break;
            }
        }
        if (noNeighbour) {  // remove from array
            listOfCells = listOfCells.filter(filterFuncGen(curNode));
        }
        if (listOfCells.length === 0) break;
    }
}

export function * randomTree(allNodes) {

    const numRows = allNodes.length;
    const numCols = allNodes[0].length;

   // ======================== grids ========================

   const genGridFunc = genGrid(allNodes);
   yield genGridFunc.next().value;
   const allWalkable = genGridFunc.next().value;

    for (let i = 0; i < allWalkable.length; i++) {
        const curNode = allWalkable[i];

        // random number
        let numWallsToRemove = randBetween(1, 4);
        let wallsToRemove = fewRandBetween(0, 4, numWallsToRemove);
        for (const w of wallsToRemove) {
            let n;
            if (w === 0 && curNode.rowNum > 1) n = allNodes[curNode.rowNum-1][curNode.colNum];
            else if (w === 1 && curNode.colNum < numCols-2) n = allNodes[curNode.rowNum][curNode.colNum+1];
            else if (w === 2 && curNode.rowNum < numRows-2) n = allNodes[curNode.rowNum+1][curNode.colNum];
            else if (w === 3 && curNode.colNum > 1) n = allNodes[curNode.rowNum][curNode.colNum-1];
            if (!n) continue;
            n.setWall(false);
            yield new Frame([n]);
        }
    }
}

export function * CAMaze(allNodes) {

    // https://www.conwaylife.com/wiki/OCA:Maze
    //  rulestring B3/S12345)

    const numRows = allNodes.length;
    const numCols = allNodes[0].length;

    let allNodesCopy = allNodes.map(i => i.map(n => n.makeCopy()));

    // ======================== random start? ========================

    const startFrameNodes = [];
    const lrMid = between(0, numCols - 1);
    const udMid = between(0, numRows - 1);
    const randNum = randBetween(5, 7);
    for (let i = 0; i < randNum; i++) {
        const randRow = randBetween(udMid - 1, udMid + 2);
        const randCol = randBetween(lrMid - 1, lrMid + 2);
        if (allNodesCopy[randRow][randCol].isWall) {
            i --;
            continue;
        }
        allNodesCopy[randRow][randCol].setWall(true);
        startFrameNodes.push(allNodesCopy[randRow][randCol]);
    }
    yield new Frame(startFrameNodes, Frame.WALL);

    // ======================== CA? ========================

    let neverChange;
    let curNode;

    for (let c = 0; c < MAX_LOAD; c++) {
        neverChange = true;
        const oneFrame = [];
        genAll(allNodesCopy);  // regenerate neighbours
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                curNode = allNodesCopy[i][j];
                
                // if dead, and have 3 live neighbours, come alive
                if (!curNode.isWall) {
                    if (curNode.wallNeighbours.length === 3) {
                        curNode.setWall(true);
                        oneFrame.push(curNode);
                        neverChange = false;
                    }
                } else {  // if alive, stay alive if 1-5 neighbours
                    if (curNode.wallNeighbours.length === 0 || curNode.wallNeighbours.length > 5) {
                        curNode.setWall(false);
                        oneFrame.push(curNode);
                        neverChange = false;
                    }
                }
            }
        }
        if (!neverChange) yield new Frame(oneFrame);
        else c = MAX_LOAD;
    }
    return;
}

export function * CAMazeCetric(allNodes) {

    // https://www.conwaylife.com/wiki/OCA:Maze
    //  rulestring B3/S12345)

    const numRows = allNodes.length;
    const numCols = allNodes[0].length;

    let allNodesCopy = allNodes.map(i => i.map(n => n.makeCopy()));

    // ======================== random start? ========================

    const startFrameNodes = [];
    const lrMid = between(0, numCols - 1);
    const udMid = between(0, numRows - 1);
    const randNum = randBetween(5, 7);
    for (let i = 0; i < randNum; i++) {
        const randRow = randBetween(udMid - 1, udMid + 2);
        const randCol = randBetween(lrMid - 1, lrMid + 2);
        if (allNodesCopy[randRow][randCol].isWall) {
            i --;
            continue;
        }
        allNodesCopy[randRow][randCol].setWall(true);
        startFrameNodes.push(allNodesCopy[randRow][randCol]);
    }
    yield new Frame(startFrameNodes, Frame.WALL);

    // ======================== CA? ========================

    let neverChange;
    let curNode;

    for (let c = 0; c < MAX_LOAD; c++) {
        neverChange = true;
        const oneFrame = [];
        genAll(allNodesCopy);  // regenerate neighbours
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                curNode = allNodesCopy[i][j];
                
                // if dead, and have 3 live neighbours, come alive
                if (!curNode.isWall) {
                    if (curNode.wallNeighbours.length === 3) {
                        curNode.setWall(true);
                        oneFrame.push(curNode);
                        neverChange = false;
                    }
                } else {  // if alive, stay alive if 1-4 neighbours, mazeCentric is 4
                    if (curNode.wallNeighbours.length === 0 || curNode.wallNeighbours.length > 4) {
                        curNode.setWall(false);
                        oneFrame.push(curNode);
                        neverChange = false;
                    }
                }
            }
        }
        if (!neverChange) yield new Frame(oneFrame);
        else c = MAX_LOAD;
    }
    return;
}

export function * CATest(allNodes) {

    // https://www.conwaylife.com/wiki/OCA:Maze
    //  rulestring B3/S12345)

    const numRows = allNodes.length;
    const numCols = allNodes[0].length;

    let allNodesCopy = allNodes.map(i => i.map(n => n.makeCopy()));

    // ======================== random start? ========================

    const startFrameNodes = [];
    const lrMid = between(0, numCols - 1);
    const udMid = between(0, numRows - 1);
    const randNum = randBetween(5, 7);
    for (let i = 0; i < randNum; i++) {
        const randRow = randBetween(udMid - 1, udMid + 2);
        const randCol = randBetween(lrMid - 1, lrMid + 2);
        if (allNodesCopy[randRow][randCol].isWall) {
            i --;
            continue;
        }
        allNodesCopy[randRow][randCol].setWall(true);
        startFrameNodes.push(allNodesCopy[randRow][randCol]);
    }
    yield new Frame(startFrameNodes, Frame.WALL);

    // ======================== CA? ========================

    let neverChange;
    let curNode;
    let oneFrame;

    // 1, 1-4 interesting

    for (let c = 0; c < MAX_LOAD; c++) {
        // console.log(c);
        neverChange = true;
        oneFrame = [];
        genAll(allNodesCopy);  // regenerate neighbours
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                curNode = allNodesCopy[i][j];
                
                // if dead, and have 3 live neighbours, come alive
                if (!curNode.isWall) {
                    if (curNode.wallNeighbours.length === 1) {
                        curNode.setWall(true);
                        oneFrame.push(curNode);
                        neverChange = false;
                    }
                } else {  // if alive, stay alive if 1-4 neighbours, mazeCentric is 4, maze is 5
                    if (curNode.wallNeighbours.length === 0 || curNode.wallNeighbours.length > 3) {
                        curNode.setWall(false);
                        oneFrame.push(curNode);
                        neverChange = false;
                    }
                }
            }
        }
        if (!neverChange) yield new Frame(oneFrame);
        else c = MAX_LOAD;
    }
    return;
}

export function * fillDeadEnds(allNodes) {

    const numRows = allNodes.length;
    const numCols = allNodes[0].length;

    let allNodesCopy = allNodes.map(i => i.map(n => n.makeCopy()));

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            allNodesCopy[i][j].generateNeighbours(allNodesCopy, false);
        }
    }

    let changed;
    let thisFrame;
    while (true) {
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                allNodesCopy[i][j].generateNeighbours(allNodesCopy, false);
                allNodesCopy[i][j].genWallNeighbours(allNodesCopy, false);
            }
        }
        changed = false;
        thisFrame = [];
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                const curNode = allNodesCopy[i][j];
                if (curNode.isStart || curNode.isEnd) continue;
                // is not a wall, only 1 neighbour or all neighbours are walls
                if (!curNode.isWall && (curNode.neighbours.length === 1 || curNode.wallNeighbours.length === curNode.numPossibleNeighbours())) {
                    allNodesCopy[i][j].setWall(true);
                    thisFrame.push(allNodesCopy[i][j]);
                    changed = true;
                }
            }
        }
        if (!changed) break;
        yield new Frame(thisFrame, Frame.WALL);
    }
}


export function randCA(allNodes) {

    const numRows = allNodes.length;
    const numCols = allNodes[0].length;
    const displayFrames = [];

    let allNodesCopy = allNodes.map(i => i.map(n => n.makeCopy()));

    function genAll(nodes) {
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                nodes[i][j].genWallNeighbours(nodes, true);
            }
        }
        return nodes;
    }

    genAll(allNodesCopy);

    const startFrameNodes = [];
    for (let i = 0; i < 20; i++) {  // 20 random 
        const randRow = randBetween(0, numRows);
        const randCol = randBetween(0, numCols);
        allNodesCopy[randRow][randCol].setWall(true);
        startFrameNodes.push(allNodesCopy[randRow][randCol]);
    }
    displayFrames.push(new Frame(startFrameNodes, Frame.WALL));

    // lets try
    
    for (let c = 0; c < 20; c++) {
        const oneFrame = [];
        genAll(allNodesCopy);  // regenerate neighbours
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                if (allNodesCopy[i][j].wallNeighbours.length >= 1 && allNodesCopy[i][j].wallNeighbours.length <= 2) {
                    if (Math.random() < 0.1) {
                        allNodesCopy[i][j].setWall(true);
                        oneFrame.push(allNodesCopy[i][j]);
                    }
                }
            }
        }
        displayFrames.push(new Frame(oneFrame));
    }

    return displayFrames;
}


export function randMaze(allNodes) {

    const numRows = allNodes.length;
    const numCols = allNodes[0].length;

    let displayFrames = [];

    function fillRow(rowOrColNum, left, right, up, down) {
        let nodesToChange = [];
        for (let j = left; j < right; j++) {
            // nodesToChange.push(allNodes[rowNum][j]);
            nodesToChange.push(new Frame([allNodes[rowOrColNum][j]], Frame.WALL));
        }
        // remove random one
        // delete nodesToChange[randBetween(left, right)];
        nodesToChange.splice(randBetween(left+1, between(left+1, right-1)), 1);
        nodesToChange.splice(randBetween(between(left+1, right-1), right-1), 1);
        displayFrames = displayFrames.concat(nodesToChange);
        // return nodesToChange.map(n => new Frame([n], Frame.WALL));
        // return new Frame(nodesToChange, Frame.WALL);
    }

    function fillCol(rowOrColNum, left, right, up, down) {
        const nodesToChange = [];
        for (let i = up; i < down; i++) {
            // nodesToChange.push(allNodes[i][colNum]);
            nodesToChange.push(new Frame([allNodes[i][rowOrColNum]], Frame.WALL));
        }
        // remove random one
        // delete nodesToChange[randBetween(up, down)];
        nodesToChange.splice(randBetween(up+1, between(up+1, down-1)), 1);
        nodesToChange.splice(randBetween(between(up+1, down-1), down-1), 1);
        displayFrames = displayFrames.concat(nodesToChange);
    }

    function helper(rowOrColNum, l, r, u, d, doRow) {
        // console.log(`${rowOrColNum} ${l} ${r} ${u} ${d}`);
        // if (l+1 === rowOrColNum || rowOrColNum+1 ==) return;
        if (doRow) {
            if (u + 1 >= rowOrColNum || rowOrColNum + 1 >= d) return;
            fillRow(rowOrColNum, l, r, u, d);
            // helper(l + between(l, r), l, r, u, rowOrColNum, !doRow);
            // helper(l + between(l, r), l, r, rowOrColNum+1, d, !doRow);
            const y = between(l, r);
            helper(l + y, l, r, u, rowOrColNum-2, !doRow);
            helper(l + y, l, r, rowOrColNum+2, d, !doRow);
        } else {
            if (l + 1 >= rowOrColNum || rowOrColNum + 1 >= r) return;
            fillCol(rowOrColNum, l, r, u, d);
            const y = between(u, d);
            // helper(u + between(u, d), l, rowOrColNum, u, d, !doRow);
            // helper(u + between(u, d), rowOrColNum+1, r, u, d, !doRow);
            helper(u + y, l, rowOrColNum-2, u, d, !doRow);
            helper(u + y, rowOrColNum+2, r, u, d, !doRow);
        }
    }

    helper(between(0, numRows), 0, numCols, 0, numRows, true);

    return displayFrames;
}