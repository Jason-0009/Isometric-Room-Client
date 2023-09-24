/**
 * Represents an element in the priority queue.
 */
type PriorityQueueElement<T> = {
    value: T         // The value stored in the element.
    priority: number // The priority associated with the value.
}

/**
 * A priority queue data structure.
 * Elements are stored based on their priority, with higher-priority elements
 * at the front of the queue.
 *
 * @template T - The type of elements stored in the queue.
 */
export default class PriorityQueue<T> {
    /**
     * An array of elements stored in the priority queue.
     */
    #elements: PriorityQueueElement<T>[] = []

    /**
     * Enqueues an element with the given priority.
     *
     * @param value - The element to enqueue.
     * @param priority - The priority of the element.
     */
    enqueue(value: T, priority: number): void {
        this.#elements.push({ value, priority })

        this.#sort()
    }

    /**
     * Dequeues and returns the highest-priority element.
     *
     * @returns The highest-priority element, or null if the queue is empty.
     */
    dequeue = (): T | null =>
        this.#isEmpty() ? null : this.#elements.shift()!.value

    /**
     * Checks if the queue contains a specific element.
     *
     * @param value - The element to check for.
     * @returns True if the element is found in the queue; otherwise, false.
     */
    contains = (value: T): boolean =>
        this.#elements.some(element => element.value === value)

    /**
     * Sorts the internal elements based on their priority.
     */
    #sort = (): PriorityQueueElement<T>[] =>
        this.#elements.sort((a, b) => a.priority - b.priority);

    /**
     * Checks if the queue is empty.
     *
     * @returns True if the queue is empty; otherwise, false.
     */
    #isEmpty = (): boolean => this.#elements.length === 0;
}
