import { MapContext } from "./Map";
import { useContext, useEffect, useState, useRef } from "react";

const defaultProps = {
  markerClickHandler: (id) => {},
  markerFocusHandler: (focused, id) => {},
  markerHoverHandler: (hovered, id) => {},
  markerStatusOptions: {},
}

export const Marker = ({ id, markerClickHandler, markerFocusHandler, markerHoverHandler, markerRenderer, markerStatusOptions }) => {
  const { map }  = useContext(MapContext);
  const marker = markerRenderer();

  const [pinStatus, setPinStatus] = useState(markerStatusOptions);
  const pinStatusRef = useRef({});
  pinStatusRef.current = pinStatus;

  const pinClickHandler = (id) => {
    markerClickHandler(id);
  };
  const pinHoverHandler = (hovered, id) => {
    markerHoverHandler(hovered, id);
  };
  const pinFocusHandler = (focused, id) => {
    markerFocusHandler(focused, id);
  };

  useEffect(() => {
    setPinStatus({ ...pinStatusRef.current, ...markerStatusOptions });
  }, [markerStatusOptions]);

  useEffect(() => {
    marker.setMap(map);
    marker.setClickHandler(() => { pinClickHandler(id) });
    marker.setHoverHandler((hovered) => { pinHoverHandler(hovered, id) });
    marker.setFocusHandler((focused) => { pinFocusHandler(focused, id) });

    return () => {
      marker.setMap(null);
    }
  }, []);

  useEffect(() => {
    if (marker) {
      marker.setStatus({...pinStatus});
    }
  }, [pinStatus]);
}

Marker.defaultProps = defaultProps;
