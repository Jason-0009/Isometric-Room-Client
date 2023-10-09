import { Application, IApplicationOptions } from 'pixi.js'

import Scene from '@core/Scene'

/**
 * Represents the client application for rendering a scene.
 */
export default class Client {
  /**
   * The application instance.
   * 
   * @type {Application}
   */
  readonly #application: Application

  /**
  * The main scene instance for managing and rendering scenes.
  * 
  * @type {Scene}
  */
  readonly #scene: Scene

  /**
   * Creates a new Client instance.
   */
  constructor() {
    const applicationOptions: Partial<IApplicationOptions> = this.#applicationOptions

    this.#application = new Application(applicationOptions)

    this.#appendViewToDOM()

    this.#scene = new Scene(this.#application)

    this.#setupEventListeners()
  }

  /**
   * Retrieves the configuration options for the application.
   * 
   * @returns {Partial<IApplicationOptions>} The application options.
   */
  get #applicationOptions(): Partial<IApplicationOptions> {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    }
  }

  /**
   * Appends the view (canvas) to the DOM.
   */
  #appendViewToDOM = () =>
    document.body.appendChild(this.#application.view as HTMLCanvasElement)

  /**
   * Sets up event listeners, e.g., for window resize events.
   */
  #setupEventListeners = () =>
    window.addEventListener('resize', this.#handleWindowResize.bind(this))

  /**
   * Handles the window resize event by updating the renderer and centering the scene.
   */
  #handleWindowResize() {
    const { innerWidth, innerHeight } = window

    this.#application.renderer.resize(innerWidth, innerHeight)

    this.#scene.centerStage()
  }
}
