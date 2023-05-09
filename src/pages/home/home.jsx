
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./home.css";
import { Link } from "react-router-dom";

const userD = JSON.parse(sessionStorage.getItem("userData"));
const Home = () => {
    const [userData, setUserData] = useState({});
    useEffect(() => {
        
        const fetcUserInfo = async () => {
          try {
            const response = await axios.get(`https://fintech-zukf.onrender.com/user/one/${userD.email}`, {
              headers: {
                Authorization: 'Bearer sk_test_0880c1a9a5273248688de6d7bec39a89996d2254',
              },
            });

            setUserData(response.data.data);
          } catch (error) {
            console.log(error.message);
          }
        };
        fetcUserInfo();
      }, []);
    return(
        <>
            <div className="page-wrapper">
                <div className="header">
                    <div className="card">
                        <div className="balance">₦ {userData.balance} </div>
                        <div className="user-account">{userData.mobile }</div>
                        <div className="user-name">{userData.firstName + " " + userData.lastName }</div>
                    </div>
                </div>

                <div className="action-list">
                   <div className="action orange"> <Link to="../make-payment">Send Money</Link></div>
                   <div className="action green"> <Link to="../history">Check History</Link></div>
                
                </div>

            </div>
        </>
    )
}

export default Home;