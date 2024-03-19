import React, { useState, useEffect } from "react";
import Accountpage from "./Accountpage.js";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";  

function Accomodationpage() {
  const [accommodations, setAccommodations] = useState([]);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const userIdFromCookie = Cookies.get("userId");
        if (userIdFromCookie) {
          const response = await axios.get(
            `http://localhost:6050/places/${userIdFromCookie}`
          );
          if (response.data.success) {
            setAccommodations(response.data.places);
            console.log(typeof accommodations.photos[0]);
          } else {
            console.error(
              "Failed to fetch accommodation places:",
              response.data.error
            );
          }
        } else {
          console.error("User ID not found in cookie");
        }
      } catch (error) {
        console.error("Error fetching accommodation places:", error);
      }
    };

    fetchAccommodations();
  }, [accommodations]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:6050/places/delete/${id}`);
      setAccommodations(accommodations.filter(accommodation => accommodation._id !== id));
    } catch (error) {
      console.error("Error deleting accommodation:", error);
    }
  };

  const handleEdit = (id) => {
    window.location.href = `/account/places/edit/${id}`;
  };
  
  return (
    <div>
      <Accountpage />
      <div className="text-center mt-4">
        <Link
          to="/account/places/add"
          className="text-purple-700 border border-purple-700 rounded-full py-2 px-6"
        >
          Add Place
        </Link>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Your Accommodations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accommodations.map((accommodation, index) => {
            const slicedUrl = accommodation.photos.slice(7);
            return (
              <div
                key={index}
                className="relative bg-gray-100 shadow-md rounded-lg p-4 flex"
              >
                <div className="mr-4">
                  <img
                    src={`http://localhost:6050/${slicedUrl}`}
                    alt={accommodation.title}
                    className="w-32 h-32 object-cover rounded-lg border border-purple-000"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold mb-2">
                    {accommodation.title}
                  </h3>
                  <p className="text-gray-600">{accommodation.address}</p>
                </div>
                <button
                  onClick={() => handleDelete(accommodation._id)}
                  className="absolute bottom-0 right-0 mb-2 mr-2 bg-purple-700 hover:bg-purple-900 text-white py-1 px-5 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEdit(accommodation._id)}
                  className="absolute bottom-0 right-4 mb-2 mr-20 bg-purple-700 hover:bg-purple-900 text-white py-1 px-5 rounded"
                >
                  Edit
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Accomodationpage;
