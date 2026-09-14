import React from 'react';

export const ResourceCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-subtle animate-pulse flex flex-col justify-between h-64">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
          <div className="h-5 w-24 bg-slate-200 rounded-full"></div>
        </div>
        <div className="h-6 w-3/4 bg-slate-200 rounded-lg mb-2"></div>
        <div className="h-4 w-full bg-slate-200 rounded mb-1.5"></div>
        <div className="h-4 w-2/3 bg-slate-200 rounded mb-4"></div>
      </div>
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 w-28 bg-slate-200 rounded"></div>
        <div className="h-8 w-20 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-slate-100 rounded-xl w-full"></div>
      ))}
    </div>
  );
};
