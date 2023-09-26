import AvatarGraphics from './AvatarGraphics'

import Point3D from '../../utils/Point3D'
import { cartesianToIsometric } from '../../utils/coordinateTransformations'

import { AVATAR_TILE_POINT, AVATAR_OFFSETS } from '../../constants/Avatar.constants'
import Tile from '../tile/Tile'
import Tilemap from '../tile/Tilemap'

/**
 * Represents an avatar in the isometric scene.
 */
export default class Avatar {
    /**
     * The position of the avatar.
     * @type {Point3D}
     * @private
     */
    readonly #position: Point3D

    /**
     * The graphics object for the avatar.
     * @type {AvatarGraphics}
     * @private
     */
    readonly #graphics: AvatarGraphics

    #tilemap!: Tilemap

    #currentTile!: Tile | undefined

    /**
     * The destination to which the avatar is currently moving.
     * @type {Point3D | null}
     * @private
     */
    #destination: Point3D | null = null;

    /**
     * Flag to indicate if the avatar is currently moving.
     * @type {boolean}
     * @private
     */
    #isMoving: boolean = false;

    /**
     * A callback function to call when the movement is complete.
     * @type {(() => void) | null}
     * @private
     */
    #onMovementComplete: (() => void) | null = null;

    /**
     * Creates a new Avatar instance.
     * @param {Point3D} position - The initial position of the avatar.
     */
    constructor(position: Point3D) {
        this.#position = position

        this.#graphics = new AvatarGraphics(this.#position)
    }

    initialize(tilemap: Tilemap, currentTile: Tile): this {
        this.#tilemap = tilemap
        this.#currentTile = currentTile

        return this
    }

    /**
     * Move the avatar to a destination.
     * @param {Point3D} position - The destination to move the avatar to.
     * @returns {Promise<void>} A promise that resolves when the movement is complete.
     */
    async moveTo(position: Point3D): Promise<void> {
        if (this.#isMoving) {
            this.#abortMovement()
        }

        this.#destination = position
        this.#isMoving = true

        return new Promise<void>((resolve) => {
            this.#onMovementComplete = resolve
        })
    }

    /**
     * Abort the current movement and reset movement-related properties.
     * @private
     */
    #abortMovement(): void {
        this.#isMoving = false
        this.#destination = null
        this.#onMovementComplete = null
    }

    /**
     * Set the avatar's position and update its graphics.
     * @param {Point3D} position - The new position for the avatar.
     * @private
     */
    #setPosition(position: Point3D): void {
        this.#position.copyFrom(position)
        this.#graphics.position.copyFrom(position)
    }

    /**
     * Move the avatar along a path of destinations.
     * @param {Point3D[]} path - The path of destinations to move the avatar along.
     * @returns {Promise<void>} A promise that resolves when the movement along the path is complete.
     */
    async moveAlongPath(path: Point3D[]): Promise<void> {
        if (this.#isMoving) {
            this.#abortMovement()
            return
        }

        const moveNext = async () => {
            if (path.length === 0) {
                return
            }

            const tilePoint = path.shift()!

            const tilePosition = cartesianToIsometric(tilePoint)

            this.#currentTile = this.#tilemap.findTileByExactPosition(tilePosition)

            const position = tilePosition.add(AVATAR_OFFSETS)

            await this.moveTo(position)
            await moveNext()
        }

        await moveNext()
    }

    /**
     * Update the avatar's position based on the elapsed time.
     * @param {number} delta - The time elapsed since the last update.
     */
    update(delta: number) {
        if (this.#isMoving && this.#destination) {
            const step = 1 * delta
            const direction = this.#destination.subtract(this.#position).normalize()
            const newPosition = this.#position.add(direction.scale(step))

            if (this.#position.distanceTo(this.#destination) <= step) {
                this.#setPosition(this.#destination)

                this.#isMoving = false
                this.#destination = null

                if (this.#onMovementComplete) {
                    this.#onMovementComplete()
                    this.#onMovementComplete = null
                }
            } else {
                this.#setPosition(newPosition)
            }
        }
    }

    /**
     * Get the graphics object of the avatar.
     * @type {AvatarGraphics}
     */
    get graphics(): AvatarGraphics {
        return this.#graphics
    }

    /**
     * Get the current position of the avatar.
     * @type {Point3D}
     */
    get position(): Point3D {
        return this.#position
    }

    get currentTile(): Tile | undefined {
        return this.#currentTile
    }
}
