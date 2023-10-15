import { Point } from 'pixi.js'

import Point3D from '@utils/coordinates/Point3D'
import Tilemap from '@modules/tile/Tilemap'

export const isValidTilePosition = (position: Point3D, tilemap: Tilemap): boolean => {
    const { x, y, z } = position

    const position2D = new Point(x, y)

    if (!isTilePositionInBounds(position, tilemap.grid)) return false

    const tileHeight = tilemap.getGridValue(position2D)

    return tileHeight !== -1 && tileHeight === z
}

const isTilePositionInBounds = (position: Point3D, grid: number[][]): boolean => {
    const { x, y } = position

    const maxGridValues = new Point(
        grid.length - 1,
        Math.max(...grid.map(row => row.length)) - 1
    )

    return x >= 0 && y >= 0 && x <= maxGridValues.x && y <= maxGridValues.y
}

export const findClosestValidTilePosition = (position: Point3D, grid: number[][]): Point3D | null =>
    grid.reduce((closest: { position: Point3D | null, distance: number }, row: number[], x: number) =>
        row.reduce((innerClosest: { position: Point3D | null, distance: number }, z: number, y: number) => {
            if (z < 0) return innerClosest

            const potentialPosition = new Point3D(x, y, z)

            if (potentialPosition.equals(position)) return innerClosest

            const distance = position.distanceTo(potentialPosition)
            const priority = potentialPosition.x === position.x && potentialPosition.y === position.y ? 0 : distance

            if (priority < innerClosest.distance) return { position: potentialPosition, distance: priority }

            return innerClosest
        }, closest), { position: null, distance: Number.POSITIVE_INFINITY }).position