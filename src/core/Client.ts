import { Application, IApplicationOptions } from 'pixi.js'

import Scene from './Scene'

/**
 * Represents the client application for rendering a scene.
 */
export default class Client {
  /**
   * The application instance.
   * @type {Application}
   * @private
   */
  readonly #application: Application

  /**
  * The main scene instance for managing and rendering scenes.
  * @type {Scene}
  * @private
  */
  readonly #scene: Scene

  /**
   * Creates a new Client instance.
   */
  constructor() {
    const applicationOptions: Partial<IApplicationOptions> = this.#getApplicationOptions()

    // Create the application instance
    this.#application = new Application(applicationOptions)

    // Append the view to the DOM
    this.#appendViewToDOM()

    // Initialize the scene
    this.#scene = new Scene(this.#application)
  }

  /**
   * Initializes the client application, including the scene and event listeners.
   * @returns {this} The Client instance for method chaining.
   */
  initialize(): this {
    this.#scene.initialize()

    // Set up event listeners
    this.#setupEventListeners()

    return this
  }

  /**
   * Retrieves the configuration options for the application.
   * @returns {Partial<IApplicationOptions>} The application options.
   * @private
   */
  #getApplicationOptions(): Partial<IApplicationOptions> {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    }
  }

  /**
   * Appends the Pixi.js view (canvas) to the DOM.
   * @private
   */
  #appendViewToDOM = () =>
    document.body.appendChild(this.#application.view as HTMLCanvasElement)

  /**
   * Sets up event listeners, e.g., for window resize events.
   * @private
   */
  #setupEventListeners = () =>
    window.addEventListener('resize', this.#handleWindowResize.bind(this))

  /**
   * Handles the window resize event by updating the renderer and centering the scene.
   * @private
   */
  #handleWindowResize() {
    const { innerWidth, innerHeight } = window

    // Resize the Pixi.js renderer
    this.#application.renderer.resize(innerWidth, innerHeight)

    // Center the scene within the viewport
    this.#scene.centerStage()
  }
}
