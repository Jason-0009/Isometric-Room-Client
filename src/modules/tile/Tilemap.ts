import { Container, Point } from 'pixi.js'

import Tile from './Tile'

import Wall from '../wall/Wall'
import WallDirection from '../wall/WallDirection'

import { cartesianToIsometric } from '../../utils/coordinateTransformations'
import Point3D from '../../utils/Point3D'

import { TILEMAP_GRID } from '../../constants/Tile.constants'

/**
 * Represents a tilemap containing a grid of tiles and walls.
 */
export default class Tilemap {
    /**
     * The container for walls in the tilemap.
     * @type {Container}
     * @private
     */
    #wallContainer: Container

    /**
     * Array of tiles in the tilemap.
     * @type {Tile[]}
     * @private
     */
    #tiles: Tile[]
    
    /**
     * The container for tiles in the tilemap.
     * @type {Container}
     * @private
     */
    #tileContainer: Container

    /**
     * Creates a Tilemap instance.
     * @param {Container} wallContainer - The container for walls in the tilemap.
     */
    constructor(wallContainer: Container) {
        this.#wallContainer = wallContainer

        this.#tiles = []
        this.#tileContainer = new Container()

        this.generateTilemap()
    }

    /**
     * Generates the tilemap based on the TILE_GRID configuration.
     */
    generateTilemap(): void {
        TILEMAP_GRID.forEach((row, rowIndex) => {
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
        const tile = new Tile(position)

        this.#tiles.push(tile)

        this.#tileContainer.addChild(tile.graphics)
    }

    getTileByExactPosition = (position: Point3D): Tile | undefined =>
        this.#tiles.find(tile => tile.position.equals(position))

    /**
     * Finds a tile at the specified point, considering tile bounds.
     * @param position - The point to search for.
     * @returns The first matching Tile object or null if not found.
     */
    getTileByPositionInBounds = (position: Point): Tile | undefined =>
        this.#tiles.find(tile => tile.isPointWithinBounds(position))

    /**
     * Retrieves the container containing the tilemap.
     * @returns {Container} The container containing the tilemap.
     */
    get tileContainer(): Container {
        return this.#tileContainer
    }
}
