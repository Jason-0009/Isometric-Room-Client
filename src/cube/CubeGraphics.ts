import { Graphics, Point } from 'pixi.js'

import { TILE_DIMENSIONS } from '../tile/Tile.constants'

import { CUBE_COLORS } from './Cube.constants'

export default class CubeGraphics extends Graphics {
    private size: number

    private xOffset: number
    private yOffset: number

    constructor(position: Point, size: number) {
        super()

        // Ensure the size is within a valid range
        this.size = Math.max(8, Math.min(size, TILE_DIMENSIONS.HEIGHT))

        this.xOffset = this.size - TILE_DIMENSIONS.WIDTH / 2
        this.yOffset = this.size - TILE_DIMENSIONS.HEIGHT / 2

        // Calculate the initial position of the cube within the graphics.
        const initialPosition = new Point(position.x - this.xOffset, position.y - this.yOffset)

        // Set the initial position of the cube within the graphics.
        this.position.copyFrom(initialPosition)

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

    /**
     * Retrieves the tile position of the cube based on its current position and offsets.
     * @returns The tile position as a Point.
     */
    get TilePosition(): Point {
        return new Point(
            this.x + this.xOffset,
            this.y + this.yOffset
        )
    }

    get Offsets() {
        return { x: this.xOffset, y: this.yOffset }
    }
}
