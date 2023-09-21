import { Application, Container, IApplicationOptions, Point } from 'pixi.js'

import Tilemap from '../tile/Tilemap'

import CubeCollection from '../cube/CubeCollection'

import Cube from '../cube/Cube'

import { cartesianToIsometric } from '../utils/coordinateTransformations'

import Camera from './Camera'

import Point3D from '../utils/Point3D'

/**
 * Represents the client application for rendering an isometric scene.
 */
export default class Client {
  private application: Application

  private camera: Camera

  private wallContainer: Container

  private tilemap: Tilemap

  private cubeCollection: CubeCollection

  constructor() {
    // Pixi.js application options
    const OPTIONS: Partial<IApplicationOptions> = {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    }

    // Create a Pixi.js application
    this.application = new Application(OPTIONS)

    const { view, stage } = this.application

    document.body.appendChild(view as HTMLCanvasElement)

    // Initialize camera, wall container, tilemap, and cube collection
    this.camera = new Camera(view as HTMLCanvasElement, stage)

    this.wallContainer = new Container()

    this.tilemap = new Tilemap(this.wallContainer)

    this.cubeCollection = new CubeCollection()

    // Initialize the scene
    this.initializeScene()

    // Set up event listeners
    this.setupEventListeners()

    // Center the stage initially
    this.centerStage()
  }

  /**
   * Initializes the scene by adding containers and objects to the stage.
   */
  private initializeScene() {
    const { stage } = this.application

    // Add containers and objects to the stage
    stage.addChild(
      this.wallContainer,
      this.tilemap.TileContainer,
      this.cubeCollection.CubeContainer
    )

    // Create cubes with specified configurations
    this.createCubes([
      { position: new Point3D(0, 0, 2), size: 24 },
      { position: new Point3D(0, 5, 0), size: 32 },
      { position: new Point3D(1, 5, 0), size: 32 },
      { position: new Point3D(2, 5, 0), size: 16 },
    ])

    // Sort cubes by position
    this.cubeCollection.sortCubesByPosition()
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
        this.camera,
        this.tilemap,
        this.cubeCollection
      )

      this.cubeCollection.addCube(cube)
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
