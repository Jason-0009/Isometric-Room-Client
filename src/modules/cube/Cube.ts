import { FederatedPointerEvent } from 'pixi.js'

import Camera from '@core/Camera'

import Tilemap from '@modules/tile/Tilemap'
import Tile from '@modules/tile/Tile'

import Avatar from '@modules/avatar/Avatar'

import CubeCollection from '@modules/cube/CubeCollection'
import CubeContainer from '@modules/cube/CubeContainer'

import PolygonGraphics from '@shared/PolygonGraphics'

import Point3D from '@utils/coordinates/Point3D'
import calculateCubeOffsets from '@utils/calculations/calculateCubeOffsets'

import createColorInput from '@utils/helpers/colorInputHelper'

export default class Cube {
    readonly #position: Point3D
    readonly #size: number

    #currentTile: Tile | undefined

    readonly #container: CubeContainer
    readonly #collection: CubeCollection
    readonly #camera: Camera
    readonly #tilemap: Tilemap
    readonly #avatar: Avatar

    #isDragging: boolean = false

    constructor(position: Point3D, size: number, currentTile: Tile, collection: CubeCollection, camera: Camera,
        tilemap: Tilemap, avatar: Avatar) {

        this.#position = position
        this.#size = size
        this.#currentTile = currentTile
        this.#container = new CubeContainer(this.#position, this.#size)
        this.#collection = collection
        this.#camera = camera
        this.#tilemap = tilemap
        this.#avatar = avatar

        this.#setupEventListeners()
    }

    #setupEventListeners(): void {
        this.#container.faces.forEach(face => face?.on('rightdown', this.#handleFaceClick.bind(this, face)))

        this.#container
            .on('pointerdown', this.#handlePointerDown.bind(this))
            .on('pointerover', this.#handlePointerOver.bind(this))
            .on('pointerout', this.#handlePointerOut.bind(this))
            .on('globalpointermove', this.#handleDragMove.bind(this))
            .on('pointerup', this.#handleDragEnd.bind(this))
            .on('pointerupoutside', this.#handleDragEnd.bind(this))
    }

    #handleFaceClick = (face: PolygonGraphics): void => createColorInput(hexColor => face.draw(hexColor))

    #handlePointerDown(event: FederatedPointerEvent): void {
        if (event.button !== 0) return

        this.#container.alpha = 0.5
        this.#isDragging = true
        this.#camera.enabled = false
    }

    #handlePointerOver = (event: FederatedPointerEvent): boolean | undefined =>
        this.#currentTile?.graphics.emit('pointerover', event)

    #handlePointerOut = (event: FederatedPointerEvent): boolean | undefined =>
        this.#currentTile?.graphics.emit('pointerout', event)

    #handleDragMove(event: FederatedPointerEvent): void {
        if (!this.#isDragging) return

        this.#currentTile?.graphics.emit('pointerout', event)

        const pointerPosition = this.#tilemap.tileContainer.toLocal(event)
        const targetTile = this.#tilemap.findTileByPositionInBounds(pointerPosition)

        if (!targetTile ||
            targetTile === this.#currentTile ||
            targetTile === this.#avatar.currentTile) return

        this.#placeOnTile(targetTile)

        if (this.#avatar.isMoving) this.#avatar.calculatePath(true)

        this.#collection.sortCubesByPosition()
        this.#collection.adjustCubeRenderingOrder(this.#avatar)

        this.currentTile?.graphics.emit('pointerover', event)
    }

    #handleDragEnd(): void {
        this.#container.alpha = 1
        this.#isDragging = false
        this.#camera.enabled = true
    }

    #placeOnTile(tile: Tile): void {
        const tallestCubeAtTile = this.#collection.findTallestCubeAt(tile.position)

        if (tallestCubeAtTile === this || tallestCubeAtTile && this.#isLargerThan(tallestCubeAtTile)) return

        const offsets = calculateCubeOffsets(this.#size)
        const newPosition = tile.position.subtract(offsets)

        newPosition.z = tallestCubeAtTile ? tallestCubeAtTile.position.z + tallestCubeAtTile.size : newPosition.z

        this.#updatePosition(newPosition)

        this.#avatar.adjustPositionOnCubeDrag(this)

        this.#currentTile = tile
    }

    #isLargerThan = (cube: Cube): boolean => this.#size > cube.size

    #updatePosition(position: Point3D): void {
        this.#position.copyFrom(position)

        this.#container.position.set(position.x, position.y - position.z)
    }

    get position(): Point3D {
        return this.#position
    }

    get size(): number {
        return this.#size
    }

    get graphics(): CubeContainer {
        return this.#container
    }

    get currentTile(): Tile | undefined {
        return this.#currentTile
    }
}
