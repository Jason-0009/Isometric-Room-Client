import { Container, Point } from 'pixi.js'

import { MAX_ZOOM, MIN_ZOOM } from '../constants/Camera.constants'

/**
 * Camera class for handling panning and zooming of the stage.
 */
export default class Camera {
    /**
     * HTMLCanvasElement to attach camera controls to.
     * @type {HTMLCanvasElement}
     * @private
     */
    readonly #view: HTMLCanvasElement

    /**
     * Application stage to apply camera controls on.
     * @type {Container}
     * @private
     */
    readonly #stage: Container

    /**
     * Flag to enable/disable camera controls.
     * @type {boolean}
     * @private
     */
    #enabled: boolean

    /**
     * Initial pointer position for panning.
     * @type {Point | null}
     * @private
     */
    #initialDragPosition: Point | null

    /**
     * Initial zoom factor.
     * @type {number}
     * @private
     */
    #zoomFactor: number

    /**
     * Create a new Camera instance.
     * @param {HTMLCanvasElement} view - The HTMLCanvasElement to attach camera controls to.
     * @param {Container} stage - The application stage to apply camera controls on.
     */
    constructor(view: HTMLCanvasElement, stage: Container) {
        this.#view = view
        this.#stage = stage

        this.#enabled = true
        this.#initialDragPosition = null
        this.#zoomFactor = 0.1

        this.#setupEventListeners()
    }

    /**
     * Set up event listeners for camera controls.
     * @private
     */
    #setupEventListeners(): void {
        // Add event listeners for pointer (drag) and mouse wheel (zoom) events
        this.#view.addEventListener('pointerdown', this.#onPointerDown.bind(this))
        this.#view.addEventListener('pointermove', this.#onPointerMove.bind(this))
        this.#view.addEventListener('pointerup', this.#onPointerUp.bind(this))

        this.#view.addEventListener('wheel', this.#onMouseWheel.bind(this))
    }

    /**
     * Handle pointer down event (mousedown or touchstart) for panning.
     * @param {MouseEvent} event - The MouseEvent or TouchEvent.
     * @private
     */
    #onPointerDown(event: MouseEvent): void {
        if (!this.#enabled) return

        // Store the initial pointer position for panning
        this.#initialDragPosition = new Point(event.clientX, event.clientY)
    }

    /**
     * Handle pointer move event (mousemove or touchmove) for panning.
     * @param {MouseEvent} event - The MouseEvent or TouchEvent.
     * @private
     */
    #onPointerMove(event: MouseEvent): void {
        if (!this.#enabled || !this.#initialDragPosition) return

        // Calculate the change in pointer position
        const delta = new Point(
            event.clientX - this.#initialDragPosition.x,
            event.clientY - this.#initialDragPosition.y
        )

        // Update the stage's position to simulate panning
        this.#stage.position.x += delta.x
        this.#stage.position.y += delta.y

        // Update the initial pointer position for the next move event
        this.#initialDragPosition = new Point(event.clientX, event.clientY)
    }

    /**
     * Handle pointer up event (mouseup or touchend) for ending panning.
     * @private
     */
    #onPointerUp = (): null =>
        // Reset the initial pointer position on pointer up
        this.#initialDragPosition = null;

    /**
     * Handle mouse wheel (scroll) event for zooming.
     * @param {WheelEvent} event - The WheelEvent.
     * @private
     */
    #onMouseWheel(event: WheelEvent): void {
        if (!this.#enabled) return

        // Adjust the zoom factor based on wheel delta (positive for zoom in, negative for zoom out)
        this.#zoomFactor -= event.deltaY * 0.001

        // Clamp the zoom factor within the specified range
        this.#zoomFactor = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, this.#zoomFactor))

        // Apply the zoom to the stage
        this.#stage.scale.set(this.#zoomFactor)
    }

    set enabled(enabled: boolean) {
        this.#enabled = enabled
    }
}
