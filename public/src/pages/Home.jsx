import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Home.css'
import axios from 'axios';
import AutoZoomDistrict from '../components/AutoZoomDistrict';
import AutoZoomVillage from '../components/AutoZoomVillage';

const Home = () => {
  const [districtGeoData, setGeoData] = useState(null);
  const [villageGeoData, setVillageGeoData] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');

  useEffect(() => {
    fetch('/MAHARASHTRA_DISTRICTS.geojson')
      .then(res => res.json())
      .then((data) => {
        // console.log(data)
        setGeoData(data)
      })
      .catch(err => console.error('Error loading GeoJSON:', err));
  }, []);

  useEffect(() => {
    // console.log("first")
    setSelectedVillage('')
  }, [selectedDistrict])

  let fetchRelatedVillages = (districtName) => {
    axios.get("/maharashtra_villages_geojson.txt", { responseType: "text" })
      .then((response) => {
        const json = JSON.parse(response.data);
        console.log(json)
        const villagesGeoJsonData = (json.features).filter(village => village.properties?.DISTRICT === districtName)
        // console.log("Villages GeoJson : ", villagesGeoJsonData)
        setVillageGeoData({
          "type": "FeatureCollection",
          "features": villagesGeoJsonData
        })
        // console.log("Filtered Villages GeoJSON Data: ", villagesGeoJsonData); // works
      })
      .catch((error) => {
        console.error("Error loading GeoJSON data:", error);
      });
  }

  // Dropdown change handler
  const handleDistrictChange = (e) => {

    fetchRelatedVillages(e.target.value)

    setSelectedDistrict(e.target.value);
  };

  const handleVillageChange = (e) => {
    // console.log(e.target.value)
    setSelectedVillage(e.target.value);
  };

  const districtStyle = (feature) => {
    return {
      color: feature.properties?.dtname === selectedDistrict ? 'blue' : 'grey',
      weight: feature.properties?.dtname === selectedDistrict ? 3 : 1,
      fillColor: 'white',
      fillOpacity: 0.3,
    };
  };

  const villageStyle = (feature) => {
    const featureName = feature.properties?.NAME?.trim().toLowerCase();
    const selectedName = selectedVillage.trim().toLowerCase();

    console.log(`🧩 Comparing featureName: "${featureName}" === selectedName: "${selectedName}"`);

    const isSelected = featureName === selectedName;

    return {
      color: isSelected ? 'blue' : 'none',
      weight: isSelected ? 3 : 1,
      fillColor: 'white',
      fillOpacity: 0.3,
    };
  };




  const onEachFeature = (feature, layer) => {
    const name = feature.properties?.dtname || 'Unknown';
    layer.bindPopup(name.toString());
  };

  const onEachVillageFeature = (feature, layer) => {
    const name = feature.properties?.NAME || 'Unknown';
    layer.bindPopup(name.toString());

    if (feature.properties?.NAME?.trim().toLowerCase() === selectedVillage.trim().toLowerCase()) {
      layer.bringToFront(); // bring selected feature on top
    }
  };

  return (
    <div id='main-container'>

      <div id='drop-down-container'>
        <fieldset style={{ border: '.5px solid grey', width: '90%', margin: 'auto' }}>
          <legend style={{ fontSize: 'small', fontWeight: '700' }}>Select District</legend>
          <select onChange={(e) => { handleDistrictChange(e) }} value={selectedDistrict} id='drop-down'>
            <option value="">Select a district</option>
            {districtGeoData &&
              districtGeoData.features.map((feature, idx) => (
                <option key={idx} value={feature.properties?.dtname}>
                  {feature.properties?.dtname}
                </option>
              ))}
          </select>
        </fieldset>
        
        <fieldset style={{ border: '.5px solid grey', width: '90%', margin: 'auto' }}>
          <legend style={{ fontSize: 'small', fontWeight: '700' }}>Select Village/City</legend>
          <select onChange={(e) => { handleVillageChange(e) }} value={selectedVillage} id='drop-down'>
            <option value="" selected>Select a Village/City</option>
            {villageGeoData &&
              villageGeoData.features?.map((feature, idx) => (
                <option key={idx} value={feature.properties?.NAME}>
                  {feature.properties?.NAME}
                </option>
              ))}
          </select>
        </fieldset>
      </div>

      {districtGeoData && (
        <MapContainer center={[19.7515, 75.7139]} zoom={7} id='map-container'>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {!selectedVillage && (
            <GeoJSON
              data={districtGeoData}
              style={districtStyle}
              onEachFeature={onEachFeature}
            />
          )}


          {villageGeoData && (
            <GeoJSON
              key={selectedVillage}
              data={villageGeoData}
              style={villageStyle}
              onEachFeature={onEachVillageFeature}
            />

          )}

          {
            selectedVillage ? <AutoZoomVillage districtGeoData={villageGeoData} selectedVillage={selectedVillage} /> : <AutoZoomDistrict districtGeoData={districtGeoData} selectedDistrict={selectedDistrict} />
          }
        </MapContainer>
      ) || (<h1 style={{ textAlign: 'center', width: '100%', color: 'white', fontSize: '3rem' }}>Map is Loading...</h1>)}
    </div>
  );
};

export default Home;
