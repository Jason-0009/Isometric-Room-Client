import { Point } from 'pixi.js'

import { TILE_DIMENSIONS } from '../constants/Tile.constants'

import Cube from '../modules/cube/Cube'

import Point3D from './Point3D'

/**
 * Calculate offsets for positioning a cube centered at a given point.
 *
 * @param {number} size - The size of the cube.
 * @returns {Point} The calculated cube offsets as a Point.
 */
export const calculateCubeOffsets = (size: number): Point =>
    new Point(
        size - TILE_DIMENSIONS.WIDTH / 2,
        size - TILE_DIMENSIONS.HEIGHT / 2,
    )


/**
 * Calculate the stacking offsets for stacking one cube on top of another.
 * @param {Cube} cubeToStack - The cube that is being stacked on the base cube.
 * @param {Cube} baseCube - The cube on which another cube is stacked.
 * @returns {Point3D} The 3D stacking offsets.
 * @private
 */
export const calculateStackingOffsets = (baseCube: Cube, cubeToStack: Cube): Point3D =>
    new Point3D(
        baseCube.size - cubeToStack.size,
        baseCube.size - cubeToStack.size,
        baseCube.size
    )
