import { Point } from 'pixi.js'

/**
 * Represents a point in three-dimensional space (x, y, z).
 */
export default class Point3D {
    /**
     * Creates a new IsometricPoint instance with x, y, and z coordinates.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @param {number} z - The z-coordinate.
     */
    constructor(private _x: number, private _y: number, private _z: number) { }

    /**
     * Copies the coordinates from another IsometricPoint.
     * @param {Point3D} point - The other IsometricPoint to copy from.
     */
    copyFrom(point: Point3D): void {
        this._x = point._x
        this._y = point._y
        this._z = point._z
    }

    /**
     * Checks if this point is equal to another IsometricPoint.
     * @param {Point3D} point - The other IsometricPoint to compare.
     * @returns {boolean} True if the points are equal, false otherwise.
     */
    equals(point: Point3D): boolean {
        return this._x === point._x && this._y === point._y && this._z === point._z
    }

    /**
     * Adds another Point3D to the current one and returns a new Point3D.
     * @param {Point3D | Point} point - The other Point3D to add.
     * @returns {Point3D} A new Point3D resulting from the addition.
     */
    add(point: Point3D | Point): Point3D {
        return new Point3D(
            this._x + point.x,
            this._y + point.y,
            'z' in point ? this._z + point.z : this._z
        )
    }

    /**
     * Subtracts another Point3D from the current one and returns a new Point3D.
     * @param {Point3D | Point} point - The other Point3D to subtract.
     * @returns {Point3D} A new Point3D resulting from the subtraction.
     */
    subtract(point: Point3D | Point): Point3D {
        return new Point3D(
            this._x - point.x,
            this._y - point.y,
            'z' in point ? this._z - point.z : this._z
        )
    }

    /**
     * Gets the x-coordinate of the point.
     * @returns {number} The x-coordinate.
     */
    get x(): number {
        return this._x
    }

    /**
     * Gets the x-coordinate of the point.
     * @returns {number} The x-coordinate.
     */
    get y(): number {
        return this._y
    }

    /**
     * Gets the z-coordinate of the point.
     * @returns {number} The z-coordinate.
     */
    get z(): number {
        return this._z
    }

    /**
     * Sets the x-coordinate of the point.
     * @param {number} x - The new x-coordinate.
     */
    set x(x: number) {
        this._x = x
    }

    /**
     * Sets the y-coordinate of the point.
     * @param {number} y - The new y-coordinate.
     */
    set y(y: number) {
        this._y = y
    }

    /**
     * Sets the z-coordinate of the point.
     * @param {number} z - The new z-coordinate.
     */
    set z(z: number) {
        this._z = z
    }
}
