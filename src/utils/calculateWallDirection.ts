import WallDirection from '@modules/wall/WallDirection'

/**
 * Calculates the wall direction for a given grid tile position.
 * 
 * @param {number} x - The x-coordinate of the grid tile.
 * @param {number} y - The y-coordinate of the grid tile.
 * @returns {WallDirection | undefined} The wall direction for the grid tile, or undefined if no wall should be added.
 */
const calculateWallDirection = (x: number, y: number): WallDirection | undefined => {
    switch (true) {
        case x === 0 && y === 0:
            return WallDirection.BOTH
        case x === 0:
            return WallDirection.LEFT
        case y === 0:
            return WallDirection.RIGHT
        default:
            return undefined
    }
}

export default calculateWallDirection
