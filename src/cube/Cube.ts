import { FederatedPointerEvent, Point } from 'pixi.js'

import CubeGraphics from './CubeGraphics'
import CubeCollection from './CubeCollection'

import Tilemap from '../tile/Tilemap'
import Tile from '../tile/Tile'

import { TILE_DIMENSIONS } from '../constants/Tile.constants'

import Camera from '../core/Camera'
import Point3D from '../utils/Point3D'

/**
 * Represents a cube object with interactivity and positioning.
 */
export default class Cube {
    private currentTile: Tile | undefined

    private graphics: CubeGraphics

    private isDragging = false

    /**
     * Creates a new Cube instance.
     * @param position - The 3D position of the cube.
     * @param size - The size of the cube.
     * @param camera - The camera object for controlling the view.
     * @param tilemap - The tilemap where the cube exists.
     * @param cubeCollection - The repository managing cubes.
     */
    constructor(
        private position: Point3D,
        private size: number,
        private camera: Camera,
        private tilemap: Tilemap,
        private cubeCollection: CubeCollection
    ) {
        this.currentTile = this.tilemap.getTileByExactPosition(position)

        // Ensure the size is within a valid range
        this.size = Math.max(8, Math.min(size, TILE_DIMENSIONS.HEIGHT))

        // Calculate the initial offsets
        const initialOffsets = this.calculateTileOffsets()

        const initialPosition = this.position.subtract(initialOffsets)

        // Set the cube's position
        this.position.copyFrom(initialPosition)

        this.graphics = new CubeGraphics(this.position, this.size)

        // Set up event listeners for interactivity
        this.setupEventListeners()
    }

    /**
     * Set up event listeners for interactivity.
     */
    private setupEventListeners() {
        // Set event mode to 'dynamic' for proper event handling
        this.graphics.eventMode = 'dynamic'

        // Handle pointer events
        this.graphics
            .on('pointerover', this.handlePointerOver.bind(this))
            .on('pointerout', this.handlePointerOut.bind(this))
            .on('pointerdown', this.handleDragStart.bind(this))
            .on('globalpointermove', this.handleDragMove.bind(this))
            .on('pointerup', this.handleDragEnd.bind(this))
            .on('pointerupoutside', this.handleDragEnd.bind(this))
    }

    /**
     * Handle the pointerover event.
     * @param event - The pointer event.
     */
    private handlePointerOver(event: FederatedPointerEvent) {
        // Emit the pointerover event on the cube's current tile graphics
        this.currentTile?.Graphics.emit('pointerover', event)
    }

    /**
     * Handle the pointerout event.
     * @param event - The pointer event.
     */
    private handlePointerOut(event: FederatedPointerEvent) {
        // Emit the pointerout event on the cube's current tile graphics
        this.currentTile?.Graphics.emit('pointerout', event)
    }

    /**
     * Handle the start of dragging the cube.
     */
    private handleDragStart() {
        // Reduce opacity to indicate dragging
        this.graphics.alpha = 0.5

        // Set dragging flag to true
        this.isDragging = true

        // Disable camera controls during dragging
        this.camera.disableControls()
    }

    /**
     * Handle the movement of the cube during dragging.
     * @param event - The pointer event.
     */
    private handleDragMove(event: FederatedPointerEvent) {
        if (!this.isDragging) return

        // Emit pointerout event on the cube's current tile graphics
        this.currentTile?.Graphics.emit('pointerout', event)

        // Convert pointer position to local coordinates of the tilemap
        const pointerPosition = this.tilemap.TileContainer.toLocal(event)

        // Get the tile at the new pointer position
        const newTile = this.tilemap.getTileByPositionInBounds(pointerPosition)

        if (!newTile) return

        this.placeOnTile(newTile)

        // Emit pointerover event on the new tile's graphics
        newTile.Graphics.emit('pointerover', event)

        // Sort the cubes based on their positions
        this.cubeCollection.sortCubesByPosition()
    }

    /**
     * Handle the end of dragging the cube.
     */
    private handleDragEnd() {
        // Restore full opacity
        this.graphics.alpha = 1

        // Set dragging flag to false
        this.isDragging = false

        // Enable camera controls after dragging
        this.camera.enableControls()
    }

    /**
     * Place the cube on a tile.
     * @param tile - The target tile.
     */
    private placeOnTile(tile: Tile) {
        // Check if the target tile is the same as the current tile; if so, exit without making changes
        if (this.currentTile?.Position.equals(tile.Position)) return
        
        // Find the tallest cube on the target tile, if any
        const cubeOnTargetTile = this.cubeCollection.findTallestCubeAt(tile.Position, this)

        // Check if the current cube is bigger than the one on the target tile's stack; if so, exit without making changes
        if (cubeOnTargetTile && this.isLargerThan(cubeOnTargetTile)) return
        
        // Calculate stacking offsets if there's a cube on the target tile's stack; otherwise, calculate tile offsets
        const offsets = cubeOnTargetTile
            ? this.calculateStackingOffsets(cubeOnTargetTile)
            : this.calculateTileOffsets()

        // Calculate the new position based on the offsets
        const newPosition = cubeOnTargetTile
            ? cubeOnTargetTile.Position.add(offsets)
            : tile.Position.subtract(offsets)

        // Update the position
        this.setPosition(newPosition)

        // Update the currentTile property
        this.currentTile = tile
    }

    /**
     * Check if this cube is larger than another cube.
     * @param cube - The other cube to compare.
     * @returns True if this cube is larger, false otherwise.
     */
    private isLargerThan(cube: Cube): boolean {
        return this.size > cube.size
    }

    /**
     * Set the cube's position and update its graphics.
     * @param position - The new position for the cube.
     */
    private setPosition(position: Point3D) {
        this.position.copyFrom(position)

        // Update the graphics position
        this.graphics.position.set(position.x, position.y - position.z)
    }

    /**
     * Calculate the 3D offsets from a tile to a cube.
     * @returns The 3D offsets.
     */
    calculateTileOffsets() {
        return new Point(
            this.size - TILE_DIMENSIONS.WIDTH / 2,
            this.size - TILE_DIMENSIONS.HEIGHT / 2,
        )
    }

    /**
     * Calculate the stacking offsets for stacking one cube on top of another.
     * @param cube - The cube to stack on.
     * @returns The 3D stacking offsets.
     */
    calculateStackingOffsets(cube: Cube): Point3D {
        return new Point3D(
            cube.size - this.size,
            cube.size - this.size,
            cube.size
        )
    }

    get CurrentTile() {
        return this.currentTile
    }

    /**
     * Get the current position of the cube.
     * @returns The current position.
     */
    get Position() {
        return this.position
    }

    /**
     * Get the graphics object of the cube.
     * @returns The graphics object.
     */
    get Graphics() {
        return this.graphics
    }
}
