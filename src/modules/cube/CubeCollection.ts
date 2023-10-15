import { Container, Point } from 'pixi.js'

import Camera from '@core/Camera'

import Cube from '@modules/cube/Cube'
import Tile from '@modules/tile/Tile'
import Tilemap from '@modules/tile/Tilemap'
import Avatar from '@modules/avatar/Avatar'

import Point3D from '@utils/coordinates/Point3D'
import calculateCubeOffsets from '@utils/calculations/calculateCubeOffsets'
import { cartesianToIsometric, isometricToCartesian } from '@utils/coordinates/coordinateTransformations'
import { findClosestValidTilePosition, isValidTilePosition } from '@utils/helpers/tilePositionHelpers'

import { CUBE_SETTINGS } from '@constants/Cube.constants'
import { TILE_DIMENSIONS } from '@constants/Tile.constants'

export default class CubeCollection {
    readonly #cubes: Cube[]
    readonly #entityContainer: Container

    constructor(entityContainer: Container) {
        this.#cubes = []
        this.#entityContainer = entityContainer
    }

    populateSceneWithCubes = (camera: Camera, tilemap: Tilemap, avatar: Avatar): void =>
        CUBE_SETTINGS.forEach(({ position, size }) => {
            let validTilePosition = this.#getValidTilePosition(position, tilemap)

            if (!validTilePosition) return

            const validSize = this.#getValidSize(size)

            let tilePosition = cartesianToIsometric(validTilePosition)
            let currentTile = tilemap.findTileByExactPosition(tilePosition)

            if (!currentTile) return

            let tallestCubeAtTile = this.findTallestCubeAt(currentTile.position)

            const isCubeNarrower = tallestCubeAtTile && tallestCubeAtTile.size < validSize

            if (isCubeNarrower) {
                const data = this.#getClosestValidTileData(validTilePosition, tilemap)

                if (!data) return

                ({
                    validPosition: validTilePosition,
                    tilePosition,
                    currentTile,
                    tallestCubeAtTile
                } = data)
            }

            const cubeOffsets = calculateCubeOffsets(validSize)
            const finalPosition = this.#getFinalCubePosition(tilePosition, cubeOffsets, tallestCubeAtTile)

            if (!currentTile) return

            const cube = new Cube(finalPosition, validSize, currentTile, this, camera, tilemap, avatar)

            this.#addCube(cube)
        })

    findTallestCubeAt = (position: Point3D): Cube | null =>
        this.#cubes.reduce((currentTallest: Cube | null, cube: Cube) => {
            const isAtPosition = cube.currentTile?.position.equals(position)
            const isTaller = cube.position.z > (currentTallest?.position.z ?? -Infinity)

            return isAtPosition && isTaller ? cube : currentTallest
        }, null)

    sortCubesByPosition(): void {
        this.#cubes.sort(this.#sortCubesByPosition)
        this.#cubes.forEach((cube, index) => cube.graphics.zIndex = index)

        this.#entityContainer.sortChildren()
    }

    adjustCubeRenderingOrder(avatar: Avatar): void {
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

    #getValidTilePosition = (position: Point3D, tilemap: Tilemap): Point3D | null => isValidTilePosition(position, tilemap) ?
        position : findClosestValidTilePosition(position, tilemap.grid)

    #getValidSize = (size: number): number => Math.max(8, Math.min(size, TILE_DIMENSIONS.HEIGHT))

    #getClosestValidTileData(position: Point3D, tilemap: Tilemap): {
        validPosition: Point3D,
        tilePosition: Point3D,
        currentTile: Tile | undefined
        tallestCubeAtTile: Cube | null
    } | undefined {
        const validPosition = findClosestValidTilePosition(position, tilemap.grid)

        if (!validPosition) return

        const tilePosition = cartesianToIsometric(validPosition)
        const currentTile = tilemap.findTileByExactPosition(tilePosition)
        const tallestCubeAtTile = this.findTallestCubeAt(tilePosition)

        return { validPosition, tilePosition, currentTile, tallestCubeAtTile }
    }

    #getFinalCubePosition(tilePosition: Point3D, cubeOffsets: Point, tallestCubeAtTile: Cube | null): Point3D {
        const finalPosition = tilePosition.subtract(cubeOffsets)

        finalPosition.z = tallestCubeAtTile ? tallestCubeAtTile.position.z + tallestCubeAtTile.size : finalPosition.z

        return finalPosition
    }

    #addCube(cube: Cube): void {
        this.#cubes.push(cube)

        this.#entityContainer.addChild(cube.graphics)
    }

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

    get cubes(): Cube[] {
        return this.#cubes
    }
}
