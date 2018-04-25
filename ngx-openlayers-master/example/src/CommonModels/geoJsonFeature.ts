import { GeoJsonGeometry } from "./geoJsonGeometry";
import { Polygon } from "./polygon";
import { GeoJsonPolygonGeometry } from "./geoJsonPolygonGeometry";
import { GeoJsonProperties } from "./geoJsonProperties";

export class GeoJsonFeature{
    public type: string;
    public geometry: GeoJsonPolygonGeometry;
    public properties: GeoJsonProperties;
    constructor(){
        this.type = "Feature";
        this.geometry = new GeoJsonPolygonGeometry();
        this.properties = new GeoJsonProperties();
    }

    public addNewFeature(polygon: Polygon){
        this.geometry.addNewPolygon(polygon);
        this.properties.areaSurface = polygon.AreaSurface;
        this.properties.voivodeshipName = polygon.Voivodeship;
    }
}