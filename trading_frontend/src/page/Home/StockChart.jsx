import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ReactApexChart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchMarketChart } from "@/State/Coin/Action";

const timeSeries = [
    {
        label: "1 Day",
        value: 1,
    },
    {
        label: "1 Week",
        value: 7,
    },
    {
        label: "1 Month",
        value: 30,
    },
];
const StockChart = ({coinId}) => {

    const dispatch = useDispatch()
    const marketChart = useSelector((store) => store.coin.marketChart);

    const [activeLabel, setActiveLabel] = useState("1 Day");
    const activePeriod = timeSeries.find((item) => item.label === activeLabel) ?? timeSeries[0];
    const hasCurrentChart =
        marketChart.coinId === coinId && marketChart.days === activePeriod.value;
    const isCurrentRequest =
        marketChart.requestedCoinId === coinId &&
        marketChart.requestedDays === activePeriod.value;

    const series = [
      {
        data: hasCurrentChart ? marketChart.data : [],
      },
    ];

    const options = {
        chart: {
            id: 'area-datetime',
            type: 'area',
            height: 450,
            zoom: {
                autoScaleYaxis: true
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            type: 'datetime',
            tickAmount: 6
        },
        markers: {
            colors: ['#fff'],
            strokeColors: '#fff',
            strokeWidth: 1,
            size: 0,
            style: 'hollow',
        },
        tooltip: {
            theme: 'dark'
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 100]
            },
        },
        grid: {
            borderColor: '#47535E',    
            show: true,
            strokeDashArray: 4,
        }
    };

    const handleActiveLabel = (value) => {
        setActiveLabel(value);
    }

    useEffect(() => {
        if (coinId) {
            dispatch(fetchMarketChart({coinId, days: activePeriod.value}));
        }
    }, [dispatch, coinId, activePeriod.value])
  return (
    <div>
        <div className="space-x-3">
            {timeSeries.map((item) => 
                <Button variant={activeLabel === item.label ? "default" : "outline"} onClick={() => handleActiveLabel(item.label)} key={item.label}>
                    {item.label}
                </Button>
            )}
        </div>

      <div id="chart-timeline">
        {hasCurrentChart && marketChart.data.length > 0 && (
            <ReactApexChart options={options} series={series} type="area" height={450} />
        )}
        {isCurrentRequest && marketChart.loading && !hasCurrentChart ? (
            <p className="py-4 text-gray-500">Loading chart...</p>
        ) : null}
        {isCurrentRequest && marketChart.error ? (
            <div className="py-4 text-red-600" role="alert">
                <p>
                    {hasCurrentChart && marketChart.data.length > 0
                        ? "Showing the last loaded chart. "
                        : "Could not load chart: "}
                    {marketChart.error}
                </p>
                <Button
                    className="mt-2"
                    variant="outline"
                    onClick={() =>
                        dispatch(fetchMarketChart({coinId, days: activePeriod.value}))
                    }
                >
                    Retry chart
                </Button>
            </div>
        ) : null}
        {!hasCurrentChart && !isCurrentRequest ? (
            <p className="py-4 text-gray-500">Loading chart...</p>
        ) : null}
        {hasCurrentChart && !isCurrentRequest && marketChart.data.length === 0 ? (
            <p className="py-4 text-gray-500">No chart data available.</p>
        ) : null}
      </div>
    </div>
  )
}

export default StockChart
