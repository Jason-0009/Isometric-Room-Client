import Point3D from '@utils/Point3D'

/**
 * Represents the settings for a cube, including its tile position (Point3D)
 * and size (number).
 */
export type CubeSettings = {
    /**
     * The tile position of the cube in 3D space.
     */
    position: Point3D

    /**
     * The size of the cube.
     */
    size: number
}

/**
 * Represents color values for different faces of a cube.
 */
export type CubeColors = {
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