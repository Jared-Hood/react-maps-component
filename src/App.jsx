import { Map } from './components/Map';
import { Marker } from './components/Marker';
import { pinDefault, pinHovered, pinSelected } from './components/MapPin';
import './App.css'

import { GoogleMaps } from '@yext/components-tsx-maps';
import Clusterer from './components/Clusterer';

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

// Coud do something like this for each icon state
// So that .withPropertiesForStatus(() => {}) wouldn't need to be specified as a props
let completeIcons = (index) => {
  return {
    default: {
      icon: pinDefault({index: index, backgroundColor: '#F46036'}),
      height: 24,
      width: 24,
    },
    hovered: {
      icon: pinHovered({index: index, backgroundColor: '#2E294E'}),
      height: 24,
      width: 24
    },
    selected: {
      icon: pinSelected({index: index, backgroundColor: '#2E294E'}),
      height: 48,
      width: 48
    }
  }
}

const pinClick = () => {
  window.open('https://yext.com', '_blank')
}

function App() {
  return (
    <>
      <Map mapProvider={GoogleMaps} clientKey={'gme-yextinc'} defaultCenter={{ lat: 38.8954, lng: -77.0698 }} defaultZoom={14} setAutoBounds={true}>
        <Clusterer>
          {locations.map((location, index) => 
            <Marker key={location.id} id={location.id} index={index} coordinate={location.coordinate} height={40} width={40} icons={iconsForEntity}/>
          )}
        </Clusterer>
      </Map>
      <Map mapProvider={GoogleMaps} clientKey={'gme-yextinc'}>
        <Marker id={'123'} coordinate={{lat: 39.83, lng: -98.58}} height={80} width={80} pinClick={pinClick} />
      </Map>
    </>
  )
}

export default App
