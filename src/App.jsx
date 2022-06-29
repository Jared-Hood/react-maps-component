import { Map } from './components/Map';
import { Marker } from './components/Marker';
import { MarkerRenderer } from './components/MarkerRenderer';
import { pinDefault, pinHovered, pinSelected } from './components/MapPin';
import './App.css'

import { GoogleMaps, PinProperties } from '@yext/components-tsx-maps';
import { useState } from 'react';

const locations = [
  {
    coordinate: { lat: 38.8974, lng: -77.0638 },
    id: '1'
  },
  {
    coordinate: { lat: 38.8954, lng: -77.0698 },
    id: '2'
  },
  {
    coordinate: { lat: 38.8984, lng: -77.0698 },
    id: '3'
  }
]

const iconsForEntity = (index) => ({
  default: pinDefault({index: index, backgroundColor: '#F46036'}),
  hovered: pinHovered({index: index, backgroundColor: '#2E294E'}),
  selected: pinSelected({index: index, backgroundColor: '#1B998B'})
});
const propertiesForStatus = (status) => {
  return new PinProperties()
    .setIcon(status.selected ? 'selected' : status.hovered || status.focused ? 'hovered' : 'default')
    .setZIndex(status.selected ? 1 : status.hovered || status.focused ? 2 : 0)
    .setHeight(status.selected ? 50 : 40)
    .setWidth(status.selected ? 50 : 40);
};
const markerStatusOptions = {
  selected: false,
  hovered: false,
  focused: false
};

// App here would be a LocationMap or LocatorMap component
function App() {
  // Save shared state for selected markers
  const [selectedMarkerId, setSelectedMarkerId] = useState('');

  // Set the state specific to these events
  // Each function is passed the setter and current state ref
  const markerClickHandler = (currentStatusState, setStatusState) => {
    setStatusState({...currentStatusState, selected: true });
  };
  const markerFocusHandler = (focused, currentStatusState, setStatusState) => {
    setStatusState({...currentStatusState, focused: focused });
  };
  const markerHoverHandler = (hovered, currentStatusState, setStatusState) => {
    setStatusState({...currentStatusState, hovered: hovered });
  };

  const singlePinClickHandler = () => {
    window.open('https://yext.com', '_blank');
  }

  return (
    <>
      <Map provider={GoogleMaps} clientKey={'gme-yextinc'} defaultCenter={{ lat: 38.8954, lng: -77.0698 }} defaultZoom={14}>
        {locations.map((location, index) => 
          <Marker key={location.id}
                  id={location.id}
                  index={index}
                  selectedMarkerId={selectedMarkerId}
                  setSelectedMarkerId={setSelectedMarkerId}
                  markerStatusOptions={markerStatusOptions}
                  markerClickHandler={markerClickHandler}
                  markerFocusHandler={markerFocusHandler}
                  markerHoverHandler={markerHoverHandler}
                  markerRenderer={ () => MarkerRenderer({ index: index, coordinate: location.coordinate, height: 40, width: 40, icons: iconsForEntity, propertiesForStatus: propertiesForStatus }) }
          />
        )}
      </Map>
      <Map provider={GoogleMaps} clientKey={'gme-yextinc'}>
        <Marker id={'123'}
                markerClickHandler={singlePinClickHandler}
                markerRenderer={() => MarkerRenderer({ coordinate: { lat: 38.8954, lng: -77.0698 }, provider: GoogleMaps, height: 40, width: 40, icons: () => { return {'default': pinDefault({})} } })}
        />
      </Map>
    </>
  )
}

export default App
