import React, { useEffect, useState } from 'react'
import './Navbar.css'

const Navbar = () => {

    const today = new Date();
    const [liveTime, setLiveTime] = useState(new Date())

    useEffect(() => {

        const interval = setInterval(() => {
            setLiveTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const renderedTime = liveTime.toLocaleTimeString();
    const renderedDate = `${today.getDate()}/${(today.getMonth()+1)}/${today.getFullYear()}`;

    return (
        <div id='navbar-container'>
            <div id='left-side-container'>
                <div id='logo-container'><h2 id='logo'>Monarch</h2></div>
                <div id='nav-items-container'>
                    <h5 className='nav-items'>Home</h5>
                    <h5 className='nav-items'>Features</h5>
                    <h5 className='nav-items'>About</h5>
                    <h5 className='nav-items'>Admin</h5>
                    <h5 className='nav-items'>LogIn</h5>
                </div>
            </div>

            <div id='right-side-container'>
                <h5 id='date-text'>{renderedDate}</h5>
                <h5 id='time-text'>{renderedTime}</h5>
            </div>
        </div>
    )
}

export default Navbar