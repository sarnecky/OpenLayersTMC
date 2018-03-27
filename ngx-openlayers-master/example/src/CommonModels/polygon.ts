import ol from 'ol';
import Sphere from 'ol/sphere';
import Geometry from 'ol/geom/geometry';
export class Polygon{
    constructor(
        geometry: ol.geom.Geometry,
        areaSurface: number,
        color: string,
        coordiantes: number[][])
    {
        this.Geometry = geometry;
        this.AreaSurface = areaSurface;
        this.Color = color;
        this.Coordinates = coordiantes;
    }
    public Geometry: ol.geom.Geometry;
    public Coordinates: number[][];
    public AreaSurface: number;
    public Color: string;
}