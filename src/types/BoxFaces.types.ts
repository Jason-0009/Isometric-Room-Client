import PolygonGraphics from '@shared/PolygonGraphics'

export type FaceKey = 'top' | 'left' | 'right'
export type BoxFaces = Map<'top' | 'left' | 'right', PolygonGraphics | null>