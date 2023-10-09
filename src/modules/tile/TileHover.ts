import { Graphics, Point } from 'pixi.js'

import { TILE_COLORS, TILE_SURFACE_POINTS } from '@constants/Tile.constants'

/**
 * Represents a graphical overlay for hovering over a tile.
 */
export default class TileHover extends Graphics {
    /**
     * Creates a new TileHover instance.
     * 
     * @param {Point} position - The position (x, y) of the TileHover.
     */
    constructor(position: Point) {
        super()

        this.position.copyFrom(position)

        this.#draw()
    }

    /**
     * Draws an elevated border around the TileHover.
     * This border is used to highlight the tile on hover.
     */
    #draw(): void {
        this.beginFill(TILE_COLORS.HOVER)
        this.drawPolygon(TILE_SURFACE_POINTS)
        this.endFill()
    }
}
