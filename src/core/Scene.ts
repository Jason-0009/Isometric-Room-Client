import { Application, Container, Point, Ticker } from 'pixi.js'

import Camera from '@core/Camera'

import WallCollection from '@modules/wall/WallCollection'
import Tilemap from '@modules/tile/Tilemap'
import Avatar from '@modules/avatar/Avatar'
import CubeCollection from '@modules/cube/CubeCollection'

import Pathfinder from '@pathfinding/Pathfinder'

import calculateInitialAvatarPosition from '@utils/calculateInitialAvatarPosition'

import { TILE_GRID } from '@constants/Tile.constants'

/**
 * Represents a scene in the application for rendering objects and entities.
 */
export default class Scene {
    /**
     * The application instance.
     * 
     * @type {Application}
     */
    readonly #application: Application

    /**
     * The camera for handling panning and zooming within the scene.
     * 
     * @type {Camera}
     */
    readonly #camera: Camera

    /**
     * The collection of walls in the scene.
     * 
     * @type {WallCollection}
     */
    readonly #wallCollection: WallCollection

    /**
     * The tilemap for handling tiles in the scene.
     * 
     * @type {Tilemap}
     */
    readonly #tilemap: Tilemap

    /**
     * The container to hold entities (e.g., cubes and avatars) in the scene.
     * 
     * @type {Container}
     */
    readonly #entityContainer: Container

    /**
     * The collection of cubes in the scene.
     * 
     * @type {CubeCollection}
     */
    readonly #cubeCollection: CubeCollection

    /**
     * The avatar object in the scene.
     * 
     * @type {Avatar}
     */
    readonly #avatar: Avatar

    /**
     * The pathfinding algorithm used for finding paths on the tilemap grid.
     * 
     * @type {Pathfinder}
     */
    readonly #pathfinder: Pathfinder

    /**
     * Creates a new Scene instance.
     * 
     * @param {Application} application - The application instance.
     */
    constructor(application: Application) {
        this.#application = application
        this.#camera = new Camera(this.#application.view as HTMLCanvasElement, this.#application.stage)
        this.#wallCollection = new WallCollection()
        this.#tilemap = new Tilemap(TILE_GRID, this.#wallCollection)
        this.#entityContainer = new Container()
        this.#cubeCollection = new CubeCollection(this.#entityContainer)
        this.#pathfinder = new Pathfinder(this.#tilemap, this.#cubeCollection)
        this.#avatar = new Avatar(calculateInitialAvatarPosition(this.#tilemap.grid), this.#tilemap, this.#cubeCollection, this.#pathfinder)

        this.#initialize()
    }

    /**
     * Initializes the scene by adding containers and objects to the stage.
     */
    #initialize() {
        this.#initializeTilemap()
        this.#initializeCubeCollection()
        this.#initializeAvatar()

        this.#addObjectsToStage()

        this.centerStage()

        this.#startTicker()
    }

    /**
     * Centers the stage within the viewport.
     */
    centerStage() {
        const { screen, stage } = this.#application

        const centerPosition = new Point(screen.width / 2, screen.height / 2)

        stage.position.copyFrom(centerPosition)
    }

    /**
     * Initializes the tilemap
     */
    #initializeTilemap = () => {
        this.#tilemap.avatar = this.#avatar
        this.#tilemap.generate()
    }

    /**
     * Initializes the cube collection.
     */
    #initializeCubeCollection = () => {
        this.#cubeCollection.populateSceneWithCubes(this.#camera, this.#tilemap, this.#avatar)
        this.#cubeCollection.sortCubesByPosition()
    }

    /**
     * Initializes the avatar.
     * This method sets up the avatar by calling its initialize method and adds it to the entity container.
     */
    #initializeAvatar() {
        this.#avatar.initialize()

        this.#entityContainer.addChild(this.#avatar.graphics)
    }

    /**
     * Adds objects and containers to the stage.
     */
    #addObjectsToStage = () =>
        this.#application.stage.addChild(
            this.#wallCollection.wallContainer,
            this.#tilemap.tileContainer,
            this.#entityContainer
        )

    /**
     * Starts the ticker for scene updates.
     */
    #startTicker = () => Ticker.shared.add(this.#update.bind(this))

    /**
     * Updates the scene on each tick of the ticker.
     * 
     * @param {number} delta - The time elapsed since the last frame, in milliseconds.
     */
    #update = (delta: number) => this.#avatar.update(delta)
}
