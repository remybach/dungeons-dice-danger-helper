import { useEffect, useState } from "react";

import "./Die.scss";

export const Die = ({ colour = "white", onClick = () => {}, value, style }) => {
  const [pips, setPips] = useState([]);

  useEffect(() => {
    setPips(
      Array.from({ length: value }).map((val, i) => (
        <span key={`die-${value}-pip-${i}`} className="pip" />
      ))
    );
  }, [value]);

  return (
    <span className={`die die-${value} die-${colour}`} onClick={onClick} title={value} style={style}>
      {pips}
    </span>
  );
};
