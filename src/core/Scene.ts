import { Application, Container, Point, Ticker } from 'pixi.js'

import Camera from './Camera'

import Tilemap from '../modules/tile/Tilemap'
import Avatar from '../modules/avatar/Avatar'
import CubeCollection from '../modules/cube/CubeCollection'

import Pathfinder from '../pathfinding/Pathfinder'

import { cartesianToIsometric } from '../utils/coordinateTransformations'

import { AVATAR_INITIAL_POSITION, AVATAR_OFFSETS } from '../constants/Avatar.constants'
import { TILE_GRID } from '../constants/Tile.constants'
import Point3D from '../utils/Point3D'


/**
 * Represents a scene in the application for rendering objects and entities.
 */
export default class Scene {
    /**
     * The application instance.
     * @type {Application}
     * @private
     */
    readonly #application: Application

    /**
     * The camera for handling panning and zooming within the scene.
     * @type {Camera}
     * @private
     */
    readonly #camera: Camera

    /**
     * The container for walls in the scene.
     * @type {Container}
     * @private
     */
    readonly #wallContainer: Container

    /**
     * The avatar object in the scene.
     * @type {Avatar}
     * @private
     */
    readonly #avatar: Avatar

    /**
     * The tilemap for handling tiles in the scene.
     * @type {Tilemap}
     * @private
     */
    readonly #tilemap: Tilemap

    /**
     * The collection of cubes in the scene.
     * @type {CubeCollection}
     * @private
     */
    readonly #cubeCollection: CubeCollection

    /**
     * The pathfinding algorithm used for finding paths on the tilemap grid.
     * @type {Pathfinder}
     * @private
     */
    readonly #pathfinder: Pathfinder

    /**
     * Creates a new Scene instance.
     * @param {Application} application - The application instance.
     */
    constructor(application: Application) {
        this.#application = application

        this.#camera = new Camera(this.#application.view as HTMLCanvasElement, this.#application.stage)

        // Create containers and objects for the scene
        this.#wallContainer = new Container()

        this.#tilemap = new Tilemap()

        this.#cubeCollection = new CubeCollection()

        // Create the avatar object
        this.#avatar = new Avatar(this.#calculateInitialAvatarPosition())

        this.#pathfinder = new Pathfinder(TILE_GRID)
    }

    /**
     * Calculates the initial position for the avatar.
     * @returns {Point}
     * @private
     */
    #calculateInitialAvatarPosition = (): Point3D =>
        cartesianToIsometric(AVATAR_INITIAL_POSITION).add(AVATAR_OFFSETS)

    /**
     * Initializes the scene by adding containers and objects to the stage.
     * @private
     */
    initialize() {
        this.#initializeTilemap()
        // this.#initializeCubes()
        this.#initializeAvatar()

        this.#addObjectsToStage()
        this.centerStage()

        this.#startTicker()
    }

    /**
     * Centers the stage within the viewport.
     * @private
     */
    centerStage() {
        const { screen, stage } = this.#application

        const centerPosition = new Point(screen.width / 2, screen.height / 2)

        stage.position.copyFrom(centerPosition)
    }

    /**
     * Initializes the tilemap and associated objects.
     * @private
     */
    #initializeTilemap = () =>
        this.#tilemap.initialize(this.#wallContainer, this.#avatar, this.#pathfinder)

    /**
     * Initializes the cube collection.
     * @private
     */
    #initializeCubes = () =>
        this.#cubeCollection.initialize(this.#camera, this.#tilemap)

    /**
     * Initializes the avatar and assigns it to a tile.
     * @private
     */
    #initializeAvatar() {
        const tilePoint = cartesianToIsometric(AVATAR_INITIAL_POSITION)

        const currentTile = this.#tilemap.findTileByExactPosition(tilePoint)

        if (!currentTile) return

        this.#avatar.initialize(this.#tilemap, currentTile)
    }

    /**
     * Adds objects and containers to the stage.
     * @private
     */
    #addObjectsToStage = () =>
        this.#application.stage.addChild(
            this.#wallContainer,
            this.#tilemap.tileContainer,
            this.#cubeCollection.cubeContainer,
            this.#avatar.graphics
        )

    /**
     * Starts the ticker for scene updates.
     * @private
     */
    #startTicker = () =>
        Ticker.shared.add(this.#update.bind(this))

    /**
     * Updates the scene on each tick of the ticker.
     * @param {number} delta - The time elapsed since the last frame, in milliseconds.
     * @private
     */
    #update = (delta: number) =>
        this.#avatar.update(delta)
}
