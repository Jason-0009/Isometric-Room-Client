import { Point } from 'pixi.js'

import Point3D from '@utils/coordinates/Point3D'

import { TILE_DIMENSIONS } from '@constants/Tile.constants'

export const AVATAR_COLORS = {
    TOP_FACE: 0x9932CC, // DarkOrchid
    LEFT_FACE: 0x32CD32, // LimeGreen
    RIGHT_FACE: 0x00BFFF // DeepSkyBlue
}

export const AVATAR_DIMENSIONS = {
    WIDTH: 20,
    HEIGHT: 60
}

export const AVATAR_OFFSETS: Point = new Point(
    TILE_DIMENSIONS.WIDTH / 2 - AVATAR_DIMENSIONS.WIDTH,
    TILE_DIMENSIONS.HEIGHT / 2
)

export const AVATAR_INITIAL_POSITION: Point3D = new Point3D(0, 0, 0)

export const AVATAR_SPEED: number = 1