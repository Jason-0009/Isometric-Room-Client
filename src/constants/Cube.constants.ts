import { CubeSettings } from '../types/Cube.types'

import Point3D from '../utils/Point3D'

/**
 * Represents color values for different faces of a cube.
 */
type CubeColors = {
    /**
     * The color of the top face of the cube.
     */
    TOP_FACE: number

    /**
     * The color of the left face of the cube.
     */
    LEFT_FACE: number

    /**
     * The color of the right face of the cube.
     */
    RIGHT_FACE: number
}

/**
 * Contains color values for different faces of a cube.
 * @type {CubeColors}
 */
export const CUBE_COLORS: CubeColors = {
    /**
     * The color of the top face of the cube.
     * @type {number}
     */
    TOP_FACE: 0xFF5733,

    /**
     * The color of the left face of the cube.
     * @type {number}
     */
    LEFT_FACE: 0x3399FF,

    /**
     * The color of the right face of the cube.
     * @type {number}
     */
    RIGHT_FACE: 0xFFD700,
}

export const CUBE_SETTINGS: CubeSettings[] = [
    { tilePoint: new Point3D(0, 0, 0), size: 24 },
    { tilePoint: new Point3D(0, 5, 0), size: 32 },
    { tilePoint: new Point3D(1, 5, 0), size: 32 },
    { tilePoint: new Point3D(2, 5, 0), size: 16 }
]