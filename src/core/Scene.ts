import { Application, Container, Point, Ticker } from 'pixi.js'

import Camera from '@core/Camera'

import WallCollection from '@modules/wall/WallCollection'
import Tilemap from '@modules/tile/Tilemap'
import Avatar from '@modules/avatar/Avatar'
import CubeCollection from '@modules/cube/CubeCollection'

import Pathfinder from '@pathfinding/Pathfinder'

import calculateInitialAvatarPosition from '@utils/calculations/calculateInitialAvatarPosition'

import { TILE_GRID } from '@constants/Tile.constants'

export default class Scene {
    readonly #application: Application
    readonly #camera: Camera
    readonly #wallCollection: WallCollection
    readonly #tilemap: Tilemap
    readonly #entityContainer: Container
    readonly #cubeCollection: CubeCollection
    readonly #avatar: Avatar | undefined
    readonly #pathfinder: Pathfinder

    constructor(application: Application) {
        this.#application = application
        this.#camera = new Camera(this.#application.view as HTMLCanvasElement, this.#application.stage)
        this.#wallCollection = new WallCollection()
        this.#tilemap = new Tilemap(TILE_GRID, this.#wallCollection)
        this.#entityContainer = new Container()
        this.#cubeCollection = new CubeCollection(this.#entityContainer)
        this.#pathfinder = new Pathfinder(this.#tilemap, this.#cubeCollection)

        const initialAvatarPosition = calculateInitialAvatarPosition(this.#tilemap)

        this.#avatar = initialAvatarPosition ? new Avatar(initialAvatarPosition, this.#tilemap,
            this.#cubeCollection, this.#pathfinder) : undefined

        this.#initialize()
    }

    #initialize() {
        this.#entityContainer.sortableChildren = true

        this.#initializeTilemap()
        this.#initializeCubeCollection()
        this.#initializeAvatar()

        this.#addObjectsToStage()

        this.centerStage()

        this.#startTicker()
    }

    centerStage() {
        const { screen, stage } = this.#application

        const centerPosition = new Point(screen.width / 2, screen.height / 2)

        stage.position.copyFrom(centerPosition)
    }

    #initializeTilemap = () => {
        if (!this.#avatar) return
        
        this.#tilemap.avatar = this.#avatar
        this.#tilemap.generate()
    }

    #initializeCubeCollection = () => {
        if (!this.#avatar) return

        this.#cubeCollection.populateSceneWithCubes(this.#camera, this.#tilemap, this.#avatar)
        this.#cubeCollection.sortCubesByPosition()
    }

    #initializeAvatar() {
        if (!this.#avatar) return

        this.#avatar.initialize()
        
        this.#cubeCollection.adjustCubeRenderingOrder(this.#avatar)
        this.#entityContainer.addChild(this.#avatar.graphics)
    }

    #addObjectsToStage = () =>
        this.#application.stage.addChild(
            this.#wallCollection.container,
            this.#tilemap.tileContainer,
            this.#entityContainer
        )

    #startTicker = () => Ticker.shared.add(this.#update.bind(this))

    #update = (delta: number) => this.#avatar?.update(delta)
}
