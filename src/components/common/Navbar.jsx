import React, { useEffect, useState } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import Logo from '../../assets/Logo/Logo-Full-Light.png';
import { NavbarLinks } from '../../data/navbar-links';
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import ProfileDropDown from '../core/Auth/ProfileDropDown';
import { apiConnector } from '../../services/apiconnector';
import { categories } from '../../services/apis';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

const Navbar = () => {
   const { token } = useSelector((state) => state.auth);
   const { user } = useSelector((state) => state.profile);
   const { totalItems } = useSelector((state) => state.cart);
   const location = useLocation();

   const [subLinks, setSubLinks] = useState([]);
   const [loading, setLoading] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   const fetchSublinks = async () => {
      setLoading(true);
      try {
         const res = await apiConnector("GET", categories.CATEGORIES_API);
         setSubLinks(res.data.data);
      } catch (error) {
         console.error(error);
      }
      setLoading(false);
   };

   useEffect(() => {
      fetchSublinks();
   }, []);

   const matchRoute = (route) => matchPath({ path: route }, location.pathname);

   const handleClick = () => {
      setIsMobileMenuOpen(false)
   }

   return (
      <div className='flex h-14 items-center justify-center border-b border-richblack-700 bg-richblack-800'>
         <div className='w-11/12 flex max-w-maxContent items-center justify-between'>
            <Link to='/'>
               <img src={Logo} alt='Logo' className='h-[60px] w-[100px] object-cover' />
            </Link>

            <div className='md:hidden'>
               <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  {isMobileMenuOpen ? (
                     <HiOutlineX className='text-white text-2xl' />
                  ) : (
                     <HiOutlineMenu className='text-white text-2xl' />
                  )}
               </button>
            </div>

            <div className='flex gap-2 md:hidden'>
               {
                  user && user?.accountType !== "Instructor" && (
                     <Link to="/dashboard/cart" className="relative">
                        <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                        {totalItems > 0 && (
                           <span className="absolute -bottom-2 -right-2 h-4 w-5 grid place-items-center rounded-full bg-richblack-500 text-xs font-bold text-yellow-100 animate-bounce">
                              {totalItems}
                           </span>
                        )}
                     </Link>
                  )
               }
               {token && <ProfileDropDown />}
            </div>

            <nav className={`md:flex ${isMobileMenuOpen ? 'block absolute top-16 left-0 w-full bg-richblack-800 px-6 py-4 z-50 text-center' : 'hidden'} md:static md:w-auto md:bg-transparent`}>
               <ul className='flex flex-col md:flex-row md:items-center gap-4 md:gap-x-6 text-richblack-25'>
                  {NavbarLinks?.map((link, index) => (
                     <li key={index} onClick={handleClick}>
                        {link.title === 'Catalog' ? (
                           <div className={`group relative ${matchRoute("catalog/*") ? 'text-yellow-25' : 'text-richblack-25'}`}>
                              <p className='flex items-center justify-center cursor-pointer'>
                                 {link.title} <MdOutlineKeyboardArrowDown size={20} />
                              </p>
                              <div className='hidden group-hover:flex flex-col absolute left-1/2 -translate-x-1/3 -translate-y-2 top-full mt-2 bg-richblack-5 p-4 rounded-md shadow-md z-50 w-72'>
                                 {subLinks?.length ? subLinks.map((subLink, i) => (
                                    <Link key={i} to={`/catalog/${subLink.name.split(" ").join('-').toLowerCase()}`} className='hover:bg-richblack-50 px-2 py-2 rounded text-black'>
                                       {subLink.name}
                                    </Link>
                                 )) : <p>No Courses Found</p>}
                              </div>
                           </div>
                        ) : (
                           <Link to={link?.path} className={matchRoute(link?.path) ? 'text-yellow-25' : 'text-richblack-25'}>
                              {link.title}
                           </Link>
                        )}
                     </li>
                  ))}

                  {
                     !token && isMobileMenuOpen && (
                        <div className='flex justify-between'>
                           <Link to={'/login'} onClick={handleClick}>
                              <button className='bg-richblack-400 p-2 rounded-xl'>Login</button>
                           </Link>
                           <Link to={'/signup'} onClick={handleClick}>
                              <button className='bg-richblack-400 p-2 rounded-xl'>Singup</button>
                           </Link>

                        </div>)
                  }
               </ul>
            </nav>

            <div className='hidden md:flex gap-x-4 items-center'>
               {user && user?.accountType !== "Instructor" && (
                  <Link to="/dashboard/cart" className="relative">
                     <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                     {totalItems > 0 && (
                        <span className="absolute -bottom-2 -right-2 h-4 w-5 grid place-items-center rounded-full bg-richblack-500 text-xs font-bold text-yellow-100 animate-bounce">
                           {totalItems}
                        </span>
                     )}
                  </Link>
               )}

               {!token && (
                  <>
                     <Link to='/login'>
                        <button className='border border-richblue-700 bg-richblack-700 px-3 py-2 text-richblack-100 rounded-md'>Log in</button>
                     </Link>
                     <Link to='/signup'>
                        <button className='border border-richblue-700 bg-richblack-700 px-3 py-2 text-richblack-100 rounded-md'>Sign up</button>
                     </Link>
                  </>
               )}

               {token && <ProfileDropDown />}
            </div>
         </div>
      </div>
   );
};

export default Navbar;
