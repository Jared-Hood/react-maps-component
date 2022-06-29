import { MapContext } from "./Map";
import { useContext, useEffect, useState, useRef } from "react";

const defaultProps = {
  markerClickHandler: (currentStatusState, setStatusState) => {},
  markerFocusHandler: (focused, currentStatusState, setStatusState) => {},
  markerHoverHandler: (hovered, currentStatusState, setStatusState) => {},
  markerStatusOptions: {},
}

export const Marker = ({ id, markerClickHandler, markerFocusHandler, markerHoverHandler, markerRenderer, markerStatusOptions }) => {
  const { map }  = useContext(MapContext);
  const marker = markerRenderer();

  const [pinStatus, setPinStatus] = useState(markerStatusOptions);
  const pinStatusRef = useRef({});
  pinStatusRef.current = pinStatus;

  const pinClickHandler = (id) => {
    markerClickHandler(pinStatusRef.current, setPinStatus);
  };
  const pinHoverHandler = (hovered) => {
    markerHoverHandler(hovered, pinStatusRef.current, setPinStatus);
  };
  const pinFocusHandler = (focused) => {
    markerFocusHandler(focused, pinStatusRef.current, setPinStatus);
  }

  useEffect(() => {
    setPinStatus({...pinStatusRef.current, ...markerStatusOptions})
  }, [markerStatusOptions])

  useEffect(() => {
    marker.setMap(map);
    marker.setClickHandler(() => { pinClickHandler(id) });
    marker.setHoverHandler((hovered) => { pinHoverHandler(hovered) });
    marker.setFocusHandler((focused) => { pinFocusHandler(focused) });

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
