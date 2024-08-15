import React from "react";

const Footer = () => (
  <footer className="w-full text-center font-Ubuntu py-1 bg-cyan-800 text-white">
    <p>
      &copy; {new Date().getFullYear()} AttendEazy. All
      rights reserved.
    </p>
  </footer>
);

export default Footer;