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

const LineGraph = ({ data }) => {
  const renderCustomLabel = (value) => {
    if (value === "totalRequests") {
      return "Total Requests";
    } else if (value === "closedRequests") {
      return "Closed Requests";
    }
    return value;
  };

  const formatDate = (dateString) => {
    // Assuming dateString is in the format "YYYY-MM-DD"
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" }); // Get short month name
    const day = date.getDate();
    return `${month} ${day}`;
  };

  return (
    <ResponsiveContainer width="100%" height="90%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate} // Format the tick values using formatDate function
        />
        <YAxis />
        <Tooltip />
        <Legend align="right" formatter={renderCustomLabel} />
        <Line
          type="monotone"
          dataKey="totalRequests"
          name="Total Requests"
          stroke="#8884d8"
          strokeWidth={4}
          fontSize={12}
        />
        <Line
          type="monotone"
          dataKey="closedRequests"
          name="Closed Requests"
          stroke="#82ca9d"
          strokeWidth={4}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

LineGraph.propTypes = {
  data: PropTypes.object.isRequired,
};

export default LineGraph;
