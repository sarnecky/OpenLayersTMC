import { Component, Output, EventEmitter, Input } from '@angular/core';
import ol from 'ol';
import Sphere from 'ol/sphere';
import Geometry from 'ol/geom/geometry';
import Style from 'ol/style/style';
import Stroke from 'ol/style/stroke';
import Circle from 'ol/style/circle';
import Fill from 'ol/style/fill';
import MultiPoint from 'ol/geom/multipoint';
import { Polygon } from "../../CommonModels/polygon";

@Component({
    selector: 'tmc-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent{
    public zoom = 7;
    public polygonName: string;
    public a: Sphere;
    public polygonStyle: Array<Style>;
    @Output() onPolygonCreated: EventEmitter<Polygon>;
    
    constructor(){
        this.polygonStyle = new Array<Style>();
        var firstStyle = new Style({
            stroke: new Stroke({
              color: 'blue',
              width: 3
            }),
            fill: new Fill({
              color: 'rgba(0, 0, 255, 0.1)'
            })
          });
        var secondStyle = new Style({
            image: new Circle({
              radius: 5,
              fill: new Fill({
                color: 'orange'
              })
            }),
            geometry: function(feature) {
              // return the coordinates of the first ring of the polygon
              var coordinates = feature.getGeometry().getCoordinates()[0];
              return new MultiPoint(coordinates);
            }
          })
        this.polygonName = "Polygon Seby hehe";
        this.onPolygonCreated = new EventEmitter<Polygon>();
        this.polygonStyle.push(firstStyle, secondStyle);
        
    }
    getPolygonSyle() : ol.style.Style{
        return this.polygonStyle;
    }
    catchDrawEndEvent(event){
        var polygon = event.feature.O.geometry;
        var distance = this.calculateDistance(polygon);
        console.log(distance);
        var polygonForEvent = new Polygon(null, distance, "blue");
        this.onPolygonCreated.emit(polygonForEvent)
    }

    calculateDistance(polygon: Geometry): number {
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