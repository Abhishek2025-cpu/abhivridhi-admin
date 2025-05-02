import React from "react";

const Section = ({ title, items }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md shadow-md">
      <h2 className="text-lg font-bold text-blue-600 mb-3">{title}</h2>
      <div className="grid gap-4">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm">
            <img src={item.image} alt={item.topic} className="w-24 h-24 object-cover mb-2 rounded-full" />
            <h3 className="text-md font-semibold text-gray-700">{item.topic}</h3>
            <p className="text-sm text-gray-500 text-center">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section;
