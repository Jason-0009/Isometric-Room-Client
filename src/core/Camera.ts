import { Container, Point } from 'pixi.js'

import { MAX_ZOOM, MIN_ZOOM } from '../constants/Camera.constants'

/**
 * Camera class for handling panning and zooming of the stage.
 */
export default class Camera {
    // Flag to enable/disable camera controls.
    private enabled: boolean = true

    // Initial pointer position for panning.
    private initialDragPosition: Point | null = null

    // Initial zoom factor.
    private zoomFactor: number = 0.1

    /**
     * Create a new Camera instance.
     * @param view - The HTMLCanvasElement to attach camera controls to.
     * @param stage - The application stage to apply camera controls on.
     */
    constructor(private view: HTMLCanvasElement, private stage: Container) {
        this.setupEventListeners()
    }

    /**
     * Set up event listeners for camera controls.
     */
    private setupEventListeners() {
        // Add event listeners for pointer (drag) and mouse wheel (zoom) events
        this.view.addEventListener('pointerdown', this.onPointerDown)
        this.view.addEventListener('pointermove', this.onPointerMove)
        this.view.addEventListener('pointerup', this.onPointerUp)

        this.view.addEventListener('wheel', this.onMouseWheel)
    }

    /**
     * Handle pointer down event (mousedown or touchstart) for panning.
     * @param event - The MouseEvent or TouchEvent.
     */
    private onPointerDown = (event: MouseEvent) => {
        if (!this.enabled) return

        // Store the initial pointer position for panning
        this.initialDragPosition = new Point(event.clientX, event.clientY)
    }

    /**
     * Handle pointer move event (mousemove or touchmove) for panning.
     * @param event - The MouseEvent or TouchEvent.
     */
    private onPointerMove = (event: MouseEvent) => {
        if (!this.enabled || !this.initialDragPosition) return

        // Calculate the change in pointer position
        const delta = new Point(
            event.clientX - this.initialDragPosition.x,
            event.clientY - this.initialDragPosition.y
        )

        // Update the stage's position to simulate panning
        this.stage.position.x += delta.x
        this.stage.position.y += delta.y

        // Update the initial pointer position for the next move event
        this.initialDragPosition = new Point(event.clientX, event.clientY)
    }

    /**
     * Handle pointer up event (mouseup or touchend) for ending panning.
     */
    private onPointerUp = () => {
        // Reset the initial pointer position on pointer up
        this.initialDragPosition = null
    }

    /**
     * Handle mouse wheel (scroll) event for zooming.
     * @param event - The WheelEvent.
     */
    private onMouseWheel = (event: WheelEvent) => {
        if (!this.enabled) return

        // Adjust the zoom factor based on wheel delta (positive for zoom in, negative for zoom out)
        this.zoomFactor -= event.deltaY * 0.001

        // Clamp the zoom factor within the specified range
        this.zoomFactor = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, this.zoomFactor))

        // Apply the zoom to the stage
        this.stage.scale.set(this.zoomFactor)
    }

    /**
     * Enable camera controls.
     */
    enableControls() {
        this.enabled = true
    }

    /**
     * Disable camera controls.
     */
    disableControls() {
        this.enabled = false
    }
}
