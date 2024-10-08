import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../../style/Nav.css';
import '../../style/Fxstyle.css'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.nav
      className=" fixed top-0 w-[97%] lg:w-[95%] mx-auto pt-2  z-30 flex justify-between items-center"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
     
      <div className=''><p className='text-3xl text-white customfont2'>Ched<span className='text-[#ecae10]'>Fx</span></p></div>

      {/* Hamburger Icon */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="text-black text-3xl focus:outline-none relative z-40"
        >
          {isOpen ? (
            <span className="inline-block text-3xl text-white">&#x2715;</span> // Times icon
          ) : (
            <span className="inline-block text-3xl text-white">&#9776;</span> // Bars icon
          )}
        </button>
      </div>

      {/* Menu Links */}
      {/* isOpen ? 'translate-x-0 text-white h-[100dvh] '  */}
      <motion.div
        className={ `fixed inset-0 customfont2 bg-black bg-opacity-80 backdrop-blur-lg  text-white flex 
          flex-col items-center justify-center transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0 text-white h-[100dvh] md:h-0 ' : 'translate-x-full '
        } md:static md:bg-transparent md:translate-x-0 md:flex md:flex-row md:items-center md:justify-end `}
        style={{ backdropFilter: 'blur(30px)' }} // This adds the backdrop blur effect
      >
        <div className="w-full  md:w-auto flex flex-col z-30 md:flex-row items-center md:items-center md:space-x-4">
          <a
            href="#Card2"
            className="hvr-underline-from-center text-lg   mb-8 md:mb-0 hover:text-gray-300 transition-transform duration-300"
            onClick={toggleMenu}
          >
            Price 
          </a>

          <a
            href="#faq"
            className="hvr-underline-from-center text-lg  mb-8 md:mb-0 hover:text-gray-300 transition-transform duration-300"
            onClick={toggleMenu}
          >
            FAQs
          </a>

          <a
            href="#contact"
            className="hvr-underline-from-center text-lg  mb-8 md:mb-0 hover:text-gray-300 transition-transform duration-300"
            onClick={toggleMenu}
          >
            Contact
          </a>
          
         <Link to="/bot" className="hvr-underline-from-center text-lg mb-8 md:mb-0 hover:text-gray-300 transition-transform duration-300">
           Tools
          </Link>
          
        </div>
      </motion.div>
    </motion.nav>
  );
}
