# Resume Parser Database Integration

## 📄 Resume Data Storage Implementation

### Updated Resume Parser API (api/parse-resume.js)

```javascript
// Add Supabase client import at the top
const { createClient } = require('@supabase/supabase-js');

// Add this function to store resume data in database
async function storeResumeDataInDatabase(userId, username, resumeData, fileInfo, rawText) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY // Use service key for server-side operations
    );

    console.log('Storing resume data in database for user:', userId);
    
    const { data, error } = await supabase
      .from('user_resume_data')
      .upsert({
        user_id: userId,
        username: username,
        resume_filename: fileInfo.originalFilename,
        resume_size: fileInfo.size,
        personal: resumeData.personal || {},
        about: resumeData.about || {},
        experience: resumeData.experience || [],
        education: resumeData.education || [],
        skills: resumeData.skills || { technical: [], soft: [] },
        projects: resumeData.projects || [],
        achievements: resumeData.achievements || [],
        certifications: [], // Add if your parser extracts certifications
        languages: [], // Add if your parser extracts languages
        raw_text: rawText, // Store original extracted text
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Supabase storage error:', error);
      throw error;
    }

    console.log('Resume data successfully stored in database');
    return { success: true, data };
    
  } catch (error) {
    console.error('Error storing resume data in database:', error);
    throw error;
  }
}

// Update your main handler function (around line 140-160)
export default async function handler(req, res) {
  // ... existing code for file parsing ...

  try {
    const extractedText = textContent; // Your extracted text
    console.log('Extracted text length:', extractedText.length);
    
    // Parse the resume data (your existing function)
    const parsedData = parseResumeText(extractedText, uploadedFile.originalFilename);
    console.log('Parsed resume data:', JSON.stringify(parsedData, null, 2));

    // NEW: Store in database if userId and username are provided
    if (fields.userId && fields.username) {
      try {
        await storeResumeDataInDatabase(
          fields.userId[0], 
          fields.username[0], 
          parsedData,
          uploadedFile,
          extractedText
        );
        console.log('Resume data stored in database successfully');
      } catch (dbError) {
        console.error('Database storage failed:', dbError);
        // Don't fail the entire request if database storage fails
        // The user will still get the parsed data response
      }
    } else {
      console.log('No userId/username provided, skipping database storage');
    }
    
    // Return the parsed data (existing response)
    res.status(200).json({
      success: true,
      message: 'Resume processed successfully',
      data: parsedData,
      extractedText: extractedText.substring(0, 1000) // First 1000 chars for debugging
    });

  } catch (error) {
    console.error('Resume parsing error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to parse resume'
    });
  }
}
```

### Frontend Dashboard Updates

Update the `handleResumeUpload` function in `Dashboard.tsx`:

```javascript
const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    setMessage('File size too large. Please upload a file smaller than 10MB.');
    setTimeout(() => setMessage(''), 3000);
    return;
  }

  setLoading(true);
  setMessage('Processing your resume...');

  try {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('userId', user.id); // Send user ID for database storage
    formData.append('username', user.username); // Send username for database storage

    const response = await fetch('/api/parse-resume', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    console.log('Resume parser response:', result);
    
    if (result.success) {
      console.log('Parsed resume data:', JSON.stringify(result.data, null, 2));
      
      // Store in localStorage for immediate access (existing code)
      localStorage.setItem(`resume_data_${user.username}`, JSON.stringify(result.data));
      
      // Update state (existing code)
      setResumeData(result.data);
      setHasResumeData(true);
      
      setMessage('✅ Resume processed and stored successfully! Data is now saved in your account.');
      setTimeout(() => setMessage(''), 5000);
    } else {
      console.error('Resume parsing failed:', result);
      setMessage(result.message || 'Failed to process resume. Please try again.');
      setTimeout(() => setMessage(''), 5000);
    }
  } catch (error) {
    console.error('Resume upload error:', error);
    setMessage('Failed to upload resume. Please try again.');
    setTimeout(() => setMessage(''), 5000);
  } finally {
    setLoading(false);
  }
};
```

### Resume Service for Database Operations

Create `services/resumeService.ts`:

