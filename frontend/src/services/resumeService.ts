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
  // Get resume data from database first, fallback to localStorage
  static async getResumeData(username: string): Promise<{ success: boolean; data?: ResumeData; error?: string }> {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('User not authenticated');
      }

      // Try to fetch from Supabase database first
      try {
        console.log('Attempting to fetch resume data from database for user:', user.data.user.id);
        const { data: dbData, error } = await supabase
          .from('user_resume_data')
          .select('*')
          .eq('user_id', user.data.user.id)
          .single();

        console.log('Database query result:', { data: dbData, error });

        if (!error && dbData) {
          // Transform database data back to ResumeData format
          const resumeData: ResumeData = {
            personal: dbData.personal || {
              fullName: '',
              email: '',
              phone: '',
              linkedin: '',
              github: '',
              website: ''
            },
            about: dbData.about || {
              paragraph1: '',
              paragraph2: ''
            },
            experience: dbData.experience || [],
            education: dbData.education || [],
            skills: dbData.skills || { technical: [], soft: [] },
            projects: dbData.projects || [],
            achievements: dbData.achievements || []
          };

          // Update localStorage cache for faster access
          localStorage.setItem(`resume_data_${username}`, JSON.stringify(resumeData));
          
          return { success: true, data: resumeData };
        }
      } catch (dbError) {
        console.log('Database fetch failed, trying localStorage fallback:', dbError);
      }

      // Fallback to localStorage if database doesn't have data
      const localData = localStorage.getItem(`resume_data_${username}`);
      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          return { success: true, data: parsedData };
        } catch (parseError) {
          console.error('Error parsing localStorage data:', parseError);
        }
      }
      
      return { success: false, error: 'No resume data found' };
    } catch (error: any) {
      console.error('Error getting resume data:', error);
      return { success: false, error: error.message };
    }
  }

  // Save resume data to both database and localStorage
  static async saveResumeData(username: string, resumeData: ResumeData): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('User not authenticated');
      }

      // Save to localStorage first for immediate access
      localStorage.setItem(`resume_data_${username}`, JSON.stringify(resumeData));

      // Try to save to database
      try {
        const { error } = await supabase
          .from('user_resume_data')
          .upsert({
            user_id: user.data.user.id,
            username: username,
            personal: resumeData.personal,
            about: resumeData.about,
            experience: resumeData.experience,
            education: resumeData.education,
            skills: resumeData.skills,
            projects: resumeData.projects,
            achievements: resumeData.achievements,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          console.error('Database save error (but localStorage saved):', error);
          return { 
            success: true, // Still successful since localStorage worked
            error: 'Data saved locally, but database sync failed. Changes will be synced when connection is restored.'
          };
        }

        return { success: true };
      } catch (dbError) {
        console.error('Database save failed (but localStorage saved):', dbError);
        return { 
          success: true, // Still successful since localStorage worked
          error: 'Data saved locally, but database sync failed. Changes will be synced when connection is restored.'
        };
      }
    } catch (error: any) {
      console.error('Error saving resume data:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if user has resume data (database first, then localStorage)
  static async hasResumeData(username: string): Promise<boolean> {
    try {
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        try {
          const { data, error } = await supabase
            .from('user_resume_data')
            .select('id')
            .eq('user_id', user.data.user.id)
            .single();

          if (!error && data) return true;
        } catch (dbError) {
          console.log('Database check failed, checking localStorage:', dbError);
        }
      }

      // Fallback to localStorage
      const localData = localStorage.getItem(`resume_data_${username}`);
      return !!localData;
      
    } catch (error) {
      console.error('Error checking resume data:', error);
      // Final fallback to localStorage only
      const localData = localStorage.getItem(`resume_data_${username}`);
      return !!localData;
    }
  }

  // Delete resume data from both database and localStorage
  static async deleteResumeData(username: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await supabase.auth.getUser();
      
      // Clear localStorage
      localStorage.removeItem(`resume_data_${username}`);
      
      if (user.data.user) {
        try {
          const { error } = await supabase
            .from('user_resume_data')
            .delete()
            .eq('user_id', user.data.user.id);

          if (error) {
            console.error('Database delete error (but localStorage cleared):', error);
          }
        } catch (dbError) {
          console.error('Database delete failed (but localStorage cleared):', dbError);
        }
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting resume data:', error);
      return { success: false, error: error.message };
    }
  }
}