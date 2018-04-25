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
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GeoJsonFeature } from "../CommonModels/geoJsonFeature";
import { GeoJsonFeatureCollection } from "../CommonModels/geoJsonFeatureCollection";
@Component({
    selector: 'tmc-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent{
    public zoom = 7;
    public polygons: Array<Polygon>
    public fileToDownload: boolean;
    public downloadJsonHref: SafeUrl;
    private _sanitizer: DomSanitizer;
    public geoJsonFeatureCollection: GeoJsonFeatureCollection;

    constructor(private sanitizer: DomSanitizer){
        this._sanitizer = sanitizer;
        this.fileToDownload = false;
        this.polygons = new Array<Polygon>();
        this.geoJsonFeatureCollection = new GeoJsonFeatureCollection();
    }

    generateDownloadJsonUri(objectToJson: any){
        var cache = [];
        var json = JSON.stringify(objectToJson, function(key, value) {
          if (typeof value === 'object' && value !== null) {
              if (cache.indexOf(value) !== -1) {
                  // Circular reference found, discard key
                  return;
              }
              // Store value in our collection
              cache.push(value);
          }
          return value;
        });

        var uri = this._sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8,"+ encodeURIComponent(json));
        this.downloadJsonHref = uri;
        this.fileToDownload = true;
    }

    catchPolygonCreatedEvent(event){
        console.log("received new polygon");
        console.log(event);
        this.updateGeoJsonModel(event);
        this.polygons.push(event);
        this.generateDownloadJsonUri(this.geoJsonFeatureCollection);
    }

    updateGeoJsonModel(polygon: Polygon){
        this.geoJsonFeatureCollection.createNewFeature(polygon);
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
      var polygonForEvent = new Polygon(null, null, "red", cord,"");
      this.polygons.push(polygonForEvent);

      console.log(this.polygons);
    }
        //this.maxArea += this.convertArea(event.AreaSurface);
}
