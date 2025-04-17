import React, { useEffect } from 'react'
import { useMap } from 'react-leaflet';
import L from 'leaflet'

const AutoZoomVillage = ({ districtGeoData, selectedVillage }) => {
    const map = useMap();
  
    useEffect(() => {
      if (!districtGeoData || !selectedVillage) return;
    //   console.log(districtGeoData)
      const feature = districtGeoData.features.find(
        (f) => f.properties?.NAME === selectedVillage
      );
  
      // console.log("Geo Data : ", selectedVillage)
   
      if (feature) {
        // console.log(feature)
        const layer = L.geoJSON(feature);
        map.fitBounds(layer.getBounds(), { padding: [50, 50] });
      }
    }, [districtGeoData, selectedVillage, map]);
  
    return null;
  };
  
export default AutoZoomVillage