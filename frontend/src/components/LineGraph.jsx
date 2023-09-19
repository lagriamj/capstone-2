import { Tooltip } from "antd";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import PropTypes from "prop-types";

const LineGraph = ({ data, values1, values2, xValue, windowsHeight768 }) => {
  const formatDate = (dateString) => {
    // Assuming dateString is in the format "YYYY-MM-DD"
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" }); // Get short month name
    const day = date.getDate();
    return `${month} ${day}`;
  };

  //const maxValues1 = Math.max(...data.map((item) => item[values1]));
  //const maxValues2 = Math.max(...data.map((item) => item[values2]));
  //const maxValue = Math.max(maxValues1, maxValues2) + 1;

  return (
    <ResponsiveContainer width="100%" height={windowsHeight768 ? "80%" : "85%"}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xValue}
          {...(xValue === "date" && { tickFormatter: formatDate })}
        />
        <YAxis />
        <Tooltip />
        <Legend align="right" />
        <Line
          type="monotone"
          dataKey={values1}
          name="Closed"
          stroke="#8884d8"
          strokeWidth={4}
          fontSize={12}
        />
        <Line
          type="monotone"
          dataKey={values2}
          name="Unclosed"
          stroke="#82ca9d"
          strokeWidth={4}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

LineGraph.propTypes = {
  data: PropTypes.object.isRequired,
  values1: PropTypes.any.isRequired,
  values2: PropTypes.any.isRequired,
  xValue: PropTypes.any.isRequired,
  windowsHeight768: PropTypes.bool.isRequired,
};

export default LineGraph;
