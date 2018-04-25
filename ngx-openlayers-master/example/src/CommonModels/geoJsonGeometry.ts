export class GeoJsonGeometry{
    public type: string;
    public coordinates: Array<number[][]>;
    constructor(){
        this.coordinates = new Array<number[][]>();
    }
}