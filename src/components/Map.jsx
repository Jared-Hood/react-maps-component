import { useState, useRef, useEffect, createContext } from "react";
import { MapOptions } from "@yext/components-tsx-maps";

/**
 * Create a controlled component that uses the components-maps as an interface to the various map provider apis.
 */

export const MapContext = createContext(null);

export const Map = (props) => {
  const { mapProvider, clientKey, apiKey, defaultCenter, defaultZoom, setAutoBounds } = props;

  const mapWrapper = useRef();
	const [map, setMap] = useState();
  const [mapLoaded, setMapLoaded] = useState(false);

  const [selectedMarkerId, setSelectedMarkerId] = useState('');

  // todo: Need to get center and zoom from map api events in order to update state
  const [center, setCenter] = useState(defaultCenter ? defaultCenter : {lat: 39.83, lng: -98.58})
  const [zoom, setZoom] = useState(defaultZoom ? defaultZoom : 4);

  useEffect(() => {
		if (mapLoaded || map) return;
		loadMap();
		setMapLoaded(true);
	});

  const loadMap = () => {
		if (!mapWrapper.current) return;

		const mapProviderName = mapProvider.getProviderName();
		const loadOptions = mapProviderName === 'Google' ? {client: clientKey} : {};

		mapProvider.load(apiKey, {
			...loadOptions
		}).then(() => {
			const providerMap = new MapOptions()
        .withProvider(mapProvider)
        .withWrapper(mapWrapper.current)
        .withDefaultCenter(center)
        .withDefaultZoom(zoom)
        .build();
			setMap(providerMap);
		});
	}

  return (
    <div className="dir-map" id="map" ref={mapWrapper} style={{'height': 500}}>
        {map && (
          <MapContext.Provider value={{
            map: map,
            selectedMarkerId: selectedMarkerId,
            setSelectedMarkerId: setSelectedMarkerId
          }}>
            {props.children}
          </MapContext.Provider>
        )}
    </div>
  )
}
