import Node from "./Node";

class Stack {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    enqueue(n) {
        const nd = new Node(n);
        if (this.head === null) {
            this.head = nd;
            this.tail = this.head;
        } else {
            nd.setNext(this.head);
            this.head = nd;
        }
        this.size++;
    }

    dequeue() {
        const first = this.head;
        this.head = this.head.next;
        this.size--;
        return first.key;
    }

    length() {
        return this.size;
    }
}

export default Stack;