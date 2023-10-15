import { Container } from 'pixi.js'

import PolygonGraphics from '@shared/PolygonGraphics'

import { BoxFaces } from 'types/BoxFaces.types'

import Point3D from '@utils/coordinates/Point3D'

import { TILE_COLORS, TILE_DIMENSIONS } from '@constants/Tile.constants'

export default class TileContainer extends Container {
    readonly #faces: BoxFaces

    constructor(position: Point3D, hasLeftBorder: boolean, hasRightBorder: boolean) {
        super()

        this.position.set(position.x, position.y - position.z)
        this.#faces = new Map([
            ['top', new PolygonGraphics(TILE_COLORS.SURFACE, this.#surfacePoints)],
            ['left', hasLeftBorder ? new PolygonGraphics(TILE_COLORS.LEFT_BORDER, this.#leftBorderPoints) : null],
            ['right', hasRightBorder ? new PolygonGraphics(TILE_COLORS.RIGHT_BORDER, this.#rightBorderPoints) : null]
        ])

        this.#faces.forEach(face => face && this.addChild(face))

        this.eventMode = 'static'
    }

    get #surfacePoints(): number[] {
        return [
            TILE_DIMENSIONS.WIDTH / 2, 0,
            TILE_DIMENSIONS.WIDTH, TILE_DIMENSIONS.HEIGHT / 2,
            TILE_DIMENSIONS.WIDTH / 2, TILE_DIMENSIONS.HEIGHT,
            0, TILE_DIMENSIONS.HEIGHT / 2,
        ]
    }

    get #leftBorderPoints(): number[] {
        return [
            0, TILE_DIMENSIONS.HEIGHT / 2,
            TILE_DIMENSIONS.WIDTH / 2, TILE_DIMENSIONS.HEIGHT,
            TILE_DIMENSIONS.WIDTH / 2, TILE_DIMENSIONS.HEIGHT + TILE_DIMENSIONS.THICKNESS,
            0, TILE_DIMENSIONS.HEIGHT / 2 + TILE_DIMENSIONS.THICKNESS,
        ]
    }

    get #rightBorderPoints(): number[] {
        return [
            TILE_DIMENSIONS.WIDTH, TILE_DIMENSIONS.HEIGHT / 2,
            TILE_DIMENSIONS.WIDTH / 2, TILE_DIMENSIONS.HEIGHT,
            TILE_DIMENSIONS.WIDTH / 2, TILE_DIMENSIONS.HEIGHT + TILE_DIMENSIONS.THICKNESS,
            TILE_DIMENSIONS.WIDTH, TILE_DIMENSIONS.HEIGHT / 2 + TILE_DIMENSIONS.THICKNESS,
        ]
    }

    get faces(): BoxFaces {
        return this.#faces
    }
}
