import { MapContext } from "./Map";
import { pinDefault} from './MapPin';
import { useContext, useEffect, useMemo, useState, useRef } from "react";
import { MapPinOptions, PinProperties } from '@yext/components-tsx-maps';

const defaultProps = {
  coordinate: { lat: 0, lng: 0},
  height: 39,
  hideOffscreen: false,
  icons: (index) => {
    return {
      'default': pinDefault({index: index}),
      'hovered': pinDefault({index: index}),
      'selected': pinDefault({index: index})
    }
  },
  propertiesForStatus: status => new PinProperties(),
  provider: null,
  width: 33,
}

const renderMarker = (coordinate, icons, index, height, hideOffscreen, provider, width) => {
  const pinOptions = new MapPinOptions()
    .withCoordinate(coordinate)
    .withHideOffscreen(hideOffscreen)
    .withPropertiesForStatus(status => {
      return new PinProperties()
        .setIcon( status.selected ? 'selected' : status.hovered || status.focused ? 'hovered' : 'default')
        .setSRText(index)
        .setZIndex(status.selected ? 1 : status.hovered || status.focused ? 2 : 0)
        .setHeight(height)
        .setWidth(width);
    })
    .withProvider(provider);

  Object.entries(icons(index)).forEach(([name, icon]) =>
    pinOptions.withIcon(name, icon)
  );

  return pinOptions.build();
}

export const Marker = ({ coordinate, height, hideOffscreen, icons, id, index, width, pinClick }) => {
  const { map, provider, selectedMarkerId, setSelectedMarkerId }  = useContext(MapContext);

  // useMemo here? like https://github.com/visgl/react-map-gl/blob/7.0-release/src/components/marker.ts#L91
  const marker = useMemo(() => {
    return renderMarker(coordinate, icons, index, height, hideOffscreen, provider, width);
  }, []);

  const [pinStatus, setPinStatus] = useState({  // pass through status prop instead of declaring here
    selected: false,
    hovered: false,
    focused: false
  });
  // I believe this is necessary since the click events come from the map api
  // which will only use the default state.
  const pinStatusRef = useRef({});
  pinStatusRef.current = pinStatus;

  const pinClickHandler = () => {
    setPinStatus({ ...pinStatusRef.current, selected: true });
    if (pinClick) {
      pinClick();
    }
    setSelectedMarkerId(id);
  };
  const pinHoverHandler = (hovered) => {
    setPinStatus({ ...pinStatusRef.current, hovered: hovered });
  };
  const pinFocusHandler = (focused) => {
    setPinStatus({ ...pinStatusRef.current, focused: focused });
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