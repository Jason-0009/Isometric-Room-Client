import AvatarGraphics from './AvatarGraphics'

import Tile from '@modules/tile/Tile'
import Tilemap from '@modules/tile/Tilemap'

import CubeCollection from '@modules/cube/CubeCollection'
import Cube from '@modules/cube/Cube'

import Pathfinder from '@pathfinding/Pathfinder'

import Point3D from '@utils/Point3D'
import { cartesianToIsometric, isometricToCartesian } from '@utils/coordinateTransformations'

import { AVATAR_DIMENSIONS, AVATAR_OFFSETS, AVATAR_SPEED } from '@constants/Avatar.constants'
import { findClosestValidTilePosition } from '@utils/tilePositionHelpers'

/**
 * Represents an avatar in the isometric scene.
 */
export default class Avatar {
    /**
     * The position of the avatar.
     * 
     * @type {Point3D}
     */
    readonly #position: Point3D

    /**
     * The graphics object for the avatar.
     * 
     * @type {AvatarGraphics}
     */
    readonly #graphics: AvatarGraphics

    /**
     * The Tilemap associated with the avatar.
     * 
     * @type {Tilemap | null}
     */
    readonly #tilemap: Tilemap

    /**
     * The collection of cubes in the world.
     * 
     * @type {CubeCollection | null}
     */
    readonly #cubeCollection: CubeCollection

    /**
     * The pathfinder used for path calculations.
     * 
     * @type {Pathfinder | null}
     */
    readonly #pathfinder: Pathfinder

    /**
     * The current Tile that the avatar is positioned on.
     * 
     * @type {Tile}
     */
    #currentTile: Tile | undefined

    /**
     * The goal destination to which the avatar is currently moving.
     * 
     * @type {Point3D | null}
     */
    #goalPosition: Point3D | null = null

    /**
     * The target position to which the avatar is currently moving.
     * 
     * @type {Point3D | null}
     */
    #targetPosition: Point3D | null = null

    /**
     * Whether the avatar is currently in motion.
     * 
     * @type {boolean}
     */
    #isMoving: boolean = false

    /**
     * A callback function to call when the movement is complete.
     * 
     * @type {(() => void) | null}
     */
    #onMovementComplete: (() => void) | null = null

    /**
     * Creates a new Avatar instance.
     *
     * @param {Point3D} position - The initial position of the avatar.
     * @param {Tilemap} tilemap - The tilemap that the avatar will move around on.
     * @param {CubeCollection} cubeCollection - The collection of cubes that the avatar can interact with.
     * @param {Pathfinder} pathfinder - The pathfinder that the avatar will use to find its way to its destination.
     */
    constructor(position: Point3D, tilemap: Tilemap, cubeCollection: CubeCollection, pathfinder: Pathfinder) {
        this.#position = position
        this.#graphics = new AvatarGraphics(this.#position)
        this.#tilemap = tilemap
        this.#cubeCollection = cubeCollection
        this.#pathfinder = pathfinder
    }

    /**
     * Initializes the avatar.
     * This method sets up the avatar's initial position and current tile based on its position.
     */
    initialize() {
        const tilePosition = this.#position.subtract(AVATAR_OFFSETS)

        this.#currentTile = this.#tilemap.findTileByExactPosition(tilePosition)

        let newPosition = this.#getNewPosition(tilePosition)
        
        const tallestCubeAtTile = this.#cubeCollection.findTallestCubeAt(tilePosition)

        if (tallestCubeAtTile &&
            tallestCubeAtTile.size < AVATAR_DIMENSIONS.WIDTH) newPosition = this.#getAdjustedNewPosition(tilePosition) || newPosition

        this.#updatePosition(newPosition)

        this.#cubeCollection.updateCubeRendering(this)
    }

