import { Point } from 'pixi.js'

import Heap from 'heap-js'

import Node from '@pathfinding/Node'

import Tilemap from '@modules/tile/Tilemap'
import CubeCollection from '@modules/cube/CubeCollection'

import Point3D from '@utils/Point3D'
import { isValidTilePosition } from '@utils/tilePositionHelpers'
import { cartesianToIsometric } from '@utils/coordinateTransformations'

import { AVATAR_DIMENSIONS } from '@constants/Avatar.constants'
import { TILE_DIMENSIONS } from '@constants/Tile.constants'

/**
 * A class for finding paths in a 3D grid using the A* algorithm.
 */
export default class Pathfinder {
    /**
     * Represents a tilemap of the 3D grid. 
     * The Tilemap class is used to manage and manipulate these tiles. 
     * This property is used in various methods to check for obstacles. 
     * The tiles in this tilemap can affect the pathfinding process. 
     * For example, a tile might be an obstacle that needs to be avoided, or it might elevate the height of a node in the grid.
     *
     * @type {Tilemap} 
     */
    readonly #tilemap: Tilemap

    /**
     * Represents a collection of cubes in the 3D grid. 
     * The CubeCollection class is used to manage and manipulate these cubes. 
     * This property is used in various methods within the Pathfinder class to check for obstacles and update node heights based on the cubes at their positions. 
     * The cubes in this collection can affect the pathfinding process. 
     * For example, a cube might be an obstacle that needs to be avoided, or it might elevate the height of a node in the grid.
     
     * @type {CubeCollection} 
    */
    readonly #cubeCollection: CubeCollection

    /**
     * The cost of diagonal movement in the grid.
     * 
     * @type {number}
     */
    readonly #DIAGONAL_COST: number = Math.sqrt(2)

    /**
     * The cost of horizontal and vertical movement in the grid.
     * 
     * @type {number}
     */
    readonly #HORIZONTAL_VERTICAL_COST: number = 1.0

    /**
     * Creates a new Pathfinder instance.
     * @param {Tilemap} tilemap - A tilemap of the 3D grid. This tilemap is used to manage and manipulate tiles, check for obstacles, and update node heights based on the tiles at their positions.
     * @param {CubeCollection} cubeCollection - A collection of cubes in the 3D grid. This collection is used to check for obstacles and update node heights based on the cubes at their positions.
     */
    constructor(tilemap: Tilemap, cubeCollection: CubeCollection) {
        this.#tilemap = tilemap
        this.#cubeCollection = cubeCollection
    }

    /**
     * Finds a path from the start position to the goal position in the 3D grid using the A* algorithm.
     * The method uses a min heap to store nodes to be explored, sorted by their estimated total cost (fCost).
     * If a path to the goal is not found and `isRecalculating` is true, it returns a path to the closest reachable node.
     * If a path to the goal is not found and `isRecalculating` is false, it returns null.
     *
     * @param {Point3D} startPosition - The starting position of the path.
     * @param {Point3D} goalPosition - The goal position to reach
     * @param {boolean} isRecalculating - A flag indicating whether this method was called to recalculate a path.
     *
     * @returns {Point3D[] | null} - An array of positions representing the path from start to goal if a path is found.
     */
    findPath(startPosition: Point3D, goalPosition: Point3D, isRecalculating: boolean): Point3D[] | null {
        if (!this.#validateInput(startPosition, goalPosition)) return null

        const [openList, closedList] = [this.#initializeOpenList(), new Set<Node>()]

        let startNode = this.#createStartNode(startPosition, goalPosition)
        let closestNode = startNode

        openList.add(startNode)

        while (!openList.isEmpty()) {
            const currentNode = openList.pop()

            if (!currentNode || this.#isInClosedList(currentNode, closedList)) continue

            this.#updateNodeHeight(currentNode)

            closedList.add(currentNode)

            if (currentNode.fCost < closestNode.fCost) closestNode = currentNode

            if (currentNode.position.equals(goalPosition)) return this.#reconstructPath(currentNode)

            this.#getNeighborNodes(currentNode).forEach(neighborNode => this.#processNeighborNode(neighborNode,
                currentNode, openList, goalPosition))
        }

        return isRecalculating ? this.#reconstructPath(closestNode) : null
    }

    /**
     * Validates the start and goal positions.
     * 
     * This method checks if the start and goal positions are valid and not the same. 
     * A position is considered valid if it exists within the grid of the tilemap.
     *
     * @param {Point3D} startPosition - The starting position of the path. This should be a 3D position representing the x, y, and z coordinates in the grid.
     * @param {Point3D} goalPosition - The goal position to reach. This should also be a 3D position representing the x, y, and z coordinates in the grid.
     * 
     * @returns {boolean} - Returns true if both the start and goal positions are valid and they are not the same. Otherwise, it returns false.
     */
    #validateInput = (startPosition: Point3D, goalPosition: Point3D): boolean => isValidTilePosition(startPosition, this.#tilemap.grid) &&
        isValidTilePosition(goalPosition, this.#tilemap.grid) && !startPosition.equals(goalPosition)

    /**
     * Initializes an open list.
     *
     * The open list is a priority queue (Heap) that stores nodes to be explored, sorted by their estimated total cost (fCost).
     * The fCost of a node is the sum of its gCost (the cost from the start node to the current node) and hCost (the heuristic cost from the current node to the goal).
     *
     * @returns {Heap<Node>} - A Heap data structure containing Node objects, sorted by their fCost.
     */
    #initializeOpenList(): Heap<Node> {
        const comparator = (nodeA: Node, nodeB: Node) => nodeA.fCost - nodeB.fCost

        return new Heap<Node>(comparator)
    }

    /**
     * Creates a start node.
     *
     * @param {Point3D} startPosition - The starting position of the path.
     * @param {Point3D} goalPosition - The goal position of the path.
     * @returns {Node} startNode - The start node with calculated heuristic cost (hCost) and total cost (fCost).
     */
    #createStartNode(startPosition: Point3D, goalPosition: Point3D): Node {
        const startNode = new Node(startPosition)

        startNode.hCost = startPosition.distanceTo(goalPosition)
        startNode.updateFCost()

        return startNode
    }

