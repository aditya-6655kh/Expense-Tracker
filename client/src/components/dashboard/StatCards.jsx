import { Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount ?? 0);

const cards = [
  {
    key: "balance",
    title: "Total Balance",
    field: "balance",
    icon: Wallet,
    gradient: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
  },
  {
    key: "income",
    title: "Total Income",
    field: "income",
    icon: ArrowUpRight,
    gradient: "linear-gradient(135deg, #047857 0%, #059669 100%)",
  },
  {
    key: "expense",
    title: "Total Expenses",
    field: "expense",
    icon: ArrowDownRight,
    gradient: "linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)",
  },
];

const StatCards = ({ stats = {} }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, i) => {
        const amount = stats[card.field] ?? stats[card.field + "s"] ?? 0;
        return (
          <div
            key={card.key}
            className={`relative overflow-hidden rounded-2xl p-5 shadow-md card-hover fade-up-${i + 1}`}
            style={{ background: card.gradient }}
          >
            {/* Decorative shapes */}
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white opacity-[0.08]" />
            <div className="absolute -right-2 -bottom-6 w-28 h-28 rounded-full bg-white opacity-[0.04]" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-1.5">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold text-white font-display">
                  {formatCurrency(amount)}
                </h3>
              </div>
              <div className="bg-white/15 p-2.5 rounded-xl">
                <card.icon size={20} className="text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCards;
