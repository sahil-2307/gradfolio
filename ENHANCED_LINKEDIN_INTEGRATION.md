# Enhanced LinkedIn Integration Guide

## 🚀 Complete LinkedIn Profile Data Integration

### LinkedIn App Configuration

#### Required Scopes
```javascript
const LINKEDIN_SCOPES = [
  'openid',
  'profile', 
  'email',
  'r_liteprofile', // Basic profile information
  'r_emailaddress', // Email address
  'r_member_social', // Extended profile data
  'w_member_social' // Write access (for future features)
].join(' ');
```

#### LinkedIn API v2 Endpoints
```javascript
const LINKEDIN_API_ENDPOINTS = {
  // Basic profile
  basicProfile: 'https://api.linkedin.com/v2/people/~',
  userInfo: 'https://api.linkedin.com/v2/userinfo',
  
  // Detailed profile sections
  fullProfile: 'https://api.linkedin.com/v2/people/~:(id,firstName,lastName,headline,summary,industry,location,pictureUrl,publicProfileUrl,positions,educations,skills,certifications,publications,languages,honorsAwards,volunteerExperiences)',
  
  // Individual sections (for targeted requests)
  positions: 'https://api.linkedin.com/v2/people/~:(positions)',
  educations: 'https://api.linkedin.com/v2/people/~:(educations)', 
  skills: 'https://api.linkedin.com/v2/people/~:(skills)',
  certifications: 'https://api.linkedin.com/v2/people/~:(certifications)',
  publications: 'https://api.linkedin.com/v2/people/~:(publications)',
  languages: 'https://api.linkedin.com/v2/people/~:(languages)',
  honorsAwards: 'https://api.linkedin.com/v2/people/~:(honorsAwards)',
  volunteerExperiences: 'https://api.linkedin.com/v2/people/~:(volunteerExperiences)'
};
```

## 🛠️ Implementation Steps

