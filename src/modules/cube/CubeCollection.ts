import { Container, Point } from 'pixi.js'

import Camera from '@core/Camera'

import Cube from '@modules/cube/Cube'
import Tile from '@modules/tile/Tile'
import Tilemap from '@modules/tile/Tilemap'
import Avatar from '@modules/avatar/Avatar'

import Point3D from '@utils/Point3D'
import calculateCubeOffsets from '@utils/calculateCubeOffsets'
import { cartesianToIsometric, isometricToCartesian } from '@utils/coordinateTransformations'
import { findClosestValidTilePosition, isValidTilePosition } from '@utils/tilePositionHelpers'

import { CUBE_SETTINGS } from '@constants/Cube.constants'
import { TILE_DIMENSIONS } from '@constants/Tile.constants'

/**
 * A collection of cubes that can be managed and sorted.
 */
export default class CubeCollection {
    /**
     * An array holding all the cube objects in the collection.
     * 
     * @type {Cube[]}
     */
    readonly #cubes: Cube[]

    /**
     * The container that holds cubes and the avatar in the isometric scene.
     * This container is used to organize and render cubes and the avatar within the scene.
     * 
     * @type {Container}
     */
    readonly #entityContainer: Container

    /**
     * Creates a new CubeCollection instance.
     */
    constructor(entityContainer: Container) {
        this.#cubes = []
        this.#entityContainer = entityContainer
    }

    /**
     * Populates the scene with cubes based on predefined settings.
     *
     * @param {Camera} camera - The camera used for rendering.
     * @param {Tilemap} tilemap - The tilemap for reference.
     * @param {Avatar} avatar - The avatar character in the scene.
     */
    populateSceneWithCubes = (camera: Camera, tilemap: Tilemap, avatar: Avatar): void =>
        CUBE_SETTINGS.forEach(({ position, size }) => {
            position = this.getValidTilePosition(position, tilemap.grid)
            size = this.getValidSize(size)

            let tilePosition = cartesianToIsometric(position)
            let currentTile = tilemap.findTileByExactPosition(tilePosition)

            if (!currentTile) return

            let tallestCubeAtTile = this.findTallestCubeAt(currentTile.position)

            if (tallestCubeAtTile && tallestCubeAtTile.size < size) ({
                position, tilePosition,
                currentTile, tallestCubeAtTile
            } = this.updatePositions(position, tilemap))

            const cubeOffsets = calculateCubeOffsets(size)
            const finalPosition = this.getFinalCubePosition(tilePosition, cubeOffsets, tallestCubeAtTile)

            if (!currentTile) return

            const cube = new Cube(finalPosition, size, currentTile, this, camera, tilemap, avatar)

            this.#addCube(cube)
        })

    /**
     * Returns a valid tile position. If the provided position is not valid, it finds the closest valid tile position.
     *
     * @param {Point3D} position - The initial position.
     * @param {number[][]} grid - The grid to validate against.
     * @returns {Point3D} - The valid tile position.
     */
    getValidTilePosition = (position: Point3D, grid: number[][]): Point3D => isValidTilePosition(position, grid) ?
        position : findClosestValidTilePosition(position, grid) || position

    /**
     * Returns a valid size. If the provided size is not within the allowed range, it adjusts it to fit within the range.
     *
     * @param {number} size - The initial size.
     * @returns {number} - The valid size.
     */
    getValidSize = (size: number): number => Math.max(8, Math.min(size, TILE_DIMENSIONS.HEIGHT))

    /**
     * Updates the positions based on the provided position and tilemap. It finds the closest valid tile position if necessary.
     *
     * @param {Point3D} position - The initial position.
     * @param {Tilemap} tilemap - The tilemap to use for finding positions.
     * @returns {Object} - An object containing the updated positions and related variables.
     */
    updatePositions(position: Point3D, tilemap: Tilemap): {
        position: Point3D
        tilePosition: Point3D
        currentTile: Tile | undefined
        tallestCubeAtTile: Cube | null
    } {
        position = findClosestValidTilePosition(position, tilemap.grid) || position

        const tilePosition = cartesianToIsometric(position)
        const currentTile = tilemap.findTileByExactPosition(tilePosition)
        const tallestCubeAtTile = this.findTallestCubeAt(tilePosition)

        return { position, tilePosition, currentTile, tallestCubeAtTile: tallestCubeAtTile }
    }

