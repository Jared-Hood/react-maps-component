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
  {
    children,
    coordinate,
    hideOffscreen,
    id,
    markerClickHandler,
    markerFocusHandler,
    markerHoverHandler,
    markerStatusOptions, // Only pass when using propertiesForStatus so MapPin can update
    mapPinOptions,
    propertiesForStatus, // Only if needed for specific functionality
    zIndex,
  }
  ) => {
  const { map, provider }  = useContext(MapContext);

  const marker = useMemo(() => {
    if (children) {
      return new MapPinOptions()
        .withCoordinate(coordinate)
        .withHideOffscreen(hideOffscreen)
        .withPropertiesForStatus(propertiesForStatus ? propertiesForStatus : () => new PinProperties())
        .withProvider(provider)
        .build();
    } else if (mapPinOptions) {
        return mapPinOptions
          .withProvider(provider)
          .build();
    } else {
      console.error("Add children or pass a mapPinOptions prop");
    }
    return null;
  }, []);

  useEffect(() => {
    if (zIndex !== 0 && !zIndex) return;
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
  // Only needed for markers using propertiesForStatus, where zIndex should be set
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
