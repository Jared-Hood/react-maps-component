import { PinProperties, MapPinOptions } from '@yext/components-tsx-maps';
import { useMemo } from 'react';

const getDefaultProps = ({
  coordinate = { lat: 0, lng: 0},
  hideOffscreen = false,
  icons = {},
  index = null,
  propertiesForStatus = status => new PinProperties(),
  provider = null,
}) => {
  return {
    coordinate,
    hideOffscreen,
    icons,
    index,
    propertiesForStatus,
    provider,
  }
};

export const MarkerRenderer = (props) => {
  const defaultProps = getDefaultProps(props);
  const { coordinate, hideOffscreen, icons, index, propertiesForStatus, provider } = defaultProps;

  const marker = useMemo(() => {
    const pinOptions = new MapPinOptions()
      .withCoordinate(coordinate)
      .withHideOffscreen(hideOffscreen)
      .withPropertiesForStatus(propertiesForStatus)
      .withProvider(provider);

    Object.entries(icons(index)).forEach(([name, icon]) =>
      pinOptions.withIcon(name, icon)
    );

    return pinOptions.build();
  }, []);

  return marker;
}
