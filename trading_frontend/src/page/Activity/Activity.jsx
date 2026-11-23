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
import { getAllOrdersForUser } from "@/State/Order/Action";

const formatCurrency = (value) => {
  if (value == null || !Number.isFinite(Number(value))) return "--";

  return `$${Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
};

const formatQuantity = (value) => {
  if (value == null || !Number.isFinite(Number(value))) return "--";

  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 8,
  });
};

const formatDateTime = (value) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) {
    return { date: "--", time: "--" };
  }

  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString(),
  };
};

const Activity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(
      getAllOrdersForUser({
        jwt: localStorage.getItem("jwt"),
      })
    );
  }, [dispatch]);

  const sortedOrders = [...orders].sort((a, b) => {
    const timeDifference =
      new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime();
    return timeDifference || Number(b.id) - Number(a.id);
  });

  return (
    <div className="p-5 lg:px-20">
      <h1 className="pb-5 text-3xl font-bold">Activity</h1>

      {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}

      {loading && orders.length === 0 ? (
        <p>Loading activity...</p>
      ) : sortedOrders.length === 0 ? (
        <p className="text-gray-500">You do not have any trading activity yet.</p>
      ) : (
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="py-5">Date &amp; Time</TableHead>
              <TableHead>Trading Pair</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Buy Price</TableHead>
              <TableHead>Sell Price</TableHead>
              <TableHead>Order Type</TableHead>
              <TableHead>Profit/Loss</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrders.map((order) => {
              const coin = order.orderItem?.coin ?? {};
              const quantity = Number(order.orderItem?.quantity);
              const buyPrice = Number(order.orderItem?.buyPrice);
              const sellPrice = Number(order.orderItem?.sellPrice);
              const hasProfitLoss =
                order.orderType === "SELL" &&
                Number.isFinite(quantity) &&
                Number.isFinite(buyPrice) &&
                Number.isFinite(sellPrice);
              const profitLoss = hasProfitLoss
                ? (sellPrice - buyPrice) * quantity
                : null;
              const dateTime = formatDateTime(order.timeStamp);
              const symbol = coin.symbol?.toUpperCase() ?? "";

              return (
                <TableRow key={order.id}>
                  <TableCell>
                    <p>{dateTime.date}</p>
                    <p className="text-gray-500">{dateTime.time}</p>
                  </TableCell>
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
                      <span>{coin.name || symbol || "--"}</span>
                    </button>
                  </TableCell>
                  <TableCell>
                    {formatQuantity(order.orderItem?.quantity)} {symbol}
                  </TableCell>
                  <TableCell>{formatCurrency(order.orderItem?.buyPrice)}</TableCell>
                  <TableCell>
                    {order.orderType === "SELL"
                      ? formatCurrency(order.orderItem?.sellPrice)
                      : "--"}
                  </TableCell>
                  <TableCell>{order.orderType ?? "--"}</TableCell>
                  <TableCell
                    className={
                      profitLoss == null
                        ? "text-gray-500"
                        : profitLoss < 0
                          ? "text-red-600"
                          : "text-green-600"
                    }
                  >
                    {profitLoss == null ? "--" : formatCurrency(profitLoss)}
                  </TableCell>
                  <TableCell>{order.status ?? "--"}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(order.price)}
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

export default Activity;
