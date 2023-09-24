import { Graphics } from 'pixi.js'

import Point3D from '../../utils/Point3D'

import { CUBE_COLORS } from '../../constants/Cube.constants'

/**
 * Represents the graphics of a cube in the isometric scene.
 */
export default class CubeGraphics extends Graphics {
    /**
     * The size of the cube.
     * @private
     * @type {number}
     */
    readonly #size: number

    /**
     * Creates a new CubeGraphics instance.
     * @param {Point3D} position - The position of the cube in 3D space.
     * @param {number} size - The size of the cube.
     */
    constructor(position: Point3D, size: number) {
        super()

        this.position.set(position.x, position.y - position.z)

        this.#size = size

        this.eventMode = 'dynamic'

        this.cursor = 'pointer'

        this.#draw()
    }

    /**
     * Draws the cube by calling individual methods to draw its faces.
     * @private
     */
    #draw(): void {
        this.#drawTopFace()
        this.#drawLeftFace()
        this.#drawRightFace()
    }

    /**
     * Draws the top face of the cube.
     * @private
     */
    #drawTopFace(): void {
        const points = [
            0, 0,
            this.#size, -this.#size / 2,
            this.#size * 2, 0,
            this.#size, this.#size / 2,
        ]

        this.beginFill(CUBE_COLORS.TOP_FACE)

        this.drawPolygon(points)

        this.endFill()
    }

    /**
     * Draws the left face of the cube.
     * @private
     */
    #drawLeftFace(): void {
        const points = [
            0, 0,
            0, this.#size,
            this.#size, this.#size * 1.5,
            this.#size, this.#size / 2,
        ]

        this.beginFill(CUBE_COLORS.LEFT_FACE)

        this.drawPolygon(points)

        this.endFill()
    }

    /**
     * Draws the right face of the cube.
     * @private
     */
    #drawRightFace(): void {
        const points = [
            this.#size * 2, 0,
            this.#size * 2, this.#size,
            this.#size, this.#size * 1.5,
            this.#size, this.#size / 2,
        ]

        this.beginFill(CUBE_COLORS.RIGHT_FACE)

        this.drawPolygon(points)

        this.endFill()
    }
}
