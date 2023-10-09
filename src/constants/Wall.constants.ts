import { WallDimensions, WallColors } from '../types/Wall.types'

/**
 * Constants for wall dimensions.
 *
 * @type {WallDimensions}
 */
export const WALL_DIMENSIONS: WallDimensions = {
    /**
     * The height of the wall.
     * 
     * @type {number}
     */
    HEIGHT: 100,

    /**
     * The thickness of the wall.
     * 
     * @type {number}
     */
    THICKNESS: 5,
}

/**
 * Constants for wall colors.
 *
 * @type {WallColors}
 */
export const WALL_COLORS: WallColors = {
    /**
     * Colors for the left side of the wall.
     * 
     * @type {object}
     * @property {number} SURFACE - The color of the left wall surface (Amber).
     * @property {number} BORDER - The color of the left wall border (Deep Orange).
     * @property {number} BORDER_TOP - The color of the top border of the left wall (Purple).
     */
    LEFT: {
        SURFACE: 0xFFC107, // Amber
        BORDER: 0xFF5722, // Deep Orange
        BORDER_TOP: 0x7B1FA2, // Purple
    },

    /**
     * Colors for the right side of the wall.
     * 
     * @type {object}
     * @property {number} SURFACE - The color of the right wall surface (Green).
     * @property {number} BORDER - The color of the right wall border (Teal).
     * @property {number} BORDER_TOP - The color of the top border of the right wall (Light Blue).
     */
    RIGHT: {
        SURFACE: 0x4CAF50, // Green
        BORDER: 0x009688, // Teal
        BORDER_TOP: 0x0288D1, // Light Blue
    },
}
