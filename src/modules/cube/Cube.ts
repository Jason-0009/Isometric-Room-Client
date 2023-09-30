import { FederatedPointerEvent } from 'pixi.js'

import Camera from '../../core/Camera'

import Tilemap from '../tile/Tilemap'
import Tile from '../tile/Tile'

import CubeCollection from './CubeCollection'
import CubeGraphics from './CubeGraphics'

import Point3D from '../../utils/Point3D'
import { calculateCubeOffsets, calculateStackingOffsets } from '../../utils/offsetCalculations'

import { TILE_DIMENSIONS } from '../../constants/Tile.constants'

/**
 * Represents a cube object with interactivity and positioning.
 */
export default class Cube {
    /**
     * The 3D position of the cube.
     * @type {Point3D}
     * @private
     */
    readonly #position: Point3D

    /**
     * The size of the cube.
     * @type {number}
     * @private
     */
    readonly #size: number

    /**
     * The graphics object representing the cube.
     * @type {CubeGraphics}
     * @private
     */
    readonly #graphics: CubeGraphics

    /**
     * The camera object for controlling the view.
     * @private
     * @type {Camera}
     */
    #camera!: Camera

    /**
     * The tilemap where the cube exists.
     * @type {Tilemap}
     * @private
     */
    #tilemap!: Tilemap

    /**
     * The repository managing cubes.
     * @type {CubeCollection}
     * @private
     */
    #cubeCollection!: CubeCollection

    /**
     * The current tile the cube is on.
     * @type {Tile | undefined}
     * @private
     */
    #currentTile: Tile | undefined

    /**
     * A flag indicating whether the cube is being dragged.
     * @type {boolean}
     * @private
     */
    #isDragging: boolean = false

    /**
     * Creates a new Cube instance.
     * @param {Point3D} position - The 3D position of the cube.
     * @param {number} size - The size of the cube.
     */
    constructor(position: Point3D, size: number) {
        this.#position = position

        // Ensure the size is within a valid range
        this.#size = Math.max(8, Math.min(size, TILE_DIMENSIONS.HEIGHT))

        this.#graphics = new CubeGraphics(this.#position, this.#size)
    }

    initialize(camera: Camera, tilemap: Tilemap,
        cubeCollection: CubeCollection, currentTile: Tile | undefined): this {
            
        this.#camera = camera
        this.#tilemap = tilemap
        this.#cubeCollection = cubeCollection
        this.#currentTile = currentTile

        this.#setupEventListeners()

        return this
    }

    /**
     * Set up event listeners for interactivity.
     * @private
     */
    #setupEventListeners(): void {
        // Set event mode to 'dynamic' for proper event handling
        this.#graphics.eventMode = 'dynamic'

