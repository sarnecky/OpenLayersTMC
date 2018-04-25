import { GeoJsonGeometry } from "./geoJsonGeometry";
import { Polygon } from "./polygon";
import { GeoJsonPolygonGeometry } from "./geoJsonPolygonGeometry";
import { GeoJsonProperties } from "./geoJsonProperties";
import { GeoJsonFeature } from "./geoJsonFeature";

export class GeoJsonFeatureCollection{
    public type: string;
    public features: Array<GeoJsonFeature>;
    constructor(){
        this.type = "FeatureCollection";
        this.features = new Array<GeoJsonFeature>();
    }

    public createNewFeature(polygon: Polygon){
        var feature = new GeoJsonFeature();
        feature.addNewFeature(polygon);
        this.features.push(feature);
    }
}