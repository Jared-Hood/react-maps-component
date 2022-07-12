- You can pass MapPinOptions to the marker instead of going through markerRenderer since at the end of the day all markerRenderer is doing is returning a MapPin
- You can't pass a MapPin because that requires a provider being loaded, which is already loaded by the Map Component. So you just set all the options and then Marker will build it.
-  Setting the markerStatus will override any explicit zIndex that is passed Only needed for markers using propertiesForStatus
- The leaflet provider has a bug with the pin zIndexs explained here: https://github.com/Leaflet/Leaflet/issues/5560
- You only need the markerStatusOptions if you are relying on the map api to update the pin for you. Otherwise setting the pin icon and zIndex is enough
- When using MapPinOptions().withIcon(name, icon), the icon param needs to be a URL or data URI. To get a data uri from a svg you can use the function in the Helper methods.
- Some default styles need to be applied to any Marker children that are rendered with React to get them to align in the correct position with their parent wrapper (actually second parent):
  - const defaultStyles = {
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)'
    }
- Using a CustomPin and a CustomMarker makes it easier to deal with state changes since they are just passed in as props


- Add typescript warning when passing zIndex and markerStatusOptions