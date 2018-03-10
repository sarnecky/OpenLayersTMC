import { Component, Output, EventEmitter } from '@angular/core';
import { Polygon } from "../CommonModels/polygon";

@Component({
    selector: 'tmc-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent{
    public zoom = 7;
    catchPolygonCreatedEvent(event){
        console.log("received new polygon");
        console.log(event); 
    }
} 