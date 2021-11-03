import Frame from "./Frame";

const MAX_LOAD = 100;

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

function genAll(nodes) {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes[0].length; j++) {
            nodes[i][j].genWallNeighbours(nodes, true);
        }
    }
    return nodes;
}

export function * binaryTree(allNodes) {

    const numRows = allNodes.length;
    const numCols = allNodes[0].length;

    let allNodesCopy = allNodes.map(i => i.map(n => n.makeCopy()));

   // ======================== grids ========================

    const borders = [];
    const allWalkable = [];
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (i % 2 === 1 || j % 2 === 1) {
                allNodesCopy[i][j].setWall(true);
                borders.push(allNodesCopy[i][j]);
            } else {
                allWalkable.push(allNodesCopy[i][j]);
            }
        }
    }
    yield new Frame(borders);

    for (let i = 0; i < allWalkable.length; i++) {
        const curNode = allWalkable[i];
        let n;

        // north or west
        let w = randBetween(1, 3) % 2;
        if (w === 0) {  // north
            if (curNode.rowNum > 0) n = allNodesCopy[curNode.rowNum-1][curNode.colNum];
        }  // west
        if (w === 1) {
            if (curNode.colNum > 0) n = allNodesCopy[curNode.rowNum][curNode.colNum-1]
        }

        if (n) {
            const nn = n.makeCopy();
            nn.setWall(false);
            yield new Frame([nn]);
        }
    }
}

export function * randomTree(allNodes) {

    const numRows = allNodes.length;
    const numCols = allNodes[0].length;

    let allNodesCopy = allNodes.map(i => i.map(n => n.makeCopy()));

   // ======================== grids ========================

    const borders = [];
    const allWalkable = [];
    // let walkable;
    for (let i = 0; i < numRows; i++) {
        // walkable = [];
        for (let j = 0; j < numCols; j++) {
            if (i % 2 === 1 || j % 2 === 1) {
                borders.push(allNodesCopy[i][j]);
            } else {
                allWalkable.push(allNodesCopy[i][j]);
            }
        }
    }
    yield new Frame(borders, Frame.WALL);

    for (let i = 0; i < allWalkable.length; i++) {
        const curNode = allWalkable[i];

        // random number
        let numWallsToRemove = randBetween(1, 4);
        let wallsToRemove = fewRandBetween(0, 4, numWallsToRemove);
        for (const w of wallsToRemove) {
            let n;
            if (w === 0 && curNode.rowNum > 0) n = allNodesCopy[curNode.rowNum-1][curNode.colNum];
            if (w === 1 && curNode.colNum < numCols-1) n = allNodesCopy[curNode.rowNum][curNode.colNum+1];
            if (w === 2 && curNode.rowNum < numRows-1) n = allNodesCopy[curNode.rowNum+1][curNode.colNum];
            if (w === 3 && curNode.colNum > 0) n = allNodesCopy[curNode.rowNum][curNode.colNum-1];
            if (!n) continue;
            const nn = n.makeCopy();
            nn.setWall(false);
            yield new Frame([nn]);
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
            }
        }
        changed = false;
        thisFrame = [];
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                const curNode = allNodesCopy[i][j];
                if (!curNode.isStart && !curNode.isEnd && !curNode.isWall && curNode.neighbours.length === 1) {  // is not a wall, only 1 neighbour
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