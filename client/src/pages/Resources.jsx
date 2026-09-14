import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResourceCard } from '../components/resources/ResourceCard';
import { ResourceFilters } from '../components/resources/ResourceFilters';
import { ResourceCardSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { resourceService } from '../services/resourceService';
import { BookOpen, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const Resources = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from query params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    semester: searchParams.get('semester') || 'all',
    type: searchParams.get('type') || 'all',
    subject: searchParams.get('subject') || 'all',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page'), 10) || 1,
  });

  const [resources, setResources] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync state to URL params
  useEffect(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.semester && filters.semester !== 'all') params.semester = filters.semester;
    if (filters.type && filters.type !== 'all') params.type = filters.type;
    if (filters.subject && filters.subject !== 'all') params.subject = filters.subject;
    if (filters.sort && filters.sort !== 'newest') params.sort = filters.sort;
    if (filters.page > 1) params.page = filters.page.toString();

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Fetch data
  useEffect(() => {
    let isMounted = true;
    const fetchResources = async () => {
      setLoading(true);
      try {
        const queryParams = {
          search: filters.search,
          semester: filters.semester,
          type: filters.type,
          subject: filters.subject,
          sort: filters.sort,
          page: filters.page,
          limit: 12,
        };

        const res = await resourceService.getResources(queryParams);
        if (isMounted && res.success) {
          setResources(res.resources);
          setTotalCount(res.totalCount);
          setTotalPages(res.totalPages);
        }
      } catch (err) {
        console.error('Failed to fetch resources:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResources();

    return () => {
      isMounted = false;
    };
  }, [filters.search, filters.semester, filters.type, filters.subject, filters.sort, filters.page]);

  const handleReset = () => {
    setFilters({
      search: '',
      semester: 'all',
      type: 'all',
      subject: 'all',
      sort: 'newest',
      page: 1,
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Curated Repository</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Academic Resources
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover verified notes, semester PYQs, and revision guides shared by top students.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-xl self-start md:self-auto shadow-subtle">
          Showing <span className="text-slate-900 font-bold">{resources.length}</span> of{' '}
          <span className="text-brand-600 font-bold">{totalCount}</span> approved resources
        </div>
      </div>

      {/* Filter and Search Bar */}
      <ResourceFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleReset}
        totalCount={totalCount}
      />

      {/* Resource Grid / Loading / Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <ResourceCardSkeleton key={i} />
          ))}
        </div>
      ) : resources.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {resources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8 pb-4">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page <= 1}
                id="pagination-prev-btn"
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => handlePageChange(pNum)}
                      id={`pagination-page-${pNum}`}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                        filters.page === pNum
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= totalPages}
                id="pagination-next-btn"
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No resources match your filters"
          description="Try broadening your search term, changing the semester filter, or selecting a different resource type."
          actionText="Reset Filters"
          onActionClick={handleReset}
        />
      )}
    </div>
  );
};
