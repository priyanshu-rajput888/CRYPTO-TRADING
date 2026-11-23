import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getUserWatchlist,
  toggleWatchlistCoin,
} from "@/State/Watchlist/Action";

const formatNumber = (value, maximumFractionDigits = 2) => {
  const number = Number(value);
  return Number.isFinite(number)
    ? number.toLocaleString(undefined, { maximumFractionDigits })
    : "--";
};

const formatCurrency = (value) => {
  const number = Number(value);
  return Number.isFinite(number)
    ? `$${number.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : "--";
};

const Watchlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: watchlist, loading, error } = useSelector((state) => state.watchlist);
  const coins = watchlist?.coins ?? [];

  useEffect(() => {
    dispatch(getUserWatchlist(localStorage.getItem("jwt")));
  }, [dispatch]);

  const handleRemoveFromWatchlist = (coinId) => {
    dispatch(
      toggleWatchlistCoin({
        jwt: localStorage.getItem("jwt"),
        coinId,
      })
    );
  };

  return (
    <div className="p-5 lg:px-20">
      <h1 className="pb-5 text-3xl font-bold">Watchlist</h1>

      {loading && !watchlist ? (
        <p>Loading watchlist...</p>
      ) : error && !watchlist ? (
        <p role="alert" className="text-red-600">{error}</p>
      ) : coins.length === 0 ? (
        <p className="text-gray-500">Your watchlist is empty.</p>
      ) : (
        <>
          {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead className="py-5">Coin</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Market cap</TableHead>
                <TableHead>24h change</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right text-red-600">Remove</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coins.map((coin) => {
                const priceChange = Number(coin.price_change_percentage_24h);
                const hasPriceChange = Number.isFinite(priceChange);

                return (
                  <TableRow key={coin.id}>
                    <TableCell>
                      <button
                        type="button"
                        className="flex cursor-pointer items-center gap-2 font-medium hover:text-primary"
                        onClick={() => navigate(`/market/${coin.id}`)}
                      >
                        <Avatar>
                          <AvatarImage src={coin.image} alt={coin.name} />
                          <AvatarFallback>
                            {coin.symbol?.slice(0, 3).toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span>{coin.name}</span>
                      </button>
                    </TableCell>
                    <TableCell>{coin.symbol?.toUpperCase() ?? "--"}</TableCell>
                    <TableCell>{formatCurrency(coin.total_volume)}</TableCell>
                    <TableCell>{formatCurrency(coin.market_cap)}</TableCell>
                    <TableCell
                      className={
                        !hasPriceChange
                          ? "text-gray-500"
                          : priceChange < 0
                            ? "text-red-600"
                            : "text-green-600"
                      }
                    >
                      {hasPriceChange
                        ? `${priceChange > 0 ? "+" : ""}${formatNumber(priceChange, 4)}%`
                        : "--"}
                    </TableCell>
                    <TableCell>{formatCurrency(coin.current_price)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveFromWatchlist(coin.id)}
                        disabled={loading}
                        aria-label={`Remove ${coin.name} from watchlist`}
                        size="icon"
                        className="h-10 w-10"
                      >
                        <BookmarkFilledIcon className="h-6 w-6 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default Watchlist;
