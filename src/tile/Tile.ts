import { Point } from 'pixi.js'

import TileGraphics from './TileGraphics'

import { isometricToCartesian } from '../utils/coordinateConversions'

export default class Tile {
    private graphics: TileGraphics

    constructor(position: Point) {
        this.graphics = new TileGraphics(position)

        this.setupEventListeners()
    }

    private setupEventListeners() {
        this.graphics
            .on('pointerover', this.handlePointerOver.bind(this))
            .on('pointerout', this.handlePointerOut.bind(this))
            .on('click', this.handleClick.bind(this))
    }

    private handlePointerOver() {
        this.graphics.createHoverEffect()
    }

    private handlePointerOut() {
        this.graphics.destroyHoverEffect()
    }

    private handleClick() {
        const { x, y } = isometricToCartesian(this.graphics.position)

        console.log(`Tile clicked at x: ${x}, y: ${y}`)
    }

    get Graphics() {
        return this.graphics
    }
}
