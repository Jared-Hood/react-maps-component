import './App.css'
import { Map } from './components/Map';
import { Marker } from './components/Marker';
import { pinDefault, pinHovered, pinSelected } from './components/MapPins';
import { Pin } from './components/Pin';

import { GoogleMaps, PinProperties, LeafletMaps, MapboxMaps, MapPinOptions } from '@yext/components-tsx-maps';
import { useState, useMemo } from 'react';

const locations = [
  {
    coordinate: { lat: 38.8974, lng: -77.0638 },
    id: '0'
  },
  {
    coordinate: { lat: 38.89511, lng: -77.07078 },
    id: '1'
  },
  {
    coordinate: { lat: 38.8984, lng: -77.0698 },
    id: '2'
  }
]
const defaultStyles = {
  position: 'absolute',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)'
}

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
    <div className='App'>
      <h2>Multiple Marker Map with Pin Component</h2>
      <Map provider={GoogleMaps} clientKey={'gme-yextinc'} defaultCenter={{ lat: 38.8954, lng: -77.0698 }} defaultZoom={14}>
        {locations.map((location, index) =>
          <Marker 
            key={location.id}
            id={location.id}
            index={index}
            markerClickHandler={markerClickHandler}
            markerFocusHandler={markerFocusHandler}
            markerHoverHandler={markerHoverHandler}
            coordinate={location.coordinate}
            hideOffscreen={false}
            zIndex={location.id === selectedMarkerId ? 1 : (location.id === focusedMarkerId || location.id === hoveredMarkerId) ? 2 : 0}
          >
            {
              location.id === selectedMarkerId ? <Pin height={70} width={70} backgroundColor={'#1B998B'} index={index} /> :
              (location.id === focusedMarkerId || location.id === hoveredMarkerId) ? <Pin height={39} width={33} backgroundColor={'#2E294E'} index={index} /> :
              <Pin height={39} width={33} backgroundColor={'#F46036'} index={index} />
            }
          </Marker>
        )}
      </Map>

      <h2>Multiple Marker Map with Pin Component and Custom Marker</h2>
      <Map provider={GoogleMaps} clientKey={'gme-yextinc'} defaultCenter={{ lat: 38.8954, lng: -77.0698 }} defaultZoom={14}>
        {locations.map((location, index) =>
          <CustomMarker
            key={location.id}
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
            coordinate={location.coordinate}
            hideOffscreen={false}
          />
        )}
      </Map>

      <h2>Multiple Marker Map with MapPinOptions</h2>
      <Map provider={LeafletMaps} apiKey={'pk.eyJ1IjoieWV4dCIsImEiOiJqNzVybUhnIn0.hTOO5A1yqfpN42-_z_GuLw'} defaultCenter={{ lat: 38.8954, lng: -77.0698 }} defaultZoom={14}>
        {locations.map((location, index) => 
          <Marker
            key={location.id}
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
            mapPinOptions={
              new MapPinOptions()
                .withCoordinate(location.coordinate)
                .withHideOffscreen(false)
                .withIcon("default", pinDefault({index: index, backgroundColor: '#F46036'}))
                .withIcon("hovered", pinHovered({index: index, backgroundColor: '#2E294E'}))
                .withIcon("selected", pinSelected({index: index, backgroundColor: '#1B998B'}))
                .withPropertiesForStatus(
                  status => new PinProperties()
                    .setIcon(status.selected ? 'selected' : status.hovered || status.focused ? 'hovered' : 'default')
                    .setZIndex(status.selected ? 1 : status.hovered || status.focused ? 2 : 0)
                    .setHeight(status.selected ? 50 : 40)
                    .setWidth(status.selected ? 50 : 40)
                )
            }
          />
        )}
      </Map>

      <h2>Single Marker Map with svg</h2>
      <Map provider={GoogleMaps} clientKey={'gme-yextinc'} defaultCenter={{ lat: 38.8954, lng: -77.0698 }}>
        <Marker
          id={'123'}
          markerClickHandler={singlePinClickHandler}
          coordinate={{ lat: 38.8954, lng: -77.0698 }}
          hideOffscreen={false}
        >
          <svg width="30" height="48" fill="#F46036" viewBox="0 0 30 38" style={{...defaultStyles, cursor: "pointer"}}>
            <path x="50%" y="40%" d="M30 15.0882C30 23.4212 23.3333 30.7353 15 38C7.22222 31.2941 0 23.4212 0 15.0882C0 6.75523 6.71573 0 15 0C23.2843 0 30 6.75523 30 15.0882Z"/>	
          </svg>
        </Marker>
      </Map>

      <h2>Single Marker Map with mapPinOptions</h2>
      <Map provider={LeafletMaps} apiKey={'pk.eyJ1IjoieWV4dCIsImEiOiJqNzVybUhnIn0.hTOO5A1yqfpN42-_z_GuLw'} defaultCenter={{ lat: 38.8954, lng: -77.0698 }}>
        <Marker
          id={'123'}
          markerClickHandler={singlePinClickHandler}
          mapPinOptions={
            new MapPinOptions()
              .withCoordinate({ lat: 38.8954, lng: -77.0698 })
              .withHideOffscreen(false)
              .withIcon("default", pinDefault({}))
          }
        />
      </Map>

      <h2>Multiple Marker Map with CustomPin Component</h2>
      <Map provider={GoogleMaps} clientKey={'gme-yextinc'} defaultCenter={{ lat: 38.8954, lng: -77.0698 }} defaultZoom={14}>
        {locations.map((location, index) =>
          <Marker 
            key={location.id}
            id={location.id}
            index={index}
            markerClickHandler={markerClickHandler}
            markerFocusHandler={markerFocusHandler}
            markerHoverHandler={markerHoverHandler}
            coordinate={location.coordinate}
            hideOffscreen={false}
            zIndex={location.id === selectedMarkerId ? 1 : (location.id === focusedMarkerId || location.id === hoveredMarkerId) ? 2 : 0}
          >
            {
              location.id === selectedMarkerId ? <CustomPin height={70} width={70} backgroundColor={'#1B998B'} index={index} /> :
              (location.id === focusedMarkerId || location.id === hoveredMarkerId) ? <CustomPin height={39} width={33} backgroundColor={'#2E294E'} index={index} /> :
              <CustomPin height={39} width={33} backgroundColor={'#F46036'} index={index} />
            }
          </Marker>
        )}
      </Map>
    </div>
  )
}

function CustomPin(props) {
  const {index, height, width, backgroundColor, textColor} = props;
  return (
    <svg width={width} height={height} fill={backgroundColor ? backgroundColor : 'red'} viewBox="0 0 30 38" style={defaultStyles}>
      <path x="50%" y="40%" d="M30 15.0882C30 23.4212 23.3333 30.7353 15 38C7.22222 31.2941 0 23.4212 0 15.0882C0 6.75523 6.71573 0 15 0C23.2843 0 30 6.75523 30 15.0882Z"/>
      <text x="50%" y="40%" fontSize="16px" fontWeight="bold" dominantBaseline="middle" textAnchor="middle" fill={textColor ? textColor : 'white'}>{index}</text>		
    </svg>
  );
}

function CustomMarker(props) {
  const {markerStatusOptions, ...rest} = props;
  const { selected, hovered, focused } = markerStatusOptions;
  return (
    <Marker {...rest} zIndex={ selected ? 1 : hovered || focused ? 2 : 0}>
      <Pin
        height={selected ? 70 : 39}
        width={selected ? 70 : 33}
        backgroundColor={selected ? '#1B998B' : hovered || focused ? '#2E294E' : '#F46036'}
        index={props.index}
      />
    </Marker>
  )
}

export default App
