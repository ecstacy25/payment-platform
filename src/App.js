import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [banks, setBanks] = useState([]);
  const [bankCode, setBankCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [payments, setPayments] = useState([]);

  const getBankDetails = async () => {
    try {
      const response = await axios.get('https://api.paystack.co/transaction/verify/:reference', {
        headers: {
          Authorization: 'Bearer sk_test_0880c1a9a5273248688de6d7bec39a89996d2254',
        },
      });
      setAccountNumber(response.data.data.account_number);
      setBankName(response.data.data.bank_name);
      return response.data.data;
    } catch (error) {
      console.error(error);
      alert('Failed to resolve account number');
    }
  };

  const resolveAccount = async (event) => {
    event.preventDefault();
    if (bankCode === '' || accountNumber === '') {
      alert('Please enter a bank code and account number');
      return;
    }
    await getBankDetails();
  };

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get('https://api.paystack.co/bank', {
          headers: {
            Authorization: 'Bearer sk_test_0880c1a9a5273248688de6d7bec39a89996d2254',
          },
        });
        setBanks(response.data.data);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch banks');
      }
    };
    fetchBanks();
  }, []);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("userData"));
        const response = await axios.get(`https://fintech-zukf.onrender.com/txn/user/${userData.email}`, {
          headers: {
            Authorization: 'Bearer nt',
          },
        });
        setPayments(response.data.data);
      } catch (error) {
        console.error(error.message);
        alert(error.message)
      }
    };
    fetchPaymentHistory();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userData = JSON.parse(sessionStorage.getItem("userData"));

      const response = await axios.post(`https://fintech-zukf.onrender.com/txn/create`,{
        recipient_name: accountNumber,
        accountNumber: accountNumber,

        // customer_email: userData.email,
        bankName: bankName,
        narration: narration,
        amount: amount
      }, {
        headers: {
          Authorization: 'Bearer nt',
        },
      });
      
      setPayments([...payments, response.data.data]);
      alert(response.data.message);
      window.location = "../home";
    } catch (error) {
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
            <select id="bankCode" name="bankCode" value={bankCode} onChange={(e) => setBankCode(e.target.value)}>
              <option value="">Select Bank Name</option>
              {banks.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="accountNumber">Account Number</label>
            <input type="text" id="accountNumber" name="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
          </div>
          <div className="form-field">
            {/* <button type="submit" onClick={resolveAccount}>
              Resolve Account
            </button> */}
          </div>
          {bankName && (
            <div className="form-field">
              <label htmlFor="bankName">Bank Name</label>
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
      <div className="payment-history">
        <h2>Payment History</h2>
        <table>
          <thead>
            <tr>
              <th>Recipient Name</th>
              <th>Account Number</th>
              <th>Bank Name</th>
              <th>Amount</th>
              <th>Narration</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.recipient_name}</td>
                <td>{payment.accountNumber}</td>
                <td>{payment.bankName}</td>
                <td>{payment.amount}</td>
                <td>{payment.narration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )};

export default App;