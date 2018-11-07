import * as React from 'react';
import {Subject} from "rxjs/internal/Subject";
import Button from '@material-ui/core/Button';
import NavigationIcon from '@material-ui/icons/Navigation';
import {EVENTS} from '../map/Map';

interface IMarkerProps {
    mapEventSubject: Subject<any>
}

const enum DIRECTION {
    UP = 'up',
    DOWN = 'down'
}

interface IMarkerState {
    style: object,
    visible: boolean,
    direction: string,
    polygon: string,
    coordinates: string
}

class MarkerComponent extends React.Component<IMarkerProps, IMarkerState> {

    readonly containerWidth = 400;
    readonly containerHeight = 400;
    readonly innerWidth = 200;

    private _mapEventSubject: Subject<any>;

    constructor(props: any) {
        super(props);
        this._mapEventSubject = props.mapEventSubject;

        this.state = {
            style: {
                top: 0,
                left: 0
            },
            visible: false,
            direction: DIRECTION.UP,
            polygon: '',
            coordinates: ''
        }
    }

    public componentDidMount(): void {
        this._mapEventSubject.subscribe((event: any) => {
            switch (event.type) {
                case EVENTS.MARKER_MOVED:
                    this.moveMarkerHandler(event.event);
                    break;
                case EVENTS.MARKER_REMOVED:
                    this.removeMarkerHandler();
                    break;
            }
        });
    }

    public render() {
        const getClass = (): string => "marker " + this.state.direction;
        return (
            this.state.visible ?
                <React.Fragment>
                    <style>
                        {`.marker.${this.state.direction}:hover{${this.state.polygon}`}
                    </style>
                    <div className={getClass()} style={this.state.style}>
                        <span>{this.state.coordinates}</span>
                        <Button variant="extendedFab" aria-label="Delete">
                            <NavigationIcon/>
                            Search
                        </Button>
                    </div>
                </React.Fragment>
                : null
        );
    }

    //
    // Handlers
    //

    private removeMarkerHandler() {
        this.setState({
            visible: false
        })
    }

    private moveMarkerHandler(event: any) {
        if (!event.pixel) return;

        const direction = (event.pixel.y < (this.containerHeight / 2)) ?
            DIRECTION.DOWN : DIRECTION.UP;

        let offsetX = 0;
        let middle = this.containerHeight / 2;
        let middleY = (direction === DIRECTION.UP) ? 0 : middle;
        let startY = (direction === DIRECTION.UP) ? middle : 0;
        if (event.pixel.x < this.innerWidth / 2 + 5) {
            offsetX = this.innerWidth / 2 + 5 - event.pixel.x;
        }
        let maxWidth = event.xa.view.innerWidth;
        if (event.pixel.x > (maxWidth - this.innerWidth/2 - 5)) {
            offsetX = (this.innerWidth/2 + 5 - (maxWidth - event.pixel.x)) * -1;
        }

        const polygon = `-webkit-clip-path : polygon(200px ${startY}px, 
                                                    ${300 + offsetX}px 100px, 
                                                    ${300 + offsetX}px ${middleY}px, 
                                                    ${100 + offsetX}px ${middleY}px, 
                                                    ${100 + offsetX}px 100px)`;

        const x = event.pixel.x - this.containerWidth / 2;
        let y = event.pixel.y - 8;
        if (direction === DIRECTION.UP) {
            y = y - this.containerHeight / 2 + 8;
        }

        this.setState({
            style: {
                left: x,
                top: y,
                paddingLeft: this.innerWidth / 2 + offsetX,
                paddingRight: this.innerWidth / 2 - offsetX
            },
            visible: true,
            direction: direction,
            polygon: polygon,
            coordinates: `${event.latLng.lat()} ${event.latLng.lng()}`
        })
    }
}

export default MarkerComponent;