
'use client';

import { CloudSun } from "lucide-react";

export const Header = () => {
  return (
    <header className="text-center mb-8 p-5 bg-black/30 rounded-2xl backdrop-blur-lg shadow-2xl">
      <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
        <CloudSun size={40} /> Real-Time Alert System
      </h1>
      <p className="text-lg opacity-90">
        Live notifications from IMD, NDMA, and Google Weather
      </p>
    </header>
  );
};
