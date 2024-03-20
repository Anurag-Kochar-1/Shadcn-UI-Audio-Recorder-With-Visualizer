import React from "react";

export const Footer = () => {
  return (
    <footer className="w-full mt-auto text-center flex justify-center items-center py-6">
      <p className="text-sm">
        {" "}
        Built by{" "}
        <a
          href="https://twitter.com/anurag__kochar"
          className="text-blue-500 underline hover:text-blue-600"
          target="_blank"
          rel="noreferrer"
        >
          {" "}
          Anurag kochar
        </a>{" "}
        in Punjab, India
      </p>
    </footer>
  );
};
