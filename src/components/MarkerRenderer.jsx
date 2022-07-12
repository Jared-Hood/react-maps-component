import { PinProperties, MapPinOptions } from '@yext/components-tsx-maps';

const getDefaultProps = ({
  coordinate = { lat: 0, lng: 0},
  hideOffscreen = false,
  icons = {},
  index = null,
  propertiesForStatus = status => new PinProperties(),
}) => {
  return {
    coordinate,
    hideOffscreen,
    icons,
    index,
    propertiesForStatus,
  }
};

export const MarkerRenderer = (props) => {
  const defaultProps = getDefaultProps(props);
  const { coordinate, hideOffscreen, icons, index, propertiesForStatus } = defaultProps;
  const pinOptions = new MapPinOptions()
    .withCoordinate(coordinate)
    .withHideOffscreen(hideOffscreen)
    .withPropertiesForStatus(propertiesForStatus);
  Object.entries(icons(index)).forEach(([name, icon]) =>
    pinOptions.withIcon(name, icon)
  );

  return pinOptions;
}