    /**
     * Check if a node is in the closed list.
     * 
     * @param {Node} node - The node to check.
     * @param {Set<Node>} closedList - The closed list.
     * @returns {boolean} - True if the node is in the closed list, false otherwise.
     */
    #isInClosedList = (node: Node, closedList: Set<Node>): boolean => [...closedList]
        .some(nodeValue => nodeValue.position.equals(node.position))

    /**
     * Updates node height based on the tallest cube at its position.
     * 
     * @param {Node} node - The node to update height for.
     */
    #updateNodeHeight(node: Node): void {
        const nodePosition = cartesianToIsometric(node.position)
        const tallestCubeAtNode = this.#cubeCollection.findTallestCubeAt(nodePosition)

        /* Update the height of the node. The new height is the 
           sum of the z-coordinate (vertical position) of the targetCube and its size.
        */
        node.height = tallestCubeAtNode ? tallestCubeAtNode.position.z + tallestCubeAtNode.size :
            nodePosition.z + TILE_DIMENSIONS.THICKNESS
    }

    /**
     * Reconstructs the path from the goal node to the start node.
     * 
     * @param {Node} goalNode - The goal node.
     * @returns {Point3D[]} - An array of positions representing the reconstructed path.
     */
    #reconstructPath(goalNode: Node): Point3D[] {
        const path: Point3D[] = []

        let currentNode: Node | null = goalNode

        while (currentNode) {
            path.push(currentNode.position)
            currentNode = currentNode.parent
        }

        // Reverse the path to obtain it from start to goal.
        return path.reverse()
    }

    /**
     * Gets the neighbor nodes of a given node.
     * 
     * @param {Node} node - The current node.
     * @returns {Node[]} An array of neighbor nodes.
     */
    #getNeighborNodes = (node: Node): Node[] => this.#getNeighborPositions(node.position)
        .map(neighborPosition => new Node(neighborPosition))

    /**
     * Gets the neighboring positions of a given position.
     * 
     * @param {Point3D} position - The position to get neighbors for.
     * @returns {Point3D[]} An array of neighboring positions.
     */
    #getNeighborPositions(position: Point3D): Point3D[] {
        const neighborPositions: Point3D[] = []
        const neighborOffsets = [
            new Point(-1, 0),     // Left
            new Point(1, 0),      // Right
            new Point(0, -1),     // Up
            new Point(0, 1),      // Down
            new Point(-1, -1),    // Top-left
            new Point(1, 1),      // Bottom-right
            new Point(-1, 1),     // Bottom-left
            new Point(1, -1),     // Top-right
        ]

        neighborOffsets.forEach(offset => {
            const neighborGridPosition = new Point(
                position.x + offset.x,
                position.y + offset.y
            )

            const gridZ = this.#tilemap.grid[neighborGridPosition.x]?.[neighborGridPosition.y]
            const neighborPosition = new Point3D(neighborGridPosition.x, neighborGridPosition.y, gridZ)

            neighborPositions.push(neighborPosition)
        })

        return neighborPositions.filter(neighborPoint => isValidTilePosition(neighborPoint, this.#tilemap.grid))
    }

    /**
     * Processes a neighbor node.
     * 
     * It updates the neighbor node's height based on the tallest cube at its position, 
     * checks if it's in the closed list or is an obstacle, and if not, updates its costs and adds it to the open list.
     * 
     * @param {Node} neighborNode - The neighbor node to be processed.
     * @param {Node} currentNode - The current node.
     * @param {Point3D} goalPosition - The goal position of the path.
     * @param {Heap<Node>} openList - The open list storing nodes to be explored.
     */
    #processNeighborNode(neighborNode: Node, currentNode: Node, openList: Heap<Node>, goalPosition: Point3D): void {
        this.#updateNodeHeight(neighborNode)

        if (this.#isObstacle(neighborNode, currentNode) || this.#isPathObstructed(neighborNode, currentNode)) return

        const existingNode = this.#findExistingNode(neighborNode, openList)
        const gCost = this.#calculateGCost(currentNode, neighborNode)

        if (existingNode && gCost >= existingNode.gCost) return

        this.#updateNeighborNode(neighborNode, currentNode, gCost, goalPosition)

        if (!existingNode) openList.push(neighborNode)
    }

    /**
     * Checks if a node is an obstacle based on the size and height of the target cube.
     * 
     * @param {Node} node - The neighbor node.
     * @param {Node} currentNode - The current node.
     * @returns {boolean} - True if the node is an obstacle, false otherwise.
     */
    #isObstacle(node: Node, currentNode: Node): boolean {
        const nodePosition = cartesianToIsometric(node.position)

        const tallestCubeAtNode = this.#cubeCollection.findTallestCubeAt(nodePosition)

        /* Check if the size of the target cube is less than the width of the avatar.
           If it is, it's considered an obstacle because the avatar can't fit through.
        */
        const isNarrowerThanAvatar = tallestCubeAtNode ? tallestCubeAtNode.size < AVATAR_DIMENSIONS.WIDTH : false

        /* Calculate the maximum height that the avatar can reach or climb.
           It's the current node's height plus one and a half times the height of the avatar.
           This represents how high the avatar can reach or climb from its current position.
        */
        const maximumHeightThreshold = currentNode.height + AVATAR_DIMENSIONS.HEIGHT / 1.5

        /* Check if the height of the node is greater than the maximum height threshold.
           If it is, it's considered an obstacle because it's too high for the avatar to reach or climb.
        */
        const isNodeHigher = node.height > maximumHeightThreshold

        return isNarrowerThanAvatar || isNodeHigher
    }

    /**
     * Checks if the path from the current node to the target node is obstructed by an obstacle.
     * 
     * @param {Node} node - The target node.
     * @param {Node} currentNode - The current node.
     * @returns {boolean} - True if the path is obstructed, false otherwise.
     */
    #isPathObstructed(node: Node, currentNode: Node): boolean {
        if (!this.#isDiagonalMove(node, currentNode)) return false

        const potentialObstaclePositions = this.#getPotentialObstaclePositions(node, currentNode)

        /* Check if there's a tile or a cube at either of these points.
           If there's no tile or there's a cube at either point, it means that the path is obstructed, so return true. 
           If there are tiles and no cubes at these points,
           it means that the path is not obstructed, so return false. 
        */
        return potentialObstaclePositions.every(position => {
            const tile = this.#tilemap.findTileByExactPosition(position)
            const cube = this.#cubeCollection.findTallestCubeAt(position)

            return !tile || cube
        })
    }

    /**
    * Checks if the movement from the current node to the target node is diagonal.
    * 
    * @param {Node} node - The target node.
    * @param {Node} currentNode - The current node.
    * @returns {boolean} - True if the movement is diagonal, false otherwise.
    */
    #isDiagonalMove = (node: Node, currentNode: Node): boolean =>
        /* Calculate the absolute difference between the x-coordinates and y-coordinates of the current node and the target node.
           If both differences are 1, it means that both x and y coordinates have changed, indicating a diagonal movement.
           In this case, return true. If not, it means that the movement is either horizontal or vertical, so return false.
        */
        Math.abs(node.position.x - currentNode.position.x) === 1 && Math.abs(node.position.y - currentNode.position.y) === 1

    /**
     * Calculates the potential obstacle positions to the left and right of the target node in the grid.
     * 
     * @param {Node} targetNode - The target node.
     * @param {Node} currentNode - The current node.
     * @returns {Point3D[]} - An array of two points that lie to the left and right of the target node.
     */
    #getPotentialObstaclePositions(targetNode: Node, currentNode: Node): Point3D[] {
        const movementDirection = this.#calculateMovementDirection(targetNode, currentNode)

        const potentialObstaclePositions = [
            this.#calculateObstaclePosition3D(targetNode, movementDirection, 'left'),
            this.#calculateObstaclePosition3D(targetNode, movementDirection, 'right')
        ]

        return potentialObstaclePositions
    }

    /**
     * Calculates the movement direction from the current node to the target node.
     * 
     * @param {Node} targetNode - The target node.
     * @param {Node} currentNode - The current node.
     * @returns {Point} - The movement direction as a 2D point.
     */
    #calculateMovementDirection = (targetNode: Node, currentNode: Node): Point =>
        new Point(
            targetNode.position.x - currentNode.position.x,
            targetNode.position.y - currentNode.position.y
        )

    /**
     * Calculates the 3D position of a potential obstacle at the specified side of the target node.
     * 
     * @param {Node} targetNode - The target node.
     * @param {Point} movementDirection - The movement direction from the current node to the target node.
     * @param {'left' | 'right'} side - The side of the target node where to calculate the obstacle position ('left' or 'right').
     * @returns {Point3D} - The 3D position of the potential obstacle.
     */
    #calculateObstaclePosition3D(targetNode: Node, movementDirection: Point, side: 'left' | 'right'): Point3D {
        const obstaclePosition2D = this.#calculateObstaclePosition2D(targetNode, movementDirection, side)
        const obstacleZ = this.#tilemap.grid[obstaclePosition2D.x]?.[obstaclePosition2D.y]

        const obstaclePosition3D = new Point3D(obstaclePosition2D.x, obstaclePosition2D.y, obstacleZ)

        return cartesianToIsometric(obstaclePosition3D)
    }

    /**
     * Calculates the 2D position of a potential obstacle at the specified side of the target node.
     * 
     * @param {Node} targetNode - The target node.
     * @param {Point} movementDirection - The movement direction from the current node to the target node.
     * @param {'left' | 'right'} side - The side of the target node where to calculate the obstacle position ('left' or 'right').
     * @returns {Point} - The 2D position of the potential obstacle.
     */
    #calculateObstaclePosition2D(targetNode: Node, movementDirection: Point, side: 'left' | 'right'): Point {
        const calculations = {
            'left': new Point(targetNode.position.x, targetNode.position.y - movementDirection.y),
            'right': new Point(targetNode.position.x - movementDirection.x, targetNode.position.y)
        }

        return calculations[side]
    }

    /**
     * Finds an existing node in the open list that matches the position of the neighbor node.
     *
     * @param {Node} neighborNode - The neighbor node.
     * @param {Heap<Node>} openList - The open list storing nodes to be explored.
     * @returns {Node | undefined} - The existing node in the open list, or undefined if no matching node is found.
     */
    #findExistingNode = (neighborNode: Node, openList: Heap<Node>): Node | undefined =>
        openList.toArray().find((node) => node.position.equals(neighborNode.position))

    /**
    * Calculate the G cost (movement cost) between the current node's position
    * and a neighbor position.
    * 
    * @param {Node} currentNode - The current node.
    * @param {Node} neighborNode - The neighbor.
    * @returns {number} The G cost between the two positions.
    */
    #calculateGCost(currentNode: Node, neighborNode: Node): number {
        const delta = new Point(
            Math.abs(currentNode.position.x - neighborNode.position.x),
            Math.abs(currentNode.position.y - neighborNode.position.y),
        )

        const costOfMovement = delta.x - delta.y === 0 ? this.#DIAGONAL_COST * neighborNode.gCost :
            this.#HORIZONTAL_VERTICAL_COST * neighborNode.gCost

        return currentNode.gCost + costOfMovement
    }
    
    /**
     * Updates the costs and parent of the neighbor node.
     *
     * @param {Node} neighborNode - The neighbor node.
     * @param {Node} currentNode - The current node.
     * @param {number} gCost - The calculated gCost for the neighbor node.
     * @param {Point3D} goalPosition - The goal position of the path.
     */
    #updateNeighborNode = (neighborNode: Node, currentNode: Node, gCost: number, goalPosition: Point3D): void => {
        neighborNode.gCost = gCost
        neighborNode.hCost = neighborNode.position.distanceTo(goalPosition)
        neighborNode.updateFCost()
        neighborNode.parent = currentNode
    }
}
