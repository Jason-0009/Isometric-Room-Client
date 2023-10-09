import { Point, Polygon } from 'pixi.js'

import TileGraphics from '@modules/tile/TileGraphics'

import Avatar from '@modules/avatar/Avatar'

import Point3D from '@utils/Point3D'
import { isometricToCartesian } from '@utils/coordinateTransformations'

import { TILE_SURFACE_POINTS } from '@constants/Tile.constants'

/**
 * Represents a tile on a grid.
 */
export default class Tile {
    /**
     * The position of the tile in isometric space.
     * 
     * @type {Point3D}
     */
    readonly #position: Point3D

    /**
    * The 2D grid of tiles.
    * 
    * @type {number[][]}
    */
    readonly #grid: number[][]


    /**
     * The graphics representing the tile.
     * 
     * @type {TileGraphics}
     */
    readonly #graphics: TileGraphics

    /**
     * The Avatar object representing the character in the scene.
     * 
     * @type {Avatar}
     */
    readonly #avatar: Avatar

    /**
     * Creates a new Tile instance.
     * 
     * @param {Point3D} position - The position of the tile in isometric space.
     */
    constructor(position: Point3D, grid: number[][], avatar: Avatar) {
        this.#position = position
        this.#grid = grid
        this.#avatar = avatar

        const hasLeftBorder = this.#isBottomTileEmpty()
        const hasRightBorder = this.#isRightTileEmpty()

        this.#graphics = new TileGraphics(this.#position, hasLeftBorder, hasRightBorder)

        this.#setupEventListeners()
    }

    /**
     * Checks if the given position is within the bounds of the tile.
     * 
     * @param {Point} position - The position to check.
     * @returns {boolean} True if the position is within the tile's bounds, otherwise false.
     */
    isPositionWithinBounds(position: Point): boolean {
        const { x, y, z } = this.position

        const transformedPoints = TILE_SURFACE_POINTS.map((surfacePoint, index) => surfacePoint + (index % 2 === 0 ? x : y - z))
        const polygon = new Polygon(transformedPoints)

        return polygon.contains(position.x, position.y)
    }

    /**
     * Check if the tile below is empty.
     * 
     * @returns {boolean} True if the tile below is empty, otherwise false.
     */
    #isBottomTileEmpty(): boolean {
        const { x, y, z } = isometricToCartesian(this.#position)

        const bottomTileZ = this.#grid[x][y + 1]

        return !bottomTileZ || bottomTileZ !== z
    }

    /**
     * Check if the tile on the right is empty.
     * 
     * @returns {boolean} True if the tile on the right is empty, otherwise false.
     */
    #isRightTileEmpty(): boolean {
        const { x, y, z } = isometricToCartesian(this.#position)

        const nextRow = this.#grid[x + 1]

        if (!nextRow) return true

        const rightTileZ = nextRow[y]

        return !rightTileZ || rightTileZ !== z
    }

    /**
     * Sets up event listeners for the tile's graphics.
     */
    #setupEventListeners(): void {
        this.#graphics
            .on('pointerover', this.#handlePointerOver.bind(this))
            .on('pointerout', this.#handlePointerOut.bind(this))
            .on('pointerdown', this.#handlePointerDown.bind(this))
    }

    /**
     * Handles the 'pointerover' event (mouse pointer entering the tile).
     */
    #handlePointerOver = (): void => this.#graphics.createHoverEffect()

    /**
     * Handles the 'pointerout' event (mouse pointer leaving the tile).
     */
    #handlePointerOut = (): void => this.#graphics.destroyHoverEffect()

    /**
     * Handles a pointer down (click or touch) event.
     */
    #handlePointerDown = (): void => {
        this.#avatar.goalPosition = isometricToCartesian(this.#position)
        this.#avatar.calculatePath()
    }

    /**
     * Gets the graphics object associated with the tile.
     * 
     * @returns {TileGraphics} The TileGraphics object.
     */
    get graphics(): TileGraphics {
        return this.#graphics
    }

    /**
     * Gets the position of the tile in isometric space.
     * 
     * @returns {Point3D} The Point3D representing the position.
     */
    get position(): Point3D {
        return this.#position
    }
}