### 1. Update LinkedIn OAuth URL in Dashboard.tsx
```javascript
const linkedinUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${encodeURIComponent('openid profile email r_liteprofile r_emailaddress r_member_social')}`;
```

### 2. Enhanced LinkedIn Callback API

```javascript
// api/linkedin-callback.js - Enhanced version
export default async function handler(req, res) {
  const { code, state } = req.query;
  
  if (!code) {
    return res.redirect('/dashboard?error=missing_code');
  }

  try {
    // Parse state to get user info
    const { userId, username } = JSON.parse(decodeURIComponent(state));

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${req.headers.origin}/api/linkedin-callback`,
      }),
    });

    const tokens = await tokenResponse.json();
    
    if (!tokens.access_token) {
      throw new Error('No access token received');
    }

    // Fetch comprehensive LinkedIn profile data
    const profileData = await fetchLinkedInProfile(tokens.access_token);
    
    // Transform and store in database
    const transformedData = transformLinkedInData(profileData);
    await storeLinkedInDataInDatabase(userId, username, transformedData);
    
    res.redirect('/dashboard?linkedin=success');
    
  } catch (error) {
    console.error('LinkedIn OAuth error:', error);
    res.redirect('/dashboard?error=linkedin_failed');
  }
}

async function fetchLinkedInProfile(accessToken) {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': 'application/json'
  };

  try {
    // Fetch comprehensive profile data
    const profileResponse = await fetch(
      'https://api.linkedin.com/v2/people/~:(id,firstName,lastName,headline,summary,industry,location,pictureUrl,publicProfileUrl,positions,educations,skills,certifications,publications,languages,honorsAwards,volunteerExperiences)',
      { headers }
    );
    
    const profileData = await profileResponse.json();
    
    // Also fetch email separately as it's not included in the main profile
    const emailResponse = await fetch(
      'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
      { headers }
    );
    
    const emailData = await emailResponse.json();
    
    return {
      ...profileData,
      email: emailData?.elements?.[0]?.['handle~']?.emailAddress
    };
    
  } catch (error) {
    console.error('Error fetching LinkedIn profile:', error);
    throw error;
  }
}

function transformLinkedInData(linkedinProfile) {
  return {
    personal: {
      fullName: `${linkedinProfile.firstName?.localized?.en_US || ''} ${linkedinProfile.lastName?.localized?.en_US || ''}`.trim(),
      email: linkedinProfile.email || '',
      phone: '', // LinkedIn doesn't provide phone
      linkedin: linkedinProfile.publicProfileUrl || '',
      github: '', // Extract from summary if mentioned
      website: '', // Extract from summary if mentioned
      profilePicture: linkedinProfile.pictureUrl || '',
      headline: linkedinProfile.headline?.localized?.en_US || '',
      location: {
        name: linkedinProfile.location?.name || '',
        country: linkedinProfile.location?.country?.localized?.en_US || ''
      },
      industry: linkedinProfile.industry?.localized?.en_US || ''
    },
    about: {
      paragraph1: linkedinProfile.summary?.localized?.en_US || '',
      paragraph2: '' // Split summary if too long
    },
    experience: transformPositions(linkedinProfile.positions),
    education: transformEducations(linkedinProfile.educations),
    skills: transformSkills(linkedinProfile.skills),
    projects: [], // LinkedIn doesn't have projects API, extract from summary
    achievements: [], // Extract from honors and awards
    certifications: transformCertifications(linkedinProfile.certifications),
    languages: transformLanguages(linkedinProfile.languages),
    publications: transformPublications(linkedinProfile.publications),
    honorsAwards: transformHonorsAwards(linkedinProfile.honorsAwards),
    volunteerExperience: transformVolunteerExperience(linkedinProfile.volunteerExperiences)
  };
}
```

### 3. Data Transformation Functions

```javascript
function transformPositions(positions) {
  if (!positions?.elements) return [];
  
  return positions.elements.map(pos => ({
    position: pos.title?.localized?.en_US || 'Position',
    company: pos.companyName?.localized?.en_US || 'Company',
    duration: formatDateRange(pos.timePeriod),
    location: pos.location?.name || '',
    description: pos.description?.localized?.en_US || '',
    companyId: pos.company || '',
    current: !pos.timePeriod?.endDate
  }));
}

function transformEducations(educations) {
  if (!educations?.elements) return [];
  
  return educations.elements.map(edu => ({
    degree: edu.degreeName?.localized?.en_US || 'Degree',
    institution: edu.schoolName?.localized?.en_US || 'Institution', 
    year: formatDateRange(edu.timePeriod),
    field: edu.fieldOfStudy?.localized?.en_US || '',
    description: edu.description?.localized?.en_US || '',
    grade: edu.grade || ''
  }));
}

function transformSkills(skills) {
  if (!skills?.elements) return { technical: [], soft: [] };
  
  const allSkills = skills.elements.map(skill => 
    skill.name?.localized?.en_US || ''
  ).filter(Boolean);
  
  // Simple categorization (you can enhance this)
  const technicalKeywords = ['javascript', 'python', 'react', 'node', 'sql', 'aws', 'docker', 'git'];
  const technical = allSkills.filter(skill => 
    technicalKeywords.some(keyword => 
      skill.toLowerCase().includes(keyword)
    )
  );
  
  const soft = allSkills.filter(skill => !technical.includes(skill));
  
  return { technical, soft };
}

function transformCertifications(certifications) {
  if (!certifications?.elements) return [];
  
  return certifications.elements.map(cert => ({
    name: cert.name?.localized?.en_US || '',
    organization: cert.authority?.localized?.en_US || '',
    issueDate: formatDate(cert.timePeriod?.startDate),
    expiryDate: formatDate(cert.timePeriod?.endDate),
    credentialId: cert.licenseNumber || '',
    url: cert.url || ''
  }));
}

// Helper functions
function formatDateRange(timePeriod) {
  if (!timePeriod) return '';
  
  const start = formatDate(timePeriod.startDate);
  const end = timePeriod.endDate ? formatDate(timePeriod.endDate) : 'Present';
  
  return `${start} - ${end}`;
}

function formatDate(dateObj) {
  if (!dateObj) return '';
  
  const { year, month } = dateObj;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return month ? `${monthNames[month - 1]} ${year}` : year.toString();
}
```

### 4. Database Storage Function

```javascript
async function storeLinkedInDataInDatabase(userId, username, linkedinData) {
  const { createClient } = require('@supabase/supabase-js');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY // Use service key for server-side
  );
  
  const { error } = await supabase
    .from('user_linkedin_data')
    .upsert({
      user_id: userId,
      username: username,
      personal: linkedinData.personal,
      about: linkedinData.about,
      experience: linkedinData.experience,
      education: linkedinData.education,
      skills: linkedinData.skills,
      projects: linkedinData.projects,
      achievements: linkedinData.achievements,
      certifications: linkedinData.certifications,
      languages: linkedinData.languages,
      publications: linkedinData.publications,
      honors_awards: linkedinData.honorsAwards,
      volunteer_experience: linkedinData.volunteerExperience,
      profile_picture_url: linkedinData.personal.profilePicture,
      headline: linkedinData.personal.headline,
      location: linkedinData.personal.location,
      industry: linkedinData.personal.industry,
      raw_linkedin_data: linkedinData, // Store complete data
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    });
    
  if (error) {
    console.error('Error storing LinkedIn data:', error);
    throw error;
  }
}
```

## 📝 Resume Data Integration

### Enhanced Resume Parser API

```javascript
// api/parse-resume.js - Add database storage
export default async function handler(req, res) {
  // ... existing parsing code ...
  
  try {
    // Parse resume and extract data
    const extractedData = await parseResumeData(pdfText);
    
    // Store in database
    if (fields.userId && fields.username) {
      await storeResumeDataInDatabase(
        fields.userId[0], 
        fields.username[0], 
        extractedData,
        uploadedFile
      );
    }
    
    return res.status(200).json({
      success: true,
      message: 'Resume parsed and stored successfully',
      data: extractedData
    });
    
  } catch (error) {
    console.error('Resume parsing error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to parse resume',
      error: error.message
    });
  }
}

async function storeResumeDataInDatabase(userId, username, resumeData, fileInfo) {
  const { createClient } = require('@supabase/supabase-js');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
  
  const { error } = await supabase
    .from('user_resume_data')
    .upsert({
      user_id: userId,
      username: username,
      resume_filename: fileInfo.originalFilename,
      resume_size: fileInfo.size,
      personal: resumeData.personal,
      about: resumeData.about,
      experience: resumeData.experience,
      education: resumeData.education,
      skills: resumeData.skills,
      projects: resumeData.projects,
      achievements: resumeData.achievements,
      certifications: resumeData.certifications || [],
      languages: resumeData.languages || [],
      raw_text: resumeData.rawText,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    });
    
  if (error) {
    console.error('Error storing resume data:', error);
    throw error;
  }
}
```

## 🔄 Updated Frontend Services

### Enhanced LinkedIn Service

```typescript
// services/linkedinService.ts - Database-first approach
export class LinkedInService {
  static async storeLinkedInData(username: string, data: LinkedInData): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('User not authenticated');
      }

      // Store in Supabase (primary storage)
      const { error } = await supabase
        .from('user_linkedin_data')
        .upsert({
          user_id: user.data.user.id,
          username: username,
          ...data, // Spread all the data fields
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      // Also store in localStorage for quick access
      localStorage.setItem(`linkedin_data_${username}`, JSON.stringify(data));
      
      return { success: true };
    } catch (error: any) {
      console.error('Error storing LinkedIn data:', error);
      return { success: false, error: error.message };
    }
  }

  static async getLinkedInData(username: string): Promise<{ success: boolean; data?: LinkedInData; error?: string }> {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('User not authenticated');
      }

      // Fetch from Supabase (primary source)
      const { data: dbData, error } = await supabase
        .from('user_linkedin_data')
        .select('*')
        .eq('user_id', user.data.user.id)
        .single();

      if (error || !dbData) {
        // Fallback to localStorage
        const localData = localStorage.getItem(`linkedin_data_${username}`);
        if (localData) {
          return { success: true, data: JSON.parse(localData) };
        }
        return { success: false, error: 'No LinkedIn data found' };
      }

      // Transform database data back to LinkedInData format
      const linkedinData: LinkedInData = {
        personal: dbData.personal,
        about: dbData.about,
        experience: dbData.experience,
        education: dbData.education,
        skills: dbData.skills,
        projects: dbData.projects,
        achievements: dbData.achievements
      };

      // Update localStorage cache
      localStorage.setItem(`linkedin_data_${username}`, JSON.stringify(linkedinData));
      
      return { success: true, data: linkedinData };
    } catch (error: any) {
      console.error('Error getting LinkedIn data:', error);
      return { success: false, error: error.message };
    }
  }
}
```

## 🎯 Next Steps

1. **Create the database tables** using the SQL schemas above
2. **Update your LinkedIn app** with enhanced permissions
3. **Deploy the enhanced callback handler**
4. **Update the frontend services** to use database-first storage
5. **Test the complete flow** from OAuth to database storage

This enhanced integration will provide:
- ✅ Complete LinkedIn profile data extraction
- ✅ Persistent database storage
- ✅ Resume parsing with database storage  
- ✅ Portfolio generation tracking
- ✅ Better data management and analytics