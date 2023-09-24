import { Container } from 'pixi.js'

import Cube from './Cube'

import Point3D from '../../utils/Point3D'

/**
 * A collection of cubes that can be managed and sorted.
 */
export default class CubeCollection {
    /**
     * An array holding all the cube objects in the collection.
     * @private
     * @type {Cube[]}
     */
    readonly #cubes: Cube[]

    /**
     * The container used to display the cubes in the collection.
     * @private
     * @type {Container}
     */
    readonly #cubeContainer: Container

    /**
     * Creates a new CubeCollection instance.
     */
    constructor() {
        this.#cubes = []

        this.#cubeContainer = new Container()
    }

    /**
     * Adds a cube to the collection and the cube container.
     * @param {Cube} cube - The cube to add.
     */
    addCube(cube: Cube): void {
        this.#cubes.push(cube)

        this.#cubeContainer.addChild(cube.graphics)
    }

    /**
     * Finds the tallest cube at a specified tile position, excluding a specific cube.
     * @param {Point3D} tilePosition - The tile position to search for cubes.
     * @param {Cube} cubeToCompare - The cube to exclude from the search.
     * @returns {Cube | null} The tallest cube at the specified tile position, or null if none is found.
     */
    findTallestCubeAt = (tilePosition: Point3D, cubeToCompare: Cube): Cube | null =>
        this.#cubes.reduce((currentTallest: Cube | null, cube) => {
            // Check if the cube is not the cube to compare,
            // has the same tile position, and is taller than the current tallest cube.
            const meetsConditions =
                cube !== cubeToCompare &&
                cube.currentTile?.position.equals(tilePosition) &&
                cube.position.z > (currentTallest?.position.z ?? -Infinity)

            // If the cube meets the conditions, return it; otherwise, return the current tallest cube.
            return meetsConditions ? cube : currentTallest
        }, null)

    /**
     * Sort cubes by their actual positions.
     */
    sortCubesByPosition(): void {
        this.#cubes.sort((cubeA, cubeB) => {
            // Compare cube positions using their x, y, and z coordinates.
            const positionA = cubeA.position
            const positionB = cubeB.position

            // Sort by height (z-coordinate) in ascending order.
            if (positionA.z !== positionB.z) return positionA.z - positionB.z

            // Sort by y-coordinate in ascending order.
            if (positionA.y !== positionB.y) return positionA.y - positionB.y

            // Sort by x-coordinate in ascending order.
            return positionA.x - positionB.x
        })

        // Update the container to match the sorted order of cubes.
        this.#cubeContainer.removeChildren()

        this.#cubes.forEach((cube) => this.#cubeContainer.addChild(cube.graphics))
    }

    /**
     * Gets the container holding all the cubes.
     * @returns {Container} The container holding the cubes.
     */
    get cubeContainer(): Container {
        return this.#cubeContainer
    }
}
