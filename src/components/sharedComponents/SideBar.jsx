import React, { use } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { User, Users, CookingPot, CalendarClock, Home } from "lucide-react";
import "../../styles/usersHomePage.scss"
import { AuthProvider, useAuth } from "../../config/AuthContext";
import { ListItemButton } from '@mui/material';


const SideBar = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const { logout } = useAuth();
    const navigate = useNavigate;


    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    const roleBasedLinks = {
        Administrator: [
            { icon: <Home />, path: '/administrator', label: 'Home', exact: true },
            { icon: <Users />, path: '/administrator/users', label: 'Users' },
            { icon: <CookingPot />, path: '/administrator/restaurants', label: 'Restaurants' }
        ],
        Customer: [
            { icon: <Home />, path: '/customer', label: 'Home', exact: true  }
        ],
        RestaurantOwner: [
            { icon: <Home />, path: '/restaurantOwner', label: 'Home', exact: true  },
            { icon: <CookingPot />, path: '/restaurantOwner/restaurants', label: 'Restaurants' }
        ],
        Employee: [
            { icon: <Home />, path: '/employee', label: 'Home', exact: true  },
        ],
        Courier: [
            { icon: <Home />, path: '/courier', label: 'HomeS', exact: true  },
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
            <ul className="sidebar-list">
                {links.map(roleLinks => (
                    <li key={roleLinks.path}>
                        <NavLink to={roleLinks.path} end={roleLinks.exact}>
                            {({isActive})=>(
                                <ListItemButton selected={isActive}>
                                    {roleLinks.icon} {roleLinks.label}
                                </ListItemButton>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>
            <div className="logout-container">
                <Link onClick={handleLogout}>Sign out</Link>
            </div>
        </aside>
    );

};

export default SideBar;