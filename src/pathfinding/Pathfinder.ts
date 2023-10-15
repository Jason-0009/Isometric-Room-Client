import { Point } from 'pixi.js'

import Heap from 'heap-js'

import Node from '@pathfinding/Node'

import Tilemap from '@modules/tile/Tilemap'
import CubeCollection from '@modules/cube/CubeCollection'

import Point3D from '@utils/coordinates/Point3D'
import { isValidTilePosition } from '@utils/helpers/tilePositionHelpers'
import { cartesianToIsometric } from '@utils/coordinates/coordinateTransformations'

import { AVATAR_DIMENSIONS } from '@constants/Avatar.constants'
import { TILE_DIMENSIONS } from '@constants/Tile.constants'

export default class Pathfinder {
    readonly #tilemap: Tilemap
    readonly #cubeCollection: CubeCollection

    readonly #DIAGONAL_COST: number = Math.sqrt(2)
    readonly #HORIZONTAL_VERTICAL_COST: number = 1.0

    constructor(tilemap: Tilemap, cubeCollection: CubeCollection) {
        this.#tilemap = tilemap
        this.#cubeCollection = cubeCollection
    }

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

    #validateInput = (startPosition: Point3D, goalPosition: Point3D): boolean => isValidTilePosition(startPosition, this.#tilemap) &&
        isValidTilePosition(goalPosition, this.#tilemap) && !startPosition.equals(goalPosition)

    #initializeOpenList(): Heap<Node> {
        const comparator = (nodeA: Node, nodeB: Node) => nodeA.fCost - nodeB.fCost

        return new Heap<Node>(comparator)
    }

    #createStartNode(startPosition: Point3D, goalPosition: Point3D): Node {
        const startNode = new Node(startPosition)

        startNode.fCost = startPosition.distanceTo(goalPosition)

        return startNode
    }

    #isInClosedList = (node: Node, closedList: Set<Node>): boolean => [...closedList]
        .some(nodeValue => nodeValue.position.equals(node.position))

    #updateNodeHeight(node: Node): void {
        const nodePosition = cartesianToIsometric(node.position)
        const tallestCubeAtNode = this.#cubeCollection.findTallestCubeAt(nodePosition)

        node.height = tallestCubeAtNode ? tallestCubeAtNode.position.z + tallestCubeAtNode.size :
            nodePosition.z + TILE_DIMENSIONS.THICKNESS
    }

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

    #getNeighborNodes = (node: Node): Node[] => this.#getNeighborPositions(node.position)
        .map(neighborPosition => new Node(neighborPosition))

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

            const gridZ = this.#tilemap.getGridValue(neighborGridPosition)
            const neighborPosition = new Point3D(neighborGridPosition.x, neighborGridPosition.y, gridZ)

            neighborPositions.push(neighborPosition)
        })

        return neighborPositions.filter(position => isValidTilePosition(position, this.#tilemap))
    }

    #processNeighborNode(neighborNode: Node, currentNode: Node, openList: Heap<Node>, goalPosition: Point3D): void {
        this.#updateNodeHeight(neighborNode)

        if (this.#isObstacle(neighborNode, currentNode) || this.#isPathObstructed(neighborNode, currentNode)) return

        const gCost = this.#calculateGCost(currentNode, neighborNode)
        const hCost = neighborNode.position.distanceTo(goalPosition)
        const fCost = gCost + hCost

        const existingNode = this.#findExistingNode(neighborNode, openList)

        if (existingNode && fCost >= existingNode.fCost) return

        this.#updateNeighborNode(neighborNode, gCost, hCost, fCost, currentNode)

        if (existingNode) return

        openList.push(neighborNode)
    }

    #isObstacle(node: Node, currentNode: Node): boolean {
        const nodePosition = cartesianToIsometric(node.position)
        const tallestCubeAtNode = this.#cubeCollection.findTallestCubeAt(nodePosition)

        const isNarrowerThanAvatar = tallestCubeAtNode ? tallestCubeAtNode.size < AVATAR_DIMENSIONS.WIDTH : false
        const maximumHeightThreshold = currentNode.height + AVATAR_DIMENSIONS.HEIGHT / 1.5
        const isNodeHigher = node.height > maximumHeightThreshold

        return isNarrowerThanAvatar || isNodeHigher
    }

    #isPathObstructed(node: Node, currentNode: Node): boolean {
        if (!this.#isDiagonalMove(node, currentNode)) return false

        const potentialObstaclePositions = this.#getPotentialObstaclePositions(node, currentNode)

        return potentialObstaclePositions.every(position => {
            if (!position) return

            const tile = this.#tilemap.findTileByExactPosition(position)
            const cube = this.#cubeCollection.findTallestCubeAt(position)

            return !tile || cube
        })
    }

    #isDiagonalMove = (node: Node, currentNode: Node): boolean =>
        Math.abs(node.position.x - currentNode.position.x) === 1 && Math.abs(node.position.y - currentNode.position.y) === 1

    #getPotentialObstaclePositions(targetNode: Node, currentNode: Node): (Point3D | undefined)[] {
        const movementDirection = this.#calculateMovementDirection(targetNode, currentNode)

        const potentialObstaclePositions = [
            this.#calculateObstaclePosition3D(targetNode, movementDirection, 'left'),
            this.#calculateObstaclePosition3D(targetNode, movementDirection, 'right')
        ]

        return potentialObstaclePositions
    }

    #calculateMovementDirection = (targetNode: Node, currentNode: Node): Point =>
        new Point(
            targetNode.position.x - currentNode.position.x,
            targetNode.position.y - currentNode.position.y
        )

    #calculateObstaclePosition3D(targetNode: Node, movementDirection: Point, side: 'left' | 'right'): Point3D | undefined {
        const obstaclePosition2D = this.#calculateObstaclePosition2D(targetNode, movementDirection, side)
        const obstacleZ = this.#tilemap.getGridValue(obstaclePosition2D)
        const obstaclePosition3D = new Point3D(obstaclePosition2D.x, obstaclePosition2D.y, obstacleZ)

        return cartesianToIsometric(obstaclePosition3D)
    }

    #calculateObstaclePosition2D(targetNode: Node, movementDirection: Point, side: 'left' | 'right'): Point {
        const calculations = {
            'left': new Point(targetNode.position.x, targetNode.position.y - movementDirection.y),
            'right': new Point(targetNode.position.x - movementDirection.x, targetNode.position.y)
        }

        return calculations[side]
    }

    #findExistingNode = (neighborNode: Node, openList: Heap<Node>): Node | undefined =>
        openList.toArray().find((node) => node.position.equals(neighborNode.position))

    #calculateGCost(currentNode: Node, neighborNode: Node): number {
        const delta = new Point(
            Math.abs(neighborNode.position.x - currentNode.position.x),
            Math.abs(neighborNode.position.y - currentNode.position.y),
        )

        const costOfMovement = delta.x - delta.y === 0 ? this.#DIAGONAL_COST * neighborNode.gCost :
            this.#HORIZONTAL_VERTICAL_COST * neighborNode.gCost

        return currentNode.gCost + costOfMovement
    }

    #updateNeighborNode = (neighborNode: Node, gCost: number, hCost: number, fCost: number, currentNode: Node): void => {
        neighborNode.gCost = gCost
        neighborNode.hCost = hCost
        neighborNode.fCost = fCost
        neighborNode.parent = currentNode
    }
}