    /**
     * Calculates a path from the current tile to the specified goal.
     */
    async calculatePath(isRecalculating: boolean = false) {
        if (!this.#currentTile || !this.#goalPosition) return

        const startPosition = isometricToCartesian(this.#currentTile.position)
        const path = this.#pathfinder.findPath(startPosition, this.#goalPosition, isRecalculating)

        if (!path) return

        await this.#moveAlongPath(path)
    }

    /**
     * Update the avatar's position based on the elapsed time.
     * 
     * @param {number} delta - The time elapsed since the last update.
     */
    async update(delta: number) {
        if (!this.#isMoving) return

        if (this.#shouldReachDestination) {
            this.#handleDestinationReached()

            return
        }

        // Calculate the velocity vector by scaling the direction vector with the speed.
        const velocity = this.#calculateVelocity(delta)

        if (!velocity) return

        // Calculate the new position by adding the velocity vector to the current position.
        const newPosition = this.#position.add(velocity)

        this.#updatePosition(newPosition)
    }

    /**
     * Adjusts the avatar's position when a cube is dragged.
     * If the avatar is on the same cube as the dragged cube, it's set to the ground level.
     * If the avatar is on a different cube, it moves to that cube's position.
     * 
     * @param {Cube} cube - The cube object being dragged.
     */
    adjustPositionOnCubeDrag = (cube: Cube): void => {
        if (!this.#currentTile || cube.currentTile !== this.#currentTile) return

        const newPosition = this.#position

        newPosition.z -= cube.size

        this.#targetPosition?.copyFrom(newPosition)

        this.#updatePosition(newPosition)
    }

    /**
     * Gets the new position of the avatar after adjusting for cube size.
     * 
     * @param {Point3D} position - The current position of the avatar.
     * @returns {Point3D} The new position of the avatar.
     */
    #getNewPosition(position: Point3D): Point3D {
        const newPosition = position.add(AVATAR_OFFSETS)
        const tallestCube = this.#cubeCollection.findTallestCubeAt(position)

        if (tallestCube) newPosition.z = tallestCube.position.z + tallestCube.size

        return newPosition
    }

    /**
     * Adjusts the given position and returns a new position based on the adjusted tile position.
     * If the adjusted tile position is not found, it returns null.
     *
     * @param {Point3D} position - The original position to be adjusted.
     * @returns {Point3D | undefined} The new adjusted position or null if the adjusted tile position is not found.
     */
    #getAdjustedNewPosition(position: Point3D): Point3D | undefined {
        const adjustedTilePosition = this.#getAdjustedTilePosition(position)

        if (!adjustedTilePosition) return

        this.#currentTile = this.#tilemap.findTileByExactPosition(adjustedTilePosition)

        return this.#getNewPosition(adjustedTilePosition)
    }

    /**
     * Gets the adjusted tile position based on the current tile's position.
     * 
     * @param {Point3D} position - The current position of the avatar.
     * @returns {Point3D | undefined} The adjusted tile position.
     */
    #getAdjustedTilePosition(position: Point3D): Point3D | undefined {
        if (!this.#currentTile) return

        const currentTilePosition = isometricToCartesian(this.#currentTile?.position)
        const validTilePosition = findClosestValidTilePosition(currentTilePosition, this.#tilemap.grid)

        return cartesianToIsometric(validTilePosition || position)
    }

    /**
     * Move the avatar along a path of destinations.
     * 
     * @param {Point3D[]} path - The path of destinations to move the avatar along.
     * @returns {Promise<void>} A promise that resolves when the movement along the path is complete.
     */
    #moveAlongPath = async (path: Point3D[]): Promise<void> =>
        await path.reduce(async (previousPromise: Promise<void>, tilePosition: Point3D) => {
            await previousPromise
            await this.#moveTo(tilePosition)
        }, Promise.resolve())

    /**
     * Asynchronously moves the avatar to the specified tile position on the map.
     * 
     * @param {Point3D} position - The tile position (in cartesian coordinates) to move to.
     * @returns {Promise<void>} A promise that resolves when the movement is complete.
     */
    async #moveTo(position: Point3D): Promise<void> {
        const tilePosition = cartesianToIsometric(position)

        const tallestCubeAtTile = this.#cubeCollection.findTallestCubeAt(tilePosition)

        this.#currentTile = this.#tilemap.findTileByExactPosition(tilePosition)
        this.#targetPosition = tilePosition.add(AVATAR_OFFSETS)

        if (tallestCubeAtTile) this.#targetPosition.z = tallestCubeAtTile.position.z + tallestCubeAtTile.size

        this.#isMoving = true
        this.#cubeCollection.updateCubeRendering(this)

        await new Promise<void>(resolve => this.#onMovementComplete = resolve)
    }

    /**
     * Handles the logic when the avatar reaches its destination.
     * It updates the avatar's position, completes the movement promise,
     * and resets the destination and movement completion callback.
     */
    #handleDestinationReached() {
        if (!this.#targetPosition || !this.#onMovementComplete) return

        this.#updatePosition(this.#targetPosition)
        this.#onMovementComplete()
        this.#stopMovement()
    }

    /**
     * Calculate the velocity of the avatar.
     * 
     * @param {number} delta - The time elapsed since the last update.
     * @returns {Point3D | undefined} The velocity vector.
     */
    #calculateVelocity(delta: number): Point3D | undefined {
        if (!this.#direction) return

        // Calculate the base velocity by scaling the direction with the product of speed and delta.
        const velocity = this.#direction.scale(this.#speed * delta)

        /* If the direction along the z-axis is negative (indicating downward movement),
           adjust the z-component of the velocity to account for the difference in 
           height between the current position and target position.
        */
        if (this.#direction.z < 0) velocity.z += this.#heightDifference

        return velocity
    }

    /**
     * Updates the avatar's position and graphics based on the specified 3D position.
     * 
     * @param {Point3D} position - The new 3D position to set for the avatar.
     */
    #updatePosition(position: Point3D): void {
        this.#position.copyFrom(position)
        this.#graphics.position.set(position.x, position.y - position.z)
    }

    /**
     * Stops the current avatar movement by clearing the target position and movement completion callback.
     * This method is typically called when the avatar needs to stop its movement abruptly.
     */
    #stopMovement() {
        this.#targetPosition = null
        this.#onMovementComplete = null
        this.#isMoving = false
    }

    /**
     * Check if the avatar should reach its destination.
     * 
     * @returns {boolean | undefined} True if the avatar should reach its destination, false otherwise.
     */
    get #shouldReachDestination(): boolean | null {
        return this.#targetPosition && this.#position.distanceTo(this.#targetPosition) <= this.#speed
    }

    /**
     * Get the speed of the avatar, accounting for direction.
     * 
     * @returns {number} The avatar's speed.
     */
    get #speed(): number {
        return this.#direction?.x === 0 || this.#direction?.y === 0 ? AVATAR_SPEED * 1.2 : AVATAR_SPEED
    }

    /**
     * Get the direction vector from the avatar's position to its destination.
     * 
     * @returns {Point3D | undefined} The direction vector.
     */
    get #direction(): Point3D | undefined {
        return this.#targetPosition?.subtract(this.#position).normalize()
    }

