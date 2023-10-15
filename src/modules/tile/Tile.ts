import { FederatedPointerEvent, Point, Polygon } from 'pixi.js'

import TileContainer from '@modules/tile/TileContainer'

import Avatar from '@modules/avatar/Avatar'

import { FaceKey } from 'types/BoxFaces.types'

import Point3D from '@utils/coordinates/Point3D'
import { isometricToCartesian } from '@utils/coordinates/coordinateTransformations'
import createColorInput from '@utils/helpers/colorInputHelper'
import darkenColor from '@utils/color/darkenColor'

import { TILE_SURFACE_POINTS } from '@constants/Tile.constants'

export default class Tile {
    readonly #position: Point3D
    readonly #tiles: Tile[]
    readonly #grid: number[][]
    readonly #container: TileContainer
    readonly #avatar: Avatar

    #originalTint: number | null = null
    #isDarkened: boolean = false

    constructor(position: Point3D, tiles: Tile[], grid: number[][], avatar: Avatar) {
        this.#position = position
        this.#tiles = tiles
        this.#grid = grid
        this.#avatar = avatar

        const hasBorders = this.#getBorders()

        this.#container = new TileContainer(this.#position, ...hasBorders)

        this.#setupEventListeners()
    }

    isPositionWithinBounds(position: Point): boolean {
        const { x, y, z } = this.position

        const transformedPoints = TILE_SURFACE_POINTS.map((surfacePoint, index) => surfacePoint + (index % 2 === 0 ? x : y - z))
        const polygon = new Polygon(transformedPoints)

        return polygon.contains(position.x, position.y)
    }

    #getBorders(): [boolean, boolean] {
        return [this.#isTileEmpty(new Point(0, 1)), this.#isTileEmpty(new Point(1, 0))]
    }

    #isTileEmpty(delta: Point): boolean {
        const { x, y, z } = isometricToCartesian(this.#position)
        const nextRow = this.#grid[x + delta.x]

        if (!nextRow) return true

        const tileZ = nextRow[y + delta.y]

        return !tileZ || tileZ !== z
    }

    #setupEventListeners(): void {
        this.#container.faces.forEach((face, key) =>
            face?.on('rightclick', this.#handleFaceClick.bind(this, key)))

        this.#container
            .on('pointerover', this.#handlePointerOver.bind(this))
            .on('pointerdown', this.#handlePointerDown.bind(this))
            .on('pointerout', this.#handlePointerOut.bind(this))
    }

    #handleFaceClick = (key: FaceKey): void =>
        createColorInput(hexColor => this.#tiles.forEach(tile =>
            tile.graphics.faces.get(key)?.draw(hexColor)))

    #handlePointerOver(): void {
        const surface = this.#container.faces.get('top')

        if (!surface || this.#isDarkened) return

        this.#originalTint = this.#originalTint || surface.tint as number

        surface.tint = darkenColor(surface.tint as number, 10)

        this.#isDarkened = true
    }

    #handlePointerDown = (event: FederatedPointerEvent): void => {
        if (event.button !== 0) return

        this.#avatar.goalPosition = isometricToCartesian(this.#position)
        this.#avatar.calculatePath()
    }

    #handlePointerOut() {
        const surface = this.#container.faces.get('top')

        if (!surface || !this.#originalTint) return

        surface.tint = this.#originalTint

        this.#isDarkened = false
    }

    get graphics(): TileContainer {
        return this.#container
    }

    get position(): Point3D {
        return this.#position
    }
}
