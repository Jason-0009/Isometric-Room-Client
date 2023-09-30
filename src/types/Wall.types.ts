/**
 * Represents dimensions for a wall.
 */
export type WallDimensions = {
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
export type WallColors = {
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