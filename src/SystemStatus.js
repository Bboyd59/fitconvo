import React from "react";

const SystemStatus = ({ audioLevels }) => {
  const getRandomStatus = () => {
    const statuses = ["OPTIMAL", "NORMAL", "CAUTION", "WARNING"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  return (
    <div className="mt-4 border-t border-green-400 pt-4">
      <h3 className="text-yellow-400 mb-2">SYSTEM STATUS</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          CPU:{" "}
          <span className="text-red-400 text-sm sm:text-base">
            {getRandomStatus()}
          </span>
        </div>
        <div>
          MEMORY:{" "}
          <span className="text-blue-400 text-sm sm:text-base">{getRandomStatus()}</span>
        </div>
        <div>
          NETWORK:{" "}
          <span className="text-purple-400 text-sm sm:text-base">
            {getRandomStatus()}
          </span>
        </div>
        <div>
          SECURITY:{" "}
          <span className="text-orange-400 text-sm sm:text-base">
            {getRandomStatus()}
          </span>
        </div>
      </div>
      <div className="mt-2">
        <div className="text-yellow-400 mb-1">AUDIO LEVELS</div>
        <div className="h-4 flex justify-between items-end">
          {audioLevels.map((level, index) => (
            <div
              key={index}
              className="w-2 bg-green-400"
              style={{
                height: `${level * 100}%`,
                transition: "height 0.1s ease-out",
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
