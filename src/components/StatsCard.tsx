interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: string;
  trendUp?: boolean;
}

const iconMap: Record<string, JSX.Element> = {
  total: (
    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  today: (
    <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  wallet: (
    <svg className="w-6 h-6 text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 110-6h5.25A2.25 2.25 0 0121 6v6zm0 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6" />
    </svg>
  ),
  rating: (
    <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
};

/** Reusable statistics card for dashboards */
export default function StatsCard({
  title,
  value,
  icon,
  trend,
  trendUp,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card-sm border border-gray-100 card-hover">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
          {iconMap[icon] || <span className="text-xl">{icon}</span>}
        </div>
        {trend && (
          <span
            className={`text-xs font-bold px-2 py-1 rounded-lg ${
              trendUp
                ? "text-green-600 bg-green-50"
                : "text-red-500 bg-red-50"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="text-muted text-xs mb-1">{title}</p>
      <p className="text-xl font-extrabold text-dark">{value}</p>
    </div>
  );
}
