import React from 'react';

const techStack = [
  {
    category: 'Frontend',
    items: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Framer Motion',
      'Lucide React Icons',
    ],
  },
  {
    category: 'Backend',
    items: [
      'Node.js',
      'Express (if used)',
      'MongoDB',
      'Mongoose',
    ],
  },
  {
    category: 'Tooling',
    items: [
      'ESLint',
      'PostCSS',
      'Vercel (Deployment)',
    ],
  },
  {
    category: 'Other',
    items: [
      'SVG Assets',
      'Custom Utility Functions',
    ],
  },
];

const TechnologyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-20 px-4">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20">
        <h1 className="text-4xl font-bold text-green-400 mb-8 text-center">Technology Stack</h1>
        <p className="text-white/80 mb-8 text-center text-lg">Here are the main technologies and tools used in building this project:</p>
        <div className="grid md:grid-cols-2 gap-8">
          {techStack.map((section) => (
            <div key={section.category} className="bg-white/10 rounded-xl p-6 shadow border border-green-200">
              <h2 className="text-2xl font-semibold text-green-600 mb-4">{section.category}</h2>
              <ul className="list-disc list-inside text-white/90 text-lg space-y-2">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnologyPage;
