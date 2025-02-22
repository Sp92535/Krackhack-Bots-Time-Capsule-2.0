import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Plus, Clock, Lock, Globe } from "lucide-react";

export function Sidebar({ username }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 bg-transparent border-none cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white border-r transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out z-40`}
      >
        <div className="p-4 space-y-4">
          <h2 className="text-2xl font-bold">Hi, {username}</h2>
          <p className="text-gray-400">Welcome back!</p>
          <Link to="/add-capsule">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded flex items-center">
              <Plus className="mr-2 h-4 w-4" /> Add Capsule
            </button>
          </Link>
          <nav className="space-y-2">
            <Link to="/upcoming-capsules">
              <button className="w-full flex items-center justify-start px-4 py-2 hover:bg-gray-700 rounded">
                <Clock className="mr-2 h-4 w-4" /> Upcoming Capsules
              </button>
            </Link>
            <Link to="/private-capsules">
              <button className="w-full flex items-center justify-start px-4 py-2 hover:bg-gray-700 rounded">
                <Lock className="mr-2 h-4 w-4" /> Private Capsules
              </button>
            </Link>
            <Link to="/public-capsules">
              <button className="w-full flex items-center justify-start px-4 py-2 hover:bg-gray-700 rounded">
                <Globe className="mr-2 h-4 w-4" /> Public Capsules
              </button>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
