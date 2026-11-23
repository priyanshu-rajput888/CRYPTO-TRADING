import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReloadIcon, UpdateIcon } from "@radix-ui/react-icons";
import {
  CopyIcon,
  DollarSign,
  DownloadIcon,
  ShuffleIcon,
  UploadIcon,
  WalletIcon,
} from "lucide-react";
import React, { useCallback, useEffect } from "react";
import TopupForm from "./TopupForm";
import WithdrawalForm from "./WithdrawalForm";
import TransferForm from "./TransferForm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { depositeMoney, getUserWallet, getWalletTransaction } from "@/State/Wallet/Action";
import { useLocation, useNavigate } from "react-router-dom";


function useQuery(){
  return new URLSearchParams(useLocation().search)
}


const Wallet = () => {
  const dispatch = useDispatch()
  const {wallet} = useSelector(store => store)
  const query = useQuery()
  const orderId = query.get("order_id");
  const paymentId = query.get("payment_id");
  const razorpayPaymentId = query.get("razorpay_payment_id");
  const navigate = useNavigate()
  const sortedTransactions = [...wallet.transactions].sort((a, b) => {
    const dateDifference = new Date(b.date).getTime() - new Date(a.date).getTime();
    return dateDifference || Number(b.id) - Number(a.id);
  });

  const handleFetchUserWallet = useCallback(() => {
    dispatch(getUserWallet(localStorage.getItem("jwt")))
  }, [dispatch])

  const handleFetchWalletTransaction = useCallback(() => {
    dispatch(getWalletTransaction({jwt:localStorage.getItem("jwt")}))
  }, [dispatch])

  useEffect(() => {
    handleFetchUserWallet();
    handleFetchWalletTransaction();
  }, [handleFetchUserWallet, handleFetchWalletTransaction])

  useEffect(() => {
    if(orderId){
      dispatch(depositeMoney({jwt:localStorage.getItem("jwt"),
        orderId,
        paymentId:razorpayPaymentId || paymentId,
        navigate
      }))
    }

  }, [dispatch, navigate, orderId, paymentId, razorpayPaymentId])
  return (
    <div className="flex flex-col items-center">
      <div className="pt-10 w-full lg:w-[60%]">
        <Card>
          <CardHeader className="pb-9">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                <WalletIcon size={30} />

                <div>
                  <CardTitle className="text-2xl">My Wallet</CardTitle>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-600 text-sm">#{wallet.userWallet?.id}</p>
                    <CopyIcon
                      size={14}
                      className="cursor-pointer hover:text-slate-500"
                    />
                  </div>
                </div>
              </div>
              <div>
                <ReloadIcon onClick={handleFetchUserWallet} className="w-6 h-6 cursor-pointer hover:text-slate-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex item-center">
              <DollarSign />
              <span className="text-2xl font-semibold">{wallet.userWallet.balance}</span>
            </div>

            <div className="flex gap-7 mt-5">
              <Dialog>
                <DialogTrigger className="text-center text-xl">
                  <div className="h-24 w-24 hover:text-gray-400 cursor-pointer flex flex-col items-center justify-center gap-2 rounded-md shadow-slate-700 shadow-md">
                    <UploadIcon />
                    <span className="text-sm mt-2">Add Money</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Top Up Your Wallet</DialogTitle>
                  </DialogHeader>
                  <TopupForm />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger>
                  <div className="h-24 w-24 hover:text-gray-400 cursor-pointer flex flex-col items-center justify-center gap-2 rounded-md shadow-slate-700 shadow-md">
                    <DownloadIcon />
                    <span className="text-sm mt-2">Withdrawal</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader className="text-center text-xl">
                    <DialogTitle>Request Withdrawal</DialogTitle>
                  </DialogHeader>
                  <WithdrawalForm />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger>
                  <div className="h-24 w-24 hover:text-gray-400 cursor-pointer flex flex-col items-center justify-center gap-2 rounded-md shadow-slate-700 shadow-md">
                    <ShuffleIcon />
                    <span className="text-sm mt-2">Transfer</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader className="text-center text-xl">
                    <DialogTitle>Transfer to other Wallet</DialogTitle>
                  </DialogHeader>
                  <TransferForm />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <div className="py-5 pt-10">
          <div className="flex gap-2 items-center pb-5">
            <h1 className="text-2xl font-semibold">History</h1>
            <UpdateIcon className="h-7 w-7 cursor-pointer hover:text-gray-500" />
          </div>

          <div className="space-y-5">
            {sortedTransactions.map((item) => {
              const isCredit = item.type === "ADD_MONEY" && Number(item.amount) >= 0;

              return (
                <div key={item.id}>
                  <Card className="w-full flex-row items-center justify-between px-5 py-2">
                    <div className="flex min-w-0 items-center gap-5">
                      <Avatar onClick={handleFetchWalletTransaction}>
                        <AvatarFallback>
                          <ShuffleIcon className="" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h1>{item.type || item.purpose}</h1>
                        <p className="text-sm text-gray-500">{item.date}</p>
                      </div>
                    </div>

                    <p className={`ml-auto whitespace-nowrap text-right ${isCredit ? "text-green-500" : "text-red-500"}`}>
                      {isCredit ? "+" : "-"}{Math.abs(Number(item.amount))} USD
                    </p>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
