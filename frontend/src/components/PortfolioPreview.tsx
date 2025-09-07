import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface PortfolioData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaSecondaryText: string;
  };
  about: {
    title: string;
    description: string;
    skills: Array<{
      name: string;
      level: number;
      category: string;
    }>;
    highlights: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  projects: {
    title: string;
    subtitle: string;
    projects: Array<{
      id: string;
      title: string;
      description: string;
      image: string;
      technologies: string[];
      liveUrl?: string;
      githubUrl?: string;
      featured: boolean;
    }>;
  };
  contact: {
    title: string;
    subtitle: string;
    email: string;
    phone: string;
    location: string;
    socialLinks: Array<{
      name: string;
      url: string;
      icon: string;
    }>;
  };
  lastUpdated: string;
}

const PortfolioPreview: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const username = searchParams.get('username');
    if (username) {
      loadPortfolioData(username);
    }
  }, [searchParams]);

  const loadPortfolioData = (username: string) => {
    try {
      console.log('Looking for portfolio data with key:', `portfolio_data_${username}`);
      
      // Check all localStorage keys for debugging
      const allKeys = Object.keys(localStorage);
      console.log('All localStorage keys:', allKeys);
      const portfolioKeys = allKeys.filter(key => key.startsWith('portfolio_data_'));
      console.log('Portfolio data keys found:', portfolioKeys);
      
      const data = localStorage.getItem(`portfolio_data_${username}`);
      console.log('Retrieved data:', data ? 'Found' : 'Not found');
      
      if (data) {
        const parsedData = JSON.parse(data);
        console.log('Parsed portfolio data:', parsedData);
        setPortfolioData(parsedData);
      } else {
        console.log('No portfolio data found for username:', username);
      }
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    const username = searchParams.get('username');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Portfolio Not Found</h2>
          <p className="text-gray-600 mb-4">
            Unable to load portfolio data for <strong>{username}</strong>.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            This might happen if the portfolio data wasn't properly generated or stored. 
            Please go back to the resume editor and try generating the portfolio again.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.close()}
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close This Tab
            </button>
            <button
              onClick={() => window.close()}
              className="block w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Resume Editor (Close Tab)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {portfolioData.hero.title}
          </h1>
          <p className="text-2xl md:text-3xl font-semibold mb-6 text-gray-700 dark:text-gray-300">
            {portfolioData.hero.subtitle}
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            {portfolioData.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors">
              {portfolioData.hero.ctaText}
            </button>
            <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-full font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
              {portfolioData.hero.ctaSecondaryText}
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            {portfolioData.about.title}
          </h2>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-16 max-w-3xl mx-auto">
            {portfolioData.about.description}
          </p>

          {/* Highlights */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {portfolioData.about.highlights.map((highlight, index) => (
              <div key={index} className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔧</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {highlight.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Technical Skills
            </h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {portfolioData.about.skills.map((skill, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{skill.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {portfolioData.projects.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {portfolioData.projects.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioData.projects.projects.map((project) => (
              <div key={project.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                  <span className="text-gray-600 dark:text-gray-400">Project Image</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {portfolioData.contact.title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            {portfolioData.contact.subtitle}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="p-6 bg-white dark:bg-gray-700 rounded-xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
              <p className="text-gray-600 dark:text-gray-300">{portfolioData.contact.email}</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-700 rounded-xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Phone</h3>
              <p className="text-gray-600 dark:text-gray-300">{portfolioData.contact.phone}</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-700 rounded-xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Location</h3>
              <p className="text-gray-600 dark:text-gray-300">{portfolioData.contact.location}</p>
            </div>
          </div>

          <div className="flex justify-center gap-6">
            {portfolioData.contact.socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                {link.name.charAt(0)}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white dark:bg-gray-900 border-t dark:border-gray-700">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Generated with Gradfolio • Last updated: {new Date(portfolioData.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioPreview;