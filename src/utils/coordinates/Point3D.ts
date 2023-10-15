import { Point } from 'pixi.js'

export default class Point3D {
    #x: number
    #y: number
    #z: number

    constructor(x: number, y: number, z: number) {
        this.#x = x
        this.#y = y
        this.#z = z
    }

    copyFrom(point: Point3D): void {
        this.#x = point.x
        this.#y = point.y
        this.#z = point.z
    }

    equals = (point: Point3D): boolean =>
        this.#x === point.x && this.#y === point.y && this.#z === point.z

    add = (point: Point3D | Point): Point3D =>
        new Point3D(
            this.#x + point.x,
            this.#y + point.y,
            'z' in point ? this.#z + point.z : this.#z
        )

    subtract = (point: Point3D | Point): Point3D =>
        new Point3D(
            this.#x - point.x,
            this.#y - point.y,
            'z' in point ? this.#z - point.z : this.#z
        )

    distanceTo(point: Point3D): number {
        const delta = new Point3D(
            this.#x - point.x,
            this.#y - point.y,
            this.#z - point.z
        )

        return Math.hypot(delta.x, delta.y, delta.z)
    }

    normalize = (): Point3D =>
        this.magnitude === 0 ? new Point3D(0, 0, 0) :
            new Point3D(
                this.#x / this.magnitude,
                this.#y / this.magnitude,
                this.#z / this.magnitude
            )

    scale = (factor: number): Point3D =>
        new Point3D(this.x * factor, this.y * factor, this.z * factor)

    get x(): number {
        return this.#x
    }

    get y(): number {
        return this.#y
    }

    get z(): number {
        return this.#z
    }

    set z(value: number) {
        this.#z = value
    }

    get magnitude(): number {
        return Math.hypot(this.#x, this.#y, this.#z)
    }
}
