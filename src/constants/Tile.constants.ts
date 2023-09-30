import { TileDimensions, TileColors } from '../types/Tile.types'

/**
 * Constants for tile dimensions.
 * @type {TileDimensions}
 */
export const TILE_DIMENSIONS: TileDimensions = {
    /**
     * The width of a tile.
     */
    WIDTH: 64,

    /**
     * The height of a tile.
     */
    HEIGHT: 32,

    /**
     * The thickness of a tile.
     */
    THICKNESS: 5,
}

/**
 * Constants for tile colors.
 * @type {TileColors}
 */
export const TILE_COLORS: TileColors = {
    /**
     * The color of the tile's surface.
     */
    SURFACE: 0xFF0000,

    /**
     * The color of the left border of the tile.
     */
    LEFT_BORDER: 0xDC143C,

    /**
     * The color of the right border of the tile.
     */
    RIGHT_BORDER: 0xCC0000,

    /**
     * The color of the tile when hovered over.
     */
    HOVER: 0xE60000,
}

/**
 * Points defining the shape of a tile's surface (used for drawing).
 * The points are defined as [x1, y1, x2, y2, x3, y3, ...]
 * @type {number[]}
 */
export const TILE_SURFACE_POINTS: number[] = [
    TILE_DIMENSIONS.WIDTH / 2, 0,
    TILE_DIMENSIONS.WIDTH, TILE_DIMENSIONS.HEIGHT / 2,
    TILE_DIMENSIONS.WIDTH / 2, TILE_DIMENSIONS.HEIGHT,
    0, TILE_DIMENSIONS.HEIGHT / 2,
]

/**
 * Grid configuration representing whether to add a tile at each grid cell.
 * Each cell can have a height value (number) or be empty (null).
 * @type {(number | null)[][]}
 */
export const TILE_GRID: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [-1, -1, 0, 0, 0, 0],
    [0, -1, 0, -1, 0, 0]
]
