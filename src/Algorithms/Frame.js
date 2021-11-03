
class Frame {
    static FRONTIER = 1;
    static CLOSED = 2;
    static PATH = 3;
    static WALL = 4;
    
    constructor(arrNodes, instruction) {
        this.arrNodes = arrNodes;
        this.instruction = instruction;
    }

    getNodes() {
        return this.arrNodes;
    }

    updateFrontier() {
        for (const node of this.arrNodes) {
            node.setFrontier(true);
        }
    }

    updateClosed() {
        for (const node of this.arrNodes) {
            node.setOpen(false);
        }
    }

    updatePath() {
        for (const node of this.arrNodes) {
            node.setPath(true);
        }
    }

    updateWall() {
        for (const node of this.arrNodes) {
            node.setWall(true);
        }
    }

    execute() {
        if (this.instruction === 1) this.updateFrontier();
        if (this.instruction === 2) this.updateClosed();
        if (this.instruction === 3) this.updatePath();
        if (this.instruction === 4) this.updateWall();
    }
}

export default Frame;