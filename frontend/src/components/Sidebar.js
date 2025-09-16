import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "./ui/button";
import { Moon, Sun, Shield, Settings, FileText } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const menuItems = [
    { path: "/moderate", icon: FileText, label: "Content Moderation", active: location.pathname === "/moderate" },
    { path: "/settings", icon: Settings, label: "Settings", active: location.pathname === "/settings" },
  ];

  return (
    <div className="w-64 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Lancyy</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">AI Content Moderation</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={item.active ? "default" : "ghost"}
                className={`w-full justify-start gap-3 h-12 ${
                  item.active 
                    ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 shadow-lg" 
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <Button
            onClick={toggleTheme}
            variant="outline"
            className="w-full justify-start gap-3 h-12 border-slate-200 dark:border-slate-700"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;