import { TileDimensions, TileColors } from 'types/Tile.types'

export const TILE_DIMENSIONS: TileDimensions = {
    WIDTH: 64,
    HEIGHT: 32,
    THICKNESS: 5,
}

export const TILE_COLORS: TileColors = {
    SURFACE: 0xFF0000, // Red
    LEFT_BORDER: 0xDC143C, // Crimson
    RIGHT_BORDER: 0xCC0000 // Dark red
}

export const TILE_SURFACE_POINTS: number[] = [
    TILE_DIMENSIONS.WIDTH / 2, 0,
    TILE_DIMENSIONS.WIDTH, TILE_DIMENSIONS.HEIGHT / 2,
    TILE_DIMENSIONS.WIDTH / 2, TILE_DIMENSIONS.HEIGHT,
    0, TILE_DIMENSIONS.HEIGHT / 2,
]

export const TILE_GRID: number[][] = [
    [3, 1, 1, 0, 0],
    [1, -1, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 3, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [-1, -1, 0, 0, 0, 0, 0],
    [-1, -1, -1, -1, 0, 0, 0]
]
