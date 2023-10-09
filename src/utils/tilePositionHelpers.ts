import { Point } from 'pixi.js'

import Point3D from '@utils/Point3D'

/**
 * Check if a tile position is valid within the given grid.
 * 
 * @param {Point3D} position - The tile position to check.
 * @param {number[][]} grid - The grid containing tile heights.
 * @returns {boolean} True if the tile position is valid, false otherwise.
 */
export const isValidTilePosition = (position: Point3D, grid: number[][]): boolean => {
    const { x, y, z } = position

    if (!isTilePositionInBounds(position, grid)) return false

    const tileHeight = grid[x]?.[y]

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
    const maxPoint = new Point(
        grid.length - 1,
        Math.max(...grid.map(row => row.length)) - 1
    )

    return x >= 0 && y >= 0 && x <= maxPoint.x && y <= maxPoint.y
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