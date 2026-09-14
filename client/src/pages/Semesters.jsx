import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, ArrowRight, Download, Layers } from 'lucide-react';
import { resourceService } from '../services/resourceService';
import { SEMESTERS } from '../utils/constants';

export const Semesters = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await resourceService.getSemestersSummary();
        if (res.success) {
          setSummary(res.semesters);
        }
      } catch (err) {
        console.warn('Failed to load semesters summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4" />
          <span>Curriculum Map</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Browse by Semester
        </h1>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Select your university semester to view syllabus-aligned notes, past question papers, and lab manuals organized specifically for your coursework.
        </p>
      </div>

      {/* Grid of 8 Semesters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {SEMESTERS.map((sem) => {
          const semData = summary.find((s) => s.semester === sem);
          const totalResources = semData?.totalResources || 0;
          const subjectsCount = semData?.subjectsCount || 0;
          const subjects = semData?.subjects || [];

          return (
            <div
              key={sem}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-subtle hover:shadow-card hover:border-brand-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center font-black text-xl">
                    {sem}
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    {totalResources} {totalResources === 1 ? 'Resource' : 'Resources'}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-1">
                  Semester {sem}
                </h3>
                <p className="text-xs text-slate-500 mb-4 font-medium">
                  {subjectsCount > 0 ? `${subjectsCount} active subjects catalogued` : 'Resources available'}
                </p>

                {/* Popular subjects tag list */}
                {subjects.length > 0 && (
                  <div className="space-y-1 mb-6">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Popular Subjects:
                    </span>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {subjects.slice(0, 3).map((subj, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-100 truncate max-w-[200px]"
                        >
                          {subj}
                        </span>
                      ))}
                      {subjects.length > 3 && (
                        <span className="text-[10px] text-brand-600 font-semibold self-center">
                          +{subjects.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link
                to={`/semesters/${sem}`}
                id={`semester-explore-btn-${sem}`}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-brand-600 hover:text-white transition flex items-center justify-center gap-1.5 mt-2"
              >
                <span>Explore Semester {sem}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
