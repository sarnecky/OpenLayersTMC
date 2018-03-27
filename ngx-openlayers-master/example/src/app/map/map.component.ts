import { Component, Output, EventEmitter } from '@angular/core';
import ol from 'ol';
import Sphere from 'ol/sphere';
import Stroke from 'ol/style/stroke';
import Fill from 'ol/style/fill';
import Style from 'ol/style/style';
import { Polygon } from "../../CommonModels/polygon";
import Feature from 'ol/feature';
import proj from 'ol/proj';
@Component({
    selector: 'tmc-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent{
    public zoom = 7;
    public colors: Array<string>;
    public polygons: Array<Polygon>;
    public colorForPolygon: string;
    @Output() onPolygonCreated: EventEmitter<Polygon>;

    constructor(){
        this.colors = new Array<string>();
        this.colors = ['red', 'green', 'blue', 'yellow', 'black', 'pink'];
        this.colorForPolygon = this.colors[0];
        this.onPolygonCreated = new EventEmitter<Polygon>();
        this.polygons = new Array<Polygon>();
    }
      catchDrawEndEvent(event){
        var polygon = event.feature.O.geometry;
        var arrayOfCoordinates = polygon.A;
        var coordinates = [];
        for(var i=0; i<arrayOfCoordinates.length;i+=2)
        {
            var index = i;
            var lonlat = proj.transform([arrayOfCoordinates[index],arrayOfCoordinates[index++]], 'EPSG:3857', 'EPSG:4326');
            var lon = lonlat[0];
            var lat = lonlat[1];
            coordinates.push([lon, lat])
        }
        console.log(event);
        var distance = this.calculateDistance(polygon);
        var polygonForEvent = new Polygon(null, distance, "blue", coordinates);
        this.polygons.push(polygonForEvent);
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

    catchDrawStartEvent(event) {
        // console.log(event)
        // let style =
        //     new Style({
        //         stroke: new Stroke({
        //         color:'white',
        //         width: 10
        //     }),
        //     fill: new Fill({
        //         color:'blue'
        //     })
        // });
       //// this.setFeature(event.feature, style);
       var index = Math.floor(Math.random()*this.colors.length-1)+0;
       console.log("index:" + index + ", color: " + this.colors[index]);
       this.colorForPolygon = this.colors[index];
    }

    setFeature(feature: Feature, style:Array<Style>){
        var array = new Array<Style>();
        array.push(style);
        feature.setStyle(array)
       // console.log(feature.getStyle());
       //
    }
}
