import * as React from 'react';

interface IMapProps {
    mountedCallback: Function
}

class MapComponent extends React.PureComponent<IMapProps, {}> {

    constructor(props:IMapProps) {
        super(props);
    }

    public componentDidMount(): void {
        const el:HTMLScriptElement = document.getElementById("gMap") as HTMLScriptElement;
        this.props.mountedCallback(el);
    }

    public render() {
        return (
            <div id="gMap" />
        );
    }
}

export default MapComponent;