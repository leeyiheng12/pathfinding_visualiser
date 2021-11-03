import React from "react";
import classes from "./Grid.module.css";

import NodeDisplay from "./NodeDisplay";

const Grid = props => {

    const allNodes = props.allNodes;
    
    const onDragHandler = (event, rowNum, colNum) => {
        // event.preventDefault();
        if (!props.enableInput) return;
        const thisNode = allNodes[rowNum][colNum];
        if (!thisNode.isStart && !thisNode.isEnd) {
            if (event.buttons === 1) {
                thisNode.setWall(true);
                props.updateNode(thisNode);
            } 
            if (event.buttons === 2) {
                thisNode.setWall(false);
                props.updateNode(thisNode);
            }
        }
    }

    const onClickHandler = (event, rowNum, colNum) => {
        if (!props.enableInput) return;
        const thisNode = allNodes[rowNum][colNum];
        if (!props.startNode && !thisNode.isEnd) {  // haven't selected start
            props.setStartNode(thisNode);
            thisNode.setWall(false);
            thisNode.setStart(true);
        } else if (props.startNode && thisNode.isStart) {  // selected start, it's this
            props.setStartNode(null);
            thisNode.setStart(false);
        } else if (!props.endNode) {  // haven't selected end
            props.setEndNode(thisNode);
            thisNode.setWall(false);
            thisNode.setEnd(true);
        } else if (props.endNode && thisNode.isEnd) {  // selected end, it's this
            props.setEndNode(null);
            thisNode.setEnd(false);
        } else {
            thisNode.setWall(!thisNode.isWall);
        }
        props.updateNode(thisNode);
    }

    return (<>
        <div className={classes.gridClass}>
            {allNodes.map(row => 
                row.map(n => <NodeDisplay
                key={2**n.rowNum * 3**n.colNum} 
                nodeClass={n}
                onClick={onClickHandler}
                onDrag={onDragHandler} />)
            )}

        </div>

    </>);
};

export default Grid;