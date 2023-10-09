import { Point } from 'pixi.js'

import Point3D from '@utils/Point3D'

import { TILE_DIMENSIONS } from '@constants/Tile.constants'

/**
 * Colors used for the avatar.
 * 
 * @namespace
 */
export const AVATAR_COLORS = {
    /**
     * The color of the top of the avatar.
     * 
     * @type {number}
     */
    TOP: 0x9932CC,      // DarkOrchid

    /**
     * The color of the left face of the avatar.
     * 
     * @type {number}
     */
    LEFT_FACE: 0x32CD32, // LimeGreen

    /**
     * The color of the right face of the avatar.
     * 
     * @type {number}
     */
    RIGHT_FACE: 0x00BFFF  // DeepSkyBlue
}

/**
 * Dimensions of the avatar.
 * 
 * @namespace
 */
export const AVATAR_DIMENSIONS = {
    /**
     * The width of the avatar in pixels.
     * 
     * @type {number}
     */
    WIDTH: 20,

    /**
     * The height of the avatar in pixels.
     * 
     * @type {number}
     */
    HEIGHT: 60
}

/**
 * Offsets for the avatar's initial position.
 * 
 * @type {Point}
 */
export const AVATAR_OFFSETS: Point = new Point(
    TILE_DIMENSIONS.WIDTH / 2 - AVATAR_DIMENSIONS.WIDTH,
    TILE_DIMENSIONS.HEIGHT / 2
)

/**
 * The initial 3D position of the avatar.
 * 
 * @type {Point3D}
 */
export const AVATAR_INITIAL_POSITION: Point3D = new Point3D(0, 0, 0)

/**
 * The speed of the avatar's movement in the 3D space.
 * This constant determines how fast the avatar moves between tiles or positions.
 * 
 * @type {number}
 */
export const AVATAR_SPEED: number = 1