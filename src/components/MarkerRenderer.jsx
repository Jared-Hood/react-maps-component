import { PinProperties } from '@yext/components-tsx-maps';
import { pinDefault, pinHovered, pinSelected } from './MapPin';
import { useMemo, useState } from 'react';

const defaultProps = {
  height: 39,
  width: 33,
  icons: (index) => {
    return {
      'default': pinDefault({index: index}),
      'hovered': pinHovered({index: index}),
      'selected': pinSelected({index: index}),
    }
  }
}

export const markerRenderer = (props) => {
  const { height, width, icons, pinOptions } = props;
  const [marker2, setMarker2] = useState();

  useMemo(() => {
    pinOptions
      .withPropertiesForStatus(status => {
        return new PinProperties()
          .setIcon( status.selected ? 'selected' : status.hovered || status.focused ? 'hovered' : 'default')
          .setSRText(index)
          .setZIndex(status.selected ? 1 : status.hovered || status.focused ? 2 : 0)
          .setHeight(height)
          .setWidth(width);
      });

    Object.entries(icons(index)).forEach(([name, icon]) =>
      pinOptions.withIcon(name, icon)
    );

    setMarker2(pinOptions);
  }, []);

  return marker2;
}

markerRenderer.defaultProps = defaultProps;
