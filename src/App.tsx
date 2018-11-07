import CssBaseline from '@material-ui/core/CssBaseline';
import * as React from 'react';
import './App.css';
import MapComponent from './map/MapComponent';
import {Map} from './map/Map';
import MarkerComponent from './marker/MarkerComponent';


class App extends React.Component {

    private _map:Map;

    constructor(props:any) {
        super(props);
    }

    public componentWillMount(): void {
        this._map = new Map();
    }

    public mapContainerMountedHandler = (el:HTMLScriptElement) => {
        this._map.addToStage(el)
    };

    public render() {
        return (
        <React.Fragment>
            <CssBaseline />
            <header>
                <h1 className="title">Custom Marker</h1>
            </header>
            <MapComponent mountedCallback={this.mapContainerMountedHandler}/>
            <MarkerComponent mapEventSubject={this._map.mapEventSubject}/>
            <footer/>
        </React.Fragment>
    );
  }
}

export default App;
