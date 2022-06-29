import { useState, useRef, useEffect, createContext } from "react";
import { MapOptions } from "@yext/components-tsx-maps";

export const MapContext = createContext(null);

const defaultProps = {
  controlEnabled: true,
  defaultCenter: { lat: 39.83, lng: -98.58 },
  defaultZoom: 4,
  padding: { bottom: () => 50, left: () => 50, right: () => 50, top: () => 50 },
  panHandler: (previousBounds, currentBounds) => {},
  panStartHandler: currentBounds => {},
  provider: null,
  providerOptions: {},
  singlePinZoom: 14,
};

export const Map = (props) => {
  const { clientKey, apiKey, controlEnabled, defaultCenter, defaultZoom, padding, panHandler, panStartHandler, provider, providerOptions, singlePinZoom } = props;

  const mapWrapper = useRef();
	const [map, setMap] = useState();
  const [mapLoaded, setMapLoaded] = useState(false);

  // Controlled properties that need to update on user interaction
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(defaultZoom);

  // todo: move to another component
  const [selectedMarkerId, setSelectedMarkerId] = useState('');

  // Call user defined panHandler and set center state on map move
  const _panHandler = (previousBounds, currentBounds) => {
    panHandler(previousBounds, currentBounds);
    const centerCoordinate = currentBounds.getCenter();
    const centerLat = centerCoordinate.latitude;
    const centerLng = centerCoordinate.longitude;
    setCenter({ lat: centerLat, lng: centerLng });
  }

  // On center change get new zoom from map and set zoom state
  useEffect(() => {
    if (!mapLoaded || !map) return;
    const zoom = map.getZoom();
    setZoom(zoom);
  }, [center]);

  useEffect(() => {
		if (mapLoaded || map || !mapWrapper.current) return;
		loadMap();
		setMapLoaded(true);
	});

  const loadMap = () => {
		const providerName = provider.getProviderName();
		const loadOptions = providerName === 'Google' ? {client: clientKey} : {};

		provider.load(apiKey, {
			...loadOptions
		}).then(() => {
			const providerMap = new MapOptions()
        .withControlEnabled(controlEnabled)
        .withDefaultCenter(center)
        .withDefaultZoom(zoom)
        .withPadding(padding)
        .withPanHandler(_panHandler)
        .withPanStartHandler(panStartHandler)
        .withProvider(provider)
        .withProviderOptions(providerOptions)
        .withSinglePinZoom(singlePinZoom)
        .withWrapper(mapWrapper.current)
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

Map.defaultProps = defaultProps;
