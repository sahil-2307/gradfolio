const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

class ResumeParser {
  constructor() {
    // Regex patterns for extracting information
    this.patterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone: /(\+\d{1,2}\s?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
      linkedin: /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/gi,
      github: /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/gi,
      website: /(?:https?:\/\/)?(?:www\.)?[\w-]+\.[\w.]+/gi,
      
      // Section headers
      sections: {
        experience: /(?:experience|work\s+experience|employment|professional\s+experience|work\s+history)/i,
        education: /(?:education|academic|qualifications|degrees)/i,
        skills: /(?:skills|technical\s+skills|competencies|proficiencies)/i,
        projects: /(?:projects|personal\s+projects|portfolio|work)/i,
        certifications: /(?:certifications?|certificates?|licenses?)/i,
        summary: /(?:summary|profile|objective|about|overview)/i
      },
      
      // Date patterns
      dates: /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}\b|\b\d{1,2}\/\d{4}\b|\b\d{4}\b/gi,
      
      // Name extraction (first line or after certain keywords)
      name: /^([A-Za-z]+\s+[A-Za-z]+(?:\s+[A-Za-z]+)*)/,
      
      // Location patterns
      location: /(?:[A-Za-z\s]+,\s*[A-Za-z]{2,})|(?:[A-Za-z\s]+,\s*[A-Z]{2})/g
    };
  }

  async parseFile(fileBuffer, fileType) {
    try {
      let text = '';
      
      if (fileType === 'application/pdf') {
        const pdfData = await pdfParse(fileBuffer);
        text = pdfData.text;
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        text = result.value;
      } else {
        throw new Error('Unsupported file type');
      }

      return this.extractData(text);
    } catch (error) {
      console.error('Error parsing file:', error);
      throw error;
    }
  }

  extractData(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const sections = this.identifySections(lines);
    
    return {
      personalInfo: this.extractPersonalInfo(lines),
      summary: this.extractSummary(sections, lines),
      experience: this.extractExperience(sections, lines),
      education: this.extractEducation(sections, lines),
      skills: this.extractSkills(sections, lines),
      projects: this.extractProjects(sections, lines),
      certifications: this.extractCertifications(sections, lines)
    };
  }

  identifySections(lines) {
    const sections = {};
    
    lines.forEach((line, index) => {
      Object.keys(this.patterns.sections).forEach(sectionName => {
        if (this.patterns.sections[sectionName].test(line)) {
          sections[sectionName] = index;
        }
      });
    });
    
    return sections;
  }

  extractPersonalInfo(lines) {
    const fullText = lines.join(' ');
    
    // Extract name (usually first meaningful line)
    let name = '';
    for (let line of lines) {
      if (line.length > 2 && !line.includes('@') && !this.patterns.phone.test(line)) {
        const nameMatch = line.match(this.patterns.name);
        if (nameMatch && nameMatch[1].split(' ').length >= 2) {
          name = nameMatch[1];
          break;
        }
      }
    }

    // Extract email
    const emailMatches = fullText.match(this.patterns.email) || [];
    const email = emailMatches[0] || '';

    // Extract phone
    const phoneMatches = fullText.match(this.patterns.phone) || [];
    const phone = phoneMatches[0] || '';

    // Extract LinkedIn
    const linkedinMatches = fullText.match(this.patterns.linkedin) || [];
    const linkedin = linkedinMatches[0] || '';

    // Extract GitHub
    const githubMatches = fullText.match(this.patterns.github) || [];
    const github = githubMatches[0] || '';

    // Extract location
    const locationMatches = fullText.match(this.patterns.location) || [];
    const location = locationMatches[0] || '';

    return {
      name: name || 'Not found',
      email,
      phone,
      location,
      linkedin,
      github
    };
  }

  extractSummary(sections, lines) {
    if (sections.summary !== undefined) {
      const startIndex = sections.summary + 1;
      const nextSectionIndex = this.findNextSection(sections, startIndex);
      const summaryLines = lines.slice(startIndex, nextSectionIndex);
      return summaryLines.join(' ').trim();
    }
    return '';
  }

  extractExperience(sections, lines) {
    if (sections.experience === undefined) return [];
    
    const startIndex = sections.experience + 1;
    const nextSectionIndex = this.findNextSection(sections, startIndex);
    const experienceLines = lines.slice(startIndex, nextSectionIndex);
    
    const experiences = [];
    let currentExperience = {};
    
    for (let line of experienceLines) {
      // Check if line contains date pattern (likely a job entry)
      const dateMatches = line.match(this.patterns.dates);
      
      if (dateMatches && dateMatches.length >= 1) {
        // Save previous experience if exists
        if (Object.keys(currentExperience).length > 0) {
          experiences.push(currentExperience);
        }
        
        // Start new experience
        const parts = line.split(/[|•-]/);
        currentExperience = {
          title: parts[0]?.trim() || 'Position',
          company: parts[1]?.trim() || 'Company',
          location: parts[2]?.trim() || '',
          duration: dateMatches.join(' - '),
          description: []
        };
      } else if (line && currentExperience.title) {
        // Add to description
        if (line.length > 10) {
          currentExperience.description.push(line);
        }
      }
    }
    
    // Add last experience
    if (Object.keys(currentExperience).length > 0) {
      currentExperience.description = currentExperience.description.join(' ');
      experiences.push(currentExperience);
    }
    
    return experiences;
  }

  extractEducation(sections, lines) {
    if (sections.education === undefined) return [];
    
    const startIndex = sections.education + 1;
    const nextSectionIndex = this.findNextSection(sections, startIndex);
    const educationLines = lines.slice(startIndex, nextSectionIndex);
    
    const education = [];
    let currentEducation = {};
    
    for (let line of educationLines) {
      const dateMatches = line.match(this.patterns.dates);
      
      if (dateMatches) {
        if (Object.keys(currentEducation).length > 0) {
          education.push(currentEducation);
        }
        
        currentEducation = {
          degree: line.replace(dateMatches[0], '').trim(),
          institution: '',
          year: dateMatches[0],
          gpa: ''
        };
      } else if (line && currentEducation.degree) {
        if (!currentEducation.institution) {
          currentEducation.institution = line;
        }
      }
    }
    
    if (Object.keys(currentEducation).length > 0) {
      education.push(currentEducation);
    }
    
    return education;
  }

  extractSkills(sections, lines) {
    if (sections.skills === undefined) return { technical: [], soft: [] };
    
    const startIndex = sections.skills + 1;
    const nextSectionIndex = this.findNextSection(sections, startIndex);
    const skillsLines = lines.slice(startIndex, nextSectionIndex);
    
    const skillsText = skillsLines.join(' ');
    const allSkills = skillsText.split(/[,•|]/g).map(skill => skill.trim()).filter(skill => skill);
    
    // Common technical skills keywords
    const technicalKeywords = [
      'javascript', 'python', 'java', 'react', 'node', 'html', 'css', 'sql', 'mongodb', 'postgres',
      'aws', 'docker', 'kubernetes', 'git', 'angular', 'vue', 'typescript', 'php', 'ruby', 'go',
      'c++', 'c#', 'swift', 'kotlin', 'flutter', 'django', 'express', 'spring', 'rails'
    ];
    
    const technical = [];
    const soft = [];
    
    allSkills.forEach(skill => {
      const lowerSkill = skill.toLowerCase();
      if (technicalKeywords.some(keyword => lowerSkill.includes(keyword))) {
        technical.push(skill);
      } else {
        soft.push(skill);
      }
    });
    
    return { technical, soft };
  }

  extractProjects(sections, lines) {
    if (sections.projects === undefined) return [];
    
    const startIndex = sections.projects + 1;
    const nextSectionIndex = this.findNextSection(sections, startIndex);
    const projectLines = lines.slice(startIndex, nextSectionIndex);
    
    const projects = [];
    let currentProject = {};
    
    for (let line of projectLines) {
      if (line.includes('http') || line.includes('github')) {
        if (currentProject.name) {
          currentProject.link = line;
          projects.push(currentProject);
          currentProject = {};
        }
      } else if (line && line.length > 5) {
        if (!currentProject.name) {
          currentProject = {
            name: line,
            description: '',
            technologies: [],
            link: ''
          };
        } else {
          currentProject.description = line;
        }
      }
    }
    
    if (Object.keys(currentProject).length > 0) {
      projects.push(currentProject);
    }
    
    return projects;
  }

  extractCertifications(sections, lines) {
    if (sections.certifications === undefined) return [];
    
    const startIndex = sections.certifications + 1;
    const nextSectionIndex = this.findNextSection(sections, startIndex);
    const certLines = lines.slice(startIndex, nextSectionIndex);
    
    return certLines.filter(line => line.length > 3);
  }

  findNextSection(sections, currentIndex) {
    const sectionIndices = Object.values(sections).filter(index => index > currentIndex);
    return sectionIndices.length > 0 ? Math.min(...sectionIndices) : undefined;
  }
}

module.exports = ResumeParser;