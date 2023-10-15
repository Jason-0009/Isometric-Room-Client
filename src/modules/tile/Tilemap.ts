import { Container, Point } from 'pixi.js'

import Tile from '@modules/tile/Tile'

import WallCollection from '@modules/wall/WallCollection'
import Avatar from '@modules/avatar/Avatar'

import { cartesianToIsometric } from '@utils/coordinates/coordinateTransformations'
import Point3D from '@utils/coordinates/Point3D'
import calculateWallDirections from '@utils/calculations/calculateWallDirections'

export default class Tilemap {
    readonly #tiles: Tile[]
    readonly #container: Container
    readonly #grid: number[][]
    readonly #wallCollection: WallCollection
    #avatar: Avatar | undefined

    constructor(grid: number[][], wallCollection: WallCollection) {
        this.#tiles = []
        this.#container = new Container()
        this.#grid = grid
        this.#wallCollection = wallCollection
    }

    generate(): void {
        this.#grid.forEach((row, x) => {
            row.forEach((z, y) => {
                if (z === -1) return

                const position = new Point3D(x, y, z)
                const isometricPosition = cartesianToIsometric(position)
                const wallDirections = calculateWallDirections(x, y)

                wallDirections.forEach(wallDirection => this.#wallCollection.addWall(isometricPosition, wallDirection))

                this.#addTile(isometricPosition)
            })
        })
    }

    getGridValue = (position: Point): number => this.#grid[position.x]?.[position.y] ?? -1

    findTileByExactPosition = (position: Point3D): Tile | undefined =>
        this.#tiles.find((tile) => tile.position.equals(position))

    findTileByPositionInBounds = (position: Point): Tile | undefined =>
        this.#tiles.find(tile => tile.isPositionWithinBounds(position))

    #addTile(position: Point3D): void {
        if (!this.#avatar) return

        const tile = new Tile(position, this.#tiles, this.#grid, this.#avatar)

        this.#tiles.push(tile)
        this.#container.addChild(tile.graphics)
    }

    get tileContainer(): Container {
        return this.#container
    }

    get grid(): number[][] {
        return this.#grid
    }

    set avatar(value: Avatar) {
        this.#avatar = value
    }
}
