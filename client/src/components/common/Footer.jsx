import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, BookOpen, Shield, Github } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Lpu<span className="text-brand-400">Hustle</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Your Academic Hustle, Simplified." A verified peer-to-peer study platform built for university students to share notes, PYQs, and study materials.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Moderated Quality
              </span>
              <span>•</span>
              <span>100% Free & Open</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/resources" className="hover:text-white transition">
                  All Resources
                </Link>
              </li>
              <li>
                <Link to="/semesters" className="hover:text-white transition">
                  Browse Semesters
                </Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-white transition">
                  Upload Notes & PYQs
                </Link>
              </li>
              <li>
                <Link to="/resources?type=PYQ" className="hover:text-white transition">
                  Previous Year Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Semesters */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Semesters
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <Link
                  key={sem}
                  to={`/semesters/${sem}`}
                  className="hover:text-white transition hover:translate-x-0.5 inline-block"
                >
                  Semester {sem}
                </Link>
              ))}
            </div>
          </div>

          {/* Guidelines & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Academic Hub
            </h4>
            <p className="text-xs leading-relaxed text-slate-400 mb-3">
              All materials uploaded are shared by students for educational and revision purposes under fair use.
            </p>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
              <span className="text-brand-400 font-semibold">Moderation Notice:</span>
              <p className="text-slate-400 mt-1">
                All submissions undergo admin review before public release.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} LpuHustle. Built for University Students.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for student success
          </p>
        </div>
      </div>
    </footer>
  );
};
