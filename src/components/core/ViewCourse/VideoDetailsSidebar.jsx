import { useEffect, useState } from "react"
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { GiHamburgerMenu } from "react-icons/gi"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import IconBtn from "../../common/IconBtn"

export default function VideoDetailsSidebar({ setReviewModal }) {
   const [activeSection, setActiveSection] = useState("")
   const [activeSubSection, setActiveSubSection] = useState("")
   const [sidebarOpen, setSidebarOpen] = useState(true) 

   const navigate = useNavigate()
   const location = useLocation()
   const { sectionId, subSectionId } = useParams()

   const {
      courseSectionData,
      courseEntireData,
      totalNoOfLectures,
      completedLectures,
   } = useSelector((state) => state.viewCourse)

   useEffect(() => {
      if (!courseSectionData.length) return

      const currentSection = courseSectionData.find((sec) => sec._id === sectionId)
      const currentSubSection = currentSection?.subSection.find((sub) => sub._id === subSectionId)

      setActiveSection(currentSection?._id || "")
      setActiveSubSection(currentSubSection?._id || "")
   }, [courseSectionData, location.pathname, sectionId, subSectionId])

   return (
      <div  
         className={`fixed top-[3.5rem] z-50 left-0 h-[calc(100vh-3.5rem)] bg-richblack-800 border-r border-richblack-700 transition-width duration-300 ease-in-out
        ${sidebarOpen ? "w-[200px] md:w-[320px]" : "w-5"}`}
      >
         {/* Hamburger always visible, positioned on top-left */}
         <div
            className="absolute top-16 left-6 text-yellow-400 cursor-pointer z-50"
            onClick={() => setSidebarOpen((prev) => !prev)}
            title={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
         >
            <GiHamburgerMenu size={20} />
         </div>

         {/* Show full sidebar content only if sidebarOpen */}
         {sidebarOpen && (
            <div className="flex h-full flex-col">
               {/* Header */}
               <div className="mx-5 flex flex-col justify-between gap-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
                  <div className="flex items-center justify-between gap-2">
                     {/* Back button */}
                     <button
                        onClick={() => navigate(`/dashboard/enrolled-courses`)}
                        title="Back"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
                     >
                        <IoIosArrowBack size={30} />
                     </button>

                     <IconBtn
                        text="Add Review"
                        customClasses="ml-auto"
                        onclick={() => setReviewModal(true)}
                     />
                  </div>

                  <div>
                     <p>{courseEntireData?.courseName}</p>
                     <p className="text-sm font-semibold text-richblack-500">
                        {completedLectures?.length} / {totalNoOfLectures}
                     </p>
                  </div>
               </div>

               {/* Section list */}
               <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
                  {courseSectionData.map((section) => (
                     <div key={section._id} className="mt-2 text-sm text-richblack-5">
                        <div
                           className="flex justify-between bg-richblack-600 px-5 py-4 cursor-pointer"
                           onClick={() => setActiveSection(section._id)}
                        >
                           <div className="w-[70%] font-semibold">{section.sectionName}</div>
                           <BsChevronDown
                              className={`transition-transform ${activeSection === section._id ? "rotate-0" : "rotate-180"
                                 }`}
                           />
                        </div>

                        {activeSection === section._id && (
                           <div className="transition-[height] duration-500 ease-in-out">
                              {section.subSection.map((sub) => (
                                 <div
                                    key={sub._id}
                                    onClick={() => {
                                       navigate(
                                          `/view-course/${courseEntireData?._id}/section/${section._id}/sub-section/${sub._id}`
                                       )
                                       setActiveSubSection(sub._id)
                                    }}
                                    className={`flex items-center gap-3 px-5 py-2 cursor-pointer ${activeSubSection === sub._id
                                          ? "bg-yellow-200 font-semibold text-richblack-800"
                                          : "hover:bg-richblack-900"
                                       }`}
                                 >
                                    <input
                                       type="checkbox"
                                       checked={completedLectures.includes(sub._id)}
                                       readOnly
                                    />
                                    {sub.title}
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
   )
}