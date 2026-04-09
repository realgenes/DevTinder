import React from "react";

const Footer = () => {
  return (
    <footer className="mt-8 pb-3 pt-6">
      <div className="glass-panel flex flex-col items-start justify-between gap-4 rounded-[28px] px-5 py-5 text-sm text-base-content/90 md:flex-row md:items-center">
        <div>
          <p className="font-display text-lg font-semibold text-base-content">
            DevTinder
          </p>
          <p>Designed for meaningful developer connections.</p>
        </div>

        <div className="flex items-center gap-5 text-xs uppercase tracking-[0.24em]">
          <span>Discover</span>
          <span>Match</span>
          <span>Chat</span>
        </div>

        <p>Copyright © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