    /**
     * Returns the final cube position based on the provided tile position, cube offsets, and tallest cube at tile position.
     *
     * @param {Point3D} tilePosition - The initial tile position.
     * @param {Point} cubeOffsets - The cube offsets to subtract from the tile position.
     * @param {Cube | null} tallestCubeAtTile - The tallest cube at the tile position, if any.
     * @returns {Point3D} - The final cube position.
     */
    getFinalCubePosition(tilePosition: Point3D, cubeOffsets: Point, tallestCubeAtTile: Cube | null): Point3D {
        const finalPosition = tilePosition.subtract(cubeOffsets)

        if (tallestCubeAtTile) finalPosition.z = tallestCubeAtTile.position.z + tallestCubeAtTile.size

        return finalPosition
    }

    /**
     * Finds the tallest cube at a specified tile position
     * 
     * @param {Point3D} position - The tile position to search for cubes.
     * @returns {Cube | null} The tallest cube at the specified tile position, 
     *                        or null if none is found.
     */
    findTallestCubeAt = (position: Point3D): Cube | null =>
        this.#cubes.reduce((currentTallest: Cube | null, cube: Cube) => {
            const isAtPosition = cube.currentTile?.position.equals(position)
            const isTaller = cube.position.z > (currentTallest?.position.z ?? -Infinity)

            return isAtPosition && isTaller ? cube : currentTallest
        }, null)

    /**
     * Sorts the cubes in the collection by their actual positions.
     * This function rearranges the order of cubes in the collection based on their positions.
     * It also updates the z-index of each cube's graphics for rendering.
     */
    sortCubesByPosition(): void {
        this.#cubes.sort(this.#sortCubesByPosition)
        this.#cubes.forEach((cube, index) => cube.graphics.zIndex = index)

        this.#entityContainer.sortChildren()
    }

    /**
     * Adjusts cube rendering based on their positions relative to the avatar.
     * Updates the rendering order of each cube's graphics to ensure proper visual representation
     * relative to the avatar's location and movement.
     * Cubes near the avatar may appear in front or behind it based on their positions.
     */
    updateCubeRendering(avatar: Avatar): void {
        if (!avatar.currentTile) return

        const avatarTilePosition = isometricToCartesian(avatar.currentTile.position)

        this.#cubes.forEach(cube => {
            if (!cube.currentTile) return

            const cubeTilePosition = isometricToCartesian(cube.currentTile.position)
            const isCubeAtAvatarPosition = cubeTilePosition.equals(avatarTilePosition)
            const isCubeInFrontOfAvatar = cubeTilePosition.x >= avatarTilePosition.x && cubeTilePosition.y >= avatarTilePosition.y

            cube.graphics.zIndex = isCubeAtAvatarPosition ? -1 : isCubeInFrontOfAvatar ? 1 : -1
        })

        this.#entityContainer.sortChildren()
    }

    /**
     * Adds a cube to the collection and the cube container.
     * 
     * @param {Cube} cube - The cube to add.
     */
    #addCube(cube: Cube): void {
        this.#cubes.push(cube)

        this.#entityContainer.addChild(cube.graphics)
    }

    /**
     * Private method to sort cubes by position.
     *
     * @param {Cube} cubeA - The first cube to compare.
     * @param {Cube} cubeB - The second cube to compare.
     * @returns {number} A number representing the comparison result:
     *                   -1 if cubeA should come before cubeB,
     *                    1 if cubeA should come after cubeB,
     *                    0 if they are considered equal.
     */
    #sortCubesByPosition = (cubeA: Cube, cubeB: Cube): number => {
        const { currentTile: currentTileA, position: positionA } = cubeA
        const { currentTile: currentTileB, position: positionB } = cubeB

        if (!currentTileA || !currentTileB) return 0

        const { position: tilePositionA } = currentTileA
        const { position: tilePositionB } = currentTileB

        const { z: zCoordinateA } = positionA
        const { z: zCoordinateB } = positionB

        if (zCoordinateA !== zCoordinateB) return zCoordinateA - zCoordinateB
        if (tilePositionA.y !== tilePositionB.y) return tilePositionA.y - tilePositionB.y

        return tilePositionA.x - tilePositionB.x
    }

    /**
     * Get a list of all cubes in the cube collection.
    
     * @member CubeCollection
     * @type {Cube[]}
     * @returns {Cube[]} - A list of Cube objects.
     */
    get cubes(): Cube[] {
        return this.#cubes
    }
}
