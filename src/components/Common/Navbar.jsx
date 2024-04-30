import React from 'react'
// import { useEffect, useState } from "react"
// import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
// import { BsChevronDown } from "react-icons/bs"
// import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
// import { apiConnector } from "../../services/apiConnector"
// import { categories } from "../../services/apis"
// import { ACCOUNT_TYPE } from "../../utils/constants"
// import ProfileDropdown from "../core/Auth/ProfileDropdown"



  // const { token } = useSelector((state) => state.auth)
  // const { user } = useSelector((state) => state.profile)
  // const { totalItems } = useSelector((state) => state.cart)
  // const location = useLocation()

  // const [subLinks, setSubLinks] = useState([])
  // const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   ;(async () => {
  //     setLoading(true)
  //     try {
  //       const res = await apiConnector("GET", categories.CATEGORIES_API)
  //       setSubLinks(res.data.data)
  //      console.log(res.data.data)
  //     } catch (error) {
  //       console.log("Could not fetch Categories.", error)
  //     }
  //     setLoading(false)
  //   })()
  // }, [])

 
  // console.log("sub links", subLinks)

  const Navbar = () => {
    const location = useLocation()

    

const matchRoute = (route) => {
  return matchPath({ path: route }, location.pathname)
}


    return (
      <div
        className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
          location.pathname !== "/" ? "bg-richblack-800" : ""
        } transition-all duration-200`}
      >
        <div className="flex w-11/12 max-w-maxContent items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
          </Link>
  
  
          {/* Navigation links */}
  
          <nav>
            <ul className="flex gap-x-6 text-richblack-25">
              {
                NavbarLinks.map((link, index) => (
                  <li key={index}>
                    {
                      link.title === "Catalog" ? (<div></div>) : (
                        <Link to={link?.path}>
                          <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                            {link.title}
                          </p>
                        </Link>
                      )
                    }
                  </li>
                ))
              }
            </ul> 
          </nav>

          {/* //login signup dashboard  */}

          
              
        </div>
      </div>
    )
  }

export default Navbar














