import { CubeSettings, CubeColors } from '../types/Cube.types'

import Point3D from '@utils/Point3D'

/**
 * Contains color values for different faces of a cube.
 * 
 * @type {CubeColors}
 */
export const CUBE_COLORS: CubeColors = {
    /**
     * The color of the top face of the cube.
     * 
     * @type {number}
     */
    TOP_FACE: 0xFF5733,

    /**
     * The color of the left face of the cube.
     * 
     * @type {number}
     */
    LEFT_FACE: 0x3399FF,

    /**
     * The color of the right face of the cube.
     * 
     * @type {number}
     */
    RIGHT_FACE: 0xFFD700,
}

/**
 * An array of cube settings specifying the initial positions and sizes of cubes.
 * 
 * @type {CubeSettings[]}
 */
export const CUBE_SETTINGS: CubeSettings[] = [
    // { position: new Point3D(0, 0, 0), size: 16 },
    { position: new Point3D(0, 0, 1), size: 32 },
    // { position: new Point3D(2, 3, 0), size: 16 },
    // { position: new Point3D(4, 6, 0), size: 24 },
    // { position: new Point3D(4, 5, 0), size: 24 },
    { position: new Point3D(6, 0, 4), size: 24 }
]