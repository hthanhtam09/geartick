"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Moon, Sun, Menu, X, User } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useTheme } from "../providers/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSelector from "../LanguageSelector";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, setTheme } = useTheme();
  const { isSignedIn } = useUser();

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Reviews", href: "/reviews" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-bold">GT</span>
            </div>
            <span className="text-xl font-bold">GearTick</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products, reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-full border bg-background px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="rounded-full p-2 transition-colors hover:bg-accent"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Authentication */}
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <SignInButton mode="modal">
                  <button className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden rounded-full p-2 transition-colors hover:bg-accent"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearchSubmit} className="lg:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products, reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border bg-background px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </form>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t bg-background md:hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Language Selector for Mobile */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm font-medium text-muted-foreground">
                    Language
                  </span>
                  <LanguageSelector />
                </div>

                {!isSignedIn && (
                  <div className="flex flex-col space-y-2 pt-4 border-t">
                    <SignInButton mode="modal">
                      <button className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary">
                        <User className="h-4 w-4" />
                        <span>Sign In</span>
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
