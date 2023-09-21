import { Container, Point } from 'pixi.js'

import Tile from './Tile'

import Wall from '../wall/Wall'
import WallDirections from '../wall/WallDirectionEnum'

import { cartesianToIsometric } from '../utils/coordinateTransformations'

import Point3D from '../utils/Point3D'

import { TILE_GRID } from './Tile.constants'
import Cube from '../cube/Cube'

/**
 * Represents a tilemap containing a grid of tiles and walls.
 */
export default class Tilemap {
    private tiles: Tile[]
    private tileContainer: Container

    constructor(private wallContainer: Container) {
        this.tiles = []

        this.tileContainer = new Container()

        this.generateTilemap()
    }

    /**
     * Generates the tilemap based on the TILE_GRID configuration.
     */
    generateTilemap() {
        TILE_GRID.forEach((row, rowIndex) => {
            row.forEach((tileHeight, columnIndex) => {
                if (tileHeight === null) return

                // Calculate the isometric position of the current tile.
                const isometricPosition = cartesianToIsometric(new Point3D(rowIndex, columnIndex, tileHeight))

                // Determine if a wall should be added to the tilemap.
                const wallDirection = this.calculateWallDirection(rowIndex, columnIndex)

                // Add a wall to the tilemap.
                if (wallDirection !== undefined) this.addWall(isometricPosition, wallDirection)

                // Add a tile to the tilemap.
                this.addTileToTilemap(isometricPosition)
            })
        })
    }

    /**
     * Determines the wall direction for a given tile.
     * @param x - The x position of the tile.
     * @param y - The y position of the tile.
     * @returns The wall direction or undefined if no wall should be added.
     */
    private calculateWallDirection(x: number, y: number): WallDirections | undefined {
        // Check if the tile is at the top-left corner of the grid.
        if (x === 0 && y === 0) return WallDirections.BOTH

        // Check if the tile is at the left edge of the grid (excluding the top-left corner).
        if (x === 0) return WallDirections.LEFT

        // Check if the tile is at the top edge of the grid (excluding the top-left corner).
        if (y === 0) return WallDirections.RIGHT

        // Return undefined if no wall should be added.
        return undefined
    }

    /**
     * Adds a wall to the tilemap.
     * @param position - The position of the wall.
     * @param direction - The direction of the wall.
     */
    private addWall(position: Point3D, direction: WallDirections) {
        const wall = new Wall(position, direction)

        this.wallContainer.addChild(wall)
    }

    /**
     * Adds a tile to the tilemap.
     * @param position - The position of the tile.
     */
    private addTileToTilemap(position: Point3D) {
        const tile = new Tile(position)

        this.tiles.push(tile)

        this.tileContainer.addChild(tile.Graphics)
    }

    getTileByExactPosition(position: Point3D) {
        return this.tiles.find(tile => tile.Position.equals(position))
    }

    /**
     * Finds a tile at the specified point, considering tile bounds.
     * @param position - The point to search for.
     * @returns The first matching Tile object or null if not found.
     */
    getTileByPositionInBounds(position: Point) {
        return this.tiles.find(tile => tile.isPointWithinBounds(position))
    }

    /**
     * Retrieves the container containing the tilemap.
     * @returns The Pixi.js container containing the tilemap.
     */
    get TileContainer() {
        return this.tileContainer
    }
}
