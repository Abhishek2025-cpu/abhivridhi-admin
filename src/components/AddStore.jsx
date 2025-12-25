import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AddStore = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [editingStore, setEditingStore] = useState(null); // Store being edited
  const thStyle = { padding: "12px", border: "1px solid #ccc", textAlign: "left" };
const tdStyle = { padding: "10px", border: "1px solid #ddd" };


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

  const [stores, setStores] = useState([]);
  const [allStores, setAllStores] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [map, setMap] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const storesPerPage = 3;

  const handleToggleForm = () => setFormVisible(!formVisible);



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
      fetchStores(); // Refresh list
    } catch (error) {
      alert("Error saving store details.");
    }
    setIsSubmitting(false);
  };

  const fetchStores = async () => {
    try {
      const res = await axios.get(
        "https://server1.pearl-developer.com/abhivriti/public/api/app/get-nearby-places"
      );
      setStores(res.data.data);
    } catch (err) {
      console.error("Error fetching stores", err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

    const openEditModal = (store) => {
    setEditingStore(store);
    setFormData({
      store_name: store.store_name,
      store_address: store.store_address,
      contact_number: store.contact_number,
      email: store.email,
      store_type: store.store_type,
      opening_hours: store.opening_hours,
      services_offered: store.services_offered
    });
    document.getElementById("editModal").style.display = "block";
  };

  const closeModal = () => {
    setEditingStore(null);
    document.getElementById("editModal").style.display = "none";
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `https://server1.pearl-developer.com/abhivriti/public/api/admin/edit-nearby-places/${editingStore.id}`,
        formData
      );
      Swal.fire("Success", "Nearby place updated successfully!", "success");
      closeModal();
      fetchStores();
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error", "Failed to update nearby place.", "error");
    }
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

  
  const filteredStores = allStores.filter((store) =>
    store.store_name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * storesPerPage;
  const indexOfFirst = indexOfLast - storesPerPage;
  const currentStores = filteredStores.slice(indexOfFirst, indexOfLast);

  const paginate = (direction) => {
    if (direction === "prev" && currentPage > 1) setCurrentPage(currentPage - 1);
    if (direction === "next" && indexOfLast < filteredStores.length) setCurrentPage(currentPage + 1);
  };

  return (
    <div style={{ maxWidth: "100%", padding: 20 }}>
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
            maxWidth: 700,
            margin: "auto",
          }}
        >
          {[["store_name", "Store Name"], ["store_address", "Address"], ["contact_number", "Contact Number"],
            ["email", "Email"], ["opening_hours", "Opening Hours"], ["services_offered", "Services Offered"],
            ["store_type", "Store Type"]
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
            <div id="map" style={{ height: "200px", borderRadius: 8, marginTop: 12 }}></div>
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

      {/* Horizontal Scrollable Table */}
      <div style={{ flexGrow: 1 }}>
        <div style={{ marginBottom: 10 }}>
          <input
            type="text"
            placeholder="Search store..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: 8,
              width: "100%",
              maxWidth: 300,
              borderRadius: 6,
              border: "1px solid #aaa",
            }}
          />
        </div>

            <div style={{ overflowX: "auto", marginTop: 40, maxWidth: "100%", width: "100%" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1200px" }}>
          <thead>
            <tr style={{ background: "#0056b3", color: "#fff" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Store Name</th>
              <th style={thStyle}>Address</th>
              <th style={thStyle}>Contact</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Hours</th>
              <th style={thStyle}>Services</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id} style={{ backgroundColor: "#f9f9f9", borderBottom: "1px solid #ddd" }}>
                <td style={tdStyle}>{store.id}</td>
                <td style={tdStyle}>{store.store_name}</td>
                <td style={tdStyle}>{store.store_address}</td>
                <td style={tdStyle}>{store.contact_number}</td>
                <td style={tdStyle}>{store.email}</td>
                <td style={tdStyle}>{store.store_type}</td>
                <td style={tdStyle}>{store.opening_hours}</td>
                <td style={tdStyle}>{store.services_offered}</td>
                <td style={tdStyle}>
                  <button title="View">👁️</button>{" "}
                  <button title="Edit" onClick={() => openEditModal(store)}>✏️</button>{" "}
                  <button title="Delete">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

         {/* Modal */}
      {editingStore && (
        <div id="editModal" style={modalStyle}>
          <div style={modalContentStyle}>
            <h3>Edit Store: {editingStore.store_name}</h3>
            <label>Store Name: <input name="store_name" value={formData.store_name} onChange={handleInputChange} /></label><br />
            <label>Address: <input name="store_address" value={formData.store_address} onChange={handleInputChange} /></label><br />
            <label>Contact: <input name="contact_number" value={formData.contact_number} onChange={handleInputChange} /></label><br />
            <label>Email: <input name="email" value={formData.email} onChange={handleInputChange} /></label><br />
            <label>Type: <input name="store_type" value={formData.store_type} onChange={handleInputChange} /></label><br />
            <label>Hours: <input name="opening_hours" value={formData.opening_hours} onChange={handleInputChange} /></label><br />
            <label>Services: <input name="services_offered" value={formData.services_offered} onChange={handleInputChange} /></label><br />
            <div style={{ marginTop: 10 }}>
              <button onClick={handleUpdate} style={{ marginRight: 10 }}>Update</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

 {/* Pagination */}
 <div style={{ marginTop: 15, display: "flex", justifyContent: "center", gap: 20 }}>
          <button
            onClick={() => paginate("prev")}
            disabled={currentPage === 1}
            style={{
              padding: "6px 16px",
              backgroundColor: "#0056b3",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Prev
          </button>
          <span style={{ fontWeight: "bold", alignSelf: "center" }}>
            Page {currentPage}
          </span>
          <button
            onClick={() => paginate("next")}
            disabled={indexOfLast >= filteredStores.length}
            style={{
              padding: "6px 16px",
              backgroundColor: "#0056b3",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Next
          </button>
        </div>
      </div>
      </div>

    );
  }


// Table cell styles
const thStyle = {
  padding: "12px",
  textAlign: "left",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "10px",
  whiteSpace: "nowrap",
};

const modalStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "10px",
  width: "400px",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
  fontFamily: "Segoe UI, sans-serif"
};

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  margin: "5px 0 15px 0",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "14px"
};

const labelStyle = {
  fontWeight: "bold",
  display: "block",
  marginBottom: "3px",
  color: "#333"
};

const buttonGroupStyle = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "20px"
};

const updateBtnStyle = {
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "5px",
  cursor: "pointer",
  marginRight: "10px"
};

const cancelBtnStyle = {
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "5px",
  cursor: "pointer"
};



export default AddStore;


{/* <div id="editModal" style={modalStyle}>
  <div style={modalContentStyle}>
    <h3 style={{ marginBottom: "20px", color: "#333" }}>
      ✏️ Edit Store: {editingStore.store_name}
    </h3>

    {Object.entries({
      "Store Name": "store_name",
      "Address": "store_address",
      "Contact": "contact_number",
      "Email": "email",
      "Type": "store_type",
      "Hours": "opening_hours",
      "Services": "services_offered"
    }).map(([label, key]) => (
      <div key={key}>
        <label style={labelStyle}>{label}</label>
        <input
          name={key}
          value={formData[key]}
          onChange={handleInputChange}
          style={inputStyle}
        />
      </div>
    ))}

    <div style={buttonGroupStyle}>
      <button onClick={handleUpdate} style={updateBtnStyle}>Update</button>
      <button onClick={closeModal} style={cancelBtnStyle}>Cancel</button>
    </div>
  </div>
</div> */}
