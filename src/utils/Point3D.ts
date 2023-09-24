import { Point } from 'pixi.js'

/**
 * Represents a point in three-dimensional space (x, y, z).
 */
export default class Point3D {
    /**
     * The x-coordinate of the point.
     * @private
     */
    #x: number

    /**
     * The y-coordinate of the point.
     * @private
     */
    #y: number

    /**
     * The z-coordinate of the point.
     * @private
     */
    #z: number

    /**
     * Creates a new Point3D instance.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @param {number} z - The z-coordinate.
     */
    constructor(x: number, y: number, z: number) {
        this.#x = x
        this.#y = y
        this.#z = z
    }

    /**
     * Copies the coordinates from another Point3D.
     * @param {Point3D} point - The other Point3D to copy from.
     * @returns {void}
     */
    copyFrom(point: Point3D): void {
        this.#x = point.#x
        this.#y = point.#y
        this.#z = point.#z
    }

    /**
     * Checks if this point is equal to another Point3D.
     * @param {Point3D} point - The other Point3D to compare.
     * @returns {boolean} True if the points are equal, false otherwise.
     */
    equals = (point: Point3D): boolean =>
        this.#x === point.#x && this.#y === point.#y && this.#z === point.#z

    /**
     * Adds another Point3D to the current one and returns a new Point3D.
     * @param {Point3D | Point} point - The other Point3D to add.
     * @returns {Point3D} A new Point3D resulting from the addition.
     */
    add = (point: Point3D | Point): Point3D =>
        new Point3D(
            this.#x + point.x,
            this.#y + point.y,
            'z' in point ? this.#z + point.z : this.#z
        )

    /**
     * Subtracts another Point3D from the current one and returns a new Point3D.
     * @param {Point3D | Point} point - The other Point3D to subtract.
     * @returns {Point3D} A new Point3D resulting from the subtraction.
     */
    subtract = (point: Point3D | Point): Point3D =>
        new Point3D(
            this.#x - point.x,
            this.#y - point.y,
            'z' in point ? this.#z - point.z : this.#z
        )

    /**
     * Gets the x-coordinate of the point.
     * @returns {number} The x-coordinate.
     */
    get x(): number {
        return this.#x
    }

    /**
     * Gets the y-coordinate of the point.
     * @returns {number} The y-coordinate.
     */
    get y(): number {
        return this.#y
    }

    /**
     * Gets the z-coordinate of the point.
     * @returns {number} The z-coordinate.
     */
    get z(): number {
        return this.#z
    }

    /**
     * Sets the x-coordinate of the point.
     * @param {number} x - The new x-coordinate.
     */
    set x(x: number) {
        this.#x = x
    }

    /**
     * Sets the y-coordinate of the point.
     * @param {number} y - The new y-coordinate.
     */
    set y(y: number) {
        this.#y = y
    }

    /**
     * Sets the z-coordinate of the point.
     * @param {number} z - The new z-coordinate.
     */
    set z(z: number) {
        this.#z = z
    }
}
