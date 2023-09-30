import { Graphics } from 'pixi.js'

import Point3D from '../../utils/Point3D'

import { AVATAR_COLORS, AVATAR_DIMENSIONS } from '../../constants/Avatar.constants'

/**
 * Represents the graphical representation of an avatar.
 */
export default class AvatarGraphics extends Graphics {
    /**
     * Creates a new instance of AvatarGraphics.
     * @param {Point3D} position - The initial position of the avatar.
     */
    constructor(position: Point3D) {
        super()

        // Set the initial position of the avatar within the graphics.
        this.position.set(position.x, position.y - position.z)

        this.#draw()
    }

    /**
     * Draws the avatar by calling individual methods to draw its faces.
     */
    #draw(): void {
        this.#drawTopFace()
        this.#drawLeftFace()
        this.#drawRightFace()
    }

    /**
     * Draws the top face of the avatar.
     * @private
     */
    #drawTopFace(): void {
        const points = [
            0, -AVATAR_DIMENSIONS.HEIGHT,
            AVATAR_DIMENSIONS.WIDTH, -AVATAR_DIMENSIONS.HEIGHT - AVATAR_DIMENSIONS.WIDTH / 2,
            AVATAR_DIMENSIONS.WIDTH * 2, -AVATAR_DIMENSIONS.HEIGHT,
            AVATAR_DIMENSIONS.WIDTH, -AVATAR_DIMENSIONS.HEIGHT + AVATAR_DIMENSIONS.WIDTH / 2
        ]

        this.beginFill(AVATAR_COLORS.TOP)

        this.drawPolygon(points)

        this.endFill()
    }

    /**
     * Draws the left face of the avatar.
     * @private
     */
    #drawLeftFace(): void {
        const points = [
            0, 0,
            0, -AVATAR_DIMENSIONS.HEIGHT,
            AVATAR_DIMENSIONS.WIDTH, -AVATAR_DIMENSIONS.HEIGHT + AVATAR_DIMENSIONS.WIDTH / 2,
            AVATAR_DIMENSIONS.WIDTH, AVATAR_DIMENSIONS.WIDTH / 2,
        ]

        this.beginFill(AVATAR_COLORS.LEFT_FACE)

        this.drawPolygon(points)

        this.endFill()
    }

    /**
     * Draws the right face of the avatar.
     * @private
     */
    #drawRightFace(): void {
        const points = [
            AVATAR_DIMENSIONS.WIDTH, AVATAR_DIMENSIONS.WIDTH / 2,
            AVATAR_DIMENSIONS.WIDTH, -AVATAR_DIMENSIONS.HEIGHT + AVATAR_DIMENSIONS.WIDTH / 2,
            AVATAR_DIMENSIONS.WIDTH * 2, -AVATAR_DIMENSIONS.HEIGHT,
            AVATAR_DIMENSIONS.WIDTH * 2, 0,
        ]

        this.beginFill(AVATAR_COLORS.RIGHT_FACE)

        this.drawPolygon(points)

        this.endFill()
    }
}
