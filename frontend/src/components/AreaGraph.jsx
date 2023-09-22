import { Tooltip } from "antd";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import PropTypes from "prop-types";

const AreaGraph = ({ data, values1, values2, xValue, windowsHeight768 }) => {
  const formatDate = (dateString) => {
    // Assuming dateString is in the format "YYYY-MM-DD"
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" }); // Get short month name
    const day = date.getDate();
    return `${month} ${day}`;
  };

  {
    /*const max = Math.max(
    ...data.map((item) => Math.max(item.values1, item.values2))
  );*/
  }

  // Create an array of ticks from 0 to the maximum value
  //const ticks = Array.from({ length: max + 1 }, (_, index) => index);

  //const maxValues1 = Math.max(...data.map((item) => item[values1]));
  //const maxValues2 = Math.max(...data.map((item) => item[values2]));
  //const maxValue = Math.max(maxValues1, maxValues2) + 1;

  return (
    <ResponsiveContainer width="100%" height={windowsHeight768 ? "70%" : "85%"}>
      <AreaChart
        width="100%"
        height="90%"
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id={values1} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id={values2} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey={xValue}
          {...(xValue === "date" && { tickFormatter: formatDate })}
        />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Legend align="right" />

        <Tooltip />
        <Area
          type="monotone"
          dataKey={values1}
          name="Closed"
          stroke="#8884d8"
          fillOpacity={1}
          fill={`url(#${values1})`}
        />
        <Area
          type="monotone"
          dataKey={values2}
          name="Unclosed"
          stroke="#82ca9d"
          fillOpacity={1}
          fill={`url(#${values2})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

AreaGraph.propTypes = {
  data: PropTypes.object.isRequired,
  values1: PropTypes.any.isRequired,
  values2: PropTypes.any.isRequired,
  xValue: PropTypes.any.isRequired,
  windowsHeight768: PropTypes.bool.isRequired,
};

export default AreaGraph;
