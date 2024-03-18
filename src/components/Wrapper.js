import React from "react";

const Wrapper = ({ children }) => {
  return (
    <div className="flex flex-col flex-wrap w-[100%] mt-4 items-center gap-5 shadow-md border-2 py-4 hover:scale-105 transition">
      {children}
    </div>
  );
};

export default Wrapper;
