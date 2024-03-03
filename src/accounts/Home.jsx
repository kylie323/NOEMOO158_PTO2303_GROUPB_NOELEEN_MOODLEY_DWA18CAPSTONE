import React from "react";
import './accounts.css';

const Home = ({ token, handleLogout }) => {
    return (
        <div>
            <div className='user-home'>
                <h3 className='welcome-back'>Welcome back, {token.user.user_metadata.full_name}</h3>
            </div>
        </div>
    );
}

export default Home;