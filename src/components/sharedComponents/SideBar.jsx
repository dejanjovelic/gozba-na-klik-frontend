import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  Users,
  CookingPot,
  CalendarClock,
  Home,
  User,
  Egg,
  MapPin,
  Handbag,
} from "lucide-react";
import "../../styles/usersHomePage.scss"
import AssignmentIcon from '@mui/icons-material/Assignment';
import { ListItemButton } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import UserContext from "../../config/UserContext";


const SideBar = ({ onLogout, onCloseSideMenu }) => {
  const {user} = useContext(UserContext);

  const roleBasedLinks = {
    administrator: [
      { icon: <Home />, path: "/administrator", label: "Home", exact: true },
      { icon: <Users />, path: "/administrator/users", label: "Users" },
      {
        icon: <CookingPot />,
        path: "/administrator/restaurants",
        label: "Restaurants",
      },
    ],

    customer: [
      { icon: <Home />, path: '/customer', label: 'Home', exact: true },
      { icon: <Egg />, path: '/customer/allergens', label: 'Allergens' },
      { icon: <MapPin />, path: '/customer/addresses', label: 'Addresses', exact: true },
      { icon: <RestaurantMenuIcon />, path: '/customer/meals', label: 'Meals', exact: true }
    ],

    restaurantowner: [
      { icon: <Home />, path: "/restaurantOwner", label: "Home", exact: true },
      {
        icon: <CookingPot />,
        path: "/restaurantOwner/restaurants",
        label: "Restaurants",
      },
      {
        icon: <Handbag />,
        path: "/restaurantOwner/orderView",
        label: "Orders",
      },
    ],

    employee: [
      { icon: <Home />, path: "/employee", label: "Home", exact: true },
    ],

    courier: [
      { icon: <Home />, path: "/courier", label: "Home", exact: true },
      {
        icon: <CalendarClock />,
        path: "/courier/workingHours",
        label: "Working hours",
      },
      { icon: <AssignmentIcon />, path: "/courier/order", label: "Order", exact: true },
    ],
  };

  const role = user?.role?.toLowerCase();
  console.log(role)
  const links = [...(roleBasedLinks[role] || [])];

  return (
    <aside className="sidebar-container">
      <div className="profile-container">
        <NavLink to={"/profile"}>
          {({ isActive }) => (
            <ListItemButton selected={isActive}>
              <User /> {user?.name} {user?.surname}
            </ListItemButton>
          )}
        </NavLink>
      </div>
      <span className="kratka-linija"></span>
      <ul className="sidebar-list">
        {links.map((roleLinks, index) => (
          <li key={roleLinks.path || index} onClick={onCloseSideMenu}>
            <NavLink to={roleLinks.path} end={roleLinks.exact}>
              {({ isActive }) => (
                <ListItemButton selected={isActive}>
                  {roleLinks.icon}&nbsp;{roleLinks.label}
                </ListItemButton>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="logout-container">
        <button onClick={onLogout} className="sidebar-logout-button">
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
