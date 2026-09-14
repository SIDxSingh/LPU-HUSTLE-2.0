export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const RESOURCE_TYPES = [
  'Notes',
  'PYQ',
  'Assignment',
  'Study Material',
  'Other',
];

export const RESOURCE_TYPE_CONFIG = {
  Notes: {
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    iconColor: 'text-blue-600',
    dotColor: 'bg-blue-500',
    badge: 'Notes',
  },
  PYQ: {
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColor: 'text-amber-600',
    dotColor: 'bg-amber-500',
    badge: 'PYQ',
  },
  Assignment: {
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    iconColor: 'text-purple-600',
    dotColor: 'bg-purple-500',
    badge: 'Assignment',
  },
  'Study Material': {
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconColor: 'text-emerald-600',
    dotColor: 'bg-emerald-500',
    badge: 'Study Material',
  },
  Other: {
    color: 'bg-slate-50 text-slate-700 border-slate-200',
    iconColor: 'text-slate-600',
    dotColor: 'bg-slate-500',
    badge: 'Other',
  },
};

export const POPULAR_SUBJECTS = [
  'Data Structures (CSE205)',
  'Database Management Systems (CSE325)',
  'Operating Systems (CSE316)',
  'Computer Networks (CSE320)',
  'Object Oriented Programming (CSE202)',
  'Mathematics-I (MTH166)',
  'Discrete Mathematics (MTH401)',
  'Engineering Physics (PHY110)',
  'Machine Learning (INT404)',
  'Design & Analysis of Algorithms (CSE306)',
  'Cloud Computing (CSE423)',
  'Web Technologies (CSE326)',
];

export const STATUS_CONFIG = {
  approved: {
    label: 'Approved',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  pending: {
    label: 'Pending Review',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
  },
};
