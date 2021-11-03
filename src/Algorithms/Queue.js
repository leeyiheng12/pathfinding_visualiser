class Node {
    constructor(key) {
        this.key = key;
        this.next = null;
    }

    setNext(n) {
        this.next = n;
    }
}

class Queue {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    enqueue(n) {
        if (this.head === null) {
            this.head = new Node(n);
            this.tail = this.head;
        } else {
            this.tail.setNext(new Node(n));
            this.tail = this.tail.next;
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

export default Queue;