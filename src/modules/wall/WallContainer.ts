import { Container } from 'pixi.js'

import WallDirection from '@modules/wall/WallDirection'

import PolygonGraphics from '@shared/PolygonGraphics'

import { BoxFaces } from 'types/BoxFaces.types'

import Point3D from '@utils/coordinates/Point3D'

import { WALL_COLORS, WALL_DIMENSIONS } from '@constants/Wall.constants'
import { TILE_DIMENSIONS } from '@constants/Tile.constants'

export default class WallContainer extends Container {
    readonly #direction: WallDirection
    readonly #sides: BoxFaces[]

    constructor(position: Point3D, direction: WallDirection) {
        super()

        this.position.copyFrom(position)
        this.#direction = direction
        this.#sides = this.#createSides

        this.#sides.forEach(side => side.forEach(face => face && this.addChild(face)))
    }

    get #createSides(): BoxFaces[] {
        const sides: BoxFaces[] = []
        const directions = [WallDirection.LEFT, WallDirection.RIGHT]

        directions.forEach(direction => this.#direction === direction ||
            this.#direction === WallDirection.BOTH ? sides.push(this.#createSide(direction)) : null)

        return sides
    }

    #createSide(direction: WallDirection): BoxFaces {
        const color = direction === WallDirection.LEFT ? WALL_COLORS.LEFT : WALL_COLORS.RIGHT
        const surfacePoints = direction === WallDirection.LEFT ? this.#leftSurfacePoints : this.#rightSurfacePoints
        const borderPoints = direction === WallDirection.LEFT ? this.#leftBorderPoints : this.#rightBorderPoints
        const borderTopPoints = direction === WallDirection.LEFT ? this.#topLeftBorderPoints : this.#topRightBorderPoints

        return new Map([
            ['top', new PolygonGraphics(color.SURFACE, surfacePoints)],
            ['left', new PolygonGraphics(color.BORDER, borderPoints)],
            ['right', new PolygonGraphics(color.BORDER_TOP, borderTopPoints)]
        ])
    }

    get #leftSurfacePoints(): number[] {
        return [
            0, TILE_DIMENSIONS.HEIGHT / 2 + TILE_DIMENSIONS.THICKNESS,
            0, -WALL_DIMENSIONS.HEIGHT,
            TILE_DIMENSIONS.WIDTH / 2, -WALL_DIMENSIONS.HEIGHT - TILE_DIMENSIONS.HEIGHT / 2,
            TILE_DIMENSIONS.WIDTH / 2, TILE_DIMENSIONS.THICKNESS,
        ]
    }

    get #leftBorderPoints(): number[] {
        return [
            0, TILE_DIMENSIONS.HEIGHT / 2 + TILE_DIMENSIONS.THICKNESS,
            -WALL_DIMENSIONS.THICKNESS, TILE_DIMENSIONS.HEIGHT / 2 + TILE_DIMENSIONS.THICKNESS - WALL_DIMENSIONS.THICKNESS / 2,
            -WALL_DIMENSIONS.THICKNESS, -WALL_DIMENSIONS.HEIGHT - WALL_DIMENSIONS.THICKNESS / 2,
            0, -WALL_DIMENSIONS.HEIGHT,
        ]
    }

    get #topLeftBorderPoints(): number[] {
        return [
            -WALL_DIMENSIONS.THICKNESS, -WALL_DIMENSIONS.HEIGHT -
            WALL_DIMENSIONS.THICKNESS / 2, TILE_DIMENSIONS.WIDTH / 2, -WALL_DIMENSIONS.HEIGHT -
            TILE_DIMENSIONS.HEIGHT / 2 - WALL_DIMENSIONS.THICKNESS, TILE_DIMENSIONS.WIDTH / 2, -WALL_DIMENSIONS.HEIGHT - TILE_DIMENSIONS.HEIGHT / 2,
            0, -WALL_DIMENSIONS.HEIGHT,
        ]
    }

    get #rightSurfacePoints(): number[] {
        return [
            TILE_DIMENSIONS.WIDTH / 2, TILE_DIMENSIONS.THICKNESS,
            TILE_DIMENSIONS.WIDTH / 2, -WALL_DIMENSIONS.HEIGHT - TILE_DIMENSIONS.HEIGHT / 2,
            TILE_DIMENSIONS.WIDTH, -WALL_DIMENSIONS.HEIGHT,
            TILE_DIMENSIONS.WIDTH, TILE_DIMENSIONS.HEIGHT / 2 + TILE_DIMENSIONS.THICKNESS,
        ]
    }

    get #rightBorderPoints(): number[] {
        return [
            TILE_DIMENSIONS.WIDTH, TILE_DIMENSIONS.HEIGHT / 2 + TILE_DIMENSIONS.THICKNESS,
            TILE_DIMENSIONS.WIDTH + WALL_DIMENSIONS.THICKNESS,
            TILE_DIMENSIONS.HEIGHT / 2 + TILE_DIMENSIONS.THICKNESS - WALL_DIMENSIONS.THICKNESS / 2,
            TILE_DIMENSIONS.WIDTH + WALL_DIMENSIONS.THICKNESS, -WALL_DIMENSIONS.HEIGHT - WALL_DIMENSIONS.THICKNESS / 2,
            TILE_DIMENSIONS.WIDTH, -WALL_DIMENSIONS.HEIGHT,
        ]
    }

    get #topRightBorderPoints(): number[] {
        return [
            TILE_DIMENSIONS.WIDTH / 2, -WALL_DIMENSIONS.HEIGHT - TILE_DIMENSIONS.HEIGHT / 2 - WALL_DIMENSIONS.THICKNESS,
            TILE_DIMENSIONS.WIDTH + WALL_DIMENSIONS.THICKNESS, -WALL_DIMENSIONS.HEIGHT - WALL_DIMENSIONS.THICKNESS / 2,
            TILE_DIMENSIONS.WIDTH, -WALL_DIMENSIONS.HEIGHT, TILE_DIMENSIONS.WIDTH / 2,
            -WALL_DIMENSIONS.HEIGHT - TILE_DIMENSIONS.HEIGHT / 2,
        ]
    }

    get sides(): BoxFaces[] {
        return this.#sides
    }
}
