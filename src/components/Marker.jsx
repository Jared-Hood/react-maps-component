import { MapContext } from "./Map";
import { pinDefault} from './MapPin';
import { useContext, useEffect, useMemo, useState, useRef } from "react";
import { PinProperties } from '@yext/components-tsx-maps';

const defaultIcons = (index) => {
  return {
    'default': pinDefault({index: index}),
    'hovered': pinDefault({index: index}),
    'selected': pinDefault({index: index})
  }
};

export const Marker = ({ id, index, coordinate, height, width, icons, pinClick }) => {
  const { map, selectedMarkerId, setSelectedMarkerId }  = useContext(MapContext);
  const [pinHeight, setpinHeight] = useState(height ? height : 39);
  const [pinWidth, setpinWidth] = useState(width ? width : 33);
  const pinIcons = icons ? icons : defaultIcons;

  const [pinStatus, setPinStatus] = useState({
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
  
  // useMemo here? like https://github.com/visgl/react-map-gl/blob/7.0-release/src/components/marker.ts#L91
  // For click, hover, and focus I think the event handlers should be moved to here for the
  // HTMLProviderPin classes, which include MapBox, Google

  const marker = useMemo(() => {
    const pinOptions = map.newPinOptions()
      .withCoordinate(coordinate)
      .withPropertiesForStatus(status => {
        return new PinProperties()
          .setIcon( status.selected ? 'selected' : status.hovered || status.focused ? 'hovered' : 'default')
          .setSRText(index)
          .setZIndex(status.selected ? 1 : status.hovered || status.focused ? 2 : 0)
          .setHeight(pinHeight)
          .setWidth(pinWidth);
      });

    Object.entries(pinIcons(index)).forEach(([name, icon]) =>
      pinOptions.withIcon(name, icon)
    );

    return pinOptions.build();
  }, []);

  useEffect(() => {
    marker.setMap(map);
    marker.setClickHandler(() => { pinClickHandler() });
    marker.setHoverHandler((hovered) => { pinHoverHandler(hovered) });
    marker.setFocusHandler((focused) => { pinFocusHandler(focused) });
  }, []);

  useEffect(() => {
    if (marker) {
      marker.setStatus({...pinStatus});
    }
  }, [pinStatus]);
}