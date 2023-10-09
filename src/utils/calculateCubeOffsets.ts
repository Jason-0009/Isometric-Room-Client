import { Point } from 'pixi.js'

import { TILE_DIMENSIONS } from '@constants/Tile.constants'

/**
 * Calculate offsets for positioning a cube centered at a given position.
 * 
 * @param {number} size - The size of the cube.
 * @returns {Point} The calculated cube offsets as a Point.
 */
const calculateCubeOffsets = (size: number): Point => new Point(size - TILE_DIMENSIONS.WIDTH / 2, size - TILE_DIMENSIONS.HEIGHT / 2,)

export default calculateCubeOffsets