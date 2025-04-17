import React, { useEffect } from 'react'
import { useMap } from 'react-leaflet';
import L from 'leaflet'

const AutoZoomDistrict = ({ districtGeoData, selectedDistrict }) => {
  const map = useMap();

  useEffect(() => {
    if (!districtGeoData || !selectedDistrict) return;

    const feature = districtGeoData.features.find(
      (f) => f.properties?.dtname === selectedDistrict
    );

    if (feature) {
      const layer = L.geoJSON(feature);
      map.fitBounds(layer.getBounds(), { padding: [50, 50] });
    }
  }, [districtGeoData, selectedDistrict, map]);

  return null;
};

export default AutoZoomDistrict