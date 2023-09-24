/**
 * Grid configuration representing whether to add a tile at each grid cell.
 * Each cell can have a height value (number) or be empty (null).
 * @type {(number | null)[][]}
 */
export const TILEMAP_GRID: (number | null)[][] = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
]

/**
 * The number of rows in the TILE_GRID.
 * @type {number}
 */
export const TILEMAP_ROWS: number = TILEMAP_GRID.length

/**
 * The maximum number of columns among all rows in the TILE_GRID.
 * @type {number}
 */
export const TILEMAP_COLUMNS: number = Math.max(...TILEMAP_GRID.map(row => row.length))