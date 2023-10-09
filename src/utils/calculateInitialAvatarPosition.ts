import Point3D from '@utils/Point3D'

import { isValidTilePosition, findClosestValidTilePosition } from '@utils/tilePositionHelpers'

import { cartesianToIsometric } from '@utils/coordinateTransformations'

import { AVATAR_INITIAL_POSITION, AVATAR_OFFSETS } from '@constants/Avatar.constants'

/**
 * Calculate the initial avatar position based on predefined settings.
 * 
 * @param {number[][]} grid - The grid containing tile heights.
 * @returns {Point3D} The initial avatar position in isometric coordinates.
 */
const calculateInitialAvatarPosition = (grid: number[][]): Point3D => {
    let initialPosition = AVATAR_INITIAL_POSITION

    if (!isValidTilePosition(initialPosition, grid)) initialPosition = findClosestValidTilePosition(initialPosition, grid) || initialPosition

    return cartesianToIsometric(initialPosition).add(AVATAR_OFFSETS)
}

export default calculateInitialAvatarPosition