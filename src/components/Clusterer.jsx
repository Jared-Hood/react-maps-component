import { useEffect, useContext, useState } from "react";
import { MapContext } from "./Map";

export default function Clusterer(props) {
	const { map, selectedMarkerId, setSelectedMarkerId } = useContext(MapContext);

	const [pinStore, setPinStore] = useState([]);

	const customMap = Object.assign(map, 
		{
			// here, instead of using the normal map.newPinOptions
			// we would have a version that returns a marker with a custom
			// setMap function that instead of actually adding to a map adds it 
			// to the clusterer's pinStore
			newPinOptions: map.newPinOptions
		}
	)

	useEffect(() => {
		// When the pins change, we loop over them and figure out which ones should be clustered
		// This is where we call the real marker.setMap function, or render the cluster
		// pin where appropriate. That pin would be customized the same way the pin for the
		// the normal marker component is
	}, [pinStore])

	return (
		<MapContext.Provider value={{
			// We pass in our 'fake' map instance to the context, this is what
			// individual markers will get access to through useContext so we
			// can proxy all the map interactions before they touch the real map
			map: customMap,
			selectedMarkerId: selectedMarkerId,
			setSelectedMarkerId: setSelectedMarkerId
		}}>
			{props.children}
		</MapContext.Provider>
	)
}