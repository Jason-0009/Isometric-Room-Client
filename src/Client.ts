import { Application, IApplicationOptions, Point } from 'pixi.js'

import Tilemap from './tile/Tilemap'

import CubeContainer from './cube/CubeContainer'

import Cube from './cube/Cube'

import { cartesianToIsometric } from './utils/coordinateConversions'

import Camera from './utils/Camera'

class Client {
  private application: Application
  private camera: Camera
  private tilemap: Tilemap
  private cubeContainer: CubeContainer

  constructor() {
    const OPTIONS: Partial<IApplicationOptions> = {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      antialias: true
    }

    this.application = new Application(OPTIONS)

    const view = this.application.view as HTMLCanvasElement

    document.body.appendChild(view)

    // Create instances of Tilemap, CubeContainer, and other dependencies
    this.camera = new Camera(view, this.application.stage)
    this.tilemap = new Tilemap()
    this.cubeContainer = new CubeContainer()

    this.initializeScene()

    this.setupEventListeners()

    // Center the stage initially
    this.centerStage()
  }

  private initializeScene() {
    const { stage } = this.application

    stage.addChild(this.tilemap.Container)
    stage.addChild(this.cubeContainer)

    this.createCubes([
      { position: new Point(2, 0), size: 24 },
      { position: new Point(0, 2), size: 32 },
      { position: new Point(2, 2), size: 16 },
    ])

    this.cubeContainer.sortByTilePosition()

    // Move the Viewport to an initial position if needed
    this.cubeContainer.position.set(0, 0)
  }

  private createCubes(configurations: { position: Point; size: number }[]) {
    configurations.forEach(({ position, size }) => {
      const isometricPosition = cartesianToIsometric(position)

      // Pass the dependencies (Tilemap, CubeContainer, Camera, etc.) to the Cube constructor
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

  private setupEventListeners() {
    // Handle window resize events to adjust the stage
    window.addEventListener('resize', this.handleWindowResize.bind(this))
  }

  private handleWindowResize() {
    const { innerWidth, innerHeight } = window

    this.application.renderer.resize(innerWidth, innerHeight)

    this.centerStage()
  }

  private centerStage() {
    const { screen, stage } = this.application

    // Calculate the center of the screen
    const centerPosition = new Point(screen.width / 2, screen.height / 2)

    // Set the stage position to the center of the screen
    stage.position.copyFrom(centerPosition)
  }
}

export default Client
