// utils/supabase/database.ts
import { createClient } from '@/utils/supabase/client'
import { convertKeysToSnakeCase, convertKeysToCamelCase } from '@/utils/case-converter'

export class SupabaseDatabase<T extends object> {
  private supabase = createClient()
  private tableName: string

  constructor(tableName: string) {
    this.tableName = tableName
  }

  async getArrayDataByUserId(userId: string): Promise<T[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('uid', userId)

      if (error) {
        console.error('Error details:', error)
        throw new Error(`Failed to fetch data: ${error.message}`)
      }

      return (data || []).map(item => convertKeysToCamelCase(item) as T)
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  }

  async getDataById(id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching data:', error)
      return null
    }
    return data
  }

  async addData(data: T, userId: string): Promise<void> {
    try {
      const snakeCaseData = convertKeysToSnakeCase({
        ...data,
        uid: userId
      })

      const { error } = await this.supabase
        .from(this.tableName)
        .insert(snakeCaseData)

      if (error) {
        console.error('Error details:', error)
        throw new Error(`Failed to add data: ${error.message}`)
      }
    } catch (error) {
      console.error('Error adding data:', error)
      throw error
    }
  }

  async updateData(id: string, data: Partial<T>): Promise<void> {
    try {
      const snakeCaseData = convertKeysToSnakeCase(data)

      const { error } = await this.supabase
        .from(this.tableName)
        .update(snakeCaseData)
        .eq('id', id)

      if (error) {
        console.error('Error details:', error)
        throw new Error(`Failed to update data: ${error.message}`)
      }
    } catch (error) {
      console.error('Error updating data:', error)
      throw error
    }
  }

  async deleteData(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error details:', error)
        throw new Error(`Failed to delete data: ${error.message}`)
      }
    } catch (error) {
      console.error('Error deleting data:', error)
      throw error
    }
  }
}