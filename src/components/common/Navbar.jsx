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

const Navbar = () => {

   const { token } = useSelector((state) => state.auth);
   const { user } = useSelector((state) => state.profile);
   const { totalItems } = useSelector((state) => state.cart);
   const location = useLocation();

   const [subLinks, setSubLinks] = useState([]);
   const [loading, setLoading] = useState(false);

   const fetchSublinks = async () => {
      setLoading(true);
      try {
         const res = await apiConnector("GET", categories.CATEGORIES_API)
         setSubLinks(res.data.data);
      } catch (error) {

      }
      setLoading(false);
   }

   useEffect(() => {
      fetchSublinks();
   }, [])

   const matchRoute = (route) => {
      return matchPath({ path: route }, location.pathname)
   }

   return (
      <div className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 bg-richblack-800 transition-all duration-200`}>

         <div className='w-11/12 flex max-w-maxContent items-center justify-between'>

            <Link to={'/'} >
               <img src={Logo} width={160} height={32} />
            </Link>

            <nav>
               <ul className='flex gap-x-6 text-richblack-25'>
                  {
                     NavbarLinks.map((link, index) => (
                        <li key={index} >
                           {
                              (link.title === 'Catalog') ?
                                 (<div className={`${matchRoute("catalog/*") ? 'text-yellow-25' : 'text-richblack-25'} flex items-center cursor-pointer group relative z-50`}>
                                    <p>{link.title}</p>
                                    <MdOutlineKeyboardArrowDown size={20} />

                                    <div className='invisible absolute left-[50%] translate-x-[-50%] translate-y-[9%] top-[50%] flex flex-col rounded-md 
                                    bg-richblack-5 p-4 text-richblue-900 opacity-0 transition-all duration-200 
                                    group-hover:visible group-hover:opacity-100 lg:w-[300px]'>

                                       <div className='absolute left-[50%] translate-x-[80%] translate-y-[-45%] top-0 h-6 w-6 rotate-45 rounded
                                       bg-richblack-5'>

                                       </div>

                                       {
                                          subLinks.length ?
                                             (
                                                subLinks.map((subLink, index) => (
                                                   <Link to={`/catalog/${subLink.name.split(" ").join('-').toLowerCase()}`} key={index}>
                                                      <p className='hover:bg-richblack-50 rounded-md px-2 py-3'>{subLink.name}</p>
                                                   </Link>
                                                ))
                                             )
                                             : (<div>No Courses Found</div>)
                                       }

                                    </div>

                                 </div>) :
                                 (
                                    <Link to={link?.path}>
                                       <p className={`${matchRoute(link?.path) ? 'text-yellow-25' :
                                          'text-richblack-25'}`}>
                                          {
                                             link.title
                                          }
                                       </p>
                                    </Link>
                                 )
                           }
                        </li>
                     ))
                  }
               </ul>
            </nav>

            {/* Login/Signup/Dashboard */}
            <div className='flex gap-x-4 items-center'>

               {
                  user && user?.accountType !== "Instructor" && (
                     <Link to="/dashboard/cart" className="relative">
                        <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                        {totalItems > 0 && (
                           <span className="absolute -bottom-2 -right-2  h-4 w-5 place-items-center overflow-hidden rounded-full bg-richblack-500 text-center text-xs font-bold text-yellow-100 animate-bounce">
                              {totalItems}
                           </span>
                        )}
                     </Link>
                  )
               }

               {
                  token === null && (
                     <Link to={'/login'}>
                        <button className='border border-richblue-700 bg-richblack-700 px-[12px] py-[8px]
                        text-richblack-100 rounded-md'>
                           Log in
                        </button>
                     </Link>
                  )
               }

               {
                  token === null && (
                     <Link to={'/signup'}>
                        <button className='border border-richblue-700 bg-richblack-700 px-[12px] py-[8px]
                        text-richblack-100 rounded-md'>
                           Sign up
                        </button>
                     </Link>
                  )
               }

               {
                  token !== null && <ProfileDropDown />
               }

            </div>

         </div>

      </div>
   )
}

export default Navbar