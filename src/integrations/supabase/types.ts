export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      contracts: {
        Row: {
          agreed_wage: number
          created_at: string
          end_date: string | null
          escrow_amount: number
          id: string
          job_id: string
          owner_id: string
          released_amount: number
          start_date: string | null
          status: Database["public"]["Enums"]["contract_status"]
          updated_at: string
          wage_type: Database["public"]["Enums"]["wage_type"]
          worker_id: string
        }
        Insert: {
          agreed_wage: number
          created_at?: string
          end_date?: string | null
          escrow_amount?: number
          id?: string
          job_id: string
          owner_id: string
          released_amount?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          updated_at?: string
          wage_type?: Database["public"]["Enums"]["wage_type"]
          worker_id: string
        }
        Update: {
          agreed_wage?: number
          created_at?: string
          end_date?: string | null
          escrow_amount?: number
          id?: string
          job_id?: string
          owner_id?: string
          released_amount?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          updated_at?: string
          wage_type?: Database["public"]["Enums"]["wage_type"]
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          counter_wage: number | null
          created_at: string
          id: string
          job_id: string
          message: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
          voice_note_url: string | null
          worker_id: string
        }
        Insert: {
          counter_wage?: number | null
          created_at?: string
          id?: string
          job_id: string
          message?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          voice_note_url?: string | null
          worker_id: string
        }
        Update: {
          counter_wage?: number | null
          created_at?: string
          id?: string
          job_id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          voice_note_url?: string | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          area_acres: number | null
          created_at: string
          crew_size: number
          crop: string | null
          description: string | null
          district: string | null
          end_date: string | null
          escrow_amount: number
          escrow_funded: boolean
          food_provided: boolean
          id: string
          latitude: number | null
          longitude: number | null
          owner_id: string
          skills_required: string[]
          start_date: string | null
          state: string | null
          status: Database["public"]["Enums"]["job_status"]
          stay_provided: boolean
          title: string
          tools_provided: boolean
          transport_provided: boolean
          updated_at: string
          urgency: string
          village: string | null
          wage_amount: number
          wage_type: Database["public"]["Enums"]["wage_type"]
          women_friendly: boolean
          women_only: boolean
        }
        Insert: {
          area_acres?: number | null
          created_at?: string
          crew_size?: number
          crop?: string | null
          description?: string | null
          district?: string | null
          end_date?: string | null
          escrow_amount?: number
          escrow_funded?: boolean
          food_provided?: boolean
          id?: string
          latitude?: number | null
          longitude?: number | null
          owner_id: string
          skills_required?: string[]
          start_date?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          stay_provided?: boolean
          title: string
          tools_provided?: boolean
          transport_provided?: boolean
          updated_at?: string
          urgency?: string
          village?: string | null
          wage_amount: number
          wage_type?: Database["public"]["Enums"]["wage_type"]
          women_friendly?: boolean
          women_only?: boolean
        }
        Update: {
          area_acres?: number | null
          created_at?: string
          crew_size?: number
          crop?: string | null
          description?: string | null
          district?: string | null
          end_date?: string | null
          escrow_amount?: number
          escrow_funded?: boolean
          food_provided?: boolean
          id?: string
          latitude?: number | null
          longitude?: number | null
          owner_id?: string
          skills_required?: string[]
          start_date?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          stay_provided?: boolean
          title?: string
          tools_provided?: boolean
          transport_provided?: boolean
          updated_at?: string
          urgency?: string
          village?: string | null
          wage_amount?: number
          wage_type?: Database["public"]["Enums"]["wage_type"]
          women_friendly?: boolean
          women_only?: boolean
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string | null
          created_at: string
          id: string
          job_id: string | null
          recipient_id: string
          sender_id: string
          voice_note_url: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          recipient_id: string
          sender_id: string
          voice_note_url?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          recipient_id?: string
          sender_id?: string
          voice_note_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      notice_board: {
        Row: {
          author_id: string | null
          body: string | null
          created_at: string
          district: string | null
          id: string
          image_url: string | null
          kind: string
          title: string
          village: string | null
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          created_at?: string
          district?: string | null
          id?: string
          image_url?: string | null
          kind?: string
          title: string
          village?: string | null
        }
        Update: {
          author_id?: string | null
          body?: string | null
          created_at?: string
          district?: string | null
          id?: string
          image_url?: string | null
          kind?: string
          title?: string
          village?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          crops: string[]
          day_rate: number | null
          district: string | null
          equipment: string[]
          farm_name: string | null
          full_name: string
          id: string
          is_verified: boolean
          jobs_completed: number
          language: string
          onboarded: boolean
          phone: string | null
          photo_url: string | null
          rating: number
          skills: string[]
          state: string | null
          updated_at: string
          village: string | null
          years_experience: number
        }
        Insert: {
          bio?: string | null
          created_at?: string
          crops?: string[]
          day_rate?: number | null
          district?: string | null
          equipment?: string[]
          farm_name?: string | null
          full_name?: string
          id: string
          is_verified?: boolean
          jobs_completed?: number
          language?: string
          onboarded?: boolean
          phone?: string | null
          photo_url?: string | null
          rating?: number
          skills?: string[]
          state?: string | null
          updated_at?: string
          village?: string | null
          years_experience?: number
        }
        Update: {
          bio?: string | null
          created_at?: string
          crops?: string[]
          day_rate?: number | null
          district?: string | null
          equipment?: string[]
          farm_name?: string | null
          full_name?: string
          id?: string
          is_verified?: boolean
          jobs_completed?: number
          language?: string
          onboarded?: boolean
          phone?: string | null
          photo_url?: string | null
          rating?: number
          skills?: string[]
          state?: string | null
          updated_at?: string
          village?: string | null
          years_experience?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          contract_id: string | null
          created_at: string
          direction: string
          id: string
          kind: string
          note: string | null
          user_id: string
        }
        Insert: {
          amount: number
          contract_id?: string | null
          created_at?: string
          direction?: string
          id?: string
          kind?: string
          note?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          contract_id?: string | null
          created_at?: string
          direction?: string
          id?: string
          kind?: string
          note?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "worker" | "landlord" | "admin"
      application_status:
        | "pending"
        | "shortlisted"
        | "hired"
        | "rejected"
        | "withdrawn"
      contract_status:
        | "pending"
        | "active"
        | "completed"
        | "disputed"
        | "cancelled"
      job_status: "draft" | "open" | "in_progress" | "completed" | "cancelled"
      wage_type: "per_day" | "per_acre" | "fixed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["worker", "landlord", "admin"],
      application_status: [
        "pending",
        "shortlisted",
        "hired",
        "rejected",
        "withdrawn",
      ],
      contract_status: [
        "pending",
        "active",
        "completed",
        "disputed",
        "cancelled",
      ],
      job_status: ["draft", "open", "in_progress", "completed", "cancelled"],
      wage_type: ["per_day", "per_acre", "fixed"],
    },
  },
} as const
