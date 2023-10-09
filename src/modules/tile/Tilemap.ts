import { Container, Point } from 'pixi.js'

import Tile from '@modules/tile/Tile'

import WallCollection from '@modules/wall/WallCollection'

import Avatar from '@modules/avatar/Avatar'

import { cartesianToIsometric } from '@utils/coordinateTransformations'
import Point3D from '@utils/Point3D'
import calculateWallDirection from '@utils/calculateWallDirection'

/**
 * Represents a tilemap containing a grid of tiles and walls.
 */
export default class Tilemap {
    /**
     * Array of tiles in the tilemap.
     * @type {Tile[]}
     */
    readonly #tiles: Tile[]

    /**
     * The container for tiles in the tilemap.
     * @type {Container}
     */
    readonly #tileContainer: Container

    /**
    * The 2D grid of tiles.
    * 
    * @type {number[][]}
    */
    readonly #grid: number[][]

    /**
     * The collection of walls in the tilemap.
     * 
     * @type {WallCollection}
     */
    readonly #wallCollection: WallCollection

    /**
     * The avatar object used within the tilemap.
     * 
     * @type {Avatar}
     */
    #avatar: Avatar | undefined

    /**
     * Creates a Tilemap instance. 
     */
    constructor(grid: number[][], wallCollection: WallCollection) {
        this.#tiles = []
        this.#tileContainer = new Container()
        this.#grid = grid
        this.#wallCollection = wallCollection
    }

    /**
     * Generates the tilemap based on the TILE_GRID configuration.
     */
    generate(): void {
        this.#grid.forEach((row, x) => {
            row.forEach((z, y) => {
                if (z === -1) return

                const position = new Point3D(x, y, z)
                const isometricPosition = cartesianToIsometric(position)
                const wallDirection = calculateWallDirection(x, y)

                if (wallDirection !== undefined) this.#wallCollection.addWall(isometricPosition, wallDirection)

                this.#addTile(isometricPosition)
            })
        })
    }
    /**
     * Finds a tile at the specified exact position.
     * 
     * @param {Point3D} position - The exact position to search for.
     * @returns {Tile | undefined} The found Tile object, or undefined if not found.
     */
    findTileByExactPosition = (position: Point3D): Tile | undefined =>
        this.#tiles.find((tile) => tile.position.equals(position))

    /**
     * Finds a tile at the specified position, considering tile bounds.
     * @param position - The position to search for.
     * @returns The first matching Tile object or null if not found.
     */
    findTileByPositionInBounds = (position: Point): Tile | undefined =>
        this.#tiles.find(tile => tile.isPositionWithinBounds(position))

    /**
     * Adds a tile to the tilemap.
     * 
     * @param position - The position of the tile.
     */
    #addTile(position: Point3D): void {
        if (!this.#avatar) return

        const tile = new Tile(position, this.#grid, this.#avatar)

        this.#tiles.push(tile)
        this.#tileContainer.addChild(tile.graphics)
    }

    /**
     * Retrieves the container containing the tilemap.
     * @returns {Container} The container containing the tilemap.
     */
    get tileContainer(): Container {
        return this.#tileContainer
    }

    /**
     * Getter for the grid property.
     * @returns {number[][]} The grid used for the tilemap layout.
     */
    get grid(): number[][] {
        return this.#grid
    }

    /**
     * Setter for the avatar property.
     * @param {Avatar} value - The avatar object that will navigate the tilemap.
     */
    set avatar(value: Avatar) {
        this.#avatar = value
    }
}
