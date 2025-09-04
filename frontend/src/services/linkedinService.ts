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
      
      // Also store in Supabase for persistence
      const user = await supabase.auth.getUser();
      if (user.data.user) {
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
          // Don't fail if Supabase fails, localStorage is sufficient
        }
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

      // Fall back to Supabase
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

      // Check Supabase
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        const { data, error } = await supabase
          .from('user_linkedin_data')
          .select('id')
          .eq('user_id', user.data.user.id)
          .single();

        return !error && !!data;
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
      
      // Clear Supabase
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        const { error } = await supabase
          .from('user_linkedin_data')
          .delete()
          .eq('user_id', user.data.user.id);

        if (error) {
          console.error('Error clearing LinkedIn data from Supabase:', error);
          // Don't fail if Supabase fails
        }
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