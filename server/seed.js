require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const User = require('./models/User');
const Resource = require('./models/Resource');
const Report = require('./models/Report');

// Ensure sample file exists in uploads folder for local previews
const ensureSampleFile = () => {
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const sampleFilePath = path.join(uploadsDir, 'sample-study-guide.pdf');
  if (!fs.existsSync(sampleFilePath)) {
    // Minimal standard PDF header for valid PDF format preview
    const minimalPdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 174 >>
stream
BT
/F1 24 Tf
100 700 Td
(LpuHustle - Academic Resource Platform) Tj
/F1 14 Tf
0 -40 Td
(Verified Student Study Material & Exam Prep Guide) Tj
0 -30 Td
(Your Academic Hustle, Simplified.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000227 00000 n 
0000000452 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
525
%%EOF`;
    fs.writeFileSync(sampleFilePath, minimalPdf);
  }
  return `/uploads/sample-study-guide.pdf`;
};

const seedDatabase = async (shouldExit = false) => {
  try {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Resource.deleteMany({}),
      Report.deleteMany({}),
    ]);

    const sampleUrl = ensureSampleFile();
    const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
    const fileUrl = `${serverUrl}${sampleUrl}`;

    console.log('[Seed] Creating user accounts...');

    // 1. Admin Account
    const admin = await User.create({
      name: 'LpuHustle Administrator',
      email: 'admin@lpuhustle.com',
      password: 'Admin@123',
      semester: 6,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    // 2. Student Accounts
    const rahul = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul.sharma@lpuhustle.com',
      password: 'Student@123',
      semester: 5,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    });

    const priya = await User.create({
      name: 'Priya Patel',
      email: 'priya.patel@lpuhustle.com',
      password: 'Student@123',
      semester: 3,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    });

    const aman = await User.create({
      name: 'Aman Verma',
      email: 'aman.verma@lpuhustle.com',
      password: 'Student@123',
      semester: 4,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    });

    const ananya = await User.create({
      name: 'Ananya Singh',
      email: 'ananya.singh@lpuhustle.com',
      password: 'Student@123',
      semester: 7,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    });

    console.log('[Seed] Seeding academic resources...');

    const sampleResources = [
      // Semester 1
      {
        title: 'Calculus and Linear Algebra Complete Notes',
        description: 'Comprehensive handwritten unit 1-5 notes for Calculus, Matrix transformations, eigenvalues, and multivariable integration with worked examples.',
        subject: 'Mathematics-I (MTH166)',
        semester: 1,
        type: 'Notes',
        fileUrl,
        fileType: 'pdf',
        fileSize: 3450000,
        originalFileName: 'MTH166_Complete_Calculus_Notes.pdf',
        uploadedBy: rahul._id,
        status: 'approved',
        downloads: 248,
        views: 610,
      },
      {
        title: 'Engineering Physics End-Term PYQ (2021-2025)',
        description: 'Solved Previous Year Questions for Engineering Physics covering Wave Optics, Quantum Mechanics, and Electrodynamics.',
        subject: 'Engineering Physics (PHY110)',
        semester: 1,
        type: 'PYQ',
        fileUrl,
        fileType: 'pdf',
        fileSize: 4200000,
        originalFileName: 'PHY110_PYQ_Solved_2021_2025.pdf',
        uploadedBy: priya._id,
        status: 'approved',
        downloads: 312,
        views: 740,
      },
      // Semester 2
      {
        title: 'Object-Oriented Programming in C++ Lab Manual & Notes',
        description: 'Detailed code snippets, OOP concepts, Polymorphism, Inheritance, Templates, and exception handling for semester 2 practicals.',
        subject: 'Object Oriented Programming (CSE202)',
        semester: 2,
        type: 'Study Material',
        fileUrl,
        fileType: 'pdf',
        fileSize: 2800000,
        originalFileName: 'CSE202_CPP_Master_Notes.pdf',
        uploadedBy: aman._id,
        status: 'approved',
        downloads: 410,
        views: 920,
      },
      {
        title: 'Basic Electrical and Electronics PYQs with Marking Scheme',
        description: 'Official PYQs from 2022 to 2025 with step-by-step circuit analysis, KCL/KVL, AC circuits, and Op-Amp derivations.',
        subject: 'Basic Electrical Engineering (ECE131)',
        semester: 2,
        type: 'PYQ',
        fileUrl,
        fileType: 'pdf',
        fileSize: 1950000,
        originalFileName: 'ECE131_Solved_PYQ.pdf',
        uploadedBy: rahul._id,
        status: 'approved',
        downloads: 180,
        views: 430,
      },
      // Semester 3
      {
        title: 'Data Structures & Algorithms Master Handwritten Notes',
        description: 'In-depth notes on Arrays, Linked Lists, Stacks, Queues, Binary Trees, AVL Trees, Heaps, Graph traversals (BFS/DFS), and asymptotic notation.',
        subject: 'Data Structures (CSE205)',
        semester: 3,
        type: 'Notes',
        fileUrl,
        fileType: 'pdf',
        fileSize: 5600000,
        originalFileName: 'DSA_CSE205_Complete_Notes.pdf',
        uploadedBy: priya._id,
        status: 'approved',
        downloads: 850,
        views: 1890,
      },
      {
        title: 'Discrete Mathematical Structures PYQs with Proofs',
        description: 'Compilation of previous year questions on Propositional Logic, Set Theory, Recurrence Relations, and Graph Theory.',
        subject: 'Discrete Mathematics (MTH401)',
        semester: 3,
        type: 'PYQ',
        fileUrl,
        fileType: 'pdf',
        fileSize: 2100000,
        originalFileName: 'MTH401_Discrete_Math_PYQs.pdf',
        uploadedBy: aman._id,
        status: 'approved',
        downloads: 295,
        views: 680,
      },
      // Semester 4
      {
        title: 'Operating Systems Concept Notes & Deadlock Handout',
        description: 'CPU scheduling algorithms (Round Robin, SJF, Priority), Semaphore synchronization, Paging, Page replacement algorithms, and Virtual memory.',
        subject: 'Operating Systems (CSE316)',
        semester: 4,
        type: 'Notes',
        fileUrl,
        fileType: 'pdf',
        fileSize: 3900000,
        originalFileName: 'CSE316_OS_Complete_Handwritten.pdf',
        uploadedBy: rahul._id,
        status: 'approved',
        downloads: 620,
        views: 1450,
      },
      {
        title: 'Design and Analysis of Algorithms (DAA) Lab Assignments',
        description: 'Solved assignments including Divide & Conquer, Greedy Algorithms, Dynamic Programming (0/1 Knapsack, LCS), and Backtracking.',
        subject: 'Design & Analysis of Algorithms (CSE306)',
        semester: 4,
        type: 'Assignment',
        fileUrl,
        fileType: 'pdf',
        fileSize: 2300000,
        originalFileName: 'CSE306_DAA_Solved_Assignments.pdf',
        uploadedBy: ananya._id,
        status: 'approved',
        downloads: 380,
        views: 810,
      },
      // Semester 5
      {
        title: 'DBMS Comprehensive Notes & Complete SQL Cheatsheet',
        description: 'Complete ER modeling, Relational Algebra, Normalization (1NF, 2NF, 3NF, BCNF), ACID properties, Transaction Management, and Indexing.',
        subject: 'Database Management Systems (CSE325)',
        semester: 5,
        type: 'Notes',
        fileUrl,
        fileType: 'pdf',
        fileSize: 4800000,
        originalFileName: 'CSE325_DBMS_Full_Notes.pdf',
        uploadedBy: rahul._id,
        status: 'approved',
        downloads: 940,
        views: 2200,
      },
      {
        title: 'Theory of Computation & Automata PYQ Bank',
        description: 'Solved questions for DFA, NFA, Regular Expressions, Context-Free Grammars, Pushdown Automata, and Turing Machines.',
        subject: 'Theory of Computation (CSE322)',
        semester: 5,
        type: 'PYQ',
        fileUrl,
        fileType: 'pdf',
        fileSize: 3100000,
        originalFileName: 'CSE322_TOC_Solved_PYQ.pdf',
        uploadedBy: aman._id,
        status: 'approved',
        downloads: 430,
        views: 950,
      },
      // Semester 6
      {
        title: 'Computer Networks Complete Protocol Suite Notes',
        description: 'Layer-by-layer breakdown: Physical, Data Link (Sliding window), Network (IPv4/IPv6, Routing protocols), Transport (TCP/UDP handshake), and Application.',
        subject: 'Computer Networks (CSE320)',
        semester: 6,
        type: 'Notes',
        fileUrl,
        fileType: 'pdf',
        fileSize: 4500000,
        originalFileName: 'CSE320_Computer_Networks_Handwritten.pdf',
        uploadedBy: ananya._id,
        status: 'approved',
        downloads: 710,
        views: 1600,
      },
      {
        title: 'Machine Learning Algorithms & Mathematical Derivations',
        description: 'Linear regression, Logistic regression, SVM, Decision Trees, Random Forest, K-Means clustering, and Gradient Descent math derivations.',
        subject: 'Machine Learning (INT404)',
        semester: 6,
        type: 'Study Material',
        fileUrl,
        fileType: 'pdf',
        fileSize: 5100000,
        originalFileName: 'INT404_ML_Algorithms_Notes.pdf',
        uploadedBy: rahul._id,
        status: 'approved',
        downloads: 540,
        views: 1250,
      },
      // Semester 7
      {
        title: 'Cloud Computing Architecture & AWS Services Guide',
        description: 'IaaS, PaaS, SaaS concepts, Virtualization, AWS Core Services (EC2, S3, RDS, Lambda), and Cloud Security fundamentals.',
        subject: 'Cloud Computing (CSE423)',
        semester: 7,
        type: 'Notes',
        fileUrl,
        fileType: 'pdf',
        fileSize: 3200000,
        originalFileName: 'CSE423_Cloud_Computing_Guide.pdf',
        uploadedBy: ananya._id,
        status: 'approved',
        downloads: 360,
        views: 790,
      },
      {
        title: 'Information Security & Cryptography PYQ Solutions',
        description: 'Symmetric & Asymmetric encryption, DES, AES, RSA algorithms, Diffie-Hellman Key Exchange, and Hashing functions.',
        subject: 'Information Security (CSE433)',
        semester: 7,
        type: 'PYQ',
        fileUrl,
        fileType: 'pdf',
        fileSize: 2650000,
        originalFileName: 'CSE433_InfoSec_Solved_PYQ.pdf',
        uploadedBy: priya._id,
        status: 'approved',
        downloads: 290,
        views: 670,
      },
      // Semester 8
      {
        title: 'Deep Learning & Neural Networks PyTorch Reference Guide',
        description: 'Perceptrons, Backpropagation, CNNs for computer vision, RNN/LSTM for sequential data, and Transformer self-attention architecture.',
        subject: 'Deep Learning (INT422)',
        semester: 8,
        type: 'Study Material',
        fileUrl,
        fileType: 'pdf',
        fileSize: 6200000,
        originalFileName: 'INT422_Deep_Learning_Reference.pdf',
        uploadedBy: ananya._id,
        status: 'approved',
        downloads: 480,
        views: 1100,
      },

      // PENDING SUBMISSIONS FOR ADMIN MODERATION WORKFLOW DEMO
      {
        title: 'Microprocessors and Interfacing 8086 Assembly Cheatsheet',
        description: 'Pin diagrams, 8086 register architecture, addressing modes, and common assembly language programs with explanation.',
        subject: 'Microprocessors (ECE216)',
        semester: 4,
        type: 'Notes',
        fileUrl,
        fileType: 'pdf',
        fileSize: 2100000,
        originalFileName: 'ECE216_Microprocessor_Notes.pdf',
        uploadedBy: priya._id,
        status: 'pending', // Will appear in Admin Dashboard Pending Review!
        downloads: 0,
        views: 0,
      },
      {
        title: 'Web Technologies HTML5/CSS3/React End-Term Mid-Term PYQs',
        description: 'Compilation of recent mid-term and end-term questions for Web Development course with practical solutions.',
        subject: 'Web Technologies (CSE326)',
        semester: 5,
        type: 'PYQ',
        fileUrl,
        fileType: 'pdf',
        fileSize: 3100000,
        originalFileName: 'CSE326_WebTech_PYQs.pdf',
        uploadedBy: aman._id,
        status: 'pending', // Will appear in Admin Dashboard Pending Review!
        downloads: 0,
        views: 0,
      },
      {
        title: 'Mobile Application Development with Flutter Assignment Solutions',
        description: 'State management using Provider and Bloc, responsive layouts, and REST API integration in Flutter.',
        subject: 'Mobile App Development (CSE424)',
        semester: 7,
        type: 'Assignment',
        fileUrl,
        fileType: 'pdf',
        fileSize: 1800000,
        originalFileName: 'CSE424_Flutter_Assignments.pdf',
        uploadedBy: rahul._id,
        status: 'pending', // Will appear in Admin Dashboard Pending Review!
        downloads: 0,
        views: 0,
      },

      // REJECTED SUBMISSION FOR DEMO
      {
        title: 'Random Lecture Audio Notes Snippet',
        description: 'Corrupted audio recording notes without legible transcript.',
        subject: 'Communication Skills (ENG110)',
        semester: 1,
        type: 'Other',
        fileUrl,
        fileType: 'pdf',
        fileSize: 850000,
        originalFileName: 'ENG110_snippet.pdf',
        uploadedBy: aman._id,
        status: 'rejected',
        rejectionReason: 'Poor legibility and missing required course transcript. Please upload clear handwritten or typed notes.',
        downloads: 0,
        views: 0,
      },
    ];

    await Resource.insertMany(sampleResources);
    console.log(`[Seed] Successfully inserted ${sampleResources.length} sample resources!`);

    console.log('=============================================');
    console.log('🎉 Database seeding completed successfully!');
    console.log('---------------------------------------------');
    console.log('🔑 Default Accounts:');
    console.log('   Admin:   admin@lpuhustle.com   / Admin@123');
    console.log('   Student: rahul.sharma@lpuhustle.com / Student@123');
    console.log('   Student: priya.patel@lpuhustle.com  / Student@123');
    console.log('   Student: aman.verma@lpuhustle.com   / Student@123');
    console.log('=============================================');

    if (shouldExit) {
      process.exit(0);
    }
    return true;
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    if (shouldExit) {
      process.exit(1);
    }
    throw err;
  }
};

if (require.main === module) {
  seedDatabase(true);
}

module.exports = seedDatabase;
