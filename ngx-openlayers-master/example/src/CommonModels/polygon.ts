import ol from 'ol';
import Sphere from 'ol/sphere';
import Geometry from 'ol/geom/geometry';
export class Polygon{
    constructor(
        geometry: ol.geom.Geometry,
        areaSurface: number,
        color: string)
    {
        this.Geometry = geometry;
        this.AreaSurface = areaSurface;
        this.Color = color;
    }
    public Geometry: ol.geom.Geometry;
    public AreaSurface: number;
    public Color: string;
}