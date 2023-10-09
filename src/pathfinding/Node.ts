import Point3D from '@utils/Point3D'

/**
 * Represents a node in a pathfinding algorithm.
 *
 * A node has a position in 3D space, a cost from the start node to this node (gCost),
 * a heuristic (estimated) cost from this node to the goal node (hCost), and a total cost
 * (fCost), which is the sum of gCost and hCost.
 *
 * A node also has a parent node for tracing the path.
 */
export default class Node {
    /**
     * The position of the node in 3D space.
     * 
     * @type {Point3D}
     */
    readonly #position: Point3D

    /**
     * Cost from the start node to this node.
     * 
     * @type {number}
     */
    #gCost: number = 0

    /**
     * Heuristic (estimated) cost from this node to the goal node.
     * 
     * @type {number}
     */
    #hCost: number = 0

    /**
     * Total cost of the node, which is the sum of gCost and hCost.
     * 
     * @type {number}
     */
    #fCost: number = 0

    /**
     * Parent node for tracing the path.
     * 
     * @type {Node | null}
     */
    #parent: Node | null = null

    /**
     * Height of the node in 3D space.
     * 
     * @type {number}
     */
    #height: number = 0

    /**
     * Creates a new Node instance.
     *
     * @param {Point3D} position - The position of the node in 3D space.
     */
    constructor(position: Point3D) {
        this.#position = position
    }

    /**
     * Get the position of the node.
     *
     * @type {Point3D}
     * @returns {Point3D} - The position of the node.
     */
    get position(): Point3D {
        return this.#position
    }

    /**
     * Get the cost from the start node to this node.
     *
     * @type {number}
     * @returns {number} - The cost from the start node to this node.
     */
    get gCost(): number {
        return this.#gCost
    }

    /**
     * Set the cost from the start node to this node.
     *
     * @param {number} value - The new cost from the start node to this node.
     */
    set gCost(value: number) {
        this.#gCost = value
    }

    /**
     * Get the heuristic cost from this node to the goal node.
     *
     * @type {number}
     * @returns {number} - The heuristic cost from this node to the goal node.
     */
    get hCost(): number {
        return this.#hCost
    }

    /**
     * Set the heuristic cost from this node to the goal node.
     *
     * @param {number} value - The new heuristic cost from this node to the goal node.
     */
    set hCost(value: number) {
        this.#hCost = value
    }

    /**
     * Get the total cost of the node.
     *
     * @type {number}
     * @returns {number} - The total cost of the node.
     */
    get fCost(): number {
        return this.#fCost
    }

    /**
     * This is a setter method for the fCost property of a Node.
     *
     * @param {number} value - The new value for the fCost property.
     */
    set fCost(value: number) {
        this.#fCost = value
    }

    /**
     * Get the parent node for tracing the path.
     *
     * @type {Node | null}
     * @returns {Node | null} - The parent node of this node.
     */
    get parent(): Node | null {
        return this.#parent
    }

    /**
     * Set the parent node for tracing the path.
     *
     * @param {Node | null} value - The new parent node of this node.
     */
    set parent(value: Node | null) {
        this.#parent = value
    }

    /**
     * Get the height of the node.
     *
     * @type {number}
     * @returns {number} - The height of the node.
     */
    get height(): number {
        return this.#height
    }

    /**
     * Set the height of the node.
     *
     * @param {number} value - The new height of the node.
     */
    set height(value: number) {
        this.#height = value
    }
}