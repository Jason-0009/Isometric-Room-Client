import { Container, Point } from 'pixi.js'

import { MAX_ZOOM, MIN_ZOOM } from '@constants/Camera.constants'

export default class Camera {
    readonly #view: HTMLCanvasElement
    readonly #stage: Container

    #enabled: boolean = true
    #initialDragPosition: Point | null = null
    #zoomFactor: number = 0.1

    constructor(view: HTMLCanvasElement, stage: Container) {
        this.#view = view
        this.#stage = stage

        this.#setupEventListeners()
    }

    #setupEventListeners(): void {
        this.#view.addEventListener('pointerdown', this.#onPointerDown.bind(this))
        this.#view.addEventListener('pointermove', this.#onPointerMove.bind(this))
        this.#view.addEventListener('pointerup', this.#onPointerUp.bind(this))
        this.#view.addEventListener('wheel', this.#onMouseWheel.bind(this))
    }

    #onPointerDown(event: MouseEvent): void {
        if (event.button !== 0 || !this.#enabled) return

        this.#initialDragPosition = new Point(event.clientX, event.clientY)
    }

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

    #onPointerUp = (): null => this.#initialDragPosition = null

    #onMouseWheel(event: WheelEvent): void {
        if (!this.#enabled) return

        // Adjust the zoom factor based on wheel delta (positive for zoom in, negative for zoom out).
        this.#zoomFactor -= event.deltaY * 0.001
        this.#zoomFactor = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, this.#zoomFactor))

        this.#stage.scale.set(this.#zoomFactor)
    }

    set enabled(enabled: boolean) {
        this.#enabled = enabled
    }
}
