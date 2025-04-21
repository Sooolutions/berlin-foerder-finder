export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Förderungen: {
        Row: {
          alter_max: number | null
          alter_min: number | null
          Bezirk: string | null
          einkommen_max: number | null
          gueltig_bis: string | null
          id: number
          link: string | null
          tags: string | null
          titel: string | null
          Zielgruppe: string | null
        }
        Insert: {
          alter_max?: number | null
          alter_min?: number | null
          Bezirk?: string | null
          einkommen_max?: number | null
          gueltig_bis?: string | null
          id?: number
          link?: string | null
          tags?: string | null
          titel?: string | null
          Zielgruppe?: string | null
        }
        Update: {
          alter_max?: number | null
          alter_min?: number | null
          Bezirk?: string | null
          einkommen_max?: number | null
          gueltig_bis?: string | null
          id?: number
          link?: string | null
          tags?: string | null
          titel?: string | null
          Zielgruppe?: string | null
        }
        Relationships: []
      }
      funding: {
        Row: {
          amount: string | null
          application_deadline: string | null
          application_process: string | null
          categories: Database["public"]["Enums"]["funding_category"][]
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string
          district: string[] | null
          education_level: string[] | null
          employment_status: string[] | null
          id: string
          income_max: number | null
          income_min: number | null
          max_age: number | null
          min_age: number | null
          organization: string
          requires_children: boolean | null
          requires_marriage: boolean | null
          tags: string[]
          title: string
          updated_at: string | null
          url: string
          valid_until: string | null
        }
        Insert: {
          amount?: string | null
          application_deadline?: string | null
          application_process?: string | null
          categories: Database["public"]["Enums"]["funding_category"][]
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description: string
          district?: string[] | null
          education_level?: string[] | null
          employment_status?: string[] | null
          id?: string
          income_max?: number | null
          income_min?: number | null
          max_age?: number | null
          min_age?: number | null
          organization: string
          requires_children?: boolean | null
          requires_marriage?: boolean | null
          tags: string[]
          title: string
          updated_at?: string | null
          url: string
          valid_until?: string | null
        }
        Update: {
          amount?: string | null
          application_deadline?: string | null
          application_process?: string | null
          categories?: Database["public"]["Enums"]["funding_category"][]
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string
          district?: string[] | null
          education_level?: string[] | null
          employment_status?: string[] | null
          id?: string
          income_max?: number | null
          income_min?: number | null
          max_age?: number | null
          min_age?: number | null
          organization?: string
          requires_children?: boolean | null
          requires_marriage?: boolean | null
          tags?: string[]
          title?: string
          updated_at?: string | null
          url?: string
          valid_until?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      funding_category:
        | "Bildung"
        | "Arbeit"
        | "Wohnen"
        | "Familie"
        | "Gesundheit"
        | "Integration"
        | "Kultur"
        | "Soziales"
        | "Sport"
        | "Wirtschaft"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      funding_category: [
        "Bildung",
        "Arbeit",
        "Wohnen",
        "Familie",
        "Gesundheit",
        "Integration",
        "Kultur",
        "Soziales",
        "Sport",
        "Wirtschaft",
      ],
    },
  },
} as const
