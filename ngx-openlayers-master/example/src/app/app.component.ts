import { Component, Output, EventEmitter } from '@angular/core';
import { Polygon } from "../CommonModels/polygon";
import { getJSON } from 'jquery'
import ol from 'ol';
import Vector from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import proj from 'ol/proj';
import VectorL from 'ol/layer/Vector'
import OL3Parser from "../../node_modules/jsts/org/locationtech/jts/io/OL3Parser";
import GeometryFactory from "../../node_modules/jsts/org/locationtech/jts/geom/GeometryFactory";

@Component({
    selector: 'tmc-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent{
    public zoom = 7;
    public polygons: Array<Polygon>
    constructor(){
        this.polygons = new Array<Polygon>();

    }
    catchPolygonCreatedEvent(event){
        console.log("received new polygon");
        console.log(event);
        // console.log("received new polygon");
        // console.log(event);
        this.polygons.push(event);
        // var reader = new OL3Parser(new GeometryFactory(),ol);
        // reader.extend();
        // if(this.polygons.length>1) {
        //   var one = reader.read(this.polygons[0].Geometry);
        //   var two = reader.read(this.polygons[1]);
        //   var union = one.union(two);
        //
        //   console.log(union.Geometry);


        //this.createLayerVoiv();
        }
    createLayerVoiv() {
      var geo = new GeoJSON();
      var features = 0;
      var feat = geo.readFeatures(features);
      console.log(feat[0].values_);

      var arrayOfCoordinates = feat[0].values_.geometry.flatCoordinates;
      var coordinates = [];
      for(var i=0; i<arrayOfCoordinates.length;i+=2)
      {
        var index = i;
        var lonlat = proj.transform([arrayOfCoordinates[index],arrayOfCoordinates[++index]], 'EPSG:3857', 'EPSG:4326');
        var lon = lonlat[0]*16;
        var lat = lonlat[1]*16;
        coordinates.push([lon, lat])
      }
      console.log(event);
      var cord = [[18, 52], [20, 52], [20, 56], [18, 52]];
      var polygonForEvent = new Polygon(null, null, "red", cord);
      this.polygons.push(polygonForEvent);

      console.log(this.polygons);
    }
        //this.maxArea += this.convertArea(event.AreaSurface);
}
