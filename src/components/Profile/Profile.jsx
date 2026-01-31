import React, { useEffect, useState } from 'react';
import { getAdminProfile, updateAdminProfile } from '../../auth/authController';

const Profile = () => {
  // Dummy Data defined here
  const dummyData = {
    name: "admin",
    email: "admin@example.com",
    image: "https://via.placeholder.com/150",
    role: "Demo Admin"
  };

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const result = await getAdminProfile();
      
      // Agar API se data mil jata hai
      if (result && result.status && result.data) {
        setProfile(result.data);
        setName(result.data.name);
        setEmail(result.data.email);
      } else {
        // Agar API status false ho ya data na mile -> Dummy Data set karein
        console.warn("API failed, loading dummy data");
        setProfile(dummyData);
        setName(dummyData.name);
        setEmail(dummyData.email);
      }
    } catch (error) {
      // Agar API crash ho jaye ya network error ho -> Dummy Data set karein
      console.error("Fetch Error:", error);
      setProfile(dummyData);
      setName(dummyData.name);
      setEmail(dummyData.email);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const result = await updateAdminProfile(formData);
    if (result.status) {
      alert("Profile updated successfully!");
      setIsEditing(false);
      fetchProfile();
    } else {
      alert(result.message || "Update failed (Check API Connection)");
    }
    setUpdating(false);
  };

  if (loading) return <div className="p-6 text-center">Loading profile...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-2xl font-bold">Admin Profile</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Edit Profile
          </button>
        )}
      </div>
      
      {profile ? (
        <div className="flex flex-col items-center">
          <div className="mb-6 relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500 shadow-sm bg-gray-100 flex items-center justify-center">
              {isEditing ? (
                <img 
                  src={previewUrl || profile.image || 'https://via.placeholder.com/150'} 
                  className="w-full h-full object-cover" 
                  alt="Preview"
                />
              ) : (
                profile.image ? (
                  <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-indigo-600">{profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}</span>
                )
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full cursor-pointer hover:bg-indigo-700 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            )}
          </div>

          <div className="w-full">
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="text-gray-500 text-sm">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-500 text-sm">Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button 
                    type="submit" 
                    disabled={updating}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setIsEditing(false); setPreviewUrl(null); }}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col border-b pb-2 text-center sm:text-left">
                  <span className="text-gray-500 text-sm">Full Name</span>
                  <span className="text-lg font-medium capitalize">{profile.name}</span>
                </div>
                <div className="flex flex-col border-b pb-2 text-center sm:text-left">
                  <span className="text-gray-500 text-sm">Email Address</span>
                  <span className="text-lg font-medium">{profile.email}</span>
                </div>
                <div className="mt-4 flex justify-center">
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                    {profile.role || "Active Admin"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Is case ki zaroorat ab kam padegi kyuki dummy data load ho jayega */
        <p className="text-red-500 text-center">Unable to load profile.</p>
      )}
    </div>
  );
};

export default Profile;