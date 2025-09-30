import React, { use } from "react";
import { Link, useNavigate } from "react-router-dom";
import{User, Users, CookingPot, CalendarClock, icons} from "lucide-react";
import "../../styles/usersHomePage.scss"
import { AuthProvider, useAuth } from "../../config/AuthContext";

const SideBar = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const {logout} = useAuth();
    const navigate = useNavigate

    const handleLogout=()=>{
        logout()
       navigate("/login")
    }
    
    const roleBasedLinks = {
        Administrator: [
            { icon:<Users/>, path: '/administrator/users', label: 'Users' },
            { icon:<CookingPot/>, path: '/administrator/restaurants', label: 'Restaurants' }
        ],
        Customer:[
            {path:'/customer/orders', label:'Orders'}
        ],
        RestaurantOwner: [
            { icon:<CookingPot/>, path: '/restaurantOwner/restaurants', label: 'Restaurants' }
        ],
        Employee:[
            {icon: <CalendarClock/>, path:'/employee/workingHours', label:'Working hours'}
        ],
        Courier:[
            {icon: <CalendarClock/>, path:'/employee/workingHours', label:'Working hours'}
        ]

    }

    const links = [...roleBasedLinks[user.role] || []];

    return (
        <aside className="sidebar-container">
            <div className="profile-container">
                <Link to={"/profile"}><User/> {user.name} {user.surname}</Link>
            </div>
            <ul>
                {links.map(roleLinks => (
                    <li key={roleLinks.path}>
                        <Link to={roleLinks.path}>{roleLinks.icon} {roleLinks.label}</Link>
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