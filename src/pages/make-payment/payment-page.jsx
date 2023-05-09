/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../component/loader/loader';
import './make-payment.css';

function MakePayment() {
  const [banks, setBanks] = useState([]);
  const [bankCode, setBankCode] = useState('');
  const [isLoader, setLoader] = useState(false);
  const [bankName, setBankName] = useState(''); 
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [payments, setPayments] = useState([]);



  console.log("bank=======",bankName)

  const getBankDetails = (detail) => {
    const data = detail.split("__");
    setBankCode(data[0]);
    setBankName(data[1]);
  }
  useEffect(()=>{
    setLoader(true);
    const fetchBanks = async () => {
      try {
        const response = await axios.get('https://api.paystack.co/bank', {
          headers: {
            Authorization: 'Bearer sk_test_0880c1a9a5273248688de6d7bec39a89996d2254',
          },
        });

        setLoader(false);
        setBanks(response.data.data);
      } catch (error) {
        setLoader(false);
        console.error(error);
      }
    };
    fetchBanks()
  }, [])
  
  const fetchPayments = async (account) => {
    try {
      const response = await axios.get(`https://api.paystack.co/bank/resolve?account_number=${account}&bank_code=${bankCode}`, {
        headers: {
          Authorization: 'Bearer sk_test_0880c1a9a5273248688de6d7bec39a89996d2254',
        },
      });
      console.log("=======",response.data.data.account_name)
      setLoader(false);
      setBankName(response.data.data.account_name);
      setPayments(response.data.data);
    } catch (error) {
      setLoader(false);
    }
  };

  const resolveAccount = async (account) => {
    if (account.length === 10) {
      setLoader(true);
      console.log("account", account)
      setAccountNumber(account);
      fetchPayments(account);

    }
  
  };

 const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true)
    try {
      const userData = JSON.parse(sessionStorage.getItem("userData"));

      const response = await axios.post(`https://fintech-zukf.onrender.com/txn/create`,{
        bankCode: bankCode,
        recipientName: payments.account_name,
        accountNumber: accountNumber,
        email: userData.email,
        bankName: bankName,
        narration: narration,
        amount: amount
      }, {
        headers: {
          Authorization: 'Bearer nt',
        },
      });
      setLoader(false);
      alert(response.data.message);
      window.location = "../home";
    } catch (error) {
      setLoader(false);
      console.error(error.message);
      alert(error.message)
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bank Payment Platform</h1>
      </header>
      <main>
       
      <div className="form-container"></div>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="bankCode">Bank Name</label>
            <select id="bankCode" name="bankCode" value={bankCode} onChange={(e) => getBankDetails(e.target.value)}>
              <option value="">Select Bank Name</option>
              {banks.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
          <label htmlFor="account">Account Number</label>
          <input type="text" id="account" onChange={(event) => resolveAccount(event.target.value)} placeholder='Ex. 3105467845' />
          </div>
          <div className="form-field">
            {/* <button type="submit" onClick={resolveAccount}>
              Resolve Account
            </button> */}
          </div>
          {bankName && (
            <div className="form-field">
              <label htmlFor="bankName">Account Name</label>
              <input type="text" id="bankName" name="bankName" value={bankName} readOnly />
            </div>
          )}
          <div className="form-field">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="narration">Narration</label>
            <input type="text" id="narration" name="narration" value={narration} onChange={(e) => setNarration(e.target.value)} />
          </div>
          <div className="form-field">
            <button type="submit">Submit Payment</button>
          </div>
        </form>
      </main>
      {
      isLoader === true ? <Loader /> : ""
     }
    </div>
  )};

export default MakePayment;