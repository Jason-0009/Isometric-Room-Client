import { Container, Point } from 'pixi.js'
import CubeGraphics from './CubeGraphics'

export default class CubeContainer extends Container {
    constructor() {
        super()
    }

    /**
     * Sorts cubes in the container based on their tile positions for proper z-index order.
     */
    sortByTilePosition() {
        this.children.sort((cubeA, cubeB) => {
            const tilePositionA = (cubeA as CubeGraphics).TilePosition
            const tilePositionB = (cubeB as CubeGraphics).TilePosition

            if (tilePositionA.y !== tilePositionB.y) return tilePositionA.y - tilePositionB.y

            return tilePositionA.x - tilePositionB.x
        })
    }

    /**
     * Check if there's a cube at a specific tile position.
     * @param targetCube - The cube to exclude from the check.
     * @param tilePosition - The tile position to check.
     * @returns True if a cube (other than the targetCube) is at the specified tile position, otherwise false.
     */
    hasOtherCubeAtTile(targetCube: CubeGraphics, tilePosition: Point): boolean {
        const isDifferentCube = (cube: CubeGraphics) => cube !== targetCube
        const hasMatchingPosition = (cube: CubeGraphics) => cube.TilePosition.equals(tilePosition)

        return this.children.some(cube => isDifferentCube(cube as CubeGraphics)
            && hasMatchingPosition(cube as CubeGraphics))
    }

    // Add other cube-related methods as needed
}
