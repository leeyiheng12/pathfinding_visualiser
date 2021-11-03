class Node {
    constructor(rows, cols, rowNum, colNum) {  // top left is 0,0
        this.totalRows = rows;
        this.totalCols = cols;
        this.rowNum = rowNum;
        this.colNum = colNum;

        this.isOpen = true;
        this.isClosed = false;
        this.isWall = false;
        this.isStart = false;
        this.isEnd = false;
        this.isFrontier = false;
        this.isPath = false;

        this.neighbours = [];
    }

    // refresh() {
    //     const x = new Node(this.totalRows, this.totalCols, this.rowNum, this.colNum);
    //     x.isOpen = this.isOpen;
    //     x.isWall = this.isWall;
    //     x.isStart = this.isStart;
    //     x.isEnd = this.isEnd;
    //     x.isFrontier = this.isFrontier;
    //     return x;
    // }

    makeCopy() {
        const nn = new Node(this.totalRows, this.totalCols, this.rowNum, this.colNum);
        nn.isOpen = this.isOpen;
        nn.isClosed = this.isClosed;
        nn.isWall = this.isWall;
        nn.isStart = this.isStart;
        nn.isEnd = this.isEnd;
        nn.isFrontier = this.isFrontier;
        nn.isPath = this.isPath;
        nn.neighbours = this.neighbours;
        return nn;
    }

    nodeDetails() {
        return {
            "rowNum": this.rowNum,
            "colNum": this.colNum,
            "isOpen": this.isOpen,
            "isWall": this.isWall,
            "isStart": this.isStart,
            "isEnd": this.isEnd,
            "isFrontier": this.isFrontier,
        }
    }

    getX() {
        return this.rowNum;
    }

    getY() {
        return this.colNum;
    }

    isEqual(anotherNode) {
        const otherDetails = anotherNode.nodeDetails();
        return this.rowNum === otherDetails.rowNum
        && this.colNum === otherDetails.colNum
        && this.isOpen === otherDetails.isOpen
        && this.isWall === otherDetails.isWall
        && this.isStart === otherDetails.isStart
        && this.isEnd === otherDetails.isEnd
        && this.isFrontier !== otherDetails.isFrontier;
    }

    toggleOpen() {
        this.isOpen = !this.isOpen;
    }

    setOpen() {
        this.isOpen = true;
        this.isClosed = false;
    }

    setClosed() {
        this.isOpen = false;
        this.isClosed = true;
    }

    setWall(bool) {
        if (bool && (this.isStart || this.isEnd)) return;
        this.isWall = bool;
    }

    setStart(bool) {
        this.isStart = bool;
    }

    setEnd(bool) {
        this.isEnd = bool;
    }

    setFrontier(bool) {
        this.isFrontier = bool;
    }
    
    setPath(bool) {
        this.isPath = bool;
    }

    reset() {
        this.unpath();
        this.isWall = false;
        this.isStart = false;
        this.isEnd = false;
    }

    unpath() {
        this.isOpen = true;
        this.isClosed = false;
        this.isFrontier = false;
        this.isPath = false;
    }

    generateNeighbours(allNodes, allowDiagonal) {
        this.neighbours = [];
        const isTop = this.rowNum === 0;
        const isBottom = this.rowNum === this.totalRows - 1;
        const isLeft = this.colNum === 0;
        const isRight = this.colNum === this.totalCols - 1;

        if (!isTop) {

            if (!allNodes[this.rowNum-1][this.colNum].isWall) 
                this.neighbours.push(allNodes[this.rowNum-1][this.colNum]);  // node above it

            if (allowDiagonal && !isLeft) {
                if (!allNodes[this.rowNum-1][this.colNum-1].isWall) 
                    this.neighbours.push(allNodes[this.rowNum-1][this.colNum-1]);  // topleft
            }

            if (allowDiagonal && !isRight) {
                if (!allNodes[this.rowNum-1][this.colNum+1].isWall) 
                    this.neighbours.push(allNodes[this.rowNum-1][this.colNum+1]);  // topright
            }
        }

        if (!isBottom) {
            if (!allNodes[this.rowNum+1][this.colNum].isWall)
                this.neighbours.push(allNodes[this.rowNum+1][this.colNum]);  // node below it

            if (allowDiagonal && !isLeft) {
                if (!allNodes[this.rowNum+1][this.colNum-1].isWall)
                this.neighbours.push(allNodes[this.rowNum+1][this.colNum-1]);  // bottomleft
            }

            if (allowDiagonal && !isRight) {
                if (!allNodes[this.rowNum+1][this.colNum+1].isWall)
                this.neighbours.push(allNodes[this.rowNum+1][this.colNum+1]);  // bottomright
            }
        }

        if (!isLeft) {
            if (!allNodes[this.rowNum][this.colNum-1].isWall)
                this.neighbours.push(allNodes[this.rowNum][this.colNum-1]);  // node to its left
        }

        if (!isRight) {
            if (!allNodes[this.rowNum][this.colNum+1].isWall)
                this.neighbours.push(allNodes[this.rowNum][this.colNum+1]);  // node to its right
        }
    }

    genWallNeighbours(allNodes, allowDiagonal) {
        this.wallNeighbours = [];
        const isTop = this.rowNum === 0;
        const isBottom = this.rowNum === this.totalRows - 1;
        const isLeft = this.colNum === 0;
        const isRight = this.colNum === this.totalCols - 1;

        if (!isTop) {

            if (allNodes[this.rowNum-1][this.colNum].isWall) 
                this.wallNeighbours.push(allNodes[this.rowNum-1][this.colNum]);  // node above it

            if (allowDiagonal && !isLeft) {
                if (allNodes[this.rowNum-1][this.colNum-1].isWall) 
                    this.wallNeighbours.push(allNodes[this.rowNum-1][this.colNum-1]);  // topleft
            }

            if (allowDiagonal && !isRight) {
                if (allNodes[this.rowNum-1][this.colNum+1].isWall) 
                    this.wallNeighbours.push(allNodes[this.rowNum-1][this.colNum+1]);  // topright
            }
        }

        if (!isBottom) {
            if (allNodes[this.rowNum+1][this.colNum].isWall)
                this.wallNeighbours.push(allNodes[this.rowNum+1][this.colNum]);  // node below it

            if (allowDiagonal && !isLeft) {
                if (allNodes[this.rowNum+1][this.colNum-1].isWall)
                this.wallNeighbours.push(allNodes[this.rowNum+1][this.colNum-1]);  // bottomleft
            }

            if (allowDiagonal && !isRight) {
                if (allNodes[this.rowNum+1][this.colNum+1].isWall)
                this.wallNeighbours.push(allNodes[this.rowNum+1][this.colNum+1]);  // bottomright
            }
        }

        if (!isLeft) {
            if (allNodes[this.rowNum][this.colNum-1].isWall)
                this.wallNeighbours.push(allNodes[this.rowNum][this.colNum-1]);  // node to its left
        }

        if (!isRight) {
            if (allNodes[this.rowNum][this.colNum+1].isWall)
                this.wallNeighbours.push(allNodes[this.rowNum][this.colNum+1]);  // node to its right
        }
    }
}

export default Node;