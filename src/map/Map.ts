import {} from "googlemaps";
import {Subject} from 'rxjs';

interface ILatLng {
    lat: number;
    lng: number;
}

export const enum EVENTS {
    MARKER_MOVED = "MARKER_MOVED",
    MARKER_REMOVED = "MARKER_REMOVED"
}

export class Map {

    readonly _mapEventSubject: Subject<any>;
    private _map: google.maps.Map;
    private _marker: google.maps.Marker | null;

    constructor() {
        this._mapEventSubject = new Subject();
    }

    //
    // Public methods
    //

    public get mapEventSubject() {
        return this._mapEventSubject;
    }

    public addToStage(el:HTMLScriptElement) {
        const SAINT_BASIL = {
            lat: 55.752496,
            lng: 37.623130
        };

        const params = {
            disableDefaultUI: true,
            zoom: 15,
            center: SAINT_BASIL
        };

        this._map = new google.maps.Map(el, params);
        this._map.addListener('click', (event:any) => this.setMarker(event));
        this._map.addListener('drag', () => this.deleteMarker());
        this._map.addListener('zoom_changed', () => this.deleteMarker());
        this._map.addListener('center_changed', () => this.deleteMarker());
    }

    //
    // Private methods
    //

    private deleteMarker() {
        if (this._marker)
            this._marker.setMap(null);
        this._marker = null;

        // push to stream
        this._mapEventSubject.next({type: EVENTS.MARKER_REMOVED, event: null});
    }

    private setMarker(event:any) {
        const point:ILatLng = event.latLng;
        if (this._marker) {
            this._marker.setPosition(point);
        } else {
            this._marker = new google.maps.Marker({
                position: point,
                map: this._map,
                icon: 'dot.png'
            });
        }

        // push to stream
        this._mapEventSubject.next({type: EVENTS.MARKER_MOVED, event: event});
    }
}