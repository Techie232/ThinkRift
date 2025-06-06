import React from 'react'
import * as Icons from "react-icons/vsc"
import { useDispatch } from 'react-redux';
import { NavLink, matchPath, useLocation } from 'react-router-dom';

const SidebarLink = ({ link, iconName }) => {

   const Icon = Icons[iconName];
   const location = useLocation();
   const dispatch = useDispatch();

   const matchRoute = (route) => {
      return matchPath({ path: route }, location.pathname);
   }

   return (
      <NavLink
         to={link.path}
         className={`text-base py-2 px-4 relative md:px-8 md:py-2 font-medium transition-all duration-300 ${matchRoute(link.path) ? "bg-yellow-800 text-yellow-100" : "bg-opacity-0 text-richblack-400 hover:text-white"}`}
      >
         <div className='flex item-center gap-x-2 items-center justify-center md:justify-start md:flex-row'>
            <Icon className="md:text-lg text-3xl" />
            <span className='block'>{link.name}</span>
            <span className={`absolute bottom-0 left-0 md:top-0 h-[0.2rem] w-full md:h-full md:w-[0.2rem] bg-yellow-50 opacity-0 transition-all duration-300
                  ${matchRoute(link.path) ? "opacity-100" : "opacity-0"}`}>
            </span>
         </div>
      </NavLink>
   )
}

export default SidebarLink