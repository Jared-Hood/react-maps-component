import { MapContext } from "./Map";
import { useContext, useEffect, useMemo } from "react";
import {createPortal} from 'react-dom';
import { MapPinOptions, PinProperties } from "@yext/components-tsx-maps";

const defaultProps = {
  markerClickHandler: (id) => {},
  markerHoverHandler: (hovered, id) => {},
  markerFocusHandler: (focused, id) => {},
  markerStatusOptions: {},
}

// Marker can either take a renderer function or {coordiante, hideOffscreen, propertiesForStatus } to use createPortal
// On a html pin
export const Marker = ({ coordinate, hideOffscreen, propertiesForStatus, children, id, markerClickHandler, markerFocusHandler, markerHoverHandler, markerRenderer, markerStatusOptions }) => {
  const { map, provider }  = useContext(MapContext);
  // const marker = markerRenderer();
  const htmlMarker = useMemo(() => {
    return new MapPinOptions()
      .withCoordinate(coordinate)
      .withHideOffscreen(hideOffscreen)
      .withPropertiesForStatus(propertiesForStatus ? propertiesForStatus : () => new PinProperties())
      .withProvider(provider)
      .build();
  }, []);

  // todo: replace _pinEl with a getPinElement() function once created for HTMLProviderPin
  const pinEl = htmlMarker.getProviderPin()._pinEl;

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
    // marker.setStatus({ ...markerStatusOptions });
    htmlMarker.setStatus({ ...markerStatusOptions });
  }, [markerStatusOptions]);

  useEffect(() => {
    // marker.setMap(map);
    // marker.setClickHandler(() => { pinClickHandler(id) });
    // marker.setHoverHandler((hovered) => { pinHoverHandler(hovered, id) });
    // marker.setFocusHandler((focused) => { pinFocusHandler(focused, id) });
    htmlMarker.setMap(map);
    htmlMarker.setClickHandler(() => { pinClickHandler(id) });
    htmlMarker.setHoverHandler((hovered) => { pinHoverHandler(hovered, id) });
    htmlMarker.setFocusHandler((focused) => { pinFocusHandler(focused, id) });

    return () => {
      // marker.setMap(null);
      htmlMarker.setMap(null);
    }
  }, []);

  return createPortal(children, pinEl)
}

Marker.defaultProps = defaultProps;
