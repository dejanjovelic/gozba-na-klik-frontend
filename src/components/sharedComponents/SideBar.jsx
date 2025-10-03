import React from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { User, Users, CookingPot, CalendarClock, Home, MapPin  } from "lucide-react";
import "../../styles/usersHomePage.scss"
import { ListItemButton } from '@mui/material';


const SideBar = ({ onLogout }) => {
    const user = JSON.parse(sessionStorage.getItem('user'));

    const roleBasedLinks = {
        Administrator: [
            { icon: <Home />, path: '/administrator', label: 'Home', exact: true },
            { icon: <Users />, path: '/administrator/users', label: 'Users' },
            { icon: <CookingPot />, path: '/administrator/restaurants', label: 'Restaurants' }
        ],
        Customer: [
            { icon: <Home />, path: '/customer', label: 'Home', exact: true },
            { icon: <MapPin />, path: '/customer/addresses', label: 'Addresses', exact: true }
        ],
        RestaurantOwner: [
            { icon: <Home />, path: '/restaurantOwner', label: 'Home', exact: true },
            { icon: <CookingPot />, path: '/restaurantOwner/restaurants', label: 'Restaurants' }
        ],
        Employee: [
            { icon: <Home />, path: '/employee', label: 'Home', exact: true },
        ],
        Courier: [
            { icon: <Home />, path: '/courier', label: 'HomeS', exact: true },
            { icon: <CalendarClock />, path: '/employee/workingHours', label: 'Working hours' }
        ]

    }

    const links = [...roleBasedLinks[user.role] || []];

    return (
        <aside className="sidebar-container">
            <div className="profile-container">
                <NavLink to={"/profile"}>
                    {({ isActive }) => (
                        <ListItemButton selected={isActive}>
                            <User /> {user.name} {user.surname}
                        </ListItemButton>
                    )}
                </NavLink>
            </div>
            <span className="kratka-linija"></span>
            <ul className="sidebar-list">
                {links.map(roleLinks => (
                    <li key={roleLinks.path}>
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