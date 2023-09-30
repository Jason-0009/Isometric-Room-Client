/**
 * Represents dimensions for a tile.
 */
export type TileDimensions = {
    /**
     * The width of a tile.
     */
    WIDTH: number

    /**
     * The height of a tile.
     */
    HEIGHT: number

    /**
     * The thickness of a tile.
     */
    THICKNESS: number
}

/**
 * Represents colors for a tile.
 */
export type TileColors = {
    /**
     * The color of the tile's surface.
     */
    SURFACE: number

    /**
     * The color of the left border of the tile.
     */
    LEFT_BORDER: number

    /**
     * The color of the right border of the tile.
     */
    RIGHT_BORDER: number

    /**
     * The color of the tile when hovered over.
     */
    HOVER: number
}