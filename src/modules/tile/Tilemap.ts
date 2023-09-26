import { Container, Point } from 'pixi.js'

import Avatar from '../avatar/Avatar'

import Tile from './Tile'

import Wall from '../wall/Wall'
import WallDirection from '../wall/WallDirection'

import { cartesianToIsometric } from '../../utils/coordinateTransformations'
import Point3D from '../../utils/Point3D'

import { TILE_GRID } from '../../constants/Tile.constants'
import Pathfinder from '../../pathfinding/Pathfinder'

/**
 * Represents a tilemap containing a grid of tiles and walls.
 */
export default class Tilemap {
    /**
     * Array of tiles in the tilemap.
     * @type {Tile[]}
     * @private
     */
    readonly #tiles: Tile[]

    /**
     * The container for tiles in the tilemap.
     * @type {Container}
     * @private
     */
    readonly #tileContainer: Container

    /**
     * The container for walls in the tilemap.
     * @type {Container}
     * @private
     */
    #wallContainer!: Container

    #avatar!: Avatar

    /**
     * The pathfinding algorithm used for finding paths on the tilemap grid.
     * @type {Pathfinder}
     * @private
     */
    #pathfinder!: Pathfinder

    /**
     * Creates a Tilemap instance. */
    constructor() {
        this.#tiles = []

        this.#tileContainer = new Container()
    }

    /**
     * Initializes the Tilemap by setting up the wall container, avatar, and pathfinder.
     * @param {Container} wallContainer - The container for walls in the tilemap.
     * @param {Avatar} avatar - The Avatar object representing the character in the scene.
     */
    initialize(wallContainer: Container, avatar: Avatar) {
        this.#wallContainer = wallContainer
        this.#avatar = avatar
        this.#pathfinder = new Pathfinder(TILE_GRID)

        this.#generate()
    }

    /**
     * Generates the tilemap based on the TILE_GRID configuration.
     */
    #generate(): void {
        TILE_GRID.forEach((row, rowIndex) => {
            row.forEach((height, columnIndex) => {
                if (height === -1) return

                const position = new Point3D(rowIndex, columnIndex, height)

                // Calculate the isometric position of the current tile.
                const isometricPosition = cartesianToIsometric(position)

                // Determine if a wall should be added to the tilemap.
                const wallDirection = this.#calculateWallDirection(rowIndex, columnIndex)

                // Add a wall to the tilemap.
                if (wallDirection !== undefined) this.#addWall(isometricPosition, wallDirection)

                // Add a tile to the tilemap.
                this.#addTile(isometricPosition)
            })
        })
    }

    /**
     * Determines the wall direction for a given tile.
     * @param x - The x position of the tile.
     * @param y - The y position of the tile.
     * @returns The wall direction or undefined if no wall should be added.
     */
    #calculateWallDirection(x: number, y: number): WallDirection | undefined {
        // Check if the tile is at the top-left corner of the grid.
        if (x === 0 && y === 0) return WallDirection.BOTH

        // Check if the tile is at the left edge of the grid (excluding the top-left corner).
        if (x === 0) return WallDirection.LEFT

        // Check if the tile is at the top edge of the grid (excluding the top-left corner).
        if (y === 0) return WallDirection.RIGHT

        // Return undefined if no wall should be added.
        return undefined
    }

    /**
     * Adds a wall to the tilemap.
     * @param position - The position of the wall.
     * @param direction - The direction of the wall.
     */
    #addWall(position: Point3D, direction: WallDirection): void {
        const wall = new Wall(position, direction)

        this.#wallContainer.addChild(wall)
    }

    /**
     * Adds a tile to the tilemap.
     * @param position - The position of the tile.
     */
    #addTile(position: Point3D): void {
        const tile = new Tile(position).initialize(this.#pathfinder, this.#avatar)

        this.#tiles.push(tile)

        this.#tileContainer.addChild(tile.graphics)
    }

    findTileByExactPosition = (position: Point3D): Tile | undefined =>
        this.#tiles.find(tile => tile.position.equals(position))

    /**
     * Finds a tile at the specified point, considering tile bounds.
     * @param position - The point to search for.
     * @returns The first matching Tile object or null if not found.
     */
    findTileByPositionInBounds = (position: Point): Tile | undefined =>
        this.#tiles.find(tile => tile.isPointWithinBounds(position))

    /**
     * Retrieves the container containing the tilemap.
     * @returns {Container} The container containing the tilemap.
     */
    get tileContainer(): Container {
        return this.#tileContainer
    }
}
