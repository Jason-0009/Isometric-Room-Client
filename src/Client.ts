import { Application, Container, IApplicationOptions, Point } from 'pixi.js'

import Tilemap from './components/tile/Tilemap'

import CubeContainer from './components/cube/CubeContainer'

import Cube from './components/cube/Cube'

import { cartesianToIsometric } from './utils/coordinateTransformations'

import Camera from './utils/Camera'
import Point3D from './utils/Point3D'

/**
 * Represents the client application for rendering an isometric scene.
 */
export default class Client {
  private application: Application
  private camera: Camera

  private wallContainer: Container
  private tilemap: Tilemap

  private cubeContainer: CubeContainer

  constructor() {
    const OPTIONS: Partial<IApplicationOptions> = {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    }

    this.application = new Application(OPTIONS)

    const view = this.application.view as HTMLCanvasElement

    document.body.appendChild(view)

    this.camera = new Camera(view, this.application.stage)

    this.wallContainer = new Container()
    this.tilemap = new Tilemap(this.wallContainer)

    this.cubeContainer = new CubeContainer()

    this.initializeScene()

    this.setupEventListeners()

    // Center the stage initially
    this.centerStage()
  }

  /**
   * Initializes the scene by adding containers and objects to the stage.
   */
  private initializeScene() {
    const { stage } = this.application

    stage.addChild(this.wallContainer)
    stage.addChild(this.tilemap.TileContainer)

    stage.addChild(this.cubeContainer)

    this.createCubes([
      { position: new Point3D(0, 0, 0), size: 24 },
      { position: new Point3D(0, 2, 0), size: 32 },
      { position: new Point3D(0, 5, 0), size: 16 },
    ])

    this.cubeContainer.sortByTilePosition()

    // Move the Viewport to an initial position if needed
    this.cubeContainer.position.set(0, 0)
  }

  /**
   * Creates cubes based on specified configurations and adds them to the scene.
   * @param configurations - An array of cube configurations including position and size.
   */
  private createCubes(configurations: { position: Point3D; size: number }[]) {
    configurations.forEach(({ position, size }) => {
      const isometricPosition = cartesianToIsometric(position)

      const cube = new Cube(
        isometricPosition,
        size,
        this.tilemap,
        this.cubeContainer,
        this.camera
      )

      this.cubeContainer.addChild(cube.Graphics)
    })
  }

  /**
   * Sets up event listeners for window resize events.
   */
  private setupEventListeners() {
    // Handle window resize events to adjust the stage
    window.addEventListener('resize', this.handleWindowResize.bind(this))
  }

  /**
   * Handles the window resize event, updating the renderer and centering the stage.
   */
  private handleWindowResize() {
    const { innerWidth, innerHeight } = window

    this.application.renderer.resize(innerWidth, innerHeight)

    this.centerStage()
  }

  /**
   * Centers the stage within the viewport.
   */
  private centerStage() {
    const { screen, stage } = this.application

    // Calculate the center of the screen
    const centerPosition = new Point(screen.width / 2, screen.height / 2)

    // Set the stage position to the center of the screen
    stage.position.copyFrom(centerPosition)
  }
}
