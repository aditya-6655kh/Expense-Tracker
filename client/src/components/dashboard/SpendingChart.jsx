import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown } from "lucide-react";

const COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#db2777", "#0284c7", "#4f46e5"];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount ?? 0);

const SpendingChart = ({ data = [] }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border-light)] p-6 flex flex-col">
      <div className="mb-5">
        <h3 className="font-bold font-display text-[var(--color-text)]">Spending Breakdown</h3>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">By category</p>
      </div>

      {data.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  background: "white",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-md)",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="mt-4 space-y-2">
            {data.slice(0, 6).map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-[var(--color-text-secondary)] truncate max-w-[120px]">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-[var(--color-text)]">
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <TrendingDown size={22} className="text-purple-300" />
          </div>
          <p className="text-[var(--color-text-secondary)] font-medium text-sm">No expense data</p>
          <p className="text-[var(--color-text-muted)] text-xs mt-1">Add expenses to see breakdown</p>
        </div>
      )}
    </div>
  );
};

export default SpendingChart;
