import Point3D from '@utils/coordinates/Point3D'

export default class Node {
    readonly #position: Point3D

    #gCost: number = 0
    #hCost: number = 0
    #fCost: number = 0

    #parent: Node | null = null
    #height: number = 0

    constructor(position: Point3D) {
        this.#position = position
    }

    get position(): Point3D {
        return this.#position
    }

    get gCost(): number {
        return this.#gCost
    }

    set gCost(value: number) {
        this.#gCost = value
    }

    get hCost(): number {
        return this.#hCost
    }

    set hCost(value: number) {
        this.#hCost = value
    }

    get fCost(): number {
        return this.#fCost
    }

    set fCost(value: number) {
        this.#fCost = value
    }

    get parent(): Node | null {
        return this.#parent
    }

    set parent(value: Node | null) {
        this.#parent = value
    }

    get height(): number {
        return this.#height
    }

    set height(value: number) {
        this.#height = value
    }
}