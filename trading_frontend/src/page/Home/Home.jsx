import { Button } from "@/components/ui/button";
import AssetTable from "./AssetTable";
import React, { useEffect } from "react";
import StockChart from "./StockChart";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DotIcon } from "@radix-ui/react-icons";
import { useDispatch, useSelector } from "react-redux";
import { getCoinList, getTop50CoinList } from "@/State/Coin/Action";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const Home = () => {
  const pageSize = 10;
  const [category, setCategory] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const {coin} = useSelector(store => store)
  const dispatch = useDispatch()
  const pageCount = Math.ceil(coin.top50.length / pageSize);
  const displayedCoins = category === "all"
    ? coin.coinList
    : coin.top50.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const coinListLoading = category === "all" ? coin.coinListLoading : coin.top50Loading;
  const coinListError = category === "all" ? coin.coinListError : coin.top50Error;
  const canGoToNextPage = category === "all"
    ? coin.coinList.length === pageSize
    : currentPage < pageCount;
  const pageNumbers = category === "all"
    ? (currentPage <= 3
      ? [1, 2, 3]
      : [1, currentPage - 1, currentPage, currentPage + 1])
    : Array.from({length: pageCount}, (_, index) => index + 1);

  const handleCategory = (value) => {
    setCategory(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (category === "all") {
      dispatch(getCoinList(currentPage));
    } else {
      dispatch(getTop50CoinList());
    }
  }, [category, currentPage, dispatch]);

  return (
    <div className="relative">
      <div className="lg:flex">
        <div className="lg:w-[50%] lg:border-r">
          <div className="p-3 flex items-center gap-4">
            <Button
              onClick={() => handleCategory("all")}
              variant={category == "all" ? "default" : "outline"}
              className="rounded-full"
            >
              All
            </Button>
            <Button
              onClick={() => handleCategory("top50")}
              variant={category == "top50" ? "default" : "outline"}
              className="rounded-full"
            >
              Top 50
            </Button>
            <Button
              onClick={() => handleCategory("topGainers")}
              variant={category == "topGainers" ? "default" : "outline"}
              className="rounded-full"
            >
              Top Gainers
            </Button>
            <Button
              onClick={() => handleCategory("topLosers")}
              variant={category == "topLosers" ? "default" : "outline"}
              className="rounded-full"
            >
              Top Losers
            </Button>
          </div>
          {coinListLoading ? (
            <p className="p-4 text-gray-500">Loading coins...</p>
          ) : coinListError ? (
            <div className="p-4 text-red-600" role="alert">
              <p>Could not load coins: {coinListError}</p>
              <Button
                className="mt-2"
                variant="outline"
                onClick={() =>
                  dispatch(category === "all" ? getCoinList(currentPage) : getTop50CoinList())
                }
              >
                Retry
              </Button>
            </div>
          ) : displayedCoins.length > 0 ? (
            <AssetTable coin={displayedCoins} category={category} />
          ) : (
            <p className="p-4 text-gray-500">No coins available.</p>
          )}
          <div className="-mt-2 py-1">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    aria-disabled={currentPage === 1}
                    tabIndex={currentPage === 1 ? -1 : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={`h-10 px-3 text-base [&_svg:not([class*='size-'])]:size-5 ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                  />
                </PaginationItem>
                {pageNumbers.map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === pageNumber}
                      aria-label={`Go to page ${pageNumber}`}
                      className="h-10 min-w-10 px-3 text-base"
                      onClick={(event) => {
                        event.preventDefault();
                        setCurrentPage(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {category === "all" && canGoToNextPage && (
                  <PaginationItem>
                    <PaginationEllipsis className="size-10 [&_svg:not([class*='size-'])]:size-5" />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    aria-disabled={!canGoToNextPage}
                    tabIndex={!canGoToNextPage ? -1 : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      if (canGoToNextPage) setCurrentPage(currentPage + 1);
                    }}
                    className={`h-10 px-3 text-base [&_svg:not([class*='size-'])]:size-5 ${!canGoToNextPage ? "pointer-events-none opacity-50" : ""}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

        <div className="w-full p-5 lg:w-[50%]">
          <StockChart coinId="bitcoin" />

          <div className="flex gap-5 item-center">
            <div>
              <Avatar>
                <AvatarImage src="https://imgs.search.brave.com/QlbJL9MSDfanEuM2QM7pAng9wJb51u7HghyYiBcONvc/rs:fit:40:40:1:0/g:ce/aHR0cHM6Ly9jb2lu/LWltYWdlcy5jb2lu/Z2Vja28uY29tL2Nv/aW5zL2ltYWdlcy8x/L2xhcmdlL2JpdGNv/aW4ucG5nPzE2OTY1/MDE0MDA" />
              </Avatar>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p>BTC</p>
                <DotIcon className="text-gray-400" />
                <p className="text-gray-400">Bitcoin</p>
              </div>

              <div className="flex items-end gap-2">
                <p className="text-xl font-bold">$69249</p>
                <p className="text-red-600">
                  <span>-1319822.578</span>
                  <span>(-0.29803%)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
