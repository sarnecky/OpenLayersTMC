import { GeoJsonGeometry } from "./geoJsonGeometry";
import { Polygon } from "./polygon";

export class GeoJsonPolygonGeometry extends GeoJsonGeometry {
    constructor(){
        super();
        this.type = "Polygon";
    }

    public addNewPolygon(polygon: Polygon){
        this.coordinates.push(polygon.Coordinates);
    }
}