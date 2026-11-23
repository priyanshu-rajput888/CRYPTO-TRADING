import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAssetDetails } from "@/State/Asset/Action";
import { getUserWallet } from "@/State/Wallet/Action";
import { payOrder } from "@/State/Order/Action";
import { DotIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const formatNumber = (value, maximumFractionDigits = 2) => {
  const number = Number(value);
  return Number.isFinite(number)
    ? number.toLocaleString(undefined, { maximumFractionDigits })
    : "--";
};

const TradingForm = ({ onOrderTypeChange }) => {
  const [orderType, setOrderType] = useState("BUY");
  const [amount, setAmount] = useState("");
  const [validationError, setValidationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const { id } = useParams();
  const { coin, wallet, asset, order } = useSelector((state) => state);
  const jwt = localStorage.getItem("jwt");

  const coinDetails = coin.coinDetails?.id === id ? coin.coinDetails : null;
  const marketCoin =
    coin.coinList.find((item) => item.id === id) ??
    coin.top50.find((item) => item.id === id);
  const selectedCoin = coinDetails ?? marketCoin;
  const symbol = selectedCoin?.symbol?.toUpperCase() ?? id?.toUpperCase() ?? "";
  const name = selectedCoin?.name ?? id ?? "Asset";
  const image = coinDetails?.image?.large ?? marketCoin?.image;
  const currentPrice = Number(
    coinDetails?.market_data?.current_price?.usd ?? marketCoin?.current_price
  );
  const priceChange = Number(
    coinDetails?.market_data?.price_change_24h ?? marketCoin?.price_change_24h
  );
  const priceChangePercentage = Number(
    coinDetails?.market_data?.price_change_percentage_24h ??
      marketCoin?.price_change_percentage_24h
  );
  const hasPrice = Number.isFinite(currentPrice) && currentPrice > 0;
  const walletBalance = Number(wallet.userWallet?.balance ?? 0);
  const userAsset =
    asset.assetDetails?.coin?.id === id ? asset.assetDetails : null;
  const availableQuantity = Number(userAsset?.quantity ?? 0);
  const inputValue = Number(amount);
  const orderQuantity =
    hasPrice && orderType === "BUY" ? inputValue / currentPrice : inputValue;
  const estimatedTotal =
    orderType === "BUY" ? inputValue : inputValue * currentPrice;
  const availableLabel =
    orderType === "BUY" ? "Available cash" : "Available quantity";
  const availableValue =
    orderType === "BUY"
      ? `$${formatNumber(walletBalance)}`
      : `${formatNumber(availableQuantity, 8)} ${symbol}`;
  const formattedPriceChange = Number.isFinite(priceChange)
    ? `${priceChange < 0 ? "-" : "+"}$${formatNumber(Math.abs(priceChange), 8)}`
    : "--";
  const formattedPriceChangePercentage = Number.isFinite(priceChangePercentage)
    ? `${priceChangePercentage > 0 ? "+" : ""}${formatNumber(priceChangePercentage, 4)}%`
    : "--";
  const isPriceChangeNegative =
    (Number.isFinite(priceChange) && priceChange < 0) ||
    (Number.isFinite(priceChangePercentage) && priceChangePercentage < 0);
  const accountLoading =
    orderType === "BUY" ? wallet.loading : asset.loading;

  useEffect(() => {
    if (jwt && !wallet.userWallet?.id) {
      dispatch(getUserWallet(jwt));
    }
  }, [dispatch, jwt, wallet.userWallet?.id]);

  useEffect(() => {
    if (jwt && id) {
      dispatch(getAssetDetails({ coinId: id, jwt }));
    }
  }, [dispatch, id, jwt]);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
    setValidationError("");
    setSuccessMessage("");
  };

  const handleOrderTypeChange = () => {
    const nextOrderType = orderType === "BUY" ? "SELL" : "BUY";
    setOrderType(nextOrderType);
    setAmount("");
    setValidationError("");
    setSuccessMessage("");
    onOrderTypeChange?.(nextOrderType);
  };

  const handleSubmit = async () => {
    setValidationError("");
    setSuccessMessage("");

    if (!hasPrice) {
      setValidationError("The current coin price is unavailable.");
      return;
    }
    if (!Number.isFinite(inputValue) || inputValue <= 0) {
      setValidationError(
        orderType === "BUY"
          ? "Enter an amount greater than zero."
          : "Enter a quantity greater than zero."
      );
      return;
    }
    if (orderType === "BUY" && inputValue > walletBalance) {
      setValidationError("Insufficient wallet balance.");
      return;
    }
    if (orderType === "SELL" && inputValue > availableQuantity) {
      setValidationError("You do not have enough of this coin to sell.");
      return;
    }
    if (!jwt || !id) {
      setValidationError("Unable to identify your account or selected coin.");
      return;
    }

    const result = await dispatch(
      payOrder({
        jwt,
        orderData: {
          coinId: id,
          quantity: orderQuantity,
          orderType,
        },
      })
    );

    if (result) {
      setAmount("");
      setSuccessMessage(`${orderType} order completed successfully.`);
      dispatch(getUserWallet(jwt));
      dispatch(getAssetDetails({ coinId: id, jwt }));
    }
  };

  return (
    <div className="space-y-10 p-5">
      <div>
        <div className="flex items-center justify-between gap-3">
          <Input
            className="py-7 focus:outline-none"
            placeholder={orderType === "BUY" ? "Enter amount (USD)..." : `Enter quantity (${symbol})...`}
            onChange={handleAmountChange}
            value={amount}
            type="number"
            min="0"
            step="any"
            name="amount"
          />
          <p className="flex h-14 w-36 items-center justify-center rounded-md border text-center">
            {orderType === "BUY"
              ? `${formatNumber(orderQuantity, 8)} ${symbol}`
              : `$${formatNumber(estimatedTotal)}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <Avatar>
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{symbol.slice(0, 3) || "?"}</AvatarFallback>
        </Avatar>

        <div>
          <div className="flex items-center gap-2">
            <p>{symbol || "--"}</p>
            <DotIcon className="text-gray-600" />
            <p className="text-gray-600">{name}</p>
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <p className="text-xl font-bold">
              {hasPrice ? `$${formatNumber(currentPrice, 8)}` : "Price unavailable"}
            </p>
            <p className={isPriceChangeNegative ? "text-red-600" : "text-green-600"}>
              <span>{formattedPriceChange}</span>
              <span className="ml-1">({formattedPriceChangePercentage})</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p>Order Type</p>
        <p>Market order</p>
      </div>

      <div className="flex items-center justify-between">
        <p>{availableLabel}</p>
        <p>
          {orderType === "BUY" && wallet.loading
            ? "Loading..."
            : orderType === "SELL" && asset.loading
              ? "Loading..."
              : availableValue}
        </p>
      </div>

      {(validationError || order.error) && (
        <p role="alert" className="text-center text-sm text-red-600">
          {validationError || order.error}
        </p>
      )}
      {successMessage && (
        <p role="status" className="text-center text-sm text-green-600">
          {successMessage}
        </p>
      )}

      <div>
        <Button
          disabled={order.loading || accountLoading || !hasPrice}
          onClick={handleSubmit}
          className={`w-full py-6 ${orderType === "SELL" ? "bg-red-600 text-white hover:bg-red-700" : ""}`}
        >
          {order.loading
            ? "Processing..."
            : accountLoading
              ? "Loading..."
              : orderType}
        </Button>
        <Button
          variant="link"
          className="mt-5 w-full text-xl"
          onClick={handleOrderTypeChange}
        >
          {orderType === "BUY" ? "Or Sell" : "Or Buy"}
        </Button>
      </div>
    </div>
  );
};

export default TradingForm;
