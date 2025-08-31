import React from 'react';
import { Link } from 'react-router-dom';
import './ModernTemplate.css';

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

interface ModernTemplateProps {
  profile: UserProfile;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ profile }) => {
  return (
    <div className="modern-template">
      <div className="container">
        <header className="header">
          <h1>{profile.name}</h1>
          <p>{profile.bio}</p>
          <p>{profile.university} • Class of {profile.graduationYear}</p>
          {profile.profilePhoto && (
            <img 
              src={`http://localhost:5000/profiles/${profile.profilePhoto}`} 
              alt={profile.name}
              className="profile-photo"
            />
          )}
        </header>

        <section className="contact">
          <h2>Contact</h2>
          <p>Email: {profile.email}</p>
          {profile.phone && <p>Phone: {profile.phone}</p>}
        </section>

        {profile.experiences && profile.experiences.length > 0 && (
          <section className="experiences">
            <h2>Experience</h2>
            {profile.experiences.map((exp) => (
              <div key={exp.id} className="experience">
                <h3>{exp.title} at {exp.company}</h3>
                <p>{exp.type} • {exp.startDate} - {exp.endDate}</p>
                <p>{exp.description}</p>
              </div>
            ))}
          </section>
        )}

        {profile.skills && profile.skills.length > 0 && (
          <section className="skills">
            <h2>Skills</h2>
            {profile.skills.map((skill, index) => (
              <div key={index} className="skill">
                <span>{skill.name}: {skill.proficiency}%</span>
              </div>
            ))}
          </section>
        )}

        {profile.projects && profile.projects.length > 0 && (
          <section className="projects">
            <h2>Projects</h2>
            {profile.projects.map((project) => (
              <div key={project.id} className="project">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <p>Technologies: {project.technologies.join(', ')}</p>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    View Live
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    View Code
                  </a>
                )}
              </div>
            ))}
          </section>
        )}

        <footer>
          <p>Built with <Link to="/">OnlinePortfolios</Link></p>
          {!profile.isPremium && (
            <Link to={`/checkout/${profile.username}`}>
              Upgrade to Premium
            </Link>
          )}
        </footer>
      </div>
    </div>
  );
};

export default ModernTemplate;