import { Container, Point } from 'pixi.js'

import Point3D from '../utils/Point3D'

import Cube from './Cube'
import { TILE_DIMENSIONS } from '../tile/Tile.constants'

export default class CubeCollection {
    private cubes: Cube[]

    private cubeContainer: Container

    constructor() {
        this.cubes = []

        this.cubeContainer = new Container()
    }

    addCube(cube: Cube) {
        this.cubes.push(cube)

        this.cubeContainer.addChild(cube.Graphics)
    }

    findTallestCubeAt(tilePosition: Point3D, cubeToCompare: Cube): Cube | null {
        let tallestCube: Cube | null = null

        let maxHeight = -Infinity

        this.cubes.forEach(cube => {
            // Skip the cube being compared
            if (cube === cubeToCompare) return

            // Skip cubes on different tiles
            if (!cube.CurrentTile?.Position.equals(tilePosition)) return

            if (cube.Position.z > maxHeight) {
                maxHeight = cube.Position.z

                tallestCube = cube
            }
        })

        return tallestCube
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

    get CubeContainer() {
        return this.cubeContainer
    }
}