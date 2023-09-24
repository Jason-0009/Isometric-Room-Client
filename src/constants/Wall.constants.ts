/**
 * Represents dimensions for a wall.
 */
type WallDimensions = {
    /**
     * The height of the wall in units.
     */
    HEIGHT: number

    /**
     * The thickness of the wall in units.
     */
    THICKNESS: number
}

/**
 * Represents colors for a wall.
 */
type WallColors = {
    LEFT: {
        /**
         * The surface color of the left wall.
         */
        SURFACE: number

        /**
         * The border color of the left wall.
         */
        BORDER: number

        /**
         * The top border color of the left wall.
         */
        BORDER_TOP: number
    }

    RIGHT: {
        /**
         * The surface color of the right wall.
         */
        SURFACE: number

        /**
         * The border color of the right wall.
         */
        BORDER: number

        /**
         * The top border color of the right wall.
         */
        BORDER_TOP: number
    }
}

/**
 * Constants for wall dimensions.
 * @type {WallDimensions}
 */
export const WALL_DIMENSIONS: WallDimensions = {
    HEIGHT: 100,
    THICKNESS: 5,
}

/**
 * Constants for wall colors.
 * @type {WallColors}
 */
export const WALL_COLORS: WallColors = {
    LEFT: {
        SURFACE: 0xFFC107, // Amber
        BORDER: 0xFF5722, // Deep Orange
        BORDER_TOP: 0x7B1FA2, // Purple
    },
    RIGHT: {
        SURFACE: 0x4CAF50, // Green
        BORDER: 0x009688, // Teal
        BORDER_TOP: 0x0288D1, // Light Blue
    },
}
