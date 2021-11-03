import React from "react";
import classes from "./NodeDisplay.module.css";


const NodeDisplay = React.memo(props => {
    
    const node = props.nodeClass;

    const clickHandler = event => {
        event.preventDefault();
        // alert(`${node.rowNum} ${node.colNum}`);
        props.onClick(event, node.rowNum, node.colNum);
    }
    
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
    const moveHandler = event => {
        event.preventDefault();
        if (event.buttons === 1 || event.buttons === 2) {
            props.onDrag(event, node.rowNum, node.colNum);
        }
    }

    const rightClass = node.isStart 
        ? classes.startStyle 
        : node.isEnd
            ? classes.endStyle
            : node.isWall
                ? classes.wallStyle
                : node.isPath
                    ? classes.pathStyle
                    : node.isClosed
                        ? classes.closedStyle
                        : node.isFrontier
                            ? classes.frontierStyle
                                : classes.openStyle;

    return (<div className={`${classes.nodeClass} ${rightClass}`}
        onClick={clickHandler}
        onMouseEnter={moveHandler}
        onMouseDown={e => e.preventDefault()}
        onContextMenu={e => e.preventDefault()}
        >
    </div>);
}, (prevProp, nextProp) => prevProp.nodeClass.isEqual(nextProp.nodeClass));

export default NodeDisplay;