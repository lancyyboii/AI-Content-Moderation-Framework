import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "./components/ui/toaster";
import Sidebar from "./components/Sidebar";
import ContentForm from "./components/ContentForm";
import AdminPanel from "./components/AdminPanel";
import StatsOverview from "./components/StatsOverview";
import SettingsPanel from "./components/SettingsPanel";

function App() {
  return (
    <ThemeProvider>
      <div className="App min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <BrowserRouter>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Navigate to="/moderate" />} />
                <Route path="/moderate" element={<ContentForm />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/stats" element={<StatsOverview />} />
                <Route path="/settings" element={<SettingsPanel />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;