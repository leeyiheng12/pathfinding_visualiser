class Node {
    constructor(key) {
        this.key = key;
        this.next = null;
        this.prev = null;
    }

    setNext(n) {
        this.next = n;
    }

    setPrev(n) {
        this.prev = n;
    }
}

export default Node;