import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchCoin } from "@/State/Coin/Action";

const SearchCoin = () => {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchCoinList, loading, error } = useSelector((state) => state.coin);

  const handleSearch = (event) => {
    event.preventDefault();
    setHasSearched(true);
    dispatch(searchCoin(query));
  };

  return (
    <div className="mx-auto w-full max-w-3xl p-5 pt-10">
      <h1 className="mb-6 text-3xl font-bold">Search coins</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by coin name or symbol"
          aria-label="Search by coin name or symbol"
        />
        <Button type="submit" disabled={loading} aria-label="Search">
          <MagnifyingGlassIcon />
          <span className="ml-2">{loading ? "Searching..." : "Search"}</span>
        </Button>
      </form>

      {error && <p role="alert" className="mt-4 text-red-600">{error}</p>}

      {loading ? (
        <p className="mt-6 text-gray-500">Searching coins...</p>
      ) : searchCoinList.length > 0 ? (
        <div className="mt-6 divide-y rounded-lg border">
          {searchCoinList.map((coin) => (
            <button
              key={coin.id}
              type="button"
              className="flex w-full cursor-pointer items-center gap-4 p-4 text-left hover:bg-muted"
              onClick={() => navigate(`/market/${coin.id}`)}
            >
              <Avatar>
                <AvatarImage src={coin.thumb ?? coin.large} alt={coin.name} />
                <AvatarFallback>
                  {coin.symbol?.slice(0, 3).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{coin.name}</span>
                <span className="text-sm text-gray-500">
                  {coin.symbol?.toUpperCase() ?? "--"}
                </span>
              </span>
              {coin.market_cap_rank != null && (
                <span className="text-sm text-gray-500">
                  Rank #{coin.market_cap_rank}
                </span>
              )}
            </button>
          ))}
        </div>
      ) : hasSearched ? (
        <p className="mt-6 text-gray-500">
          {query.trim() ? "No coins found." : "Enter a coin name or symbol to search."}
        </p>
      ) : (
        <p className="mt-6 text-gray-500">Search for a coin by name or symbol.</p>
      )}
    </div>
  );
};

export default SearchCoin;
