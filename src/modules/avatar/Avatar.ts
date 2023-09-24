import { Point } from 'pixi.js'

import AvatarGraphics from './AvatarGraphics'

import Point3D from '../../utils/Point3D'

import { TILE_DIMENSIONS } from '../../constants/Tile.constants'

import { AVATAR_WIDTH } from '../../constants/Avatar.constants'

/**
 * Represents an avatar in the isometric scene.
 */
export default class Avatar {
    /**
     * The position of the avatar.
     * @private
     * @type {Point3D}
     */
    readonly #position: Point3D;

    /**
     * The graphics object for the avatar.
     * @type {AvatarGraphics}
     * @private
     */
    readonly #graphics: AvatarGraphics

    /**
     * Creates a new Avatar instance.
     * @param {Point3D} position - The initial position of the avatar.
     */
    constructor(position: Point3D) {
        this.#position = position

        const offsets = new Point(
            TILE_DIMENSIONS.WIDTH / 2 - AVATAR_WIDTH,
            TILE_DIMENSIONS.HEIGHT / 2
        )

        const initialPosition = this.#position.add(offsets)

        this.#position.copyFrom(initialPosition)

        this.#graphics = new AvatarGraphics(this.#position)
    }

    /**
     * Get the graphics object of the avatar.
     * @type {AvatarGraphics}
     */
    get graphics(): AvatarGraphics {
        return this.#graphics
    }
}
