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
}
