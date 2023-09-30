import { Point } from 'pixi.js'

import Heap from 'heap-js'

import Node from './Node'

import Point3D from '../utils/Point3D'

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
        // Check if the start and goal points are valid tiles.
        if (!this.#isValidTile(startPoint) || !this.#isValidTile(goalPoint)) return null

        // Sort nodes by lowest estimated total cost (fCost)
        const comparator = (nodeA: Node, nodeB: Node) => nodeA.fCost - nodeB.fCost

        // Initialize an open list to store nodes to be explored.
        const openList = new Heap<Node>(comparator)

        // Initialize a closed list to store nodes that have been explored.
        const closedList = new Set<Node>()

        const gCost = 0
        const hCost = startPoint.distanceTo(goalPoint)

        // Create the starting node with initial values.
        const startNode = new Node(startPoint, gCost, hCost)

        // Enqueue the starting node to the open list with its fCost as the priority.
        openList.add(startNode)

        // Start the main pathfinding loop.
        while (!openList.isEmpty()) {
            // Dequeue the node with the lowest fCost from the open list.
            const currentNode = openList.pop()

            // If there are no more nodes in the open list, break out of the loop (no path found).
            if (!currentNode) break

            // Add the current node to the closed list to mark it as explored.
            closedList.add(currentNode)

            // If the current node's position matches the goal, reconstruct and return the path.
            if (currentNode.position.equals(goalPoint)) return this.#reconstructPath(currentNode)

            // Get the neighbor nodes of the current node.
            const neighborNodes = this.#getNeighborNodes(currentNode)

            // Iterate through the neighbor nodes.
            neighborNodes.forEach(neighborNode => {
                // Calculate the gCost from the current node to this neighbor node.
                const gCost = this.#calculateGCost(currentNode, neighborNode)

                // Calculate the heuristic (hCost) from this neighbor node to the goal.
                const hCost = neighborNode.position.distanceTo(goalPoint)

                // Calculate the fCost (sum of gCost and hCost) for the neighbor node.
                const fCost = gCost + hCost

                neighborNode.gCost = gCost
                neighborNode.hCost = hCost
                neighborNode.fCost = fCost
                neighborNode.parent = currentNode

                // Check if the neighbor node is already in the closed list.
                if ([...closedList].some(node => node.equals(neighborNode))) return

                // Add the neighbor node to the open list with updated costs.
                openList.push(neighborNode)
            })
        }

        // No path found, return null.
        return null
    }


    /**
     * Checks if a given point is a walkable tile (not blocked).
     * @param {Point3D} point - The point to check.
     * @returns {boolean} - True if the point is a walkable tile, false otherwise.
     */
    #isValidTile({ x, y }: Point3D): boolean {
        if (x < 0 || x >= this.#grid.length || y < 0) return false

        const tile = this.#grid[x]?.[y]

        return tile !== -1 && tile !== undefined
    }

    /**
     * Reconstructs the path from the goal node to the start node.
     * @param {Node} goalNode - The goal node.
     * @returns {Point3D[]} - An array of points representing the reconstructed path.
     */
    #reconstructPath(goalNode: Node): Point3D[] {
        const path: Point3D[] = []

        let currentNode: Node | null = goalNode

        while (currentNode) {
            path.push(currentNode.position)

            currentNode = currentNode.parent
        }

        return path
    }

    /**
     * Gets the neighbor nodes of a given node.
     * @param {Node} currentNode - The current node.
     * @returns {Node[]} An array of neighbor nodes.
     */
    #getNeighborNodes = ({ position }: Node): Node[] =>
        this.#getNeighborPoints(position).map(neighborPoint => new Node(neighborPoint))

    /**
     * Gets the neighboring points of a given point.
     * @param {Point3D} point - The point to get neighbors for.
     * @returns {Point3D[]} - An array of neighboring points.
     */
    #getNeighborPoints({ x, y, z }: Point3D): Point3D[] {
        const neighborPoints: Point3D[] = [
            // Neighbors in the x and y dimensions with the same z position (current z position)
            new Point3D(x - 1, y, z),
            new Point3D(x + 1, y, z),
            new Point3D(x, y - 1, z),
            new Point3D(x, y + 1, z),

            // Diagonal neighbors with the same z position (current z position)
            new Point3D(x - 1, y - 1, z),
            new Point3D(x + 1, y + 1, z),
            new Point3D(x - 1, y + 1, z),
            new Point3D(x + 1, y - 1, z),
        ]

        return neighborPoints.filter(point => this.#isValidTile(point))
    }

    /**
     * Calculate the G cost (movement cost) between the current node's position
     * and a neighbor point.
     * @param {Node} currentNode - The current node.
     * @param {Node} neighborNode - The neighbor.
     * @returns {number} The G cost between the two positions.
     */
    #calculateGCost(currentNode: Node, neighborNode: Node): number {
        const delta = new Point(
            Math.abs(currentNode.position.x - neighborNode.position.x),
            Math.abs(currentNode.position.y - neighborNode.position.y)
        )

        return (delta.x + delta.y === 2) ?
            this.#DIAGONAL_COST * neighborNode.gCost :
            this.#HORIZONTAL_VERTICAL_COST * neighborNode.gCost
    }
}
