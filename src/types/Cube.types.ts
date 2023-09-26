import Point3D from '../utils/Point3D'

/**
 * Represents the settings for a cube, including its tile position (Point3D)
 * and size (number).
 */
export type CubeSettings = {
    /**
     * The tile position of the cube in 3D space.
     */
    tilePoint: Point3D

    /**
     * The size of the cube.
     */
    size: number
}
