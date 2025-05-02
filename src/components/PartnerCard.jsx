import React from "react";
import Section from "./Section";

const PartnerCard = ({ partner }) => {
  return (
    <div className="bg-white border border-gray-200 p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-200">
      <Section title="Abhivriti Advantage" items={partner.porter_advantage} />
      <Section title="Benefits" items={partner.benefits} />
      <div className="my-6">
        <h2 className="text-lg font-bold text-blue-600 mb-3">Making Life Easy</h2>
        <div className="flex flex-col items-center bg-gray-50 p-3 rounded-lg shadow-sm">
          <img src={partner.making_life_easy_image} alt="Making Life Easy" className="w-40 h-40 object-cover mb-2 rounded-md" />
          <p className="text-sm text-gray-500 text-center">{partner.making_life_easy_description}</p>
        </div>
      </div>
      <div className="my-6">
        <h2 className="text-lg font-bold text-blue-600 mb-3">Own Multiple Vehicles</h2>
        <div className="flex flex-col items-center bg-gray-50 p-3 rounded-lg shadow-sm">
          <img src={partner.own_multiple_vehicle_image} alt="Own Multiple Vehicles" className="w-40 h-40 object-cover mb-2 rounded-md" />
        </div>
      </div>
      <div className="text-sm text-gray-400 mt-4">
        <p>Created: {new Date(partner.created_at).toLocaleString()}</p>
        <p>Updated: {new Date(partner.updated_at).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default PartnerCard;
