import React from 'react';
import { formatDate } from '../../utils/formatters';
import { Shield, UserCheck } from 'lucide-react';

export const UserTable = ({ users }) => {
  if (!users || users.length === 0) {
    return <div className="text-center p-8 text-xs text-slate-500">No users found.</div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200/80">
            <tr>
              <th className="py-3.5 px-4">Student</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Semester</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Total Submissions</th>
              <th className="py-3.5 px-4">Approved</th>
              <th className="py-3.5 px-4">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/60 transition">
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  {u.name}
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-600">
                  {u.email}
                </td>
                <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                  Sem {u.semester}
                </td>
                <td className="py-3.5 px-4">
                  {u.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Shield className="w-3 h-3 text-amber-600" /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      <UserCheck className="w-3 h-3 text-slate-500" /> Student
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-xs font-bold text-slate-800">
                  {u.uploadsCount || 0}
                </td>
                <td className="py-3.5 px-4 text-xs font-bold text-emerald-600">
                  {u.approvedCount || 0}
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-400 whitespace-nowrap">
                  {formatDate(u.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
