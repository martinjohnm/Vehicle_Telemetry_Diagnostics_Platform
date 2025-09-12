


type QueryItem<T> = {
    value : T, 
    priority : number
}

export class MaxPriorityQueue<T> {
    public heap : QueryItem<T>[] = [];

    public parent(index: number) {
        return Math.floor((index-1)/2)
    }

    public leftChild(index: number) {
        return 2 * index + 1
    }

    public rightChild(index: number) {
        return 2 * index + 1
    }

    public swap(i : number, j: number) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]
    }

    enqueue(value: T, priority : number) {
      
        this.heap.push({value, priority})
        this.bubbleUp()
    }

    dequeue() {
        if (this.heap.length ===0 ) return undefined;
        if (this.heap.length ===1) return this.heap.pop();

        const max = this.heap[0]
        this.heap[0] = this.heap.pop()!;
        this.bubbleDown()

        return max;
    }

    peek(): T | undefined {
        if (this.heap.length > 1) {
            return this.heap[0].value;
        } else {
            return undefined
        }
        
    }

    size(): number {
        return this.heap.length
    }


    bubbleUp() {
        let index = this.heap.length - 1
        while (
            index > 0 &&
            this.heap[this.parent(index)].priority < this.heap[index].priority 
        ) {
            this.swap(index, this.parent(index));
            index = this.parent(index)
        }
    }

    bubbleDown() {
        let index = 0;
        while (this.leftChild(index) < this.heap.length) {
            let largerChildIndex = this.leftChild(index);

            if (
                this.rightChild(index) < this.heap.length && 
                this.heap[this.rightChild(index)].priority > this.heap[largerChildIndex].priority 
            ) {
                largerChildIndex = this.rightChild(index);
            }

            if (
                this.heap[index].priority >= this.heap[largerChildIndex].priority
            ) {
                break;
            }

            this.swap(index, largerChildIndex);
            index = largerChildIndex;
        }
    }
}