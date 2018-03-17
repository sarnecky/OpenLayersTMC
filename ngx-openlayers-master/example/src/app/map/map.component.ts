import { Component, Output, EventEmitter } from '@angular/core';
import ol from 'ol';
import Sphere from 'ol/sphere';
import Stroke from 'ol/style/stroke';
import Fill from 'ol/style/fill';
import Style from 'ol/style/style';
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

  catchDrawStartEvent(event) {
      console.log(event)
      let style =
          Style({
            stroke: new Stroke({
            color:'white',
            width: 10
          }),
          fill: new Fill({
            color:'green'
          })
        });
      event.feature.setStyle(style);
      console.log(event.feature.getStyle());
  }
}
