import { Component, Output, EventEmitter } from '@angular/core';
import ol from 'ol';
import Sphere from 'ol/sphere';
import Geometry from 'ol/geom/geometry';
import { Polygon } from "../../CommonModels/polygon";

@Component({
    selector: 'tmc-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent{
    public zoom = 7;
    
    @Output() onPolygonCreated: EventEmitter<Polygon>;
    
    constructor(){
        this.onPolygonCreated = new EventEmitter<Polygon>();
    }

    catchDrawEndEvent(event){
        var polygon = event.feature.O.geometry;
        var distance = this.calculateDistance(polygon);
        console.log(distance);
        var polygonForEvent = new Polygon(null, distance, "blue");
        this.onPolygonCreated.emit(polygonForEvent)
    }

    calculateDistance(polygon: ol.geom.Geometry): number {
        console.log("calculate")
        console.log(polygon)
        var area = Sphere.getArea(polygon);
        var output;
        if(area > 10000){
            output = (Math.round(area/1000000 * 100) / 100) + " km"
        }
        else{
            output = (Math.round(area*100)/100)+ " m";
        }
        return output;
    }
} 