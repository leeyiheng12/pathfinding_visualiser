import Queue from "./Queue";
import FastPriorityQueue from "fastpriorityqueue";
import Frame from "./Frame";


export function manhattanDistance(point1, point2) {
    return Math.abs(point1.getX()-point2.getX()) + Math.abs(point1.getY()-point2.getY());
}


export function euclideanDistance(point1, point2) {
    return ((point1.getX() - point2.getX()) ** 2 + (point1.getY() - point2.getY()) ** 2) ** 0.5
}

export function bestFirstSearch(startNode, endNode, allNodes, heuristicFunction) {

    // https://github.com/lemire/FastPriorityQueue.js/
    const q = new FastPriorityQueue((arr1, arr2) => arr1[1] < arr2[1]);
    q.add([startNode, 0]);

    const cameFrom = new Map();
    cameFrom.set(startNode, null);

    let found = false;

    let displayFrames = [];
    let thisFrameFrontierNodes;

    while (q.size > 0 && !found) {
        const output = q.poll();
        const curNode = output[0];  // since I insert [node, priority]
        if (!curNode.neighbours) continue;

        thisFrameFrontierNodes = [];  // for visualisation purposes
        for (let i = 0; i < curNode.neighbours.length && !found; i++) {
            let neighbour = curNode.neighbours[i];
            if (neighbour.isEnd) {
                endNode = neighbour;
                cameFrom.set(endNode, curNode);
                found = true;  // end early
            }
            if (!cameFrom.has(neighbour)) {  // has not been evaluated before
                cameFrom.set(neighbour, curNode);  // remember where it came from
                thisFrameFrontierNodes.push(neighbour);  // for visualisation
                const heuristic = heuristicFunction(neighbour, endNode);
                q.add([neighbour, heuristic]);
            }
        }

        // at this frame, the frontier nodes should light up
        const x = new Frame(thisFrameFrontierNodes, Frame.FRONTIER);
        displayFrames.push(x);
        
        // at this frame, the visited node should be displayed as closed
        const y = new Frame([curNode], Frame.CLOSED)
        displayFrames.push(y);
    }

    if (!found) return [displayFrames, null];

    // for visualisation
    const pathFrames = [];
    for (let i = 1; endNode !== null; i++) {
        pathFrames.push(new Frame([endNode], Frame.PATH));
        endNode = cameFrom.get(endNode);
    }
    pathFrames.reverse();

    // want to return an array of 2 arrays
    // first array is array of Frames showing the visualisation of pathfinding, to be shown first
    // second array is array of Frames showing the final path
    return [displayFrames, pathFrames];
}


export function bfs(startNode, endNode, allNodes, heuristicFunction) {

    const q = new Queue();
    q.enqueue(startNode);

    const cameFrom = new Map();
    cameFrom.set(startNode, null);

    let found = false;

    let displayFrames = [];
    let thisFrameFrontierNodes;

    while (q.length() > 0 && !found) {
        const curNode = q.dequeue();
        if (curNode.neighbours === null) continue;

        thisFrameFrontierNodes = [];  // for visualisation purposes
        for (let i = 0; i < curNode.neighbours.length && !found; i++) {
            let neighbour = curNode.neighbours[i];
            if (neighbour.isEnd) {
                endNode = neighbour;
                cameFrom.set(endNode, curNode);
                found = true;  // end early
            }
            if (!cameFrom.has(neighbour)) {  // has not been evaluated before
                cameFrom.set(neighbour, curNode);  // remember where it came from
                thisFrameFrontierNodes.push(neighbour);  // for visualisation
                q.enqueue(neighbour);
            }
        }
        // at this frame, the frontier nodes should light up
        const x = new Frame(thisFrameFrontierNodes, Frame.FRONTIER);
        displayFrames.push(x);
        
        // at this frame, the visited node should be displayed as closed
        const y = new Frame([curNode], Frame.CLOSED)
        displayFrames.push(y);
    }

    if (!found) return [displayFrames, null];

    // for visualisation
    const pathFrames = [];
    for (let i = 1; endNode !== null; i++) {
        pathFrames.push(new Frame([endNode], Frame.PATH));
        endNode = cameFrom.get(endNode);
    }
    pathFrames.reverse();

    return [displayFrames, pathFrames];
}

export function aStar(startNode, endNode, allNodes, heuristicFunction) {

    // https://github.com/lemire/FastPriorityQueue.js/
    const q = new FastPriorityQueue((arr1, arr2) => arr1[1] < arr2[1]);  // open list
    q.add([startNode, 0]);

    const nodesInQ = new Set();
    nodesInQ.add(startNode);

    const cameFrom = new Map();
    cameFrom.set(startNode, null);

    const gScores = new Map();  // movement cost from startNode
    const fScores = new Map();
    for (let i = 0; i < allNodes.length; i++) {
        for (let j = 0; j < allNodes[i].length; j++) {
            gScores.set(allNodes[i][j], Infinity);
            fScores.set(allNodes[i][j], Infinity);
        }
    }

    gScores.set(startNode, 0);
    gScores.set(startNode, heuristicFunction(startNode, endNode));

    let found = false;

    let displayFrames = [];
    let thisFrameFrontierNodes;

    while (q.size > 0 && !found) {
        const output = q.poll();
        const curNode = output[0];  // since I insert [node, priority]
        nodesInQ.delete(curNode);

        if (curNode.neighbours === null) continue;

        thisFrameFrontierNodes = [];  // for visualisation purposes

        for (let i = 0; i < curNode.neighbours.length && !found; i++) {
            let neighbour = curNode.neighbours[i];
            if (neighbour.isEnd) {
                endNode = neighbour;
                cameFrom.set(endNode, curNode);
                found = true;  // end early
            }
            
            const tempGScore = gScores.get(curNode) + heuristicFunction(curNode, neighbour);  // weight of edge from current to neighbour
            if (tempGScore < gScores.get(neighbour)) {  // this is a better path
                cameFrom.set(neighbour, curNode);
                gScores.set(neighbour, tempGScore);
                fScores.set(neighbour, tempGScore + heuristicFunction(neighbour, endNode));
                if (!nodesInQ.has(neighbour)) {  // neighbour not in priority queue
                    q.add([neighbour, fScores.get(neighbour)]);
                    nodesInQ.add(neighbour);
                    thisFrameFrontierNodes.push(neighbour);  // for visualisation
                }
            }
        }

        // at this frame, the frontier nodes should light up
        const x = new Frame(thisFrameFrontierNodes, Frame.FRONTIER);
        displayFrames.push(x);
        
        // at this frame, the visited node should be displayed as closed
        const y = new Frame([curNode], Frame.CLOSED)
        displayFrames.push(y);
    }

    if (!found) return [displayFrames, null];

    // for visualisation
    const pathFrames = [];
    for (let i = 1; endNode !== null; i++) {
        pathFrames.push(new Frame([endNode], Frame.PATH));
        endNode = cameFrom.get(endNode);
    }
    pathFrames.reverse();

    // want to return an array of 2 arrays
    // first array is array of Frames showing the visualisation of pathfinding, to be shown first
    // second array is array of Frames showing the final path
    return [displayFrames, pathFrames];
}