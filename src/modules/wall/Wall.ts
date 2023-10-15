import WallDirection from '@modules/wall/WallDirection'
import WallContainer from '@modules/wall/WallContainer'

import { FaceKey } from 'types/BoxFaces.types'

import Point3D from '@utils/coordinates/Point3D'
import createColorInput from '@utils/helpers/colorInputHelper'

export default class Wall {
    readonly #position: Point3D
    readonly #direction: WallDirection
    readonly #walls: Wall[]
    readonly #container: WallContainer

    constructor(position: Point3D, direction: WallDirection, walls: Wall[]) {
        this.#position = position
        this.#direction = direction
        this.#walls = walls
        this.#container = new WallContainer(this.#position, this.#direction)

        this.#setupEventListeners()
    }

    #setupEventListeners = (): void => this.#container.sides.forEach(side =>
        side.forEach((face, key) => face?.on('rightclick', this.#handleFaceClick.bind(this, key))))

    #handleFaceClick = (key: FaceKey): void => createColorInput(hexColor => this.#walls.forEach((wall) => {
        if (wall.#direction === this.#direction) {
            wall.#container.sides.forEach(side => side.get(key)?.draw(hexColor))
        }
    }))


    get container(): WallContainer {
        return this.#container
    }
}
