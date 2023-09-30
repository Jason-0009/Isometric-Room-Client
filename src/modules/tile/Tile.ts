import { Point, Polygon } from 'pixi.js'

import TileGraphics from './TileGraphics'

import Avatar from '../avatar/Avatar'

import Pathfinder from '../../pathfinding/Pathfinder'

import Point3D from '../../utils/Point3D'
import { isometricToCartesian } from '../../utils/coordinateTransformations'

import { TILE_GRID } from '../../constants/Tile.constants'

import { TILE_SURFACE_POINTS } from '../../constants/Tile.constants'

/**
 * Represents a tile on a grid.
 */
export default class Tile {
    /**
     * The position of the tile in isometric space.
     * @type {Point3D}
     * @private
     */
    readonly #position: Point3D

    /**
     * The graphics representing the tile.
     * @type {TileGraphics}
     * @private
     */
    readonly #graphics: TileGraphics

    /**
     * The Avatar object representing the character in the scene.
     * @type {Avatar}
     * @private
     */
    #avatar!: Avatar

    /**
     * The Pathfinder instance for pathfinding operations related to this tile.
     * @type {Pathfinder}
     * @private
     */
    #pathfinder!: Pathfinder

    /**
     * Creates a new Tile instance.
     * @param {Point3D} position - The position of the tile in isometric space.
     */
    constructor(position: Point3D) {
        this.#position = position

        // Determine if the tile should have left and right borders.
        const hasLeftBorder = this.#isBottomTileEmpty()
        const hasRightBorder = this.#isRightTileEmpty()

        this.#graphics = new TileGraphics(this.#position, hasLeftBorder, hasRightBorder)
    }

    /**
     * Initializes the Tile by setting up its associated Pathfinder instance and Avatar.
     * @param {Pathfinder} pathfinder - The Pathfinder instance for pathfinding operations related to this tile.
     * @param {Avatar} avatar - The Avatar object representing the character in the scene.
     * @returns {this} The initialized Tile instance.
     */
    initialize(avatar: Avatar, pathfinder: Pathfinder): this {
        this.#avatar = avatar
        this.#pathfinder = pathfinder

        this.#setupEventListeners()

        return this
    }

    /**
     * Checks if the given point is within the bounds of a tile.
     * @param {Point} point - The point to check.
     * @returns {boolean} True if the point is within the tile's bounds, otherwise false.
     */
    isPointWithinBounds(point: Point): boolean {
        const transformedPoints = TILE_SURFACE_POINTS.map((surfacePoint, index) => {
            const tileCoordinate = index % 2 === 0 ? this.#position.x : this.#position.y
            return surfacePoint + tileCoordinate
        })

        const polygon = new Polygon(transformedPoints)

        return polygon.contains(point.x, point.y)
    }

    /**
     * Check if the tile below is empty.
     * @returns {boolean} True if the tile below is empty, otherwise false.
     * @private
     */
    #isBottomTileEmpty(): boolean {
        // Convert isometric coordinates to cartesian coordinates.
        const { x, y, z } = isometricToCartesian(this.#position)

        // Check if there is a tile to the bottom.
        const leftTileZ = TILE_GRID[x][y + 1]

        // Check if the tile to the bottom is either null or has a different `z` value.
        return !leftTileZ || leftTileZ !== z
    }

    /**
     * Check if the tile on the right is empty.
     * @returns {boolean} True if the tile on the right is empty, otherwise false.
     * @private
     */
    #isRightTileEmpty(): boolean {
        // Convert isometric coordinates to cartesian coordinates.
        const { x, y, z } = isometricToCartesian(this.#position)

        // Check if there is a row to the right.
        const nextRow = TILE_GRID[x + 1]

        // There's no row to the right, so the tile is empty.
        if (!nextRow) return true

        // Get the `z` value of the tile to the right.
        const rightTileZ = nextRow[y]

        // Check if the tile to the right is either null or has a different `z` value.
        return !rightTileZ || rightTileZ !== z
    }

    /**
     * Sets up event listeners for the tile's graphics.
     * - 'pointerover': Triggered when the mouse pointer enters the tile.
     * - 'pointerout': Triggered when the mouse pointer leaves the tile.
     * - 'click': Triggered when the tile is clicked.
     */
    #setupEventListeners(): void {
        this.#graphics
            .on('pointerover', this.#handlePointerOver.bind(this))
            .on('pointerout', this.#handlePointerOut.bind(this))
            .on('click', this.#handleClick.bind(this))
    }

    /**
     * Handles the 'pointerover' event (mouse pointer entering the tile).
     * Creates a hover effect for the tile's graphics.
     * @private
     */
    #handlePointerOver = (): void =>
        this.#graphics.createHoverEffect()

    /**
     * Handles the 'pointerout' event (mouse pointer leaving the tile).
     * Destroys the hover effect for the tile's graphics.
     * @private
     */
    #handlePointerOut = (): void =>
        this.#graphics.destroyHoverEffect()

    /**
     * Handles the 'click' event (tile is clicked).
     * Converts the tile's isometric position to Cartesian coordinates and logs the result.
     * @private
     */
    async #handleClick(): Promise<void> {
        if (!this.#avatar.currentTile) return

        console.log('clicked position: ', isometricToCartesian(this.position))

        const start = isometricToCartesian(this.#avatar.currentTile.position)
        const goal = isometricToCartesian(this.#position)

        const path = this.#pathfinder.findPath(start, goal)

        if (!path) {
            console.error('No valid path found.')

            return
        }

        console.log(path)

        await this.#avatar.moveAlongPath(path)
    }

    /**
     * Gets the graphics object associated with the tile.
     * @returns {TileGraphics} The TileGraphics object.
     */
    get graphics(): TileGraphics {
        return this.#graphics
    }

    /**
     * Gets the position of the tile in isometric space.
     * @returns {Point3D} The Point3D representing the position.
     */
    get position(): Point3D {
        return this.#position
    }
}
