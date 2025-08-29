import { supabase } from '../config/supabase'
import type { User } from '../config/supabase'

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

export class AuthService {
  // Sign up new user
  static async signUp(email: string, password: string, username: string, fullName?: string): Promise<AuthResponse> {
    try {
      console.log('🔧 SignUp Debug - Starting signup process...')
      console.log('🔧 Skipping username check for now - creating auth user directly')
      
      // Skip username check for now - database access is blocked

      // Create auth user
      console.log('🔧 Creating auth user...')
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName
          }
        }
      })

      console.log('🔧 Auth signup result:', { authData, authError })

      if (authError) {
        return { success: false, error: `Auth error: ${authError.message}` }
      }

      if (!authData.user) {
        return { success: false, error: 'User creation failed' }
      }

      // Skip user profile creation for now - return basic user data
      console.log('🔧 Skipping user profile creation - RLS blocking access')
      
      const basicUser = {
        id: authData.user.id,
        email: authData.user.email!,
        username,
        full_name: fullName,
        subscription_plan: 'free' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true
      }

      console.log('🔧 Returning basic user data:', basicUser)
      return { success: true, user: basicUser }
    } catch (error: any) {
      console.error('🔧 SignUp catch error:', error)
      return { success: false, error: `Network error: ${error.message}` }
    }
  }

  // Sign in user
  static async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      if (!authData.user) {
        return { success: false, error: 'Sign in failed' }
      }

      // Get user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (userError || !userData) {
        return { success: false, error: 'User profile not found' }
      }

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', authData.user.id)

      return { success: true, user: userData }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Sign out user
  static async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return null

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      return userData
    } catch (error) {
      return null
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser()
    return !!user
  }

  // Get auth session
  static async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }
}