"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  User,
  LogOut,
  ShoppingCart,
  Settings,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { clearUser } from "@/app/store/slices/AuthSlice";
import { useSignOutMutation } from "@/app/store/apis/AuthApi";

const UserMenu = ({ menuOpen, closeMenu }) => {
  const [signout] = useSignOutMutation();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, closeMenu]);

  const handleSignOut = async () => {
    try {
      await signout().unwrap();
      dispatch(clearUser());
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const menuItems = [
    {
      section: "Navigation",
      routes: [
        {
          href: "/",
          label: "Home",
          icon: <Home size={18} className="text-indigo-500" />,
          show: true,
        },
        {
          href: "/orders",
          label: "My Orders",
          icon: <ShoppingCart size={18} className="text-emerald-500" />,
          show: true,
        },
        {
          href: "/me",
          label: "Profile",
          icon: <User size={18} className="text-blue-500" />,
          show: true,
        },
        {
          href: "/settings",
          label: "Settings",
          icon: <Settings size={18} className="text-gray-500" />,
          show: true,
        },
      ],
    },
    {
      section: "Admin",
      routes: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard size={18} className="text-purple-500" />,
          show: user?.role === "ADMIN" || user?.role === "SUPERADMIN",
        },
        {
          href: "/admin/users",
          label: "User Management",
          icon: <Shield size={18} className="text-amber-500" />,
          show: user?.role === "SUPERADMIN",
        },
      ],
    },
  ];

  // Menu animations
  const menuVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          ref={menuRef}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={menuVariants}
          className="absolute right-0 top-12 w-64 bg-white shadow-xl rounded-lg z-50 border border-gray-100 overflow-hidden"
          style={{
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Decorative arrow */}
          <div className="absolute top-[-8px] right-4 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100"></div>

          {/* User profile section */}
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu sections */}
          <div className="py-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {menuItems.map((section, sectionIndex) => {
              const visibleRoutes = section.routes.filter(
                (route) => route.show
              );
              if (visibleRoutes.length === 0) return null;

              return (
                <div key={sectionIndex} className="mb-2 last:mb-0">
                  <div className="px-4 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {section.section}
                  </div>
                  {visibleRoutes.map((route) => (
                    <motion.div key={route.href} variants={itemVariants}>
                      <Link
                        href={route.href}
                        className="flex items-center px-4 py-2.5 gap-3 hover:bg-gray-50/80 text-gray-700 text-sm transition-colors duration-200 relative group"
                        onClick={closeMenu}
                      >
                        <span className="flex-shrink-0">{route.icon}</span>
                        <span className="flex-1">{route.label}</span>
                        <ChevronRight
                          size={16}
                          className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-transparent group-hover:bg-indigo-500 transition-all duration-200 transform scale-y-0 group-hover:scale-y-100 origin-center"></span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Sign out button */}
          <motion.div
            variants={itemVariants}
            className="mt-1 border-t border-gray-100"
          >
            <button
              onClick={() => {
                handleSignOut();
                closeMenu();
              }}
              className="flex items-center w-full px-4 py-3 gap-3 text-red-600 hover:bg-red-50/80 transition-colors duration-200 text-sm"
            >
              <LogOut size={18} />
              <span>Sign out</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserMenu;
