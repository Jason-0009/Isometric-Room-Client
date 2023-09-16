import { Point } from 'pixi.js'

import { TILE_DIMENSIONS } from '../tile/Tile.constants'

/**
 * Converts cartesian coordinates (x, y) to isometric coordinates (x, y).
 * @param cartesianX - The x-coordinate in cartesian space.
 * @param cartesianY - The y-coordinate in cartesian space.
 * @returns An object containing the converted isometric coordinates (x, y).
 */
export const cartesianToIsometric = (position: Point) =>
    new Point(
        (position.x - position.y) * (TILE_DIMENSIONS.WIDTH / 2),
        (position.x + position.y) * (TILE_DIMENSIONS.HEIGHT / 2)
    )

/**
 * Converts isometric coordinates (x, y) to cartesian coordinates (x, y).
 * @param isometricX - The x-coordinate in isometric space.
 * @param isometricY - The y-coordinate in isometric space.
 * @returns An object containing the converted cartesian coordinates (x, y).
 */
export const isometricToCartesian = (position: Point) =>
    new Point(
        (position.x / (TILE_DIMENSIONS.WIDTH / 2) + position.y / (TILE_DIMENSIONS.HEIGHT / 2)) * 0.5,
        (position.y / (TILE_DIMENSIONS.HEIGHT / 2) - position.x / (TILE_DIMENSIONS.WIDTH / 2)) * 0.5
    )
