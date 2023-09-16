import { Graphics } from 'pixi.js'

import { TILE_COLORS, TILE_SURFACE_POINTS } from './Tile.constants'

import Point3D from '../../utils/Point3D'

/**
 * Represents a graphical overlay for hovering over a tile.
 */
export default class TileHover extends Graphics {
    /**
     * Creates a new TileHover instance.
     * @param x - The x-coordinate for the position of the TileHover.
     * @param y - The y-coordinate for the position of the TileHover.
     */
    constructor(position: Point3D) {
        super()

        // Set the position of the TileHover.
        this.position.set(position.x, position.y - position.z)

        // Call the method to draw the elevated border.
        this.draw()
    }

    /**
     * Draws an elevated border around the TileHover.
     * This border is used to highlight the tile on hover.
     */
    private draw() {
        this.beginFill(TILE_COLORS.HOVER)

        // Draw the border as a polygon using the TILE_POINTS defined in Tile.constants.
        this.drawPolygon(TILE_SURFACE_POINTS)

        this.endFill()
    }
}
