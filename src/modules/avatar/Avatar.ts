import AvatarGraphics from './AvatarGraphics'

import Tile from '../tile/Tile'
import Tilemap from '../tile/Tilemap'

import Point3D from '../../utils/Point3D'
import { cartesianToIsometric } from '../../utils/coordinateTransformations'

import { AVATAR_OFFSETS, AVATAR_SPEED } from '../../constants/Avatar.constants'

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

    /**
     * Represents the Tilemap associated with the avatar.
     * The Tilemap manages the game's tiles and provides information about the game world.
     * It is assigned during the initialization of the avatar using the `initialize` method.
     * @type {Tilemap}
     * @private
     */
    #tilemap!: Tilemap

    /**
     * Represents the current Tile that the avatar is positioned on.
     * @type {Tile | undefined}
     * @private
     */
    #currentTile!: Tile | undefined

    /**
     * The destination to which the avatar is currently moving.
     * @type {Point3D | null}
     * @private
     */
    #destination: Point3D | null = null

    /**
     * Flag to indicate if the avatar is currently moving.
     * @type {boolean}
     * @private
     */
    #isMoving: boolean = false

    /**
     * A callback function to call when the movement is complete.
     * @type {(() => void) | null}
     * @private
     */
    #onMovementComplete: (() => void) | null = null

    /**
     * Creates a new Avatar instance.
     * @param {Point3D} position - The initial position of the avatar.
     */
    constructor(position: Point3D) {
        this.#position = position

        this.#graphics = new AvatarGraphics(this.#position)
    }

    /**
     * Initializes the Avatar by setting up its associated Tilemap and current Tile.
     * @param {Tilemap} tilemap - The Tilemap instance representing the game world.
     * @param {Tile} currentTile - The Tile the avatar is initially positioned on.
     * @returns {this} The initialized Avatar instance.
     */
    initialize(tilemap: Tilemap, currentTile: Tile): this {
        this.#tilemap = tilemap
        this.#currentTile = currentTile

        return this
    }

    /**
     * Move the avatar along a path of destinations.
     * @param {Point3D[]} path - The path of destinations to move the avatar along.
     * @returns {Promise<void>} A promise that resolves when the movement along the path is complete.
     */
    async moveAlongPath(path: Point3D[]): Promise<void> {
        for (const tilePoint of path) {
            await this.moveTo(tilePoint)
        }
    }

    async moveTo(tilePoint: Point3D): Promise<void> {
        const tilePosition = cartesianToIsometric(tilePoint)

        this.#currentTile = this.#tilemap!.findTileByExactPosition(tilePosition)

        this.#destination = tilePosition.add(AVATAR_OFFSETS)
        this.#isMoving = true

        await new Promise<void>((resolve) => {
            this.#onMovementComplete = resolve
        })
    }

    /**
     * Update the avatar's position based on the elapsed time.
     * @param {number} delta - The time elapsed since the last update.
     */
    update(delta: number) {
        if (this.#isMoving && this.#destination) {
            const direction = this.#destination.subtract(this.#position).normalize()
            const step = AVATAR_SPEED * delta

            // Ensure the avatar reaches exactly the destination
            if (this.#position.distanceTo(this.#destination) <= step) {
                this.#updatePosition(this.#destination)
                this.#isMoving = false
                this.#destination = null

                if (this.#onMovementComplete) {
                    this.#onMovementComplete()
                    this.#onMovementComplete = null
                }
            } else {
                const newPosition = this.#position.add(direction.scale(step))
                this.#updatePosition(newPosition)
            }
        }
    }

    /**
     * Update the avatar's position and its graphics.
     * @param {Point3D} position - The new position for the avatar.
     * @private
     */
    #updatePosition(position: Point3D): void {
        this.#position.copyFrom(position)

        this.#graphics.position.copyFrom(this.#position)
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

    /**
     * Get the current Tile that the avatar is positioned on.
     * @type {Tile | undefined}
     */
    get currentTile(): Tile | undefined {
        return this.#currentTile
    }
}
