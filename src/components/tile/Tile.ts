import { Texture } from 'pixi.js'

import TileGraphics from './TileGraphics'

import { isometricToCartesian } from '../../utils/coordinateTransformations'

import Point3D from '../../utils/Point3D'

/**
 * Represents a tile on a grid.
 */
export default class Tile {
    private graphics: TileGraphics

    /**
     * Creates a new Tile instance.
     * @param position - The position of the tile in 3D space.
     */
    constructor(position: Point3D) {
        this.graphics = new TileGraphics(position)

        this.setupEventListeners()
    }

    /**
     * Sets up event listeners for the tile's graphics.
     * - 'pointerover': Triggered when the mouse pointer enters the tile.
     * - 'pointerout': Triggered when the mouse pointer leaves the tile.
     * - 'click': Triggered when the tile is clicked.
     */
    private setupEventListeners() {
        this.graphics
            .on('pointerover', this.handlePointerOver.bind(this))
            .on('pointerout', this.handlePointerOut.bind(this))
            .on('click', this.handleClick.bind(this))
    }

    /**
     * Handles the 'pointerover' event (mouse pointer entering the tile).
     * Creates a hover effect for the tile's graphics.
     */
    private handlePointerOver() {
        this.graphics.createHoverEffect()
    }

    /**
     * Handles the 'pointerout' event (mouse pointer leaving the tile).
     * Destroys the hover effect for the tile's graphics.
     */
    private handlePointerOut() {
        this.graphics.destroyHoverEffect()
    }

    /**
     * Handles the 'click' event (tile is clicked).
     * Converts the tile's isometric position to Cartesian coordinates and logs the result.
     */
    private handleClick() {
        const { x, y, z } = isometricToCartesian(this.graphics.Position)

        console.log(`Tile clicked at x: ${x}, y: ${y}, z: ${z}`)
    }

    /**
     * Gets the graphics object associated with the tile.
     * @returns The TileGraphics object.
     */
    get Graphics() {
        return this.graphics
    }
}
