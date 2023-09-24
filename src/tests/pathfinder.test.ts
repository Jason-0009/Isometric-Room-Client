import Pathfinder from '../pathfinding/Pathfinder'
import Point3D from '../utils/Point3D'

describe('Pathfinder', () => {
    const grid = [
        [0, 1, 0, 0, 0],
        [0, -1, 0, -1, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 0, -1, 0],
        [0, 0, 0, 1, 0],
    ]

    const startPoint = new Point3D(0, 0, 0)
    const goalPoint = new Point3D(4, 4, 0)

    const pathfinder = new Pathfinder(grid)

    it('should find a valid path', () => {
        const path = pathfinder.findPath(startPoint, goalPoint)

        // Define the expected path based on your grid
        const expectedPath = [
            new Point3D(0, 0, 0),
            new Point3D(1, 0, 0),
            new Point3D(2, 1, 0),
            new Point3D(3, 2, 0),
            new Point3D(4, 3, 0),
            new Point3D(4, 4, 0)
        ]

        // Assert that a valid path is found (not null)
        expect(path).not.toBeNull()

        // Assert that the returned path matches the expected path
        expect(path?.toString()).toEqual(expectedPath.toString())
    })
})
