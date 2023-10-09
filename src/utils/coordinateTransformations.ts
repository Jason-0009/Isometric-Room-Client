import { TILE_DIMENSIONS } from '@constants/Tile.constants'

import Point3D from '@utils/Point3D'

/**
 * Converts cartesian coordinates to isometric coordinates.
 * 
 * @param {Point3D} position - The 3D cartesian position.
 * @returns {Point3D} An object containing the converted isometric coordinates.
 */
export const cartesianToIsometric = (position: Point3D): Point3D =>
    new Point3D(
        (position.x - position.y) * (TILE_DIMENSIONS.WIDTH / 2),
        (position.x + position.y) * (TILE_DIMENSIONS.HEIGHT / 2),
        position.z * TILE_DIMENSIONS.HEIGHT
    )

/**
 * Converts isometric coordinates to cartesian coordinates.
 * 
 * @param {Point3D} position - The 3D isometric position.
 * @returns {Point3D} An object containing the converted cartesian coordinates.
 */
export const isometricToCartesian = (position: Point3D): Point3D =>
    new Point3D(
        (position.x / (TILE_DIMENSIONS.WIDTH / 2) + position.y / (TILE_DIMENSIONS.HEIGHT / 2)) / 2,
        (position.y / (TILE_DIMENSIONS.HEIGHT / 2) - position.x / (TILE_DIMENSIONS.WIDTH / 2)) / 2,
        position.z / TILE_DIMENSIONS.HEIGHT
    )
