import AvatarContainer from './AvatarContainer'

import Tile from '@modules/tile/Tile'
import Tilemap from '@modules/tile/Tilemap'

import CubeCollection from '@modules/cube/CubeCollection'
import Cube from '@modules/cube/Cube'

import Pathfinder from '@pathfinding/Pathfinder'

import PolygonGraphics from '@shared/PolygonGraphics'

import Point3D from '@utils/coordinates/Point3D'
import { cartesianToIsometric, isometricToCartesian } from '@utils/coordinates/coordinateTransformations'

import { AVATAR_DIMENSIONS, AVATAR_OFFSETS, AVATAR_SPEED } from '@constants/Avatar.constants'
import { findClosestValidTilePosition } from '@utils/helpers/tilePositionHelpers'

import createColorInput from '@utils/helpers/colorInputHelper'

export default class Avatar {
    readonly #position: Point3D
    readonly #container: AvatarContainer
    readonly #tilemap: Tilemap
    readonly #cubeCollection: CubeCollection
    readonly #pathfinder: Pathfinder

    #currentTile: Tile | undefined
    #goalPosition: Point3D | null = null
    #targetPosition: Point3D | null = null
    #isMoving: boolean = false
    #onMovementComplete: (() => void) | null = null

    constructor(position: Point3D, tilemap: Tilemap, cubeCollection: CubeCollection, pathfinder: Pathfinder) {
        this.#position = position
        this.#container = new AvatarContainer(this.#position)
        this.#tilemap = tilemap
        this.#cubeCollection = cubeCollection
        this.#pathfinder = pathfinder
    }

    initialize() {
        const tilePosition = this.#position.subtract(AVATAR_OFFSETS)

        this.#currentTile = this.#tilemap.findTileByExactPosition(tilePosition)

        let newPosition = this.#getNewPosition(tilePosition)

        const tallestCubeAtTile = this.#cubeCollection.findTallestCubeAt(tilePosition)
        const isCubeNarrowerThanAvatar = tallestCubeAtTile && tallestCubeAtTile.size < AVATAR_DIMENSIONS.WIDTH

        if (isCubeNarrowerThanAvatar) {
            const adjustedNewPosition = this.#getAdjustedNewPosition(tilePosition)

            if (!adjustedNewPosition) return

            newPosition = adjustedNewPosition
        }

        this.#updatePosition(newPosition)
        
        this.#setupEventListeners()
    }

    async calculatePath(isRecalculating: boolean = false) {
        if (!this.#currentTile || !this.#goalPosition) return

        const startPosition = isometricToCartesian(this.#currentTile.position)
        const path = this.#pathfinder.findPath(startPosition, this.#goalPosition, isRecalculating)

        if (!path) return

        await this.#moveAlongPath(path)
    }

    async update(delta: number) {
        if (!this.#isMoving) return

        if (this.#shouldReachDestination) {
            this.#handleDestinationReached()

            return
        }

        const velocity = this.#calculateVelocity(delta)

        if (!velocity) return

        const newPosition = this.#position.add(velocity)

        this.#updatePosition(newPosition)
    }

    adjustPositionOnCubeDrag = (cube: Cube): void => {
        if (!this.#currentTile || cube.currentTile !== this.#currentTile) return

        const newPosition = this.#currentTile.position.add(AVATAR_OFFSETS)
        const tallestCubeAtTile = this.#cubeCollection.findTallestCubeAt(this.#currentTile.position)

        newPosition.z = tallestCubeAtTile && cube !== tallestCubeAtTile ?
            tallestCubeAtTile.position.z + tallestCubeAtTile.size : newPosition.z

        this.#updatePosition(newPosition)
    }

    #getNewPosition(position: Point3D): Point3D {
        const newPosition = position.add(AVATAR_OFFSETS)
        const tallestCube = this.#cubeCollection.findTallestCubeAt(position)

        if (tallestCube) newPosition.z = tallestCube.position.z + tallestCube.size

        return newPosition
    }

    #getAdjustedNewPosition(position: Point3D): Point3D | undefined {
        const adjustedTilePosition = this.#getAdjustedTilePosition(position)

        if (!adjustedTilePosition) return

        this.#currentTile = this.#tilemap.findTileByExactPosition(adjustedTilePosition)

        return this.#getNewPosition(adjustedTilePosition)
    }

    #getAdjustedTilePosition(position: Point3D): Point3D | undefined {
        if (!this.#currentTile) return

        const validTilePosition = findClosestValidTilePosition(isometricToCartesian(position), this.#tilemap.grid)

        if (!validTilePosition) return

        return cartesianToIsometric(validTilePosition)
    }

    #updatePosition(position: Point3D): void {
        this.#position.copyFrom(position)

        this.#container.position.set(position.x, position.y - position.z)
    }

    #setupEventListeners = () => this.#container.faces.forEach(face => face?.
        on('rightdown', this.#handleFaceClick.bind(this, face)))

    #handleFaceClick = (face: PolygonGraphics): void => createColorInput(hexColor => face.draw(hexColor))

    #moveAlongPath = async (path: Point3D[]): Promise<void> =>
        await path.reduce(async (previousPromise: Promise<void>, tilePosition: Point3D) => {
            await previousPromise
            await this.#moveTo(tilePosition)
        }, Promise.resolve())

    async #moveTo(position: Point3D): Promise<void> {
        const tilePosition = cartesianToIsometric(position)
        const tallestCubeAtTile = this.#cubeCollection.findTallestCubeAt(tilePosition)

        this.#currentTile = this.#tilemap.findTileByExactPosition(tilePosition)
        this.#targetPosition = tilePosition.add(AVATAR_OFFSETS)

        this.#targetPosition.z = tallestCubeAtTile ? tallestCubeAtTile.position.z + tallestCubeAtTile.size : this.#targetPosition.z

        this.#isMoving = true
        this.#cubeCollection.adjustCubeRenderingOrder(this)

        await new Promise<void>(resolve => this.#onMovementComplete = resolve)
    }

    #handleDestinationReached() {
        if (!this.#targetPosition || !this.#onMovementComplete) return

        this.#updatePosition(this.#targetPosition)
        this.#onMovementComplete()
        this.#stopMovement()
    }

    #calculateVelocity(delta: number): Point3D | undefined {
        if (!this.#direction) return

        const velocity = this.#direction.scale(this.#speed * delta)

        if (this.#direction.z < 0) velocity.z += this.#heightDifference

        return velocity
    }

    #stopMovement() {
        this.#targetPosition = null
        this.#onMovementComplete = null
        this.#isMoving = false
    }

    get #shouldReachDestination(): boolean | null {
        return this.#targetPosition && this.#position.distanceTo(this.#targetPosition) <= this.#speed
    }

    get #speed(): number {
        return this.#direction?.x === 0 || this.#direction?.y === 0 ? AVATAR_SPEED * 1.2 : AVATAR_SPEED
    }

    get #direction(): Point3D | undefined {
        return this.#targetPosition?.subtract(this.#position).normalize()
    }

    get #heightDifference(): number {
        return this.#targetPosition ? isometricToCartesian(this.#targetPosition).z - isometricToCartesian(this.#position).z : 0
    }

    get graphics(): AvatarContainer {
        return this.#container
    }

    get position(): Point3D {
        return this.#position
    }

    get currentTile(): Tile | undefined {
        return this.#currentTile
    }

    set currentTile(value: Tile | undefined) {
        this.#currentTile = value
    }

    set goalPosition(value: Point3D) {
        this.#goalPosition = value
    }

    get isMoving(): boolean {
        return this.#isMoving
    }
}
