import { FederatedPointerEvent, Point } from 'pixi.js'

import Point3D from '../../utils/Point3D'

import Camera from '../../core/Camera'

import Tilemap from '../tile/Tilemap'

import CubeCollection from './CubeCollection'

import Tile from '../tile/Tile'

import CubeGraphics from './CubeGraphics'

import { TILE_DIMENSIONS } from '../../constants/Tile.constants'

/**
 * Represents a cube object with interactivity and positioning.
 */
export default class Cube {
    /**
     * The 3D position of the cube.
     * @private
     * @type {Point3D}
     */
    readonly #position: Point3D

    /**
     * The size of the cube.
     * @private
     * @type {number}
     */
    readonly #size: number

    /**
     * The camera object for controlling the view.
     * @private
     * @type {Camera}
     */
    readonly #camera: Camera

    /**
     * The tilemap where the cube exists.
     * @private
     * @type {Tilemap}
     */
    readonly #tilemap: Tilemap

    /**
     * The repository managing cubes.
     * @private
     * @type {CubeCollection}
     */
    readonly #cubeCollection: CubeCollection

    /**
     * The graphics object representing the cube.
     * @private
     * @type {CubeGraphics}
     */
    readonly #graphics: CubeGraphics

    /**
     * The current tile the cube is on.
     * @private
     * @type {Tile | undefined}
     */
    #currentTile: Tile | undefined

    /**
     * A flag indicating whether the cube is being dragged.
     * @private
     * @type {boolean}
     */
    #isDragging: boolean = false

    /**
     * Creates a new Cube instance.
     * @param {Point3D} position - The 3D position of the cube.
     * @param {number} size - The size of the cube.
     * @param {Camera} camera - The camera object for controlling the view.
     * @param {Tilemap} tilemap - The tilemap where the cube exists.
     * @param {CubeCollection} cubeCollection - The repository managing cubes.
     */
    constructor(
        size: number,
        position: Point3D,
        camera: Camera,
        tilemap: Tilemap,
        cubeCollection: CubeCollection
    ) {
        // Ensure the size is within a valid range
        this.#size = Math.max(8, Math.min(size, TILE_DIMENSIONS.HEIGHT))

        const tileOffsets = this.#calculateTileOffsets()

        this.#position = position.subtract(tileOffsets)

        this.#camera = camera

        this.#tilemap = tilemap

        this.#cubeCollection = cubeCollection

        this.#graphics = new CubeGraphics(this.#position, this.#size)

        const tilePosition = this.#position.add(tileOffsets)

        this.#currentTile = tilemap.getTileByExactPosition(tilePosition)

        // Set up event listeners for interactivity
        this.#setupEventListeners()
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
        this.#camera.disableControls()
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
        const newTile = this.#tilemap.getTileByPositionInBounds(pointerPosition)

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
        this.#camera.enableControls()
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
            ? this.#calculateStackingOffsets(cubeOnTargetTile)
            : this.#calculateTileOffsets()

        // Calculate the new position based on the offsets
        const newPosition = cubeOnTargetTile
            ? cubeOnTargetTile.#position.add(offsets)
            : tile.position.subtract(offsets)

        // Update the position
        this.#setPosition(newPosition)

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
     * Set the cube's position and update its graphics.
     * @param {Point3D} position - The new position for the cube.
     * @private
     */
    #setPosition(position: Point3D): void {
        this.#position.copyFrom(position)

        // Update the graphics position
        this.#graphics.position.set(position.x, position.y - position.z)
    }

    /**
     * Calculate the 3D offsets from a tile to a cube.
     * @returns {Point} The 3D offsets.
     * @private
     */
    #calculateTileOffsets = (): Point =>
        new Point(
            this.#size - TILE_DIMENSIONS.WIDTH / 2,
            this.#size - TILE_DIMENSIONS.HEIGHT / 2,
        )

    /**
     * Calculate the stacking offsets for stacking one cube on top of another.
     * @param {Cube} cube - The cube to stack on.
     * @returns {Point3D} The 3D stacking offsets.
     * @private
     */
    #calculateStackingOffsets = (cube: Cube): Point3D =>
        new Point3D(
            cube.#size - this.#size,
            cube.#size - this.#size,
            cube.#size
        )

    /**
     * Get the current position of the cube.
     * @returns {Point3D} The current position.
     */
    get position(): Point3D {
        return this.#position
    }

    /**
     * Get the current tile the cube is on.
     * @returns {Tile | undefined} The current tile.
     */
    get currentTile(): Tile | undefined {
        return this.#currentTile
    }

    /**
     * Get the graphics object of the cube.
     * @returns {CubeGraphics} The graphics object.
     */
    get graphics(): CubeGraphics {
        return this.#graphics
    }
}
