import { WallDimensions, WallColors } from 'types/Wall.types'

export const WALL_DIMENSIONS: WallDimensions = {
    HEIGHT: 100,
    THICKNESS: 5,
}

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
