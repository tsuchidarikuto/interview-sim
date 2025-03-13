// utils/supabase/database.ts
import { SupabaseClient } from '@supabase/supabase-js'  // 型定義用に追加
import { convertKeysToSnakeCase, convertKeysToCamelCase,toSnakeCase } from '@/utils/case-converter'


export class SupabaseDatabase<T extends object> {
  private supabase: SupabaseClient
  private tableName: string

  // コンストラクタで既存のクライアントを渡せるようにする
  constructor(tableName: string, supabaseClient: SupabaseClient) {
    this.tableName = tableName
    this.supabase = supabaseClient
  }

  async getArrayDataByUserId(userId: string): Promise<T[]> {
    try {
      const { data, error } = await this.supabase
        .from(toSnakeCase(this.tableName))
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

  async getDataById(id: string): Promise<T> {
    const { data, error } = await this.supabase
      .from(toSnakeCase(this.tableName))
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      throw new Error(`Failed to fetch data: ${error?.message || 'Data not found'}`)
    }
    return data as T
  }

  /**
   * データを追加する
   * @param data 追加するデータ
   * @param userId ユーザーID
   * @returns 追加されたデータ
   */
  async addData(data: T, userId: string): Promise<T> {
    try {
      // データの整形
      const insertData = {
        ...convertKeysToSnakeCase(data),
        uid: userId,        
      }

      console.log('Inserting data:', insertData); // デバッグ用

      // データの挿入（selectを先に実行）
      const { data: insertedData, error } = await this.supabase
        .from(toSnakeCase(this.tableName))
        .insert(insertData)
        .select('*')  // '*'を明示的に指定
        .single()

      // エラーの詳細なログ
      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`データの追加に失敗しました: ${error.message || 'Unknown error'}`);
      }

      // 結果の検証
      if (!insertedData) {
        console.error('No data returned after insert');
        throw new Error('データの追加は成功しましたが、返却値が空でした');
      }

      console.log('Successfully inserted data:', insertedData); // デバッグ用

      // 追加されたデータをキャメルケースに変換して返す
      return convertKeysToCamelCase(insertedData) as T;

    } catch (error) {
      console.error('データ追加時のエラー詳細:', {
        error,
        tableName: this.tableName,
        originalData: data
      });

      if (error instanceof Error) {
        throw new Error(`データ追加エラー: ${error.message}`);
      }
      throw new Error('予期せぬエラーが発生しました');
    }
  }

  async updateData(id: string, data: Partial<T>): Promise<void> {
    try {
      const snakeCaseData = convertKeysToSnakeCase(data)

      const { error } = await this.supabase
        .from(toSnakeCase(this.tableName))
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
        .from(toSnakeCase(this.tableName))
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

  async getSortedData(column: string, direction: 'asc' | 'desc'): Promise<T[]> {
    try {
      const { data, error } = await this.supabase
        .from(toSnakeCase(this.tableName))
        .select('*')
        .order(toSnakeCase(column), { ascending: direction === 'asc' })

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
  
}