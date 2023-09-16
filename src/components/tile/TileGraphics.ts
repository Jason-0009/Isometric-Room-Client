import { Graphics, Point } from 'pixi.js'

import { TILE_COLORS, TILE_DIMENSIONS, TILE_GRID } from './Tile.constants'

import TileHover from './TileHover'

import { isometricToCartesian } from '../../utils/coordinateTransformations'
import Point3D from '../../utils/Point3D'

/**
 * A class representing the graphical representation of a tile.
 */
export default class TileGraphics extends Graphics {
    // Stores the hover effect for the tile.
    private tileHover: TileHover | null = null

    /**
     * Create a new TileGraphics instance.
     * @param _position - The position of the tile.
     */
    constructor(private _position: Point3D) {
        super()

        this._position = _position

        this.position.set(_position.x, _position.y - _position.z)

        this.eventMode = 'static'

        this.draw() // Call the initial drawing method.
    }

    /**
     * Draw the tile and its borders.
     */
    private draw() {
        this.drawSurface() // Draw the tile surface.

        // Check and draw borders based on tile position.
        if (this.isBottomTileEmpty()) this.drawLeftBorder()
        if (this.isRightTileEmpty()) this.drawRightBorder()
    }

    /**
     * Draw the surface of the tile.
     */
    private drawSurface() {
        const points = [
            TILE_DIMENSIONS.WIDTH / 2, 0,               // Top middle point
            TILE_DIMENSIONS.WIDTH, TILE_DIMENSIONS.HEIGHT / 2,    // Right middle point
            TILE_DIMENSIONS.WIDTH / 2, TILE_DIMENSIONS.HEIGHT,    // Bottom middle point
            0, TILE_DIMENSIONS.HEIGHT / 2,             // Left middle point
        ]

        this.beginFill(TILE_COLORS.SURFACE) // Set the fill color.

        this.drawPolygon(points) // Draw the tile surface polygon.

        this.endFill() // End the fill.
    }

    /**
     * Draw the left border of the tile.
     */
    private drawLeftBorder() {
        const points = [
            0, TILE_DIMENSIONS.HEIGHT / 2,
            TILE_DIMENSIONS.WIDTH / 2, TILE_DIMENSIONS.HEIGHT,
            TILE_DIMENSIONS.WIDTH / 2, TILE_DIMENSIONS.HEIGHT + TILE_DIMENSIONS.THICKNESS,
            0, TILE_DIMENSIONS.HEIGHT / 2 + TILE_DIMENSIONS.THICKNESS,
        ]

        this.beginFill(TILE_COLORS.LEFT_BORDER) // Set border color.

        this.drawPolygon(points) // Draw the left border.

        this.endFill() // End the fill.
    }

    /**
     * Draw the right border of the tile.
     */
    private drawRightBorder() {
        const points = [
            TILE_DIMENSIONS.WIDTH, TILE_DIMENSIONS.HEIGHT / 2,
            TILE_DIMENSIONS.WIDTH / 2, TILE_DIMENSIONS.HEIGHT,
            TILE_DIMENSIONS.WIDTH / 2, TILE_DIMENSIONS.HEIGHT + TILE_DIMENSIONS.THICKNESS,
            TILE_DIMENSIONS.WIDTH, TILE_DIMENSIONS.HEIGHT / 2 + TILE_DIMENSIONS.THICKNESS,
        ]

        this.beginFill(TILE_COLORS.RIGHT_BORDER) // Set border color.

        this.drawPolygon(points) // Draw the right border.

        this.endFill() // End the fill.
    }

    /**
     * Create a hover effect for the tile.
     */
    createHoverEffect() {
        if (this.tileHover) return

        this.tileHover = new TileHover(this._position) // Create a hover effect.

        this.parent.addChild(this.tileHover) // Add the hover effect to the parent container.
    }

    /**
     * Destroy the hover effect for the tile.
     */
    destroyHoverEffect() {
        if (!this.tileHover) return

        this.parent.removeChild(this.tileHover) // Remove the hover effect from the parent container.

        this.tileHover.destroy() // Destroy the hover effect instance.

        this.tileHover = null // Reset the hover effect reference.
    }

    /**
     * Check if the tile below is empty.
     * @returns {boolean} True if the tile below is empty, otherwise false.
     */
    private isBottomTileEmpty(): boolean {
        // // Convert isometric coordinates to cartesian coordinates.
        // const { x, y } = isometricToCartesian(this._position)

        // // Check if there is a cell below and it's either "0" or undefined (empty).
        // return !TILE_GRID[x][y + 1]
        // Convert isometric coordinates to cartesian coordinates.
        const { x, y, z } = isometricToCartesian(this._position)

        // Check if there is a row to the right.
        const leftTileZ = TILE_GRID[x][y + 1]

        // // Check if the tile to the right is either null or has a different `z` value.
        return !leftTileZ || leftTileZ !== z
    }

    /**
     * Check if the tile on the right is empty.
     * @returns {boolean} True if the tile on the right is empty, otherwise false.
     */
    private isRightTileEmpty(): boolean {
        // Convert isometric coordinates to cartesian coordinates.
        const { x, y, z } = isometricToCartesian(this._position)

        // Check if there is a row to the right.
        const nextRow = TILE_GRID[x + 1]

        // There's no row to the right, so the tile is empty.
        if (!nextRow) return true

        // Get the `z` value of the tile to the right.
        const rightTileZ = nextRow[y]

        // Check if the tile to the right is either null or has a different `z` value.
        return !rightTileZ || rightTileZ !== z
    }


    get Position() {
        return this._position
    }
}
