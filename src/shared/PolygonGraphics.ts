import { Graphics } from 'pixi.js'

export default class PolygonGraphics extends Graphics {
    readonly #points: number[]

    constructor(color: number, points: number[]) {
        super()

        this.#points = points

        this.eventMode = 'dynamic'
        this.cursor = 'pointer'

        this.draw(color)
    }

    draw(color: number): void {
        this.clear()
        this.beginFill(color)
        this.drawPolygon(this.#points)
        this.endFill()
    }
}
