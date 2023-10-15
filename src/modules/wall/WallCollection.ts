import { Container } from 'pixi.js'

import WallDirection from '@modules/wall/WallDirection'
import Wall from '@modules/wall/Wall'

import Point3D from '@utils/coordinates/Point3D'

export default class WallCollection {
    readonly #walls: Wall[]
    readonly #container: Container

    constructor() {
        this.#walls = []
        this.#container = new Container()
    }

    addWall(position: Point3D, direction: WallDirection) {
        const wall = new Wall(position, direction, this.#walls)
        
        this.#walls.push(wall)
        this.#container.addChild(wall.container)
    }

    get container(): Container {
        return this.#container
    }
}
