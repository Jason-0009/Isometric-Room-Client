import { Point } from 'pixi.js'

import { TILE_DIMENSIONS } from '@constants/Tile.constants'

const calculateCubeOffsets = (size: number): Point => new Point(size - TILE_DIMENSIONS.WIDTH / 2, size - TILE_DIMENSIONS.HEIGHT / 2,)

export default calculateCubeOffsets