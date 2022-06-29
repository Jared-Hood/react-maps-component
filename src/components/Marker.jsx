import { MapContext } from "./Map";
import { useContext, useEffect, useState, useRef } from "react";

const defaultProps = {
  markerClickHandler: () => {},
  markerFocusHandler: (focused) => {},
  markerHoverHandler: (hovered) => {},
}

export const Marker = ({ id, markerClickHandler, markerFocusHandler, markerHoverHandler, markerRenderer }) => {
  const { map, selectedMarkerId, setSelectedMarkerId }  = useContext(MapContext);
  const marker = markerRenderer();

  // todo: pass through status prop instead of declaring here
  const [pinStatus, setPinStatus] = useState({
    selected: false,
    hovered: false,
    focused: false
  });
  const pinStatusRef = useRef({});
  pinStatusRef.current = pinStatus;

  const pinClickHandler = () => {
    setPinStatus({ ...pinStatusRef.current, selected: true });
    setSelectedMarkerId(id);
    markerClickHandler();
  };
  const pinHoverHandler = (hovered) => {
    setPinStatus({ ...pinStatusRef.current, hovered: hovered });
    markerHoverHandler(hovered);
  };
  const pinFocusHandler = (focused) => {
    setPinStatus({ ...pinStatusRef.current, focused: focused });
    markerFocusHandler(focused);
  }

  useEffect(() => {
    if (id !== selectedMarkerId) {
      setPinStatus({ ...pinStatusRef.current, selected: false });
    } else if (id === selectedMarkerId) {
      setPinStatus({ ...pinStatusRef.current, selected: true });
    }
  }, [selectedMarkerId])

  useEffect(() => {
    marker.setMap(map);
    marker.setClickHandler(() => { pinClickHandler() });
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
