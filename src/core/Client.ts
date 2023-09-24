import { Application, Container, IApplicationOptions, Point } from 'pixi.js'

import Camera from './Camera'

import Avatar from '../modules/avatar/Avatar'

import Tilemap from '../modules/tile/Tilemap'

import CubeCollection from '../modules/cube/CubeCollection'
import Cube from '../modules/cube/Cube'

import { cartesianToIsometric } from '../utils/coordinateTransformations'
import Point3D from '../utils/Point3D'

/**
 * Represents the client application for rendering an isometric scene.
 */
export default class Client {
  /**
   * Application instance.
   * @private
   * @type {Application}
   */
  readonly #application: Application

  /**
   * Camera for handling panning and zooming.
   * @private
   * @type {Camera}
   */
  readonly #camera: Camera

  /**
   * Container for walls in the scene.
   * @private
   * @type {Container}
   */
  readonly #wallContainer: Container

  /**
   * Tilemap for handling tiles in the scene.
   * @private
   * @type {Tilemap}
   */
  readonly #tilemap: Tilemap

  /**
   * Collection of cubes in the scene.
   *
   * @type {CubeCollection}
   */
  readonly #cubeCollection: CubeCollection

  /**
   * Avatar object in the scene.
   * @private
   * @type {Avatar}
   */
  readonly #avatar: Avatar

  /**
   * Create a new Client instance.
   */
  constructor() {
    const OPTIONS: Partial<IApplicationOptions> = {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    }

    this.#application = new Application(OPTIONS)

    const { view, stage } = this.#application

    document.body.appendChild(view as HTMLCanvasElement)

    this.#camera = new Camera(view as HTMLCanvasElement, stage)

    this.#wallContainer = new Container()
    this.#tilemap = new Tilemap(this.#wallContainer)

    this.#cubeCollection = new CubeCollection()

    const initialAvatarPosition = cartesianToIsometric(new Point3D(1, 0, 0))

    this.#avatar = new Avatar(initialAvatarPosition)

    // Initialize the scene
    this.#initializeScene()

    // Set up event listeners
    this.#setupEventListeners()

    // Center the stage initially
    this.#centerStage()
  }

  /**
   * Initializes the scene by adding containers and objects to the stage.
   */
  #initializeScene(): void {
    const { stage } = this.#application

    // Add containers and objects to the stage
    stage.addChild(
      this.#wallContainer,
      this.#tilemap.tileContainer,
      this.#cubeCollection.cubeContainer,
      this.#avatar.graphics
    )

    // Create cubes based on specified configurations
    this.#createCubes([
      { size: 24, position: new Point3D(0, 0, 0) },
      { size: 32, position: new Point3D(0, 5, 0) },
      { size: 32, position: new Point3D(1, 5, 0) },
      { size: 16, position: new Point3D(2, 5, 0) },
    ])

    // Sort cubes by position
    this.#cubeCollection.sortCubesByPosition()
  }

  /**
   * Creates cubes based on specified configurations and adds them to the scene.
   *
   * @param {Array<{ position: Point3D, size: number }>} configurations - An array of cube configurations including position and size.
   */
  #createCubes(configurations: { size: number, position: Point3D }[]): void {
    configurations.forEach(({ size, position }) => {
      const isometricPosition = cartesianToIsometric(position)

      const cube = new Cube(
        size,
        isometricPosition,
        this.#camera,
        this.#tilemap,
        this.#cubeCollection
      )

      this.#cubeCollection.addCube(cube)
    })
  }

  /**
   * Sets up event listeners for window resize events.
   */
  #setupEventListeners(): void {
    // Handle window resize events to adjust the stage
    window.addEventListener('resize', this.#handleWindowResize.bind(this))
  }

  /**
   * Handles the window resize event, updating the renderer and centering the stage.
   */
  #handleWindowResize(): void {
    const { innerWidth, innerHeight } = window

    this.#application.renderer.resize(innerWidth, innerHeight)

    this.#centerStage()
  }

  /**
   * Centers the stage within the viewport.
   */
  #centerStage(): void {
    const { screen, stage } = this.#application

    // Calculate the center of the screen
    const centerPosition = new Point(screen.width / 2, screen.height / 2)

    // Set the stage position to the center of the screen
    stage.position.copyFrom(centerPosition)
  }
}
