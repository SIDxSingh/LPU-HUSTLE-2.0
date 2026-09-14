import React from 'react';
import { Users, BookOpen, Clock, CheckCircle2, XCircle, Download } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export const StatCards = ({ stats }) => {
  const statItems = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      title: 'Total Resources',
      value: stats?.totalResources || 0,
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      title: 'Pending Review',
      value: stats?.pendingResources || 0,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      badge: stats?.pendingResources > 0 ? 'Requires Action' : null,
      highlight: stats?.pendingResources > 0,
    },
    {
      title: 'Approved',
      value: stats?.approvedResources || 0,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      title: 'Rejected',
      value: stats?.rejectedResources || 0,
      icon: XCircle,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
    },
    {
      title: 'Total Downloads',
      value: formatNumber(stats?.totalDownloads || 0),
      icon: Download,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl border bg-white shadow-subtle transition-all duration-200 ${
              item.highlight ? 'ring-2 ring-amber-400 border-amber-300' : 'border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <div className={`p-2 rounded-xl border ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              {item.badge && (
                <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{item.value}</p>
            <p className="text-xs font-semibold text-slate-500 truncate">{item.title}</p>
          </div>
        );
      })}
    </div>
  );
};
