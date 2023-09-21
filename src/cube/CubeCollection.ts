import { Container } from 'pixi.js'

import Point3D from '../utils/Point3D'

import Cube from './Cube'

/**
 * A collection of cubes that can be managed and sorted.
 */
export default class CubeCollection {
    private cubes: Cube[]

    private cubeContainer: Container

    constructor() {
        this.cubes = []

        this.cubeContainer = new Container()
    }

    /**
     * Adds a cube to the collection and the cube container.
     * @param cube - The cube to add.
     */
    addCube(cube: Cube) {
        this.cubes.push(cube)

        this.cubeContainer.addChild(cube.Graphics)
    }

    /**
     * Finds the tallest cube at a specified tile position, excluding a specific cube.
     * @param tilePosition - The tile position to search for cubes.
     * @param cubeToCompare - The cube to exclude from the search.
     * @returns The tallest cube at the specified tile position, or null if none is found.
     */
    findTallestCubeAt(tilePosition: Point3D, cubeToCompare: Cube) {
        return this.cubes.reduce((currentTallest: Cube | null, cube) => {
            // Check if the cube is not the cube to compare,
            // has the same tile position, and is taller than the current tallest cube.
            const meetsConditions =
                cube !== cubeToCompare &&
                cube.CurrentTile?.Position.equals(tilePosition) &&
                cube.Position.z > (currentTallest?.Position.z ?? -Infinity)

            // If the cube meets the conditions, return it; otherwise, return the current tallest cube.
            return meetsConditions ? cube : currentTallest
        }, null)
    }

    /**
     * Sort cubes by their actual positions.
     */
    sortCubesByPosition() {
        this.cubes.sort((cubeA, cubeB) => {
            // Compare cube positions using their x, y, and z coordinates.
            const positionA = cubeA.Position
            const positionB = cubeB.Position

            // Sort by height (z-coordinate) in ascending order.
            if (positionA.z !== positionB.z) return positionA.z - positionB.z

            // Sort by y-coordinate in ascending order.
            if (positionA.y !== positionB.y) return positionA.y - positionB.y

            // Sort by x-coordinate in ascending order.
            return positionA.x - positionB.x
        })

        // Update the container to match the sorted order of cubes.
        this.cubeContainer.removeChildren()

        this.cubes.forEach((cube) => this.cubeContainer.addChild(cube.Graphics))
    }

    /**
     * Gets the container holding all the cubes.
     * @returns The container holding the cubes.
     */
    get CubeContainer() {
        return this.cubeContainer
    }
}