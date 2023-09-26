/**
 * Represents an element in the priority queue.
 * @template T - The type of value stored in the element.
 */
type PriorityQueueElement<T> = {
    /**
     * The value stored in the element.
     */
    value: T

    /**
     * The priority associated with the value.
     */
    priority: number
}
