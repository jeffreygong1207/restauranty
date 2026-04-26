"use client";

import { useState } from "react";

const roles = ["restaurant_manager", "diner", "replacement_diner", "admin"];

export function RoleSwitcher() {
  const [role, setRole] = useState(() => {
    if (typeof window === "undefined") return "restaurant_manager";
    return window.localStorage.getItem("restauranty-role") ?? "restaurant_manager";
  });
  return (
    <select
      className="icon-btn"
      value={role}
      onChange={(event) => {
        setRole(event.target.value);
        window.localStorage.setItem("restauranty-role", event.target.value);
      }}
      aria-label="Demo role"
    >
      {roles.map((item) => (
        <option key={item} value={item}>
          {item.replaceAll("_", " ")}
        </option>
      ))}
    </select>
  );
}
