import { Point } from 'pixi.js'

import Point3D from '../utils/Point3D'

import { TILE_DIMENSIONS } from './Tile.constants'

/**
 * The color of the avatar in hexadecimal format (0xRRGGBB).
 * @type {number}
 */
export const AVATAR_COLOR: number = 0xFF0000 // Red color

/**
 * The width of the avatar in pixels.
 * @type {number}
 */
export const AVATAR_WIDTH: number = 20

/**
 * The height of the avatar in pixels.
 * @type {number}
 */
export const AVATAR_HEIGHT: number = 60

/**
 * The offsets for the avatar's initial position.
 * @type {Point}
 */
export const AVATAR_OFFSETS: Point = new Point(
    TILE_DIMENSIONS.WIDTH / 2 - AVATAR_WIDTH,
    TILE_DIMENSIONS.HEIGHT / 2
)

/**
 * The initial position of the avatar.
 * @type {Point3D}
 */
export const AVATAR_TILE_POINT: Point3D = new Point3D(1, 0, 0)
