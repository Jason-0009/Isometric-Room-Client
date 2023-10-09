import { Point } from 'pixi.js'

import Point3D from '@utils/Point3D'
import Tilemap from '@modules/tile/Tilemap'

/**
 * Calculates the initial position of the avatar based on predefined settings.
 * 
 * The function first checks if the predefined initial position is valid in the given tilemap.
 * If it's not valid, it finds the closest valid tile position in the tilemap grid.
 * If no valid position is found, it defaults to the predefined initial position.
 * 
 * The function then converts the initial position from cartesian to isometric coordinates,
 * and adds predefined offsets to it.
 *
 * @param {Tilemap} tilemap - The tilemap of the 3D grid. This tilemap is used to validate the initial position and find a valid position if necessary.
 * @returns {Point3D} - The initial avatar position in isometric coordinates.
 */
export const isValidTilePosition = (position: Point3D, tilemap: Tilemap): boolean => {
    const { x, y, z } = position

    const position2D = new Point(x, y)

    if (!isTilePositionInBounds(position, tilemap.grid)) return false

    const tileHeight = tilemap.getGridValue(position2D)

    /* Check if the tile height is not -1 (indicating an invalid tile)
       and matches the z-coordinate of the tile position
    */
    return tileHeight !== -1 && tileHeight === z
}

/**
 * Check if a tile position is within the bounds of the grid.
 * 
 * @param {Point3D} position - The tile position to check.
 * @param {number[][]} grid - The grid containing tile heights.
 * @returns {boolean} True if the tile position is within bounds, false otherwise.
 */
const isTilePositionInBounds = (position: Point3D, grid: number[][]): boolean => {
    const { x, y } = position

    // Determine the maximum valid values for x and y based on the grid dimensions.
    const maxGridValues = new Point(
        grid.length - 1,
        Math.max(...grid.map(row => row.length)) - 1
    )

    return x >= 0 && y >= 0 && x <= maxGridValues.x && y <= maxGridValues.y
}

/**
 * Find the closest valid tile position to a given tile position within the grid.
 * 
 * @param {Point3D} position - The target tile position.
 * @param {number[][]} grid - The grid containing tile heights.
 * @returns {Point3D | null} The closest valid tile position, or null if none is found.
 */
export const findClosestValidTilePosition = (position: Point3D, grid: number[][]): Point3D | null =>
    grid.reduce((closest: { position: Point3D | null, distance: number }, row: number[], x: number) =>
        row.reduce((innerClosest: { position: Point3D | null, distance: number }, z: number, y: number) => {
            if (z < 0) return innerClosest

            const potentialPosition = new Point3D(x, y, z)

            if (potentialPosition.equals(position)) return innerClosest

            const distance = position.distanceTo(potentialPosition)
            const priority = potentialPosition.x === position.x && potentialPosition.y === position.y ? 0 : distance

            if (priority < innerClosest.distance) return { position: potentialPosition, distance: priority }

            return innerClosest
        }, closest), { position: null, distance: Number.POSITIVE_INFINITY }).position