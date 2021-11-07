class UnionFind {
    
    constructor(arr) {
        this.p = [];
        this.rank = [];
        this.elmToIdx = new Map();
        for (let i = 0; i < arr.length; i++) {
            this.p[i] = i;
            this.rank[i] = 0;
            this.elmToIdx.set(arr[i], i);
        }
    }

    findSet(elm) {
        return this.findSetHelper(this.elmToIdx.get(elm));
    }

    findSetHelper(i) {
        if (this.p[i] === i) return i;
        else {
            this.p[i] = this.findSetHelper(this.p[i]);
            return this.p[i]; 
        } 
    }

    isSameSet(elm1, elm2) { 
        return this.findSet(elm1) === this.findSet(elm2); 
    }

    unionSet(elm1, elm2) { 
        if (!this.isSameSet(elm1, elm2)) { 
            const x = this.findSet(elm1);
            const y = this.findSet(elm2);
            // rank is used to keep the tree short
            if (this.rank[x] > this.rank[y]) 
                this.p[y] = x;
            else { 
                this.p[x] = y;
                if (this.rank[x] === this.rank[y]) 
                    this.rank[y] = this.rank[y]+1; 
            } 
        } 
    }
}

export default UnionFind;