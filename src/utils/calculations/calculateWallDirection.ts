import WallDirection from '@modules/wall/WallDirection'

const calculateWallDirection = (x: number, y: number): WallDirection | undefined => {
    switch (true) {
        case x === 0 && y === 0: return WallDirection.BOTH
        case x === 0: return WallDirection.LEFT
        case y === 0: return WallDirection.RIGHT
    }
}

export default calculateWallDirection
