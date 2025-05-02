import React, { useState, useEffect } from "react";
import axios from "axios";

const AddStore = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    store_name: "",
    store_address: "",
    latitude: "",
    longitude: "",
    contact_number: "",
    email: "",
    opening_hours: "",
    services_offered: "",
    store_type: "",
    status: 1,
  });

  const [map, setMap] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleForm = () => setFormVisible(!formVisible);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(
        "https://server1.pearl-developer.com/abhivriti/public/api/admin/add-nearby-places",
        formData
      );
      alert("Store details saved successfully!");
      setFormData({
        store_name: "",
        store_address: "",
        latitude: "",
        longitude: "",
        contact_number: "",
        email: "",
        opening_hours: "",
        services_offered: "",
        store_type: "",
        status: 1,
      });
      setFormVisible(false);
    } catch (error) {
      alert("Error saving store details.");
    }
    setIsSubmitting(false);
  };

  const initMap = () => {
    const mapDiv = document.getElementById("map");
    if (!mapDiv) return;

    const mapObj = new window.google.maps.Map(mapDiv, {
      center: { lat: 19.076, lng: 72.8777 },
      zoom: 12,
    });

    const input = document.getElementById("map-search");
    const searchBox = new window.google.maps.places.SearchBox(input);
    mapObj.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);

    mapObj.addListener("bounds_changed", () => {
      searchBox.setBounds(mapObj.getBounds());
    });

    let marker = null;

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;
      const place = places[0];

      if (!place.geometry || !place.geometry.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      mapObj.setCenter({ lat, lng });
      mapObj.setZoom(15);

      setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));

      if (marker) marker.setMap(null);
      marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapObj,
      });
    });

    mapObj.addListener("click", (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));

      if (marker) marker.setMap(null);
      marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapObj,
      });
    });

    setMap(mapObj);
  };

  useEffect(() => {
    if (formVisible && window.google && document.getElementById("map")) {
      initMap();
    }
  }, [formVisible]);

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <button
        onClick={handleToggleForm}
        style={{
          padding: "12px 24px",
          backgroundColor: "#0056b3",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "20px",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        {formVisible ? "Hide Form" : "Add Store"}
      </button>

      {formVisible && (
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "#ffffff",
            padding: 25,
            borderRadius: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {[
            ["store_name", "Store Name"],
            ["store_address", "Address"],
            ["contact_number", "Contact Number"],
            ["email", "Email"],
            ["opening_hours", "Opening Hours"],
            ["services_offered", "Services Offered"],
            ["store_type", "Store Type"],
          ].map(([key, label]) => (
            <div key={key} style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontWeight: "500", marginBottom: 6 }}>{label}</label>
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                }}
              />
            </div>
          ))}

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: "500" }}>Latitude: {formData.latitude}</label>
            <br />
            <label style={{ fontWeight: "500" }}>Longitude: {formData.longitude}</label>
            <br />
            <input
              id="map-search"
              className="controls"
              type="text"
              placeholder="Search location"
              style={{
                marginTop: 10,
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <div
              id="map"
              style={{ height: "200px", borderRadius: 8, marginTop: 12 }}
            ></div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "12px 24px",
              backgroundColor: isSubmitting ? "#999" : "#0056b3",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              width: "100%",
              fontWeight: "bold",
              fontSize: "16px",
              marginTop: 10,
            }}
          >
            {isSubmitting ? "Saving..." : "Submit Store"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddStore;
