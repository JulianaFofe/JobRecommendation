import { useState } from "react"
import { NavProps, type NavBarProps } from "../../types/data"
import { NavLink } from "react-router-dom"
import { FiMenu, FiX } from "react-icons/fi"
import { motion } from "framer-motion"
import logo from "../../assets/images/img.png"

const NavBar = () => {
  const [items] = useState<NavBarProps[]>(NavProps)
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(prev => !prev)

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md flex items-center justify-between px-6 py-3">
      {/* Logo */}
      <div>
       <a href="/"> <img src={logo} alt="Team Logo" className="w-40 h-15" /></a>
      </div>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-8 items-center">
        {items.map(item => (
          <li key={item.id}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "text-secondary font-semibold text-lg underline"
                  : "text-primary hover:text-secondary"
              }
            >
              {item.title}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Desktop Button */}
      <div className="hidden md:block">
        <a href=""><button className="py-2 px-6 bg-white hover:bg-primary hover:text-white text-primary border border-primary rounded-sm transition">
          Get Started
        </button></a>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-green-700 z-50 focus:outline-none" // <- explicitly green, ensure contrast
        onClick={toggleMenu}
      >
        {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden flex flex-col items-center gap-4 py-4 z-50">
          <ul className="flex flex-col gap-4 items-center">
            {items.map(item => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? "text-secondary font-semibold underline"
                      : "text-primary hover:text-secondary"
                  }
                  onClick={() => setIsOpen(false)} // close after click
                >
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
          <motion.button 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="py-2 px-6 bg-white hover:bg-primary text-primary border border-primary rounded-sm transition-transform duration-300 hover:scale-105">
            Get Started
          </motion.button>
        </div>
      )}
    </nav>
  )
}

export default NavBar
