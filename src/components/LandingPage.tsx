import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import './LandingPage.css';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  type: 'fulltime' | 'internship';
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  name: string;
  proficiency: number;
}


interface UserProfile {
  id: string;
  username: string;
  name: string;
  bio: string;
  graduationYear: string;
  university: string;
  template: string;
  email: string;
  phone?: string;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  profilePhoto?: string;
  resume?: string;
  isPremium: boolean;
  createdAt: string;
}

const LandingPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/profile/${username}`);
        setProfile(response.data);
      } catch (error: any) {
        console.error('Failed to fetch profile:', error);
        setError(error.response?.data?.error || 'Profile not found');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);



  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="error-container">
        <h2>Profile Not Found</h2>
        <p>{error || 'The requested profile could not be found.'}</p>
        <Link to="/" className="back-link">← Create Your Profile</Link>
      </div>
    );
  }

  const renderTemplate = () => {
    const template = profile.template || 'modern';
    
    switch (template) {
      case 'classic':
        return <ClassicTemplate profile={profile} />;
      case 'minimal':
        return <MinimalTemplate profile={profile} />;
      case 'modern':
      default:
        return <ModernTemplate profile={profile} />;
    }
  };

  return (
    <div className="landing-page">
      {renderTemplate()}
    </div>
  );
};

export default LandingPage;