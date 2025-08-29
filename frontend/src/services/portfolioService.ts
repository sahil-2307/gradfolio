import { supabase } from '../config/supabase'
import type { Portfolio, MediaFile } from '../config/supabase'

export interface CreatePortfolioData {
  title: string
  template_type: 'modern' | 'creative' | 'professional' | 'minimal'
  portfolio_data: any
}

export class PortfolioService {
  // Create new portfolio
  static async createPortfolio(data: CreatePortfolioData): Promise<{ success: boolean; portfolio?: Portfolio; error?: string }> {
    try {
      const user = await supabase.auth.getUser()
      if (!user.data.user) {
        return { success: false, error: 'User not authenticated' }
      }

      // Get user profile to get username
      const { data: userData } = await supabase
        .from('users')
        .select('username')
        .eq('id', user.data.user.id)
        .single()

      if (!userData) {
        return { success: false, error: 'User profile not found' }
      }

      const { data: portfolio, error } = await supabase
        .from('portfolios')
        .insert([
          {
            user_id: user.data.user.id,
            username: userData.username,
            title: data.title,
            template_type: data.template_type,
            portfolio_data: data.portfolio_data,
            is_published: false,
            is_public: true
          }
        ])
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, portfolio }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Get user's portfolios
  static async getUserPortfolios(): Promise<{ success: boolean; portfolios?: Portfolio[]; error?: string }> {
    try {
      const user = await supabase.auth.getUser()
      if (!user.data.user) {
        return { success: false, error: 'User not authenticated' }
      }

      const { data: portfolios, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('updated_at', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, portfolios: portfolios || [] }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Get portfolio by username
  static async getPortfolioByUsername(username: string): Promise<{ success: boolean; portfolio?: Portfolio; error?: string }> {
    try {
      const { data: portfolio, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('username', username)
        .eq('is_published', true)
        .eq('is_public', true)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      // Increment view count
      if (portfolio) {
        await supabase
          .from('portfolios')
          .update({ view_count: portfolio.view_count + 1 })
          .eq('id', portfolio.id)

        // Log portfolio view for analytics
        await supabase
          .from('portfolio_views')
          .insert([
            {
              portfolio_id: portfolio.id,
              viewed_at: new Date().toISOString()
            }
          ])
      }

      return { success: true, portfolio }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Update portfolio
  static async updatePortfolio(portfolioId: string, updates: Partial<Portfolio>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('portfolios')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', portfolioId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Publish portfolio
  static async publishPortfolio(portfolioId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('portfolios')
        .update({ 
          is_published: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', portfolioId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Delete portfolio
  static async deletePortfolio(portfolioId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', portfolioId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Upload media file
  static async uploadMediaFile(file: File, portfolioId: string): Promise<{ success: boolean; mediaFile?: MediaFile; error?: string }> {
    try {
      const user = await supabase.auth.getUser()
      if (!user.data.user) {
        return { success: false, error: 'User not authenticated' }
      }

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${user.data.user.id}/${portfolioId}/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file)

      if (uploadError) {
        return { success: false, error: uploadError.message }
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      // Save media file record
      const { data: mediaFile, error: dbError } = await supabase
        .from('media_files')
        .insert([
          {
            user_id: user.data.user.id,
            portfolio_id: portfolioId,
            file_name: file.name,
            file_type: file.type.startsWith('image') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'video',
            file_size: file.size,
            file_url: publicUrl
          }
        ])
        .select()
        .single()

      if (dbError) {
        return { success: false, error: dbError.message }
      }

      return { success: true, mediaFile }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}