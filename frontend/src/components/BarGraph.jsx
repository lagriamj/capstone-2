import { Tooltip } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import PropTypes from "prop-types";

const BarGraph = ({ data, values1, values2, xValue, windowsHeight768 }) => {
  const formatDate = (dateString) => {
    // Assuming dateString is in the format "YYYY-MM-DD"
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" }); // Get short month name
    const day = date.getDate();
    return `${month} ${day}`;
  };

  return (
    <ResponsiveContainer width="100%" height={windowsHeight768 ? "80%" : "85%"}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xValue}
          {...(xValue === "date" && { tickFormatter: formatDate })}
        />
        <YAxis />
        <Tooltip />
        <Legend align="right" />
        <Bar dataKey={values1} name="Closed" fill="#8884d8" barSize={30} />
        <Bar dataKey={values2} name="Unclosed" fill="#82ca9d" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
};

BarGraph.propTypes = {
  data: PropTypes.object.isRequired,
  values1: PropTypes.any.isRequired,
  values2: PropTypes.any.isRequired,
  xValue: PropTypes.any.isRequired,
  windowsHeight768: PropTypes.bool.isRequired,
};

export default BarGraph;
