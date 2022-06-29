import { MapContext } from "./Map";
import { useContext, useEffect } from "react";

const defaultProps = {
  markerClickHandler: (id) => {},
  markerHoverHandler: (hovered, id) => {},
  markerFocusHandler: (focused, id) => {},
  markerStatusOptions: {},
}

export const Marker = ({ id, markerClickHandler, markerFocusHandler, markerHoverHandler, markerRenderer, markerStatusOptions }) => {
  const { map }  = useContext(MapContext);
  const marker = markerRenderer();

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
    marker.setStatus({ ...markerStatusOptions });
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
}

Marker.defaultProps = defaultProps;
