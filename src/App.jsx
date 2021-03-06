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

// App here would be a LocationMap or LocatorMap component
function App() {
  // Save shared state for selected markers
  const [selectedMarkerId, setSelectedMarkerId] = useState('');
  const [focusedMarkerId, setFocusedMarkerId] = useState('');
  const [hoveredMarkerId, setHoveredMarkerId] = useState('');


  const markerClickHandler = (id) => {
    setSelectedMarkerId(id);
  };
  const markerFocusHandler = (focused, id) => {
    setFocusedMarkerId(focused ? id: '')
  };
  const markerHoverHandler = (hovered, id) => {
    setHoveredMarkerId(hovered ? id : '');
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
                  markerStatusOptions={{
                    selected: location.id === selectedMarkerId,
                    focused: location.id === focusedMarkerId,
                    hovered: location.id === hoveredMarkerId,
                  }}
                  markerClickHandler={markerClickHandler}
                  markerFocusHandler={markerFocusHandler}
                  markerHoverHandler={markerHoverHandler}
                  markerRenderer={ () => MarkerRenderer({ coordinate: location.coordinate, icons: iconsForEntity, index: index, propertiesForStatus: propertiesForStatus }) }
          />
        )}
      </Map>
      <Map provider={GoogleMaps} clientKey={'gme-yextinc'}>
        <Marker id={'123'}
                markerClickHandler={singlePinClickHandler}
                markerRenderer={() => MarkerRenderer({ coordinate: { lat: 38.8954, lng: -77.0698 }, icons: () => { return {'default': pinDefault({})} } })}
        />
      </Map>
    </>
  )
}

export default App
