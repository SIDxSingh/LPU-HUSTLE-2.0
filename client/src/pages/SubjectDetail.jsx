import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resourceService } from '../services/resourceService';
import { ResourceCard } from '../components/resources/ResourceCard';
import { ResourceCardSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { BookOpen, ArrowLeft, Filter, GraduationCap } from 'lucide-react';
import { RESOURCE_TYPES } from '../utils/constants';

export const SubjectDetail = () => {
  const { subjectName } = useParams();
  const [resources, setResources] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchSubjectResources = async () => {
      setLoading(true);
      try {
        const res = await resourceService.getResources({
          subject: subjectName,
          limit: 50,
        });
        if (isMounted && res.success) {
          setResources(res.resources);
        }
      } catch (err) {
        console.error('Failed to load subject resources:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSubjectResources();

    return () => {
      isMounted = false;
    };
  }, [subjectName]);

  const filteredResources = resources.filter((r) => {
    if (selectedType === 'all') return true;
    return r.type === selectedType;
  });

  const semester = resources[0]?.semester;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/resources"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Resources
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100 shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              {semester && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full mb-1">
                  <GraduationCap className="w-3.5 h-3.5" /> Semester {semester}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {subjectName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                All syllabus notes, solved previous year questions, and assignments.
              </p>
            </div>
          </div>

          <Link
            to={`/upload?subject=${encodeURIComponent(subjectName)}`}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white gradient-brand shadow-sm self-start md:self-auto"
          >
            + Contribute to {subjectName.split('(')[0]}
          </Link>
        </div>

        {/* Type Pills */}
        <div className="flex items-center gap-2 pt-6 mt-6 border-t border-slate-100 overflow-x-auto text-xs font-semibold">
          <span className="text-slate-400 mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter by Material:
          </span>
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-xl transition shrink-0 ${
              selectedType === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Materials ({resources.length})
          </button>
          {RESOURCE_TYPES.map((type) => {
            const count = resources.filter((r) => r.type === type).length;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-xl transition shrink-0 ${
                  selectedType === type
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <ResourceCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((res) => (
            <ResourceCard key={res._id} resource={res} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No ${selectedType} resources available for ${subjectName}`}
          description="Contribute your class notes or past question papers to fill this gap."
          actionText="Upload Resource"
          actionLink={`/upload?subject=${encodeURIComponent(subjectName)}`}
        />
      )}
    </div>
  );
};
