import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, Divider } from "@mui/material";
import Chart from "react-apexcharts";

const TemplateChart = () => {
  const [chartData, setChartData] = useState([]);
  const [selectedStockName, setSelectedStockName] = useState("");

  useEffect(() => {
    // Retrieve selectedStockName from local storage
    const savedStockName = localStorage.getItem("selectedStockName");
    if (savedStockName) {
      setSelectedStockName(savedStockName);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.allorigins.win/get?url=https://query1.finance.yahoo.com/v8/finance/chart/${selectedStockName}.IS`
        );

        if (response.data.contents) {
          const data = JSON.parse(response.data.contents);
          const result = data.chart.result[0];

          if (result) {
            const { timestamp, indicators } = result;
            const { quote } = indicators;
            const candleData = quote[0];

            const filteredChartData = timestamp.reduce((acc, time, index) => {
              const open = candleData.open[index];
              const high = candleData.high[index];
              const low = candleData.low[index];
              const close = candleData.close[index];

              if (
                open !== null &&
                high !== null &&
                low !== null &&
                close !== null
              ) {
                acc.push({
                  x: new Date(time * 1000),
                  y: [open, high, low, close],
                });
              }

              return acc;
            }, []);

            setChartData([{ data: filteredChartData }]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedStockName]); // Trigger fetch whenever selectedStockName changes

  useEffect(() => {
    // Listen for changes in selectedStockName and refresh the chart
    const refreshChart = () => {
      const savedStockName = localStorage.getItem("selectedStockName");
      if (savedStockName !== selectedStockName) {
        setSelectedStockName(savedStockName);
      }
    };

    window.addEventListener("storage", refreshChart);

    return () => {
      window.removeEventListener("storage", refreshChart);
    };
  }, [selectedStockName]);

  const options = {
    chart: {
      type: "candlestick",
      height: 500,
    },
    xaxis: {
      type: "datetime",
    },
  };

  return (
    <Card>
      <CardHeader title={`Stock Chart - ${selectedStockName}`} />
      <Divider />
      <CardContent>
        <Chart
          options={options}
          series={chartData}
          type="candlestick"
          width={1000}
        />
      </CardContent>
    </Card>
  );
};

export default TemplateChart;
