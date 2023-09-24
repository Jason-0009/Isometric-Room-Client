import { findPath, isValidTile } from '../utils/pathfinding'
import Point3D from '../utils/Point3D'

describe('pathfinding', () => {
    it('should find a path from start to goal', (): void => {
        const startPoint: Point3D = new Point3D(0, 0, 0)
        const goalPoint: Point3D = new Point3D(4, 2, 0)

        const expectedPath: Point3D[] = [
            new Point3D(0, 0, 0),
            new Point3D(1, 1, 0),
            new Point3D(2, 2, 0),
            new Point3D(3, 2, 0),
            new Point3D(4, 2, 0),
        ]

        const result: Point3D[] | null = findPath(startPoint, goalPoint)

        // Ensure that result is not null
        expect(result).not.toBeNull()

        // Check if both arrays have the same length
        expect(result?.length).toBe(expectedPath.length)

        // Compare the elements in both arrays
        expect(result?.every((point, index) => (
            point.x === expectedPath[index]?.x &&
            point.y === expectedPath[index]?.y &&
            point.z === expectedPath[index]?.z
        ))).toBe(true)
    })

    test('should return true for a valid tile', (): void => {
        const tile: Point3D = new Point3D(5, 2, 0)

        const result: boolean = isValidTile(tile)

        expect(result).toBe(true)
    })
})
