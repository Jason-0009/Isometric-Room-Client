import { Container } from 'pixi.js'

import PolygonGraphics from '@shared/PolygonGraphics'

import { BoxFaces } from 'types/BoxFaces.types'

import Point3D from '@utils/coordinates/Point3D'

import { AVATAR_COLORS, AVATAR_DIMENSIONS } from '@constants/Avatar.constants'

export default class AvatarContainer extends Container {
    readonly #faces: BoxFaces

    constructor(position: Point3D) {
        super()

        this.position.set(position.x, position.y - position.z)
        this.#faces = new Map([
            ['top', new PolygonGraphics(AVATAR_COLORS.TOP_FACE, this.#topFacePoints)],
            ['left', new PolygonGraphics(AVATAR_COLORS.LEFT_FACE, this.#leftFacePoints)],
            ['right', new PolygonGraphics(AVATAR_COLORS.RIGHT_FACE, this.#rightFacePoints)]
        ])

        this.#faces.forEach(face => face && this.addChild(face))
    }

    get #topFacePoints(): number[] {
        return [
            0, -AVATAR_DIMENSIONS.HEIGHT,
            AVATAR_DIMENSIONS.WIDTH, -AVATAR_DIMENSIONS.HEIGHT - AVATAR_DIMENSIONS.WIDTH / 2,
            AVATAR_DIMENSIONS.WIDTH * 2, -AVATAR_DIMENSIONS.HEIGHT,
            AVATAR_DIMENSIONS.WIDTH, -AVATAR_DIMENSIONS.HEIGHT + AVATAR_DIMENSIONS.WIDTH / 2
        ]
    }

    get #leftFacePoints(): number[] {
        return [
            0, 0,
            0, -AVATAR_DIMENSIONS.HEIGHT,
            AVATAR_DIMENSIONS.WIDTH, -AVATAR_DIMENSIONS.HEIGHT + AVATAR_DIMENSIONS.WIDTH / 2,
            AVATAR_DIMENSIONS.WIDTH, AVATAR_DIMENSIONS.WIDTH / 2,
        ]
    }

    get #rightFacePoints(): number[] {
        return [
            AVATAR_DIMENSIONS.WIDTH, AVATAR_DIMENSIONS.WIDTH / 2,
            AVATAR_DIMENSIONS.WIDTH, -AVATAR_DIMENSIONS.HEIGHT + AVATAR_DIMENSIONS.WIDTH / 2,
            AVATAR_DIMENSIONS.WIDTH * 2, -AVATAR_DIMENSIONS.HEIGHT,
            AVATAR_DIMENSIONS.WIDTH * 2, 0,
        ]
    }

    get faces(): BoxFaces {
        return this.#faces
    }
}
