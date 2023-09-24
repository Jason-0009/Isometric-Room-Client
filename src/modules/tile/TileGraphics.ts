import { Graphics } from 'pixi.js'

import TileHover from './TileHover'

import Point3D from '../../utils/Point3D'

import { TILE_COLORS, TILE_DIMENSIONS } from '../../constants/Tile.constants'

/**
 * A class representing the graphical representation of a tile.
 */
export default class TileGraphics extends Graphics {
    /**
     * Stores the hover effect for the tile.
     * @private
     * @type {TileHover | null}
     */
    #tileHover: TileHover | null = null;

    /**
     * Create a new TileGraphics instance.
     * @param position - The position of the tile.
     */
    constructor(position: Point3D, hasLeftBorder: boolean, hasRightBorder: boolean) {
        super()

        this.position.set(position.x, position.y - position.z)

        this.eventMode = 'static'

        // Call the initial drawing method.
        this.#draw(hasLeftBorder, hasRightBorder)
    }

    /**
     * Draw the tile and its borders.
     */
    #draw(hasLeftBorder: boolean, hasRightBorder: boolean): void {
        this.#drawSurface() // Draw the tile surface.

        // Check and draw borders based on tile position.
        if (hasLeftBorder) this.#drawLeftBorder()
        if (hasRightBorder) this.#drawRightBorder()
    }

    /**
     * Draw the surface of the tile.
     */
    #drawSurface(): void {
        const points = [
            TILE_DIMENSIONS.WIDTH / 2, 0,
            TILE_DIMENSIONS.WIDTH, TILE_DIMENSIONS.HEIGHT / 2,
            TILE_DIMENSIONS.WIDTH / 2, TILE_DIMENSIONS.HEIGHT,
            0, TILE_DIMENSIONS.HEIGHT / 2,
        ]

        // Set the fill color.
        this.beginFill(TILE_COLORS.SURFACE)

        // Draw the tile surface polygon.
        this.drawPolygon(points)

        // End the fill.
        this.endFill()
    }

    /**
     * Draw the left border of the tile.
     */
    #drawLeftBorder(): void {
        const points = [
            0, TILE_DIMENSIONS.HEIGHT / 2,
            TILE_DIMENSIONS.WIDTH / 2, TILE_DIMENSIONS.HEIGHT,
            TILE_DIMENSIONS.WIDTH / 2, TILE_DIMENSIONS.HEIGHT + TILE_DIMENSIONS.THICKNESS,
            0, TILE_DIMENSIONS.HEIGHT / 2 + TILE_DIMENSIONS.THICKNESS,
        ]

        // Set border color.
        this.beginFill(TILE_COLORS.LEFT_BORDER)

        // Draw the left border.
        this.drawPolygon(points)

        // End the fill.
        this.endFill()
    }

    /**
     * Draw the right border of the tile.
     */
    #drawRightBorder(): void {
        const points = [
            TILE_DIMENSIONS.WIDTH, TILE_DIMENSIONS.HEIGHT / 2,
            TILE_DIMENSIONS.WIDTH / 2, TILE_DIMENSIONS.HEIGHT,
            TILE_DIMENSIONS.WIDTH / 2, TILE_DIMENSIONS.HEIGHT + TILE_DIMENSIONS.THICKNESS,
            TILE_DIMENSIONS.WIDTH, TILE_DIMENSIONS.HEIGHT / 2 + TILE_DIMENSIONS.THICKNESS,
        ]

        // Set border color.
        this.beginFill(TILE_COLORS.RIGHT_BORDER)

        // Draw the right border.
        this.drawPolygon(points)

        // End the fill.
        this.endFill()
    }

    /**
     * Create a hover effect for the tile.
     */
    createHoverEffect(): void {
        if (this.#tileHover) return

        // Create a hover effect.
        this.#tileHover = new TileHover(this.position)

        // Add the hover effect to the parent container.
        this.parent.addChild(this.#tileHover)
    }

    /**
     * Destroy the hover effect for the tile.
     */
    destroyHoverEffect(): void {
        if (!this.#tileHover) return

        // Remove the hover effect from the parent container.
        this.parent.removeChild(this.#tileHover)

        // Destroy the hover effect instance.
        this.#tileHover.destroy()

        // Reset the hover effect reference.
        this.#tileHover = null
    }
}
