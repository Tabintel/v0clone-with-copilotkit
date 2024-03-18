import React from "react";

const Button = ({
  bgColor,
  textColor,
  text,
  borderRadius,
  shadow,
  handleClick,
}) => {
  return (
    <button
      onClick={handleClick}
      className={`${bgColor} ${textColor} py-[4px] px-[7px] md:py-[7px] md:px-[15px] my-3 cursor-pointer ${borderRadius} ${shadow}`}
    >
      {text}
    </button>
  );
};

export default Button;
