import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  BookmarkFilledIcon,
  BookmarkIcon,
  DotIcon,
} from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import React, { useEffect, useState } from "react";
import TradingForm from "./TradingForm";
import StockChart from "../Home/StockChart";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCoinDetails } from "@/State/Coin/Action";
import {
  getUserWatchlist,
  toggleWatchlistCoin,
} from "@/State/Watchlist/Action";

const StockDetails = () => {

  const { coin, watchlist } = useSelector((store) => store);

  const dispatch = useDispatch()
  const {id} = useParams()  
  const [tradeOrderType, setTradeOrderType] = useState("BUY");
  const marketCoin =
    coin.coinList.find((item) => item.id === id) ??
    coin.top50.find((item) => item.id === id) ??
    coin.searchCoinList.find((item) => item.id === id);
  const coinDetails = coin.coinDetails?.id === id ? coin.coinDetails : null;
  const selectedCoin = coinDetails ?? marketCoin;
  const image =
    coinDetails?.image?.large ??
    marketCoin?.image ??
    marketCoin?.large ??
    marketCoin?.thumb;
  const symbol = selectedCoin?.symbol?.toUpperCase() ?? id?.toUpperCase();
  const name = selectedCoin?.name ?? id;
  const currentPrice =
    coinDetails?.market_data?.current_price?.usd ?? marketCoin?.current_price;
  const priceChange =
    coinDetails?.market_data?.price_change_24h ?? marketCoin?.price_change_24h;
  const priceChangePercentage =
    coinDetails?.market_data?.price_change_percentage_24h ??
    marketCoin?.price_change_percentage_24h;
  const formatNumber = (value) => {
    const number = Number(value);
    return value == null || !Number.isFinite(number)
      ? "--"
      : number.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };
  const hasPriceChange = priceChange != null || priceChangePercentage != null;

  useEffect(() => {

    dispatch(fetchCoinDetails({coinId:id}))

  }, [dispatch, id])

  useEffect(() => {
    dispatch(getUserWatchlist(localStorage.getItem("jwt")));
  }, [dispatch]);

  const isInWatchlist =
    watchlist.data?.coins?.some((item) => item.id === id) ?? false;

  const handleToggleWatchlist = () => {
    dispatch(
      toggleWatchlistCoin({
        jwt: localStorage.getItem("jwt"),
        coinId: id,
      })
    );
  };

  return (
    <div className="p-5 mt-5">

      <div className="flex justify-between">
        <div className="flex gap-5 items-center">
          <div>
            <Avatar>
              <AvatarImage
                key={id}
                src={image}
                alt={name}
              />
              <AvatarFallback>{symbol?.slice(0, 3) ?? "?"}</AvatarFallback>
            </Avatar>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <p>{symbol}</p>
              <DotIcon className="text-gray-600" />
              <p className="text-gray-600">{name}</p>
            </div>

            <div className="flex items-end gap-2">
              <p className="text-xl font-bold">
                {currentPrice == null
                  ? "Price unavailable"
                  : `$${formatNumber(currentPrice)}`}
              </p>
              <p className={
                !hasPriceChange
                  ? "text-gray-500"
                  : Number(priceChange) < 0
                    ? "text-red-600"
                    : "text-green-600"
              }>
                <span>{formatNumber(priceChange)}</span>
                <span>({formatNumber(priceChangePercentage)}%)</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            disabled={watchlist.loading}
            onClick={handleToggleWatchlist}
            aria-label={
              isInWatchlist ? "Remove from watchlist" : "Add to watchlist"
            }
          >
            {isInWatchlist ? (
              <BookmarkFilledIcon className="h-6 w-6" />
            ) : (
              <BookmarkIcon className="h-6 w-6" />
            )}
          </Button>

          {watchlist.error && (
            <p role="alert" className="text-sm text-red-600">
              {watchlist.error}
            </p>
          )}

          <Dialog>
            <DialogTrigger>
              <Button size='lg'>Trade</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {tradeOrderType === "BUY"
                    ? "How much do you want to spend?"
                    : "How much do you want to sell?"}
                </DialogTitle>
                
              </DialogHeader>
              <TradingForm onOrderTypeChange={setTradeOrderType}/>
            </DialogContent>
          </Dialog>


        </div>
      </div>

      {coin.loading && !coinDetails && (
        <p className="mt-4 text-sm text-gray-500">Loading coin details...</p>
      )}
      {coin.error && !coinDetails && (
        <div className="mt-4 flex items-center gap-2">
          <p role="alert" className="text-sm text-red-600">
            Could not load coin details: {coin.error}
          </p>
          <Button
            variant="outline"
            onClick={() => dispatch(fetchCoinDetails({ coinId: id }))}
          >
            Retry
          </Button>
        </div>
      )}

      <div className="mt-14">
        <StockChart coinId={id}/>
      </div>
    </div>
  );
};

export default StockDetails;
