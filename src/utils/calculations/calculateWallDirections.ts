import WallDirection from '@modules/wall/WallDirection'

const calculateWallDirections = (x: number, y: number): WallDirection[] => {
    if (x === 0 && y === 0) return [WallDirection.LEFT, WallDirection.RIGHT]
    if (x === 0) return [WallDirection.LEFT]
    if (y === 0) return [WallDirection.RIGHT]
    
    return []
}

export default calculateWallDirections
