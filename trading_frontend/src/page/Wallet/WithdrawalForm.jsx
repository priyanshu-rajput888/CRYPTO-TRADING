import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPaymentDetails, withdrawalRequest } from "@/State/Withdrawal/Action";

const WithdrawalForm = () => {
  const [amount, setAmount] = React.useState("");
  const dispatch = useDispatch()
  const {wallet, withdrawal} = useSelector(store => store)
  const paymentDetails = withdrawal.paymentDetails;
  const accountNumber = paymentDetails?.accountNumber ?? "";
  const maskedAccountNumber = accountNumber.length > 4
    ? `${"*".repeat(accountNumber.length - 4)}${accountNumber.slice(-4)}`
    : accountNumber;

  useEffect(() => {
    if (!paymentDetails) {
      dispatch(getPaymentDetails({jwt: localStorage.getItem("jwt")}));
    }
  }, [dispatch, paymentDetails]);

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = () => {
    dispatch(withdrawalRequest({amount, jwt:localStorage.getItem("jwt")}))
    console.log(amount);
  };

  return (
    <div className="pt-10 space-y-5">
      <div className="flex justify-between items-center rounded-md bg-[#FAF5FF] text-[#1F2937] text-xl font-bold px-5 py-4">
        <p>Available balance</p>
        <p>${Number(wallet.userWallet?.balance ?? 0).toLocaleString()}</p>
      </div>

      <div className="flex flex-col items-center">
        <h1 className="text-[#1F2937]">Enter Withdrawal amount</h1>
        <div className="flex items-center justify-center">
          <Input
            onChange={handleChange}
            value={amount}
            className="withdrawalInput py-7 border-none outline-none focus:outline-none px-0 text-2xl text-center text-[#1F2937] placeholder:text-[#9CA3AF]"
            placeholder="$9999"
            type="number"
          />
        </div>
      </div>

      <div>
        <p className="pb-2 text-[#1F2937]">Transfer to</p>
        <div className="flex items-center gap-5 border border-[#E9D5FF] px-5 py-2 rounded-md">
          <img
            className="h-8 w-8"
            src="https://cdn.pixabay.com/photo/2020/02/18/11/03/bank-4859142_1280.png"
            alt=""
          />
          <div>
            {paymentDetails ? (
              <>
                <p className="text-xl font-bold text-[#1F2937]">{paymentDetails.bankName}</p>
                <p className="text-xs font-mono whitespace-nowrap tracking-normal text-[#9CA3AF]">
                  {maskedAccountNumber}
                </p>
              </>
            ) : (
              <p className="text-sm text-[#9CA3AF]">
                {withdrawal.loading ? "Loading payment details..." : (
                  <Link to="/payment-details" className="text-[#A000C8] hover:underline">
                    Add payment details
                  </Link>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      <DialogClose className="w-full">
        <Button
          onClick={handleSubmit}
          className="w-full py-7 text-xl bg-[#A000C8] hover:bg-[#8700A8] text-white"
        >
          Withdraw
        </Button>
      </DialogClose>
    </div>
  );
};

export default WithdrawalForm;