        // Handle pointer events
        this.#graphics
            .on('pointerover', this.#handlePointerOver.bind(this))
            .on('pointerout', this.#handlePointerOut.bind(this))
            .on('pointerdown', this.#handleDragStart.bind(this))
            .on('globalpointermove', this.#handleDragMove.bind(this))
            .on('pointerup', this.#handleDragEnd.bind(this))
            .on('pointerupoutside', this.#handleDragEnd.bind(this))
    }

    /**
     * Handle the pointerover event.
     * @param {FederatedPointerEvent} event - The pointer event.
     * @returns {boolean | undefined}
     * @private
     */
    #handlePointerOver = (event: FederatedPointerEvent): boolean | undefined =>
        // Emit the pointerover event on the cube's current tile graphics
        this.#currentTile?.graphics.emit('pointerover', event)

    /**
     * Handle the pointerout event.
     * @param {FederatedPointerEvent} event - The pointer event.
     * @returns {boolean | undefined}
     * @private
     */
    #handlePointerOut = (event: FederatedPointerEvent): boolean | undefined =>
        // Emit the pointerout event on the cube's current tile graphics
        this.#currentTile?.graphics.emit('pointerout', event)

    /**
     * Handle the start of dragging the cube.
     * @private
     */
    #handleDragStart(): void {
        // Reduce opacity to indicate dragging
        this.#graphics.alpha = 0.5

        // Set dragging flag to true
        this.#isDragging = true

        // Disable camera controls during dragging
        this.#camera.enabled = false
    }

    /**
     * Handle the movement of the cube during dragging.
     * @param {FederatedPointerEvent} event - The pointer event.
     * @private
     */
    #handleDragMove(event: FederatedPointerEvent): void {
        if (!this.#isDragging) return

        // Emit pointerout event on the cube's current tile graphics
        this.#currentTile?.graphics.emit('pointerout', event)

        // Convert pointer position to local coordinates of the tilemap
        const pointerPosition = this.#tilemap.tileContainer.toLocal(event)

        // Get the tile at the new pointer position
        const newTile = this.#tilemap.findTileByPositionInBounds(pointerPosition)

        if (!newTile) return

        this.#placeOnTile(newTile)

        // Emit pointerover event on the new tile's graphics
        newTile.graphics.emit('pointerover', event)

        // Sort the cubes based on their positions
        this.#cubeCollection.sortCubesByPosition()
    }

    /**
     * Handle the end of dragging the cube.
     * @private
     */
    #handleDragEnd(): void {
        // Restore full opacity
        this.#graphics.alpha = 1

        // Set dragging flag to false
        this.#isDragging = false

        // Enable camera controls after dragging
        this.#camera.enabled = true
    }

    /**
     * Place the cube on a tile.
     * @param {Tile} tile - The target tile.
     * @private
     */
    #placeOnTile(tile: Tile): void {
        // Check if the target tile is the same as the current tile; if so, exit without making changes
        if (this.#currentTile?.position.equals(tile.position)) return

        // Find the tallest cube on the target tile, if any
        const cubeOnTargetTile = this.#cubeCollection.findTallestCubeAt(tile.position, this)

        // Check if the current cube is bigger than the one on the target tile's stack; if so, exit without making changes
        if (cubeOnTargetTile && this.#isLargerThan(cubeOnTargetTile)) return

        // Calculate stacking offsets if there's a cube on the target tile's stack; otherwise, calculate tile offsets
        const offsets = cubeOnTargetTile
            ? calculateStackingOffsets(cubeOnTargetTile, this)
            : calculateCubeOffsets(this.#size)

        // Calculate the new position based on the offsets
        const newPosition = cubeOnTargetTile
            ? cubeOnTargetTile.#position.add(offsets)
            : tile.position.subtract(offsets)

        // Update the position
        this.#updatePosition(newPosition)

        // Update the currentTile property
        this.#currentTile = tile
    }

    /**
     * Check if this cube is larger than another cube.
     * @param {Cube} cube - The other cube to compare.
     * @returns {boolean} True if this cube is larger, false otherwise.
     * @private
     */
    #isLargerThan = (cube: Cube): boolean =>
        this.#size > cube.#size

    /**
     * Update the cube's position and graphics.
     * @param {Point3D} position - The new position for the cube.
     * @private
     */
    #updatePosition(position: Point3D): void {
        this.#position.copyFrom(position)

        // Update the graphics position
        this.#graphics.position.set(position.x, position.y - position.z)
    }

    /**
     * Get the current position of the cube.
     * @returns {Point3D} The current position.
     */
    get position(): Point3D {
        return this.#position
    }

    /**
     * Get the size of the cube.
     * @returns {number} The size.
     */
    get size(): number {
        return this.#size
    }

    /**
     * Get the graphics object of the cube.
     * @returns {CubeGraphics} The graphics object.
     */
    get graphics(): CubeGraphics {
        return this.#graphics
    }

    /**
     * Get the current tile the cube is on.
     * @returns {Tile | undefined} The current tile.
     */
    get currentTile(): Tile | undefined {
        return this.#currentTile
    }
}
