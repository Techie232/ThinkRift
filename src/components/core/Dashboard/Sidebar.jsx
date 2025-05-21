import React, { useState } from 'react'
import { sidebarLinks } from '../../../data/dashboard-links'
import { logout } from "../../../services/operations/authAPI"
import { useDispatch, useSelector } from 'react-redux'
import SidebarLink from './SidebarLink'
import { useNavigate } from 'react-router-dom'
import { LuLogOut } from "react-icons/lu";
import ConfirmationModal from '../../common/ConfirmationModal'

const Sidebar = () => {

   const { user, loading: profileLoading } = useSelector((state) => state.profile);
   const { loading: authLoading } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [confirmationModal, setConfirmationModal] = useState(null);

   if (profileLoading || authLoading) {
      return (
         <div className='mt-10'>
            Loading...
         </div>
      )
   }

   return (
      <div className='text-white bg-richblack-800'>
         <div className='md:min-w-[222px] flex-col border-r-[1px] border-r-richblack-700 md:flex
        h-[calc[100vh-3.5rem)] bg-richblack-800 py-10'>

            <div className='flex flex-col'>
               {
                  sidebarLinks.map((link) => {
                     if (link.type && user?.accountType !== link.type) return null;
                     return (
                        <SidebarLink key={link.id} link={link} iconName={link.icon} />
                     )
                  })
               }
            </div>

            <div className='mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600'></div>

            <div className='flex flex-col items-center md:items-start'>
               <SidebarLink
                  link={{ name: "Settings", path: "/dashboard/settings" }}
                  iconName="VscSettingsGear"
               />

               <button
                  onClick={() => setConfirmationModal({
                     text1: "Are You Sure ?",
                     text2: "You will be logged out of your Account",
                     btn1Text: "Logout",
                     btn2Text: "Cancel",
                     btn1Handler: () => dispatch(logout(navigate)),
                     btn2Handler: () => setConfirmationModal(null),
                  })}
                  className='hover:text-white transition-all duration-200 text-sm font-medium text-richblack-300 mx-4'>

                  <div className='flex items-center gap-x-2 p-4'>
                     <LuLogOut className='text-2xl' />
                     <span>Logout</span>
                  </div>
               </button>
            </div>
         </div>
         {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
      </div>
   )
}

export default Sidebar