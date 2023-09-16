import { Graphics, Point } from 'pixi.js'

import { TILE_SURFACE_POINTS } from './Tile.constants'

/**
 * Represents a graphical overlay for hovering over a tile.
 */
export default class TileHover extends Graphics {
    /**
     * Creates a new TileHover instance.
     * @param x - The x-coordinate for the position of the TileHover.
     * @param y - The y-coordinate for the position of the TileHover.
     */
    constructor(position: Point) {
        super()

        // Set the position of the TileHover.
        this.position.copyFrom(position)

        // Call the method to draw the elevated border.
        this.draw()
    }

    /**
     * Draws an elevated border around the TileHover.
     * This border is used to highlight the tile on hover.
     */
    private draw() {
        // Set the line style for the border (3 pixels wide, white color).
        this.lineStyle(2, 0xffcc00)

        // Draw the border as a polygon using the TILE_POINTS defined in Tile.constants.
        this.drawPolygon(TILE_SURFACE_POINTS)
    }
}
