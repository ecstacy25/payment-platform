/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./history.css";



const getTxnHistory = async (email) => {
    const userData = JSON.parse(sessionStorage.getItem("userData"));

    try {
        const response = await axios.get(`https://fintech-zukf.onrender.com/txn/user/${userData.email}`, {
          headers: {
            Authorization: 'Bearer sk_test_0880c1a9a5273248688de6d7bec39a89996d2254',
          },
        });
        console.log(response.data.data);
        return response.data.data;

      } catch (error) {
        console.log(error.message);
      }
}
const History = () => {
    const [history, setHistory] = useState([]);
    
    useEffect(() => {
        async function runCode() {
            const resp = await getTxnHistory();
            if(resp){
                setHistory(resp.reverse());
               setTimeout(() => {
                console.log("resp", history);
               }, 2000);
            }
        }
        runCode();
      }, []);

    return (
        <>
            <div className="history-page">
                <h2>Transaction History</h2>
               {
                 history.length > 0 ? history.map((element) => (
                    <div key={element._id} id={element._id} className="h-item" > 
                        <div className="time">{element.timeCreated}</div>
                        <div className="amount">Amount: {element.amount}</div>
                        <div className="name">Reciever: {element.recipientName}</div>
                        <div className="account">Account Number: {element.accountNumber}</div>
                        <div className="bank">Bank: {element.bankName}</div>
                        <div className="status">Status: {element.paymentStatus}</div>

                    </div>
                 )) : 
                 <div className="h-item">No History</div>
               }

               {console.log("history", history.length)}
            </div>
        </>
    )
}

export default History;