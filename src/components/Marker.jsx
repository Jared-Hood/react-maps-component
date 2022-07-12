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
export const Marker = (
  { mapId,
    coordinate,
    hideOffscreen,
    propertiesForStatus,
    zIndex,
    children,
    id,
    markerClickHandler,
    markerFocusHandler,
    markerHoverHandler,
    markerRenderer,
    markerStatusOptions,
  }
  ) => {
  const { map, provider }  = useContext(MapContext);

  const marker = useMemo(() => {
    if (children) {
      // If children passed then create a MapPin and render the children into the pin element
      // Only works for HTMLPins (Google, Mapbox, Bing, Baidu)
      return new MapPinOptions()
        .withCoordinate(coordinate)
        .withHideOffscreen(hideOffscreen)
        .withPropertiesForStatus(propertiesForStatus ? propertiesForStatus : () => new PinProperties())
        .withProvider(provider)
        .build();
    } else if (markerRenderer) {
      // Need to build here to avoid using useContent, useMemo inside of MarkerRender.jsx since
      // You can't use hooks inside of other hooks
      const markerRenderOptions = markerRenderer();
      return markerRenderOptions
        .withProvider(provider)
        .build();
    } else {
      console.error("Add children or pass a markerRender prop");
    }
    return null;
  }, []);

  useEffect(() => {
    if (!children || (zIndex !== 0 && !zIndex)) return;
    const markerWrapper = marker.getProviderPin().getWrapperElement();
    markerWrapper.style.zIndex = zIndex;
  }, [zIndex]);

  const pinClickHandler = (id) => {
    markerClickHandler(id);
  };
  const pinHoverHandler = (hovered, id) => {
    markerHoverHandler(hovered, id);
  };
  const pinFocusHandler = (focused, id) => {
    markerFocusHandler(focused, id);
  };

  // Setting the markerStatus will override any explicit zIndex that is passed
  // Only needed for markers using propertiesForStatus
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

  if (children) {
    const pinEl = marker.getProviderPin().getPinElement();
    return createPortal(children, pinEl);
  }
}

Marker.defaultProps = defaultProps;
