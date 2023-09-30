import { Container } from 'pixi.js'

import Camera from '../../core/Camera'

import Cube from './Cube'
import Tilemap from '../tile/Tilemap'

import Point3D from '../../utils/Point3D'
import { calculateCubeOffsets } from '../../utils/offsetCalculations'
import { cartesianToIsometric } from '../../utils/coordinateTransformations'

import { CUBE_SETTINGS } from '../../constants/Cube.constants'

/**
 * A collection of cubes that can be managed and sorted.
 */
export default class CubeCollection {
    /**
     * An array holding all the cube objects in the collection.
     * @type {Cube[]}
     * @private
     */
    readonly #cubes: Cube[]

    /**
     * The container used to display the cubes in the collection.
     * @type {Container}
     * @private
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
     * Initializes the CubeCollection with cubes based on predefined settings.
     * @param {Camera} camera - The camera object for controlling the view.
     * @param {Tilemap} tilemap - The tilemap where the cubes exist.
     * @param {CubeCollection} cubeCollection - The repository managing cubes.
     * @returns {this} The initialized CubeCollection.
     */
    initialize = (camera: Camera, tilemap: Tilemap): void =>
        CUBE_SETTINGS.forEach(({ tilePoint, size }) => {
            const tilePosition = cartesianToIsometric(tilePoint)
            const offsets = calculateCubeOffsets(size)

            const position = tilePosition.subtract(offsets)

            const currentTile = tilemap.findTileByExactPosition(tilePosition)

            const cube = new Cube(position, size).initialize
                (
                    camera,
                    tilemap,
                    this,
                    currentTile
                )

            this.#addCube(cube)
        })

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
     * Adds a cube to the collection and the cube container.
     * @param {Cube} cube - The cube to add.
     * @private
     */
    #addCube(cube: Cube): void {
        this.#cubes.push(cube)

        this.#cubeContainer.addChild(cube.graphics)
    }

    /**
     * Gets the container holding all the cubes.
     * @returns {Container} The container holding the cubes.
     */
    get cubeContainer(): Container {
        return this.#cubeContainer
    }
}
