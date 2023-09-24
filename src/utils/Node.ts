import Point3D from './Point3D'

/**
 * Represents a node in a pathfinding algorithm.
 */
class Node {
    /**
     * The position of the node in 3D space.
     * @type {Point3D}
     * @private
     */
    readonly #position: Point3D

    /**
     * Cost from the start node to this node (g).
     * @type {number}
     * @private
     */
    #gCost: number = 0

    /**
     * Heuristic (estimated) cost from this node to the goal node (h).
     * @type {number}
     * @private
     */
    #hCost: number = 0

    /**
     * Total cost of the node, which is the sum of gCost and hCost (fCost).
     * @type {number}
     * @private
     */
    #fCost: number = 0

    /**
     * Parent node for tracing the path.
     * @type {Node | null}
     * @private
     */
    #parent: Node | null = null

    /**
     * Creates a new Node instance.
     * @param {Point3D} position - The position of the node in 3D space.
     */
    constructor(position: Point3D) {
        this.#position = position
    }

    /**
     * Get the position of the node.
     * @type {Point3D}
     * @returns {Point3D} - The position of the node.
     */
    get position(): Point3D {
        return this.#position
    }

    /**
     * Get the cost from the start node to this node (gCost).
     * @type {number}
     * @returns {number} - The cost from the start node to this node.
     */
    get gCost(): number {
        return this.#gCost
    }

    /**
     * Set the cost from the start node to this node (gCost).
     * @param {number} value - The cost from the start node to this node.
     */
    set gCost(value: number) {
        this.#gCost = value
    }

    /**
     * Get the heuristic cost from this node to the goal node (hCost).
     * @type {number}
     * @returns {number} - The heuristic cost from this node to the goal node.
     */
    get hCost(): number {
        return this.#hCost
    }

    /**
     * Set the heuristic cost from this node to the goal node (hCost).
     * @param {number} value - The heuristic cost from this node to the goal node.
     */
    set hCost(value: number) {
        this.#hCost = value
    }

    /**
     * Get the total cost of the node (fCost).
     * @type {number}
     * @returns {number} - The total cost of the node.
     */
    get fCost(): number {
        return this.#fCost
    }

    /**
     * Set the total cost of the node (fCost).
     * @param {number} value - The total cost of the node.
     */
    set fCost(value: number) {
        this.#fCost = value
    }

    /**
     * Get the parent node for tracing the path.
     * @type {Node | null}
     * @returns {Node | null} - The parent node of this node.
     */
    get parent(): Node | null {
        return this.#parent
    }

    /**
     * Set the parent node for tracing the path.
     * @param {Node | null} value - The parent node of this node.
     */
    set parent(value: Node | null) {
        this.#parent = value
    }
}

export default Node
