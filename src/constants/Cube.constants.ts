import { CubeSettings, CubeFaceColors } from 'types/Cube.types'

import Point3D from '@utils/coordinates/Point3D'

export const CUBE_COLORS: CubeFaceColors = {
    TOP_FACE: 0xFF5733, // Orange
    LEFT_FACE: 0x3399FF, // Blue
    RIGHT_FACE: 0xFFD700, // Yellow
}

export const CUBE_SETTINGS: CubeSettings[] = [
    { position: new Point3D(2, 4, 0), size: 32 },
    { position: new Point3D(2, 3, 0), size: 32 },
    { position: new Point3D(0, 0, 0), size: 16 },
    { position: new Point3D(4, 6, 0), size: 24 },
    { position: new Point3D(4, 5, 0), size: 24 },
    { position: new Point3D(6, 0, 4), size: 24 }
]