import { FederatedPointerEvent } from 'pixi.js'

import Camera from '@core/Camera'

import Tilemap from '@modules/tile/Tilemap'
import Tile from '@modules/tile/Tile'

import Avatar from '@modules/avatar/Avatar'

import CubeCollection from '@modules/cube/CubeCollection'
import CubeGraphics from '@modules/cube/CubeGraphics'

import Point3D from '@utils/Point3D'
import calculateCubeOffsets from '@utils/calculateCubeOffsets'

/**
 * Represents a cube object with interactivity and positioning.
 */
export default class Cube {
    /**
     * The 3D position of the cube.
     * 
     * @type {Point3D}
     */
    readonly #position: Point3D

    /**
     * The size of the cube.
     * 
     * @type {number}
     */
    readonly #size: number

    /**
     * The current tile the cube is on.
     * 
     * @type {Tile | undefined}
     */
    #currentTile: Tile | undefined

    /**
     * The graphics object representing the cube.
     * 
     * @type {CubeGraphics}
     */
    readonly #graphics: CubeGraphics

    /**
     * The collection managing cubes.
     * 
     * @type {CubeCollection}
     */
    readonly #cubeCollection: CubeCollection

    /**
     * The camera object for controlling the view.
     * 
     * @type {Camera}
     */
    readonly #camera: Camera

    /**
     * The tilemap where the cube exists.
     * 
     * @type {Tilemap}
     */
    readonly #tilemap: Tilemap

    /**
     * The avatar object associated with this cube.
     * 
     * @type {Avatar}
     */
    readonly #avatar: Avatar

    /**
     * A flag indicating whether the cube is being dragged.
     * 
     * @type {boolean}
     */
    #isDragging: boolean = false

    /**
     * Creates a new Cube instance.
     *
     * @param {Point3D} position - The 3D position of the cube.
     * @param {number} size - The size of the cube.
     * @param {CubeCollection} cubeCollection - The collection of cubes that the cube belongs to.
     * @param {Camera} camera - The camera that the cube will be rendered with.
     * @param {Tilemap} tilemap - The tilemap that the cube is placed on.
     * @param {Avatar} avatar - The avatar that can interact with the cube.
     * @param {Tile} currentTile - The tile that the cube is currently on.
     */
    constructor(position: Point3D, size: number, currentTile: Tile, cubeCollection: CubeCollection, camera: Camera,
        tilemap: Tilemap, avatar: Avatar) {

        this.#position = position
        this.#size = size
        this.#currentTile = currentTile
        this.#graphics = new CubeGraphics(this.#position, this.#size)
        this.#cubeCollection = cubeCollection
        this.#camera = camera
        this.#tilemap = tilemap
        this.#avatar = avatar

        this.#setupEventListeners()
    }

    /**
     * Set up event listeners for interactivity.
     */
    #setupEventListeners(): void {
        this.#graphics.eventMode = 'dynamic'

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
     * 
     * @param {FederatedPointerEvent} event - The pointer event.
     * @returns {boolean | undefined}
     */
    #handlePointerOver = (event: FederatedPointerEvent): boolean | undefined => this.#currentTile?.graphics.emit('pointerover', event)

    /**
     * Handle the pointerout event.
     * 
     * @param {FederatedPointerEvent} event - The pointer event.
     * @returns {boolean | undefined}
     */
    #handlePointerOut = (event: FederatedPointerEvent): boolean | undefined => this.#currentTile?.graphics.emit('pointerout', event)

    /**
     * Handle the start of dragging the cube.
     */
    #handleDragStart(): void {
        this.#graphics.alpha = 0.5
        this.#isDragging = true
        this.#camera.enabled = false
    }

    /**
     * Handle the movement of the cube during dragging.
     * 
     * @param {FederatedPointerEvent} event - The pointer event.
     */
    #handleDragMove(event: FederatedPointerEvent): void {
        if (!this.#isDragging) return

        this.#currentTile?.graphics.emit('pointerout', event)

        const pointerPosition = this.#tilemap.tileContainer.toLocal(event)
        const targetTile = this.#tilemap.findTileByPositionInBounds(pointerPosition)

        if (!targetTile ||
            targetTile === this.#currentTile ||
            targetTile === this.#avatar.currentTile) return

        this.#placeOnTile(targetTile)

        if (this.#avatar.isMoving) this.#avatar.calculatePath(true)

        this.#cubeCollection.sortCubesByPosition()
        this.#cubeCollection.updateCubeRendering(this.#avatar)

        this.currentTile?.graphics.emit('pointerover', event)
    }

    /**
     * Handle the end of dragging the cube.
     */
    #handleDragEnd(): void {
        this.#graphics.alpha = 1
        this.#isDragging = false
        this.#camera.enabled = true
    }

    /**
     * Place the cube on a tile.
     * 
     * @param {Tile} tile - The target tile.
     */
    #placeOnTile(tile: Tile): void {
        const tallestCube = this.#cubeCollection.findTallestCubeAt(tile.position)

        if (tallestCube === this || tallestCube && this.#isLargerThan(tallestCube)) return

        const offsets = calculateCubeOffsets(this.#size)
        const newPosition = tile.position.subtract(offsets)

        if (tallestCube) newPosition.z = tallestCube.position.z + tallestCube.size

        this.#avatar.adjustPositionOnCubeDrag(this)

        this.#updatePosition(newPosition)

        this.#currentTile = tile
    }

    /**
     * Check if this cube is larger than another cube.
     * 
     * @param {Cube} cube - The other cube to compare.
     * @returns {boolean} True if this cube is larger, false otherwise.
     */
    #isLargerThan = (cube: Cube): boolean => this.#size > cube.size

    /**
     * Updates the cube's position and graphics based on the specified 3D position.
     * 
     * @param {Point3D} position - The new 3D position to set for the cube.
     */
    #updatePosition(position: Point3D): void {
        this.#position.copyFrom(position)

        this.#graphics.position.set(position.x, position.y - position.z)
    }

    /**
     * Get the current position of the cube.
     * 
     * @returns {Point3D} The current position.
     */
    get position(): Point3D {
        return this.#position
    }

    /**
     * Get the size of the cube.
     * 
     * @returns {number} The size.
     */
    get size(): number {
        return this.#size
    }

    /**
     * Get the graphics object of the cube.
     * 
     * @returns {CubeGraphics} The graphics object.
     */
    get graphics(): CubeGraphics {
        return this.#graphics
    }

    /**
     * Get the current tile the cube is on.
     * 
     * @returns {Tile | undefined} The current tile.
     */
    get currentTile(): Tile | undefined {
        return this.#currentTile
    }
}
