import { DisplayObject, DisplayObjectEvents, FederatedPointerEvent, Point } from 'pixi.js'

import CubeGraphics from './CubeGraphics'

import Tilemap from '../tile/Tilemap'

import CubeContainer from './CubeContainer'

import Camera from '../utils/Camera'

/**
 * Represents a cube object with interactivity and positioning.
 */
export default class Cube {
    private graphics: CubeGraphics

    private isDragging: boolean = false;

    /**
     * Creates a new Cube instance.
     * @param position - The initial position of the cube.
     * @param size - The size of the cube.
     * @param tilemap - The tilemap where the cube exists.
     * @param cubeContainer - The repository managing cubes.
     */
    constructor(position: Point, size: number, 
        private tilemap: Tilemap, private cubeContainer: CubeContainer,
        private camera: Camera) {
        this.graphics = new CubeGraphics(position, size)

        this.setupEventListeners()
    }

    /**
     * Sets up event interactions for the cube.
     */
    private setupEventListeners() {
        this.graphics
            .on('pointerover', this.handleTileEvent.bind(this, 'pointerover'))
            .on('pointerout', this.handleTileEvent.bind(this, 'pointerout'))
            .on('pointerdown', this.handleDragStart.bind(this))
            .on('globalpointermove', this.handleDragMove.bind(this))
            .on('pointerup', this.handleDragEnd.bind(this))
            .on('pointerupoutside', this.handleDragEnd.bind(this))
    }

    /**
     * Handles the start of dragging the cube.
     */
    private handleDragStart() {
        this.graphics.alpha = 0.5
        
        this.isDragging = true

        this.camera.disableControls()
    }

    /**
     * Handles the movement of the cube during dragging.
     * @param event - The pointer event.
     */
    private handleDragMove(event: FederatedPointerEvent) {
        // Check if the cube is currently being dragged; if not, exit the function.
        if (!this.isDragging) return

        // Trigger 'pointerout' event.
        this.handleTileEvent('pointerout', event)

        // Get the local pointer position.
        const localPointerPosition = this.getLocalPointerPosition(event)

        // Get the tile under the pointer.
        const tile = this.tilemap.getTileByPositionInBounds(localPointerPosition)

        // If there's no tile or if it's possible to move to the tile, exit the function.
        if (!tile || !this.canMoveToTile(tile)) return

        // Update the cube's position based on the selected tile.
        this.updateCubePosition(tile)

        // Sort the cube container based on tile positions.
        this.cubeContainer.sortByTilePosition()

        // Trigger 'pointerover' event.
        this.handleTileEvent('pointerover', event)
    }

    /**
     * Handles the end of dragging the cube.
     */
    private handleDragEnd() {
        this.graphics.alpha = 1

        this.isDragging = false

        this.camera.enableControls()
    }

    /**
     * Dispatches a pointer event to a tile based on the cube's position.
     * @param eventName - The name of the pointer event.
     * @param event - The pointer event to dispatch.
     */
    private handleTileEvent(eventName: string, event: FederatedPointerEvent) {
        const position = this.graphics.TilePosition

        const tile = this.tilemap.getTileByExactPosition(position)

        tile?.emit(eventName as keyof DisplayObjectEvents, event)
    }

    /**
     * Get the local pointer position within the tilemap.
     * @param event - The pointer event.
     * @returns The local pointer position.
     */
    private getLocalPointerPosition(event: FederatedPointerEvent): Point {
        const pointerPosition = new Point(event.x, event.y)

        return this.tilemap.Container.toLocal(pointerPosition)
    }

    /**
     * Checks if the cube can move to the given tile.
     * @param tile - The target tile.
     * @returns True if the cube can move to the tile, otherwise false.
     */
    private canMoveToTile(tile: DisplayObject): boolean {
        // Check if there is another cube on the same tile.
        return !this.cubeContainer.hasOtherCubeAtTile(this.graphics, tile.position)
    }

    /**
     * Updates the cube's position based on the tile's position.
     * @param tile - The target tile.
     */
    private updateCubePosition(tile: DisplayObject) {
        this.graphics.position.copyFrom(new Point(
            tile.x - this.graphics.Offsets.x,
            tile.y - this.graphics.Offsets.y
        ))
    }

    /**
     * Gets the CubeGraphics object associated with this cube.
     * @returns The CubeGraphics object.
     */
    get Graphics() {
        return this.graphics
    }
}
