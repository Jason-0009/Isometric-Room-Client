import { Container } from 'pixi.js'

import Wall from '@modules/wall/Wall'
import WallDirection from '@modules/wall/WallDirection'

import Point3D from '@utils/Point3D'

/**
 * Represents a collection of walls in the game.
 */
export default class WallCollection {
    /**
     * The container for holding the walls.
     * 
     * @type {Container}
     */
    readonly #wallContainer: Container

    /**
     * Creates a new instance of WallCollection.
     */
    constructor() {
        this.#wallContainer = new Container()
    }

    /**
     * Adds a wall to the collection.
     * 
     * @param {Point3D} position - The position of the wall.
     * @param {WallDirection} direction - The direction of the wall.
     */
    addWall(position: Point3D, direction: WallDirection): void {
        const wall = new Wall(position, direction)
        
        this.#wallContainer.addChild(wall)
    }

    /**
     * Gets the container holding the walls.
     * 
     * @returns {Container} The container for walls.
     */
    get wallContainer(): Container {
        return this.#wallContainer
    }
}
