import { Point } from 'pixi.js'

import Point3D from '../utils/Point3D'

import { TILE_DIMENSIONS } from './Tile.constants'

/**
 * Colors used for the avatar.
 * @namespace
 */
export const AVATAR_COLORS = {
    /**
     * The base color of the avatar (Lavender).
     * @type {number}
     */
    TOP: 0xE6E6FA,      // Lavender

    /**
     * The color of the left face of the avatar (LimeGreen).
     * @type {number}
     */
    LEFT_FACE: 0x32CD32, // LimeGreen

    /**
     * The color of the right face of the avatar (DeepSkyBlue).
     * @type {number}
     */
    RIGHT_FACE: 0x00BFFF  // DeepSkyBlue
}

/**
 * Dimensions of the avatar.
 * @namespace
 */
export const AVATAR_DIMENSIONS = {
    /**
     * The width of the avatar in pixels.
     * @type {number}
     */
    WIDTH: 20,

    /**
     * The height of the avatar in pixels.
     * @type {number}
     */
    HEIGHT: 60
}

/**
 * Offsets for the avatar's initial position.
 * @type {Point}
 */
export const AVATAR_OFFSETS: Point = new Point(
    TILE_DIMENSIONS.WIDTH / 2 - AVATAR_DIMENSIONS.WIDTH,
    TILE_DIMENSIONS.HEIGHT / 2
)

/**
 * The initial position of the avatar in 3D space.
 * @type {Point3D}
 */
export const AVATAR_INITIAL_POSITION: Point3D = new Point3D(2, 2, 0)

export const AVATAR_SPEED = 1