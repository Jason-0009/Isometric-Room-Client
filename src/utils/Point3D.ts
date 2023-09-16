import { Point } from 'pixi.js'

/**
 * Represents a point in three-dimensional space (x, y, z).
 */
export default class Point3D extends Point {
    /**
     * Creates a new Point3D instance with x, y, and z coordinates.
     * @param x - The x-coordinate.
     * @param y - The y-coordinate.
     * @param z - The z-coordinate.
     */
    constructor(x: number, y: number, private _z: number) {
        super(x, y)
    }

    /**
     * Gets the z-coordinate of the point.
     * @returns The z-coordinate.
     */
    get z() {
        return this._z
    }
}
