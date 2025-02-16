"use client";
import React, { JSX, useState } from "react";
import { FiMenu, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { lusitana } from "@/ui/fonts";
import Link from "next/link";
type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  data_cy?: string;
  onClick?: () => void;
};

const NavLink: React.FC<NavLinkProps> = ({
  href,
  data_cy,
  children,
  onClick,
}) => (
  <Link
    href={href}
    data-cy={data_cy}
    className={`${lusitana.className} text-black dark:text-[#f0eff4] no-underline transition duration-300 p-2 hover:text-[#ffa552] dark:hover:text-[#ffa552] hover:text-shadow `}
    onClick={onClick}
  >
    {children}
  </Link>
);

export default function HeaderClientSide(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "home" },
    { href: "/profile", label: "profile" },
    { href: "/revenues", label: "შემოსავლები" },
    { href: "/customers", label: "კლიენტები" },
  ];

  return (
    <>
      <button
        className={`${lusitana.className} text-2xl text-stone-900 dark:text-gray-200 flex items-center`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        data-cy="menu"
      >
        <FiMenu />
        {menuOpen ? <FiArrowDown /> : <FiArrowUp />}
      </button>
      {menuOpen && (
        <nav
          className={`absolute h-svh top-12 left-0 w-full shadow-md dark:bg-stone-800/20 bg-stone-50/20 backdrop-blur-md text-5xl`}
          aria-label="Main Navigation"
        >
          <ul className="flex flex-col gap-3 p-4 max-w-[1110px] mx-auto">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <NavLink href={href} onClick={() => setMenuOpen(false)}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