```typescript
import { supabase } from '../config/supabase';

export interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    website: string;
  };
  about: {
    paragraph1: string;
    paragraph2: string;
  };
  experience: Array<{
    position: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    description: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    link: string;
  }>;
  achievements: string[];
}

export class ResumeService {
  static async getResumeData(username: string): Promise<{ success: boolean; data?: ResumeData; error?: string }> {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('User not authenticated');
      }

      // Fetch from Supabase (primary source)
      const { data: dbData, error } = await supabase
        .from('user_resume_data')
        .select('*')
        .eq('user_id', user.data.user.id)
        .single();

      if (error || !dbData) {
        // Fallback to localStorage
        const localData = localStorage.getItem(`resume_data_${username}`);
        if (localData) {
          return { success: true, data: JSON.parse(localData) };
        }
        return { success: false, error: 'No resume data found' };
      }

      // Transform database data back to ResumeData format
      const resumeData: ResumeData = {
        personal: dbData.personal,
        about: dbData.about,
        experience: dbData.experience,
        education: dbData.education,
        skills: dbData.skills,
        projects: dbData.projects,
        achievements: dbData.achievements
      };

      // Update localStorage cache
      localStorage.setItem(`resume_data_${username}`, JSON.stringify(resumeData));
      
      return { success: true, data: resumeData };
    } catch (error: any) {
      console.error('Error getting resume data:', error);
      return { success: false, error: error.message };
    }
  }

  static async hasResumeData(username: string): Promise<boolean> {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return false;

      // Check database first
      const { data, error } = await supabase
        .from('user_resume_data')
        .select('id')
        .eq('user_id', user.data.user.id)
        .single();

      if (!error && data) return true;

      // Fallback to localStorage
      const localData = localStorage.getItem(`resume_data_${username}`);
      return !!localData;
      
    } catch (error) {
      console.error('Error checking resume data:', error);
      return false;
    }
  }

  static async deleteResumeData(username: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('User not authenticated');
      }

      // Delete from database
      const { error } = await supabase
        .from('user_resume_data')
        .delete()
        .eq('user_id', user.data.user.id);

      if (error) throw error;

      // Clear localStorage
      localStorage.removeItem(`resume_data_${username}`);
      
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting resume data:', error);
      return { success: false, error: error.message };
    }
  }
}
```

## 🎯 What Gets Stored in Database

### Example Database Record:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "user-uuid-here",
  "username": "johndoe",
  "resume_filename": "John_Doe_Resume.pdf",
  "resume_size": 245760,
  "personal": {
    "fullName": "John Doe",
    "email": "john.doe@email.com",
    "phone": "+1-555-123-4567",
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe", 
    "website": "https://johndoe.dev"
  },
  "about": {
    "paragraph1": "Experienced software developer with 5+ years in full-stack development.",
    "paragraph2": "Passionate about creating scalable solutions and mentoring junior developers."
  },
  "experience": [
    {
      "position": "Senior Software Developer",
      "company": "Tech Corp",
      "duration": "2021 - Present",
      "description": "Led development of microservices architecture serving 1M+ users daily."
    },
    {
      "position": "Full Stack Developer", 
      "company": "StartUp Inc",
      "duration": "2019 - 2021",
      "description": "Built responsive web applications using React and Node.js."
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Computer Science",
      "institution": "University of Technology",
      "year": "2019",
      "description": "Graduated summa cum laude, GPA: 3.9/4.0"
    }
  ],
  "skills": {
    "technical": ["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", "Docker"],
    "soft": ["Leadership", "Communication", "Problem Solving", "Team Management"]
  },
  "projects": [
    {
      "title": "E-commerce Platform",
      "description": "Built full-stack e-commerce solution with payment integration",
      "technologies": ["React", "Node.js", "MongoDB", "Stripe"],
      "link": "https://github.com/johndoe/ecommerce"
    }
  ],
  "achievements": [
    "Won Best Innovation Award 2023",
    "Led team of 8 developers", 
    "Increased system performance by 40%"
  ],
  "certifications": [],
  "languages": [],
  "raw_text": "JOHN DOE\nSoftware Developer\njohn.doe@email.com...",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

## ✅ Benefits

1. **Complete Data Persistence** - No more losing resume data on browser clear
2. **Cross-Device Access** - User can access their data from any device  
3. **Portfolio Generation** - All data available for creating portfolios
4. **Analytics & Reporting** - Track resume uploads and parsing success
5. **Backup & Recovery** - Raw text stored for re-processing if needed
6. **Performance** - Database + localStorage hybrid approach for speed

## 🚀 Implementation Steps

1. **Create the database tables** (SQL above)
2. **Add environment variable** `SUPABASE_SERVICE_KEY` to Vercel
3. **Update the resume parser** with database storage code
4. **Update the dashboard** to send userId/username
5. **Test the complete flow** from upload to database storage

Your resume parser will now store ALL the extracted JSON data permanently in the database! 🎉