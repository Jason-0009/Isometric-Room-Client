import { Graphics } from 'pixi.js'

import TileHover from '@modules/tile/TileHover'

import Point3D from '@utils/Point3D'

import { TILE_COLORS, TILE_DIMENSIONS } from '@constants/Tile.constants'

/**
 * A class representing the graphical representation of a tile.
 */
export default class TileGraphics extends Graphics {
    /**
     * Stores the hover effect for the tile.
     * 
     * @type {TileHover | null}
     */
    #tileHover: TileHover | null = null

    /**
     * Create a new TileGraphics instance.
     *
     * @param position - The position of the tile.
     * @param hasLeftBorder - Whether the tile has a left border.
     * @param hasRightBorder - Whether the tile has a right border.
     */
    constructor(position: Point3D, hasLeftBorder: boolean, hasRightBorder: boolean) {
        super()

        this.position.set(position.x, position.y - position.z)
        this.eventMode = 'static'

        this.#draw(hasLeftBorder, hasRightBorder)
    }


    /**
     * Draw the tile and its borders.
     * 
     * #private
     */
    #draw(hasLeftBorder: boolean, hasRightBorder: boolean): void {
        this.#drawSurface()

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

        this.beginFill(TILE_COLORS.SURFACE)
        this.drawPolygon(points)
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

        this.beginFill(TILE_COLORS.LEFT_BORDER)
        this.drawPolygon(points)
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

        this.beginFill(TILE_COLORS.RIGHT_BORDER)
        this.drawPolygon(points)
        this.endFill()
    }

    /**
     * Create a hover effect for the tile.
     */
    createHoverEffect(): void {
        if (this.#tileHover) return

        this.#tileHover = new TileHover(this.position)

        this.parent.addChild(this.#tileHover)
    }

    /**
     * Destroy the hover effect for the tile.
     */
    destroyHoverEffect(): void {
        if (!this.#tileHover) return

        this.parent.removeChild(this.#tileHover)

        this.#tileHover.destroy()
        this.#tileHover = null
    }
}
