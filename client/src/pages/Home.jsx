import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  GraduationCap,
  UploadCloud,
  FileCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  Users,
  Download,
} from 'lucide-react';
import { ResourceCard } from '../components/resources/ResourceCard';
import { ResourceCardSkeleton } from '../components/common/LoadingSkeleton';
import { resourceService } from '../services/resourceService';
import { SEMESTERS } from '../utils/constants';

export const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredData, setFeaturedData] = useState({ popular: [], recent: [] });
  const [semestersSummary, setSemestersSummary] = useState([]);
  const [activeTab, setActiveTab] = useState('popular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, semRes] = await Promise.all([
          resourceService.getFeaturedResources(),
          resourceService.getSemestersSummary(),
        ]);
        if (featuredRes.success) {
          setFeaturedData(featuredRes);
        }
        if (semRes.success) {
          setSemestersSummary(semRes.semesters);
        }
      } catch (err) {
        console.warn('Failed to load home page featured items:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/resources?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/resources');
    }
  };

  const currentResources =
    activeTab === 'popular' ? featuredData.popular : featuredData.recent;

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" />
            <span>Academic Resource-Sharing Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            <span className="text-slate-500 font-medium">LPU Students</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15] mb-6">
            Your Academic Hustle,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600">
              Simplified.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Find notes, previous year questions (PYQs) and study material shared by students, for students. Never panic before end-term exams again.
          </p>

          {/* Hero Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto relative mb-8"
          >
            <div className="relative flex items-center shadow-xl shadow-brand-500/10 rounded-2xl bg-white border border-slate-200/80 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100 transition-all p-2">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                id="hero-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject (e.g. DBMS, Operating Systems, CSE205, Calculus)..."
                className="w-full px-3 py-2 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                id="hero-search-submit-btn"
                className="px-5 py-3 rounded-xl font-bold text-sm text-white gradient-brand hover:opacity-95 shadow-md shadow-brand-500/20 shrink-0 transition flex items-center gap-1.5"
              >
                <span>Find Notes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Metrics Pills */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Semesters 1 to 8 Covered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-500" />
              <span>Admin Verified Moderation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Direct PDF & PYQ Downloads</span>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Semester Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Structured Curriculum</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Browse by Semester
            </h2>
          </div>
          <Link
            to="/semesters"
            className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition"
          >
            View all semesters <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {SEMESTERS.map((sem) => {
            const semInfo = semestersSummary.find((s) => s.semester === sem);
            const count = semInfo?.totalResources || 0;

            return (
              <Link
                key={sem}
                to={`/semesters/${sem}`}
                id={`home-sem-card-${sem}`}
                className="group bg-white rounded-2xl border border-slate-200/80 p-4 text-center hover:border-brand-400 hover:shadow-card hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-brand-50 group-hover:text-brand-600 flex items-center justify-center font-black text-base mx-auto mb-2 transition">
                    {sem}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition">
                    Sem {sem}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-2">
                  {count} {count === 1 ? 'file' : 'files'}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Resources Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Curated Study Material</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Approved Academic Resources
            </h2>
          </div>

          {/* Toggle between Popular and Recent */}
          <div className="inline-flex p-1 rounded-xl bg-slate-200/70 border border-slate-300/60 text-xs font-bold">
            <button
              id="home-tab-popular"
              onClick={() => setActiveTab('popular')}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'popular'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-brand-600" />
              Most Popular
            </button>
            <button
              id="home-tab-recent"
              onClick={() => setActiveTab('recent')}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'recent'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-brand-600" />
              Recently Added
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <ResourceCardSkeleton key={i} />
            ))}
          </div>
        ) : currentResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentResources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
            No resources found in this category yet.
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            to="/resources"
            id="home-view-all-resources-btn"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-800 bg-white border border-slate-200 shadow-sm hover:border-brand-400 hover:text-brand-600 transition"
          >
            <span>Explore All Academic Resources</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Why LpuHustle Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
              Built for University Exam Success
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              LpuHustle solves the frantic last-minute WhatsApp group scramble by creating a organized, moderated repository of semester notes, syllabus handouts, and solved PYQ papers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-300 flex items-center justify-center mb-3">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base mb-1">Quality Moderation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every resource submitted by students is reviewed by moderators to ensure clarity, correct classification, and readability.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base mb-1">PYQ Solutions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Access categorized previous year question papers sorted by semester and subject to spot recurring exam patterns.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base mb-1">Community Driven</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Share your handwritten class notes and lab assignments to earn contribution stats on your user dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-50 border border-brand-200/80 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left shadow-sm">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              Have Great Notes or Solved PYQs?
            </h3>
            <p className="text-sm text-slate-600 max-w-xl">
              Help your university peers ace their examinations. Upload your semester notes, solved question papers, and lab manuals in seconds.
            </p>
          </div>

          <Link
            to="/upload"
            id="home-cta-contribute-btn"
            className="px-6 py-3.5 rounded-xl font-bold text-sm text-white gradient-brand hover:opacity-95 shadow-md shadow-brand-500/25 flex items-center gap-2 shrink-0 transition"
          >
            <UploadCloud className="w-5 h-5" />
            <span>Contribute Notes Now</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
