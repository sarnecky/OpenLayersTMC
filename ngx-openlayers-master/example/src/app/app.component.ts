import { Component, Output, EventEmitter } from '@angular/core';
import { Polygon } from "../CommonModels/polygon";

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
        this.polygons.push(event);
    }
} 