import useAccountInfo from '@/hooks/useAccountInfo';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useCallback, useEffect, useState } from 'react';
import { showTonBalance, toWei } from "../../utils/common";
import cssClass from "./sendForm.module.scss";
const TransactionForm = () => {
 /**
  * STATES
  */
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
    /**
   * STATES
   */
   const [userInfo, setUserInfo] = useState<any>(null);
   /**
   * HOOKS
   */
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const wallet = useTonWallet();
  const { status, data, error, isFetching } = useAccountInfo(wallet?.account?.chain, wallet?.account?.address);  
 
  /**
   * FUNCTIONS
   */
  const sendTon = async (amountWei: any,walletAddress: any) => {

    try {
      // try to send ton here
      const myTransaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
        messages: [
            {
                address: walletAddress,
                amount: amountWei,
            }
        ]
      }
      const rs = await tonConnectUI.sendTransaction(myTransaction);
      console.log("🚀 ~ sendTon ~ rs:", rs)
   
  
      
    } catch (error) {
      console.log("🚀 ~ sendTon ~ error:", error)
    }
  }
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle the form submission
    if(!walletAddress){
      alert("Wallet address is required!");
      return;
    }
    if(!walletAddress){
      alert("Wallet address is required!");
      return;
     }
    const amountWei = toWei(amount);
    if(amountWei > userInfo?.balance){
      alert("Insufficient balance!");
      return;
    }
   
    sendTon(amountWei,walletAddress);
  };
 const getUserInfo = useCallback(() => {
    try {
        if (!data) {
            setUserInfo(null);
            return;
        }
        setUserInfo(data);
    } catch (error) {
        console.log("🚀 ~ getUserInfo ~ error:", error)
    }
  },[data]);
  const initData = useCallback(() => {
    getUserInfo();
  }, [getUserInfo]);
  /**
   * USE EFFECTS
   */
    useEffect(() => {
        initData();
    }, [initData]);
  /**
   * RENDERS
   */
  return (
      <div className={`flex items-center justify-center min-h-screen  ${cssClass.sendForm}`}>
      <form
        className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-6 text-2xl font-bold pt-4 text-gray-800">Transaction Form</h2>
        <div className="mb-4">
          <label className="flex items-center mb-2 text-sm font-bold text-gray-700" htmlFor="amount">
            Amount <div className="ml-auto">balance:  {showTonBalance(userInfo?.balance)} TON </div>
          </label>
          <input
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="wallet">
            Wallet Receive Address
          </label>
          <input
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            id="wallet"
            type="text"
            placeholder="Enter wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;