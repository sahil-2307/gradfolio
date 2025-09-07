import { supabase } from '../config/supabase';

export interface LinkedInData {
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

export class LinkedInService {
  // Store LinkedIn data for a user
  static async storeLinkedInData(username: string, data: LinkedInData): Promise<{ success: boolean; error?: string }> {
    try {
      // Store in localStorage for immediate access
      localStorage.setItem(`linkedin_data_${username}`, JSON.stringify(data));
      
      // Try to store in Supabase for persistence, but don't fail if table doesn't exist
      try {
        const user = await supabase.auth.getUser();
        if (user.data.user) {
          // First check if the table exists by doing a simple select
          const { error: checkError } = await supabase
            .from('user_linkedin_data')
            .select('id')
            .limit(1);

          // If table doesn't exist, skip Supabase storage
          if (checkError && (checkError.code === 'PGRST106' || checkError.message.includes('does not exist') || checkError.message.includes('Not Acceptable'))) {
            console.log('user_linkedin_data table not found, using localStorage only');
          } else if (!checkError) {
            // Table exists, try to upsert
            const { error } = await supabase
              .from('user_linkedin_data')
              .upsert({
                user_id: user.data.user.id,
                username: username,
                linkedin_data: data,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'user_id'
              });

            if (error) {
              console.error('Error storing LinkedIn data in Supabase:', error);
            }
          }
        }
      } catch (supabaseError) {
        console.log('Supabase storage failed, continuing with localStorage only:', supabaseError);
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error storing LinkedIn data:', error);
      return { success: false, error: error.message };
    }
  }

  // Get LinkedIn data for a user
  static async getLinkedInData(username: string): Promise<{ success: boolean; data?: LinkedInData; error?: string }> {
    try {
      // Try localStorage first for speed
      const localData = localStorage.getItem(`linkedin_data_${username}`);
      if (localData) {
        try {
          const data = JSON.parse(localData);
          return { success: true, data };
        } catch (parseError) {
          console.error('Error parsing LinkedIn data from localStorage:', parseError);
        }
      }

      // Try to fall back to Supabase, but handle table not existing
      try {
        const user = await supabase.auth.getUser();
        if (user.data.user) {
          const { data: dbData, error } = await supabase
            .from('user_linkedin_data')
            .select('linkedin_data')
            .eq('user_id', user.data.user.id)
            .single();

          if (!error && dbData) {
            // Store in localStorage for next time
            localStorage.setItem(`linkedin_data_${username}`, JSON.stringify(dbData.linkedin_data));
            return { success: true, data: dbData.linkedin_data };
          }
        }
      } catch (supabaseError) {
        console.log('Supabase fetch failed, no fallback available:', supabaseError);
      }
      
      return { success: false, error: 'No LinkedIn data found' };
    } catch (error: any) {
      console.error('Error getting LinkedIn data:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if user has LinkedIn data
  static async hasLinkedInData(username: string): Promise<boolean> {
    try {
      // Check localStorage first
      const localData = localStorage.getItem(`linkedin_data_${username}`);
      if (localData) {
        return true;
      }

      // Try to check Supabase, but don't fail if table doesn't exist
      try {
        const user = await supabase.auth.getUser();
        if (user.data.user) {
          console.log('Checking LinkedIn data for user:', user.data.user.id);
          
          // First check if the table exists by doing a simple select
          const { error: checkError } = await supabase
            .from('user_linkedin_data')
            .select('id')
            .limit(1);

          // If table doesn't exist, skip Supabase check
          if (checkError && (checkError.code === 'PGRST106' || checkError.message.includes('does not exist') || checkError.message.includes('Not Acceptable'))) {
            console.log('user_linkedin_data table not found, using localStorage only');
            return false;
          }
          
          const { data, error } = await supabase
            .from('user_linkedin_data')
            .select('id')
            .eq('user_id', user.data.user.id)
            .single();

          console.log('LinkedIn data check result:', { data, error });
          return !error && !!data;
        }
      } catch (supabaseError) {
        console.log('Supabase check failed, using localStorage only:', supabaseError);
      }
      
      return false;
    } catch (error) {
      console.error('Error checking LinkedIn data:', error);
      return false;
    }
  }

  // Clear LinkedIn data for a user
  static async clearLinkedInData(username: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Clear localStorage
      localStorage.removeItem(`linkedin_data_${username}`);
      
      // Try to clear from Supabase, but don't fail if table doesn't exist
      try {
        const user = await supabase.auth.getUser();
        if (user.data.user) {
          // First check if table exists
          const { error: checkError } = await supabase
            .from('user_linkedin_data')
            .select('id')
            .limit(1);

          // Only try to delete if table exists
          if (!checkError || checkError.code !== 'PGRST106') {
            const { error } = await supabase
              .from('user_linkedin_data')
              .delete()
              .eq('user_id', user.data.user.id);

            if (error && error.code !== 'PGRST106') {
              console.log('Non-critical Supabase clear error:', error.message);
            }
          }
        }
      } catch (supabaseError: any) {
        // Silently handle Supabase errors - localStorage is primary storage
        console.log('Supabase clear skipped (table may not exist)');
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error clearing LinkedIn data:', error);
      return { success: false, error: error.message };
    }
  }

  // Update specific parts of LinkedIn data
  static async updateLinkedInData(username: string, updates: Partial<LinkedInData>): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.getLinkedInData(username);
      if (!result.success || !result.data) {
        return { success: false, error: 'No existing LinkedIn data to update' };
      }

      const updatedData = { ...result.data, ...updates };
      return await this.storeLinkedInData(username, updatedData);
    } catch (error: any) {
      console.error('Error updating LinkedIn data:', error);
      return { success: false, error: error.message };
    }
  }
}