    /**
     * Get the height difference between the current position and the target position.
     * 
     * @returns {number} - The height difference.
     */
    get #heightDifference(): number {
        return this.#targetPosition ? isometricToCartesian(this.#targetPosition).z - isometricToCartesian(this.#position).z : 0
    }

    /**
     * Get the graphics object of the avatar.
     * 
     * @returns {AvatarGraphics} The AvatarGraphics object.
     */
    get graphics(): AvatarGraphics {
        return this.#graphics
    }

    /**
     * Get the current position of the avatar.
     * 
     * @returns {Point3D} The current position of the avatar.
     */
    get position(): Point3D {
        return this.#position
    }

    /**
     * Get the current Tile that the avatar is positioned on.
     * 
     * @returns {Tile | undefined} The current Tile or undefined if not positioned on any Tile.
     */
    get currentTile(): Tile | undefined {
        return this.#currentTile
    }

    /**
     * Sets the current Tile that the avatar is positioned on.
     * 
     * @param {Tile | undefined} value - The Tile object representing the current position of the avatar.
     */
    set currentTile(value: Tile | undefined) {
        this.#currentTile = value
    }

    /**
     * Sets the goal destination for the avatar.
     * 
     * @param {Point3D} value - The goal destination.
     */
    set goalPosition(value: Point3D) {
        this.#goalPosition = value
    }

    /**
     * Get the moving status of the avatar.
     * 
     * @returns {boolean} True if the avatar is currently in motion, false otherwise.
     */
    get isMoving(): boolean {
        return this.#isMoving
    }
}
