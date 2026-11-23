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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserAsset } from "@/State/Asset/Action";

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

const formatChange = (value) => {
  if (value == null || !Number.isFinite(Number(value))) return "--";

  const number = Number(value);
  return `${number > 0 ? "+" : number < 0 ? "-" : ""}${formatCurrency(Math.abs(number))}`;
};

const Portfolio = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { asset } = useSelector((state) => state);
  const userAssets = Array.isArray(asset.userAsset) ? asset.userAsset : [];

  useEffect(() => {
    dispatch(getUserAsset(localStorage.getItem("jwt")));
  }, [dispatch]);

  const totalValue = userAssets.reduce((total, holding) => {
    const price = Number(holding.coin?.current_price);
    const quantity = Number(holding.quantity);
    return Number.isFinite(price) && Number.isFinite(quantity)
      ? total + price * quantity
      : total;
  }, 0);

  return (
    <div className="p-5 lg:px-20">
      <h1 className="pb-5 text-3xl font-bold">Portfolio</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-5">
          <p className="text-sm text-gray-500">Portfolio value</p>
          <p className="mt-1 text-2xl font-semibold">{formatCurrency(totalValue)}</p>
        </div>
        <div className="rounded-lg border p-5">
          <p className="text-sm text-gray-500">Assets held</p>
          <p className="mt-1 text-2xl font-semibold">{userAssets.length}</p>
        </div>
      </div>

      {asset.loading && userAssets.length === 0 ? (
        <p>Loading portfolio...</p>
      ) : asset.error ? (
        <p role="alert" className="text-red-600">{asset.error}</p>
      ) : userAssets.length === 0 ? (
        <p className="text-gray-500">You do not have any assets yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>24h Change</TableHead>
              <TableHead>Change (%)</TableHead>
              <TableHead className="text-right">Holding Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userAssets.map((holding) => {
              const coin = holding.coin ?? {};
              const currentPrice = Number(coin.current_price);
              const quantity = Number(holding.quantity);
              const holdingValue =
                Number.isFinite(currentPrice) && Number.isFinite(quantity)
                  ? currentPrice * quantity
                  : null;
              const priceChange = coin.price_change_24h;
              const percentageChange = coin.price_change_percentage_24h;
              const isNegative =
                Number(priceChange) < 0 || Number(percentageChange) < 0;
              const symbol = coin.symbol?.toUpperCase() ?? "";

              return (
                <TableRow key={holding.id}>
                  <TableCell>
                    <button
                      type="button"
                      className="flex cursor-pointer items-center gap-2 font-medium hover:text-primary"
                      onClick={() => coin.id && navigate(`/market/${coin.id}`)}
                    >
                      <Avatar>
                        <AvatarImage src={coin.image} alt={coin.name ?? symbol} />
                        <AvatarFallback>{symbol.slice(0, 3) || "?"}</AvatarFallback>
                      </Avatar>
                      <span>{coin.name || symbol || "Unknown asset"}</span>
                    </button>
                  </TableCell>
                  <TableCell>{formatCurrency(currentPrice)}</TableCell>
                  <TableCell>
                    {formatNumber(quantity, 8)} {symbol}
                  </TableCell>
                  <TableCell className={isNegative ? "text-red-600" : "text-green-600"}>
                    {formatChange(priceChange)}
                  </TableCell>
                  <TableCell className={isNegative ? "text-red-600" : "text-green-600"}>
                    {percentageChange == null || !Number.isFinite(Number(percentageChange))
                      ? "--"
                      : `${Number(percentageChange) > 0 ? "+" : ""}${formatNumber(percentageChange, 4)}%`}
                  </TableCell>
                  <TableCell className="text-right">
                    {holdingValue == null ? "--" : formatCurrency(holdingValue)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Portfolio;
