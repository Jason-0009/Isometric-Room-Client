import { Point } from 'pixi.js'

import Point3D from './Point3D'

import Node from './Node'

import { TILEMAP_GRID, TILEMAP_ROWS, TILEMAP_COLUMNS } from '../constants/Tilemap.constants'

const DIAGONAL_COST = 1.5
const HORIZONTAL_VERTICAL_COST = 1.0

/**
 * Finds a path from the start point to the goal point in a tile-based grid.
 *
 * @param {Point3D} startPoint - The starting point.
 * @param {Point3D} goalPoint - The goal point.
 * @returns {Point3D[] | null} - An array of points representing the path, or null if no path is found.
 */
export const findPath = (startPoint: Point3D, goalPoint: Point3D): Point3D[] | null => {
    // Check if the start and goal points are valid tiles
    if (!isValidTile(startPoint) || !isValidTile(goalPoint)) return null

    const openList: Node[] = []
    const closedList: boolean[][] = createClosedList()

    const startNode = new Node(startPoint)

    openList.push(startNode)

    while (openList.length > 0) {
        const currentNode = openList.shift() as Node

        // If the current node is the goal, reconstruct and return the path
        if (currentNode.position.equals(goalPoint)) return reconstructPath(currentNode)

        const neighborPoints = getNeighborPoints(currentNode.position)

        neighborPoints.forEach((neighborPoint) => {
            const neighborNode = new Node(neighborPoint)

            // Check if the neighbor point is already in the closed list
            if (closedList[currentNode.position.y][currentNode.position.x]) return

            const gCost = calculateCost(currentNode, neighborNode)
            const hCost = calculateHeuristic(neighborNode.position, goalPoint)
            const fCost = gCost + hCost

            const existingNeighbor = openList.find((element) =>
                element.position.equals(neighborNode.position))

            // If the neighbor is in the open list and its cost is higher, skip it
            if (existingNeighbor && fCost >= existingNeighbor.fCost) return

            neighborNode.gCost = gCost
            neighborNode.hCost = hCost
            neighborNode.fCost = fCost

            neighborNode.parent = currentNode

            openList.push(neighborNode)
            openList.sort((nodeA: Node, nodeB: Node) => nodeA.fCost - nodeB.fCost)
        })

        // Mark the current node as closed
        closedList[currentNode.position.y][currentNode.position.x] = true
    }

    // No path found
    return null
}

/**
 * Checks if a point is a valid tile within the grid bounds and walkable.
 *
 * @param {Point3D} point - The point to check.
 * @returns {boolean} - True if the point is valid and walkable, false otherwise.
 */
export const isValidTile = (point: Point3D): boolean =>
    isInBounds(point) && isWalkableTile(point)

/**
 * Checks if a point is within the grid bounds.
 *
 * @param {Point3D} point - The point to check.
 * @returns {boolean} - True if the point is within the grid bounds, false otherwise.
 */
const isInBounds = (point: Point3D): boolean =>
    point.x >= 0 && point.x < TILEMAP_COLUMNS && point.y >= 0 && point.y < TILEMAP_ROWS

/**
 * Checks if a tile is walkable.
 *
 * @param {Point3D} point - The point representing the tile.
 * @returns {boolean} - True if the tile is walkable, false otherwise.
 */
const isWalkableTile = (point: Point3D): boolean => {
    const row = TILEMAP_GRID[point.y]
    const tile = row?.[point.x]

    return tile !== null && tile !== undefined
}

/**
 * Creates a closed list initialized with `false` values.
 *
 * @returns {boolean[][]} - A 2D array representing the closed list.
 */
const createClosedList = (): boolean[][] =>
    TILEMAP_GRID.map((row) => row.map(() => false))

/**
 * Reconstructs the path from a node to the start node.
 *
 * @param {Node} node - The node from which to reconstruct the path.
 * @returns {Point3D[]} - An array of points representing the reconstructed path.
 */
const reconstructPath = (node: Node): Point3D[] => {
    const path: Point3D[] = []

    let current: Node | null = node

    while (current) {
        path.unshift(current.position)

        current = current.parent
    }

    return path
}

/**
 * Gets the neighbor points of a given point.
 *
 * @param {Point3D} point - The point for which to find neighbors.
 * @returns {Point3D[]} - An array of neighbor points.
 */
const getNeighborPoints = (point: Point3D): Point3D[] => {
    const { x, y, z } = point

    const neighborPoints = [
        new Point3D(x - 1, y - 1, z), // Top-left
        new Point3D(x - 1, y, z),     // Left
        new Point3D(x - 1, y + 1, z), // Bottom-left
        new Point3D(x, y - 1, z),     // Top
        new Point3D(x, y + 1, z),     // Bottom
        new Point3D(x + 1, y - 1, z), // Top-right
        new Point3D(x + 1, y, z),     // Right
        new Point3D(x + 1, y + 1, z), // Bottom-right
    ]

    return neighborPoints.filter((point) => isValidTile(point))
}

/**
 * Calculates the cost of moving from the current node to a neighbor node.
 *
 * @param {Node} currentNode - The current node.
 * @param {Node} neighborNode - The neighbor node.
 * @returns {number} - The cost of moving from the current node to the neighbor node.
 */
const calculateCost = (currentNode: Node, neighborNode: Node): number => {
    const delta = new Point(
        Math.abs(neighborNode.position.x - currentNode.position.x),
        Math.abs(neighborNode.position.y - currentNode.position.y)
    )

    return currentNode.gCost + (delta.x === 1 && delta.y === 1 ?
        DIAGONAL_COST : HORIZONTAL_VERTICAL_COST)
}

/**
 * Calculates the heuristic (estimated) cost from a point to the goal point.
 *
 * @param {Point3D} point - The point for which to calculate the heuristic.
 * @param {Point3D} goalPoint - The goal point.
 * @returns {number} - The heuristic cost from the point to the goal point.
 */
const calculateHeuristic = (point: Point3D, goalPoint: Point3D): number =>
    Math.abs(point.x - goalPoint.x) + Math.abs(point.y - goalPoint.y)
