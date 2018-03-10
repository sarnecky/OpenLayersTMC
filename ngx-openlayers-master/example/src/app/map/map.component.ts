import {Component} from '@angular/core';
import ol from 'ol';
import Sphere from 'ol/sphere';
import Geometry from 'ol/geom/geometry';

@Component({
    selector: 'tmc-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent{
    public zoom = 7;

    catchEvent(event){
        var polygon = event.feature.O.geometry;
        console.log(this.calculateDistance(polygon));
    }

    calculateDistance(polygon: ol.geom.Geometry): number {
        console.log("calculate")
        console.log(polygon)
        var area = Sphere.getArea(polygon);
        var output;
        if(area > 10000){
            output = (Math.round(area/1000000 * 100) / 100) + ' km<sup>2</sup>'
        }
        else{
            output = (Math.round(area*100)/100)+ 'm<sup>2</sup>';
        }
        return output;
    }
} 