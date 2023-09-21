/**
 * Constants for tile dimensions.
 */
export const TILE_DIMENSIONS = {
    /**
     * The width of a tile.
     * @type {number}
     */
    WIDTH: 64,

    /**
     * The height of a tile.
     * @type {number}
     */
    HEIGHT: 32,

    /**
     * The thickness of a tile.
     * @type {number}
     */
    THICKNESS: 5,
};

/**
 * Constants for tile colors.
 */
export const TILE_COLORS = {
    /**
     * The color of the tile's surface.
     * @type {number}
     */
    SURFACE: 0xFF0000,

    /**
     * The color of the left border of the tile.
     * @type {number}
     */
    LEFT_BORDER: 0xDC143C,

    /**
     * The color of the right border of the tile.
     * @type {number}
     */
    RIGHT_BORDER: 0xCC0000,

    /**
     * The color of the tile when hovered over.
     * @type {number}
     */
    HOVER: 0xE60000,
};

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
];

/**
 * Grid configuration representing whether to add a tile at each grid cell.
 * Each cell can have a height value (number) or be empty (null).
 * @type {(number | null)[][]}
 */
export const TILE_GRID: (number | null)[][] = [
    [2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
];
