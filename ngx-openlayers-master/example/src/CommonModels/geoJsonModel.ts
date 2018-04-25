import { GeoJsonGeometry } from "./geoJsonGeometry";
import { Polygon } from "./polygon";
import { GeoJsonPolygonGeometry } from "./geoJsonPolygonGeometry";

export class GeoJsonModel{
    public type: string;
    public geometry: GeoJsonPolygonGeometry;
    constructor(){
        this.type = "Feature";
        this.geometry = new GeoJsonPolygonGeometry();
    }

    updateGeometry(polygon: Polygon){
        this.geometry.addNewPolygon(polygon);
    }
}