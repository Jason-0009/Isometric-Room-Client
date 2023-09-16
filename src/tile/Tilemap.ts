import { Container, DisplayObject, Point, Polygon } from 'pixi.js'

import Tile from './Tile'

import Wall from '../wall/Wall'

import WallDirections from '../wall/WallDirectionEnum'

import { cartesianToIsometric } from '../utils/coordinateConversions'

import { TILE_GRID, TILE_SURFACE_POINTS } from './Tile.constants'

/**
 * Represents a tilemap containing a grid of tiles and walls.
 */
class Tilemap {
    private container: Container

    /**
     * Creates a new Tilemap instance.
     */
    constructor() {
        // Initialize a Pixi.js container to hold the tilemap graphics.
        this.container = new Container()

        // Generate the tilemap based on the TILE_GRID configuration.
        this.generate()
    }

    /**
     * Generates the tilemap based on the TILE_GRID configuration.
     */
    private generate() {
        TILE_GRID.forEach((row, rowIndex) => {
            row.forEach((shouldAddTile, columnIndex) => {
                if (!shouldAddTile) return

                // Calculate the isometric position of the current tile.
                const isometricPosition = this.calculateIsometricPosition(rowIndex, columnIndex)

                // Add a tile to the tilemap.
                this.addTile(isometricPosition)

                // Determine if a wall should be added to the tilemap.
                const wallDirection = this.getWallDirection(rowIndex, columnIndex)

                if (wallDirection === undefined) return

                // Add a wall to the tilemap.
                this.addWall(isometricPosition, wallDirection)
            })
        })
    }

    /**
     * Calculates the isometric position of a tile based on its grid coordinates.
     * @param x - The x position of the tile.
     * @param y - The y position of the tile.
     * @returns The isometric position as a Point.
     */
    private calculateIsometricPosition(x: number, y: number): Point {
        const position = new Point(x, y)

        return cartesianToIsometric(position)
    }

    /**
     * Adds a tile to the tilemap.
     * @param position - The position of the tile.
     */
    private addTile(position: Point) {
        const tile = new Tile(position)

        this.container.addChild(tile.Graphics)
    }

    /**
     * Adds a wall to the tilemap.
     * @param position - The position of the wall.
     * @param direction - The direction of the wall.
     */
    private addWall(position: Point, direction: WallDirections) {
        const wall = new Wall(position, direction)

        this.container.addChild(wall)
    }

    /**
     * Determines the wall direction for a given tile.
     * @param x - The x position of the tile.
     * @param y - The y position of the tile.
     * @returns The wall direction or undefined if no wall should be added.
     */
    private getWallDirection(x: number, y: number) {
        // Check if the tile is at the top-left corner of the grid.
        if (x === 0 && y === 0) return WallDirections.BOTH

        // Check if the tile is at the left edge of the grid (excluding the top-left corner).
        if (x === 0) return WallDirections.LEFT

        // Check if the tile is at the top edge of the grid (excluding the top-left corner).
        if (y === 0) return WallDirections.RIGHT
    }

    /**
     * Finds a tile in the tilemap with an exact position match.
     * @param position - The coordinates to search for.
     * @returns The first matching TileGraphics object or null if not found.
     */
    getTileByExactPosition(position: Point) {
        return this.container.children.find((tile) => tile.position.equals(position))
    }

    /**
     * Finds a tile at the specified point, considering tile bounds.
     * @param position - The point to search for.
     * @returns The first matching TileGraphics object or null if not found.
     */
    getTileByPositionInBounds(position: Point) {
        return this.container.children.find((tile) => this.isPointWithinTileBounds(position, tile))
    }

    /**
     * Checks if the given point is within the bounds of a tile.
     * @param point - The point to check.
     * @param tile - The tile to check against.
     * @returns True if the point is within the tile's bounds, otherwise false.
     */
    private isPointWithinTileBounds(point: Point, tile: DisplayObject) {
        const transformedPoints = TILE_SURFACE_POINTS.map((surfacePoint, index) => {
            const tileCoordinate = index % 2 === 0 ? tile.x : tile.y
            return surfacePoint + tileCoordinate
        })

        const polygon = new Polygon(transformedPoints)

        return polygon.contains(point.x, point.y)
    }

    /**
     * Retrieves the container containing the tilemap.
     * @returns The Pixi.js container containing the tilemap.
     */
    get Container(): Container {
        return this.container
    }
}

export default Tilemap
