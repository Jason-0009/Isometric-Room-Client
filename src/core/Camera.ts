import { Container, Point } from 'pixi.js'

import { MAX_ZOOM, MIN_ZOOM } from '@constants/Camera.constants'

/**
 * Camera class for handling panning and zooming of the stage.
 */
export default class Camera {
    /**
     * HTMLCanvasElement to attach camera controls to.
     * 
     * @type {HTMLCanvasElement}
     */
    readonly #view: HTMLCanvasElement

    /**
     * Application stage to apply camera controls on.
     * 
     * @type {Container}
     */
    readonly #stage: Container

    /**
     * Flag to enable/disable camera controls.
     * 
     * @type {boolean}
     */
    #enabled: boolean = true

    /**
     * Initial pointer position for panning.
     * 
     * @type {Point | null}
     */
    #initialDragPosition: Point | null = null

    /**
     * Initial zoom factor.
     * 
     * @type {number}
     */
    #zoomFactor: number = 0.1

    /**
     * Create a new Camera instance.
     * 
     * @param {HTMLCanvasElement} view - The HTMLCanvasElement to attach camera controls to.
     * @param {Container} stage - The application stage to apply camera controls on.
     */
    constructor(view: HTMLCanvasElement, stage: Container) {
        this.#view = view
        this.#stage = stage

        this.#setupEventListeners()
    }

    /**
     * Set up event listeners for camera controls.
     */
    #setupEventListeners(): void {
        this.#view.addEventListener('pointerdown', this.#onPointerDown.bind(this))
        this.#view.addEventListener('pointermove', this.#onPointerMove.bind(this))
        this.#view.addEventListener('pointerup', this.#onPointerUp.bind(this))
        this.#view.addEventListener('wheel', this.#onMouseWheel.bind(this))
    }

    /**
     * Handle pointer down event (mousedown or touchstart) for panning.
     * 
     * @param {MouseEvent} event - The MouseEvent or TouchEvent.
     */
    #onPointerDown(event: MouseEvent): void {
        if (!this.#enabled) return

        this.#initialDragPosition = new Point(event.clientX, event.clientY)
    }

    /**
     * Handle pointer move event (mousemove or touchmove) for panning.
     * 
     * @param {MouseEvent} event - The MouseEvent or TouchEvent.
     */
    #onPointerMove(event: MouseEvent): void {
        if (!this.#enabled || !this.#initialDragPosition) return

        const delta = new Point(
            event.clientX - this.#initialDragPosition.x,
            event.clientY - this.#initialDragPosition.y
        )

        this.#stage.position.x += delta.x
        this.#stage.position.y += delta.y

        this.#initialDragPosition = new Point(event.clientX, event.clientY)
    }

    /**
     * Handle pointer up event (mouseup or touchend) for ending panning.
     */
    #onPointerUp = (): null => this.#initialDragPosition = null

    /**
     * Handle mouse wheel (scroll) event for zooming.
     * 
     * @param {WheelEvent} event - The WheelEvent.
     */
    #onMouseWheel(event: WheelEvent): void {
        if (!this.#enabled) return

        // Adjust the zoom factor based on wheel delta (positive for zoom in, negative for zoom out).
        this.#zoomFactor -= event.deltaY * 0.001

        // Clamp the zoom factor within the specified range.
        this.#zoomFactor = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, this.#zoomFactor))

        this.#stage.scale.set(this.#zoomFactor)
    }

    /**
     * Set the enabled status of the object.
     *
     * @param {boolean} enabled - The new enabled status. Set to `true` to enable, `false` to disable.
     */
    set enabled(enabled: boolean) {
        this.#enabled = enabled
    }
}
