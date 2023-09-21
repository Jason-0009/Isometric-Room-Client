import { Graphics } from 'pixi.js'

import { CUBE_COLORS } from './Cube.constants'

import Point3D from '../utils/Point3D'

export default class CubeGraphics extends Graphics {
    constructor(position: Point3D, private size: number) {
        super()

        // Set the initial position of the cube within the graphics.
        this.position.set(position.x, position.y - position.z)

        this.eventMode = 'dynamic'

        this.cursor = 'pointer'

        this.draw()
    }

    /**
     * Draws the cube by calling individual methods to draw its faces.
     */
    draw() {
        this.drawTopFace()
        this.drawLeftFace()
        this.drawRightFace()
    }

    /**
     * Draws the top face of the cube.
     */
    private drawTopFace() {
        const points = [
            0, 0,
            this.size, -this.size / 2,
            this.size * 2, 0,
            this.size, this.size / 2,
        ]

        this.beginFill(CUBE_COLORS.TOP_FACE)

        this.drawPolygon(points)

        this.endFill()
    }

    /**
     * Draws the left face of the cube.
     */
    private drawLeftFace() {
        const points = [
            0, 0,
            0, this.size,
            this.size, this.size * 1.5,
            this.size, this.size / 2,
        ]

        this.beginFill(CUBE_COLORS.LEFT_FACE)

        this.drawPolygon(points)

        this.endFill()
    }

    /**
     * Draws the right face of the cube.
     */
    private drawRightFace() {
        const points = [
            this.size * 2, 0,
            this.size * 2, this.size,
            this.size, this.size * 1.5,
            this.size, this.size / 2,
        ]

        this.beginFill(CUBE_COLORS.RIGHT_FACE)

        this.drawPolygon(points)

        this.endFill()
    }
}
