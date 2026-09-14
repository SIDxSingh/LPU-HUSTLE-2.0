import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resourceService } from '../services/resourceService';
import { ResourceCard } from '../components/resources/ResourceCard';
import { ResourceCardSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { GraduationCap, BookOpen, Filter, ArrowLeft } from 'lucide-react';
import { RESOURCE_TYPES } from '../utils/constants';

export const SemesterDetail = () => {
  const { semId } = useParams();
  const [resources, setResources] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchSemesterData = async () => {
      setLoading(true);
      try {
        const [resList, subjList] = await Promise.all([
          resourceService.getResources({
            semester: semId,
            limit: 50,
          }),
          resourceService.getSubjectsList(semId),
        ]);

        if (isMounted) {
          if (resList.success) setResources(resList.resources);
          if (subjList.success) setSubjects(subjList.subjects);
        }
      } catch (err) {
        console.error('Failed to load semester details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSemesterData();

    return () => {
      isMounted = false;
    };
  }, [semId]);

  const filteredResources = resources.filter((r) => {
    const matchSubject =
      selectedSubject === 'all' ||
      r.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchType = selectedType === 'all' || r.type === selectedType;
    return matchSubject && matchType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <Link
        to="/semesters"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Semesters
      </Link>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-brand-500/20 shrink-0">
              {semId}
            </div>
            <div>
              <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-0.5">
                <GraduationCap className="w-4 h-4" />
                <span>Semester Curriculum</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Semester {semId} Resources
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Showing notes, question papers, and assignments catalogued for Semester {semId}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/upload?semester=${semId}`}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white gradient-brand shadow-sm hover:opacity-95 transition"
            >
              + Upload to Sem {semId}
            </Link>
          </div>
        </div>

        {/* Subjects in this semester */}
        {subjects.length > 0 && (
          <div className="pt-6 mt-6 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Filter by Course Subject:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSubject('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedSubject === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Subjects ({resources.length})
              </button>
              {subjects.map((sub, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSubject(sub.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                    selectedSubject === sub.name
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 opacity-70" />
                  <span>{sub.name}</span>
                  <span className="text-[10px] opacity-75 font-normal">({sub.count})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Type Filter */}
        <div className="flex items-center gap-2 pt-4 overflow-x-auto text-xs font-semibold">
          <span className="text-slate-400 mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 rounded-lg transition shrink-0 ${
              selectedType === 'all'
                ? 'bg-brand-50 text-brand-700 border border-brand-200 font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          {RESOURCE_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-lg transition shrink-0 ${
                selectedType === type
                  ? 'bg-brand-50 text-brand-700 border border-brand-200 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Resources grid */}
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
          title={`No resources found for Semester ${semId}`}
          description={
            selectedSubject !== 'all' || selectedType !== 'all'
              ? 'No resources match your selected subject and type filter in this semester.'
              : 'Be the first to contribute notes or question papers for this semester!'
          }
          actionText="Upload Resource"
          actionLink={`/upload?semester=${semId}`}
        />
      )}
    </div>
  );
};
