import Point3D from '@utils/Point3D'

import { isValidTilePosition, findClosestValidTilePosition } from '@utils/tilePositionHelpers'

import { cartesianToIsometric } from '@utils/coordinateTransformations'

import { AVATAR_INITIAL_POSITION, AVATAR_OFFSETS } from '@constants/Avatar.constants'
import Tilemap from '@modules/tile/Tilemap'

/**
 * Calculates the initial position of the avatar based on predefined settings.
 *
 * @param {Tilemap} tilemap - The tilemap of the 3D grid.
 * @returns {Point3D | undefined} - The initial avatar position in isometric coordinates. If no valid position is found, it returns `undefined`.
 */
const calculateInitialAvatarPosition = (tilemap: Tilemap): Point3D | undefined => {
    let initialPosition: Point3D | null = AVATAR_INITIAL_POSITION

    if (!isValidTilePosition(initialPosition, tilemap))
        initialPosition = findClosestValidTilePosition(initialPosition, tilemap.grid)

    if (!initialPosition) return

    return cartesianToIsometric(initialPosition).add(AVATAR_OFFSETS)
}

export default calculateInitialAvatarPosition