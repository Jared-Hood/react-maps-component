import { Map } from './components/Map';
import { Marker } from './components/Marker';
import { pinDefault, pinHovered, pinSelected } from './components/MapPin';
import './App.css'

import { GoogleMaps } from '@yext/components-tsx-maps';

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

function App() {
  return (
    <Map mapProvider={GoogleMaps} clientKey={'gme-yextinc'} defaultCenter={{ lat: 38.8954, lng: -77.0698 }} defaultZoom={14}>
      {locations.map((location, index) => 
        <Marker key={location.id} id={location.id} index={index} coordinate={location.coordinate} height={40} width={40} icons={iconsForEntity}/>
      )}
    </Map>
  )
}

export default App
