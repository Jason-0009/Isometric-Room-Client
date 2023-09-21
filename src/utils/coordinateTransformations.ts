import { TILE_DIMENSIONS } from '../constants/Tile.constants'

import Point3D from './Point3D'

/**
 * Converts cartesian coordinates (x, y) to isometric coordinates (x, y, z).
 * @param position - The 3D cartesian position.
 * @returns An object containing the converted isometric coordinates (x, y, z).
 */
export const cartesianToIsometric = (position: Point3D) => {
    const x = (position.x - position.y) * (TILE_DIMENSIONS.WIDTH / 2)
    const y = (position.x + position.y) * (TILE_DIMENSIONS.HEIGHT / 2)
    const z = position.z * TILE_DIMENSIONS.HEIGHT
    
    return new Point3D(x, y, z)
}

/**
 * Converts isometric coordinates (x, y, z) to cartesian coordinates (x, y, z).
 * @param position - The 3D isometric position.
 * @returns An object containing the converted cartesian coordinates (x, y, z).
 */
export const isometricToCartesian = (position: Point3D) => {
    const x = (position.x / (TILE_DIMENSIONS.WIDTH / 2) + position.y / (TILE_DIMENSIONS.HEIGHT / 2)) / 2
    const y = (position.y / (TILE_DIMENSIONS.HEIGHT / 2) - position.x / (TILE_DIMENSIONS.WIDTH / 2)) / 2
    const z = position.z / TILE_DIMENSIONS.HEIGHT

    return new Point3D(x, y, z)
}
