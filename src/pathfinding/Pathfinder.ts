import Point3D from '../utils/Point3D'

import Node from './Node'

import PriorityQueue from '../utils/PriorityQueue'

/**
 * A class for finding paths in a 3D grid using the A* algorithm.
 */
export default class Pathfinder {
    /**
     * The 3D grid representing walkable and non-walkable tiles.
     * @type {number[][]}
     */
    readonly #grid: number[][]

    /**
     * The cost of diagonal movement in the grid.
     * @type {number}
     */
    readonly #DIAGONAL_COST: number = Math.sqrt(2)

    /**
     * The cost of horizontal and vertical movement in the grid.
     * @type {number}
     */
    readonly #HORIZONTAL_VERTICAL_COST: number = 1.0

    /**
     * Creates a new Pathfinder instance.
     * @param {number[][]} grid - The 3D grid representing walkable and non-walkable tiles.
     */
    constructor(grid: number[][]) {
        this.#grid = grid
    }

    /**
     * Finds a path from the start point to the goal point in the 3D grid.
     * @param {Point3D} startPoint - The starting point of the path.
     * @param {Point3D} goalPoint - The goal point to reach.
     * @returns {Point3D[] | null} - An array of points representing the path, or null if no path is found.
     */
    findPath(startPoint: Point3D, goalPoint: Point3D): Point3D[] | null {
        // Check if the start and goal points are valid tiles
        if (!this.#isValidTile(startPoint) ||
            !this.#isValidTile(goalPoint)) return null

        // Initialize the open list and closed list
        const openList = new PriorityQueue<Node>()
        const closedList = new Set<Node>()

        // Calculate the initial heuristic cost from the start to goal
        const gCost = 0
        const hCost = this.#calculateHeuristic(startPoint, goalPoint)

        // Create the starting node and enqueue it
        const startNode = new Node(startPoint, gCost, hCost)

        openList.enqueue(startNode, startNode.fCost)

        while (true) {
            // Dequeue the current node from the open list
            const currentNode = openList.dequeue()!

            // If the current node is the goal node, reconstruct and return the path
            if (currentNode.position.equals(goalPoint)) return this.#reconstructPath(currentNode)

            // Add the current node to the closed list
            closedList.add(currentNode)

            // Get the neighbor points of the current node
            const neighborPoints = this.#getNeighborPoints(currentNode.position)

            // Explore the neighbor points
            neighborPoints.forEach((neighborPoint) => {
                if (!this.#isValidTile(neighborPoint)) return

                // Calculate costs for the neighbor node
                const gCost = currentNode.gCost +
                    this.#calculateGCost(currentNode.position, neighborPoint)
                const hCost = this.#calculateHeuristic(neighborPoint, goalPoint)
                const fCost = gCost + hCost

                // Create the neighbor node
                const neighborNode = new Node(neighborPoint, gCost, hCost, currentNode)

                // Check if the neighbor node is in the open list or has a lower fCost
                if (openList.contains(neighborNode) &&
                    fCost >= neighborNode.fCost) return

                // Enqueue the neighbor node
                openList.enqueue(neighborNode, fCost)
            })
        }
    }

    /**
     * Checks if a given point is a valid walkable tile within the grid.
     * @param {Point3D} point - The point to check.
     * @returns {boolean} - True if the point is a valid walkable tile, false otherwise.
     */
    #isValidTile = (point: Point3D): boolean =>
        this.#isInBounds(point) && this.#isWalkableTile(point)

    /**
     * Checks if a given point is within the bounds of the grid.
     * @param {Point3D} point - The point to check.
     * @returns {boolean} - True if the point is within bounds, false otherwise.
     */
    #isInBounds = ({ x, y }: Point3D): boolean =>
        x >= 0 && x < this.#grid.length && y >= 0 && y < this.#grid[0].length

    /**
     * Checks if a given point is a walkable tile (not blocked).
     * @param {Point3D} point - The point to check.
     * @returns {boolean} - True if the point is a walkable tile, false otherwise.
     */
    #isWalkableTile({ x, y }: Point3D): boolean {
        const tile = this.#grid[x]?.[y]

        return tile !== -1 && tile !== undefined
    }

    /**
     * Reconstructs the path from the goal node to the start node.
     * @param {Node} node - The goal node.
     * @returns {Point3D[]} - An array of points representing the reconstructed path.
     */
    #reconstructPath(node: Node): Point3D[] {
        const path: Point3D[] = []

        let current: Node | null = node

        while (current) {
            path.unshift(current.position)

            current = current.parent
        }

        return path
    }

    /**
     * Gets the neighboring points of a given point.
     * @param {Point3D} point - The point to get neighbors for.
     * @returns {Point3D[]} - An array of neighboring points.
     */
    #getNeighborPoints({ x, y, z }: Point3D): Point3D[] {
        const neighborPoints: Point3D[] = [
            new Point3D(x - 1, y, z),         // Left
            new Point3D(x + 1, y, z),         // Right
            new Point3D(x, y - 1, z),         // Up
            new Point3D(x, y + 1, z),         // Down
            new Point3D(x - 1, y - 1, z),     // Upper-left
            new Point3D(x + 1, y + 1, z),     // Lower-right
            new Point3D(x - 1, y + 1, z),     // Lower-left
            new Point3D(x + 1, y - 1, z),     // Upper-right
        ]

        return neighborPoints.filter((point) => this.#isValidTile(point))
    }

    /**
     * Calculate the G cost (movement cost) between the current node's position
     * and a neighbor point.
     *
     * @param {Point3D} currentNodePosition - The position of the current node.
     * @param {Point3D} neighborPoint - The position of the neighbor point.
     * @returns {number} The G cost between the two positions.
     */
    #calculateGCost(currentNodePosition: Point3D, neighborPoint: Point3D): number {
        const delta = new Point3D(
            Math.abs(currentNodePosition.x - neighborPoint.x),
            Math.abs(currentNodePosition.y - neighborPoint.y),
            Math.abs(currentNodePosition.z - neighborPoint.z)
        )

        const minimumDelta = Math.min(delta.x, delta.y, delta.z)

        return minimumDelta > 0 ? this.#DIAGONAL_COST * minimumDelta :
            this.#HORIZONTAL_VERTICAL_COST * minimumDelta
    }

    /**
     * Calculates the heuristic cost (estimated cost) between two points.
     * @param {Point3D} point - The current point.
     * @param {Point3D} goalPoint - The goal point.
     * @returns {number} - The heuristic cost between the points.
     */
    #calculateHeuristic(point: Point3D, goalPoint: Point3D): number {
        const delta = new Point3D(
            Math.abs(point.x - goalPoint.x),
            Math.abs(point.y - goalPoint.y),
            Math.abs(point.z - goalPoint.z)
        )

        return Math.hypot(delta.x, delta.y, delta.z)
    }
}
