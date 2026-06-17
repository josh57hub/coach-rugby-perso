// Types générés manuellement depuis supabase/migrations/00001_init_schema.sql
// À régénérer avec `supabase gen types typescript` si le schéma évolue
// (nécessite la CLI Supabase : npx supabase login && npx supabase gen types...).

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          prenom: string;
          taille_cm: number;
          poids_kg: number;
          postes: string[];
          poste_principal: string;
          sport: string;
          niveau: string;
          date_reprise: string;
          objectif_court: string | null;
          objectifs_long: string[];
          equipement_disponible: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Omit<Database["public"]["Tables"]["profiles"]["Row"], "id">> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      daily_checkins: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          sommeil_h: number;
          qualite_sommeil: number;
          energie: number;
          fatigue: number;
          stress: number;
          motivation: number;
          douleur_ischio: number;
          douleur_hanche: number;
          douleur_pied: number;
          douleur_genou: number;
          poids_kg: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["daily_checkins"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["daily_checkins"]["Row"]>;
        Relationships: [];
      };
      injury_history: {
        Row: {
          id: string;
          user_id: string;
          zone: string;
          cote: string | null;
          type: string;
          statut: "Récurrent" | "Antécédent" | "Surveillance";
          annee: string | null;
          impact: string | null;
          strategie: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["injury_history"]["Row"]> & {
          user_id: string;
          zone: string;
          type: string;
          statut: "Récurrent" | "Antécédent" | "Surveillance";
        };
        Update: Partial<Database["public"]["Tables"]["injury_history"]["Row"]>;
        Relationships: [];
      };
      training_sessions: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          type: string;
          titre: string;
          duree_min: number;
          rpe_cible: number | null;
          objectif: string | null;
          equipement: string[];
          echauffement: string[];
          travail_principal: string[];
          accessoire: string[];
          mobilite: string[];
          prevention: string[];
          recuperation: string[];
          alternatives: string[];
          contexte: "Salle" | "Domicile" | "Vacances" | "Terrain" | null;
          statut: "planifiee" | "faite" | "manquee" | "adaptee";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["training_sessions"]["Row"]> & {
          user_id: string;
          date: string;
          type: string;
          titre: string;
        };
        Update: Partial<Database["public"]["Tables"]["training_sessions"]["Row"]>;
        Relationships: [];
      };
      session_logs: {
        Row: {
          id: string;
          user_id: string;
          session_id: string | null;
          date: string;
          rpe_ressenti: number | null;
          duree_reelle_min: number | null;
          charge_totale: number | null;
          douleur_post_ischio: number | null;
          douleur_post_hanche: number | null;
          douleur_post_pied: number | null;
          douleur_post_genou: number | null;
          series_completees: Json;
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["session_logs"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["session_logs"]["Row"]>;
        Relationships: [];
      };
      meal_entries: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          repas: "Petit-déjeuner" | "Déjeuner" | "Collation" | "Dîner";
          source: "photo_ia" | "manuel";
          photo_url: string | null;
          aliments: string[];
          resume: string | null;
          calories: number | null;
          proteines_g: number | null;
          glucides_g: number | null;
          lipides_g: number | null;
          feedback: string | null;
          suggestions: string[];
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["meal_entries"]["Row"]> & {
          user_id: string;
          repas: "Petit-déjeuner" | "Déjeuner" | "Collation" | "Dîner";
        };
        Update: Partial<Database["public"]["Tables"]["meal_entries"]["Row"]>;
        Relationships: [];
      };
      recovery_logs: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          items: Json;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["recovery_logs"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["recovery_logs"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
