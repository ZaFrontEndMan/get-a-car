export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string
          description_ar: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          order_index: number | null
          title: string
          title_ar: string | null
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          description: string
          description_ar?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          title: string
          title_ar?: string | null
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          description?: string
          description_ar?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          title?: string
          title_ar?: string | null
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      additional_services: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          address: string | null
          city: string | null
          contact_email: string | null
          country: string | null
          created_at: string
          facebook_url: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          site_description: string | null
          site_name: string
          support_phone: string | null
          twitter_url: string | null
          updated_at: string
          website: string | null
          youtube_url: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_email?: string | null
          country?: string | null
          created_at?: string
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          site_description?: string | null
          site_name?: string
          support_phone?: string | null
          twitter_url?: string | null
          updated_at?: string
          website?: string | null
          youtube_url?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_email?: string | null
          country?: string | null
          created_at?: string
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          site_description?: string | null
          site_name?: string
          support_phone?: string | null
          twitter_url?: string | null
          updated_at?: string
          website?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      blogs: {
        Row: {
          author_id: string
          content: string
          content_ar: string | null
          created_at: string
          excerpt: string | null
          excerpt_ar: string | null
          featured_image: string | null
          id: string
          keywords: string[] | null
          published_at: string | null
          slug: string
          status: string
          title: string
          title_ar: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          content_ar?: string | null
          created_at?: string
          excerpt?: string | null
          excerpt_ar?: string | null
          featured_image?: string | null
          id?: string
          keywords?: string[] | null
          published_at?: string | null
          slug: string
          status?: string
          title: string
          title_ar?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          content_ar?: string | null
          created_at?: string
          excerpt?: string | null
          excerpt_ar?: string | null
          featured_image?: string | null
          id?: string
          keywords?: string[] | null
          published_at?: string | null
          slug?: string
          status?: string
          title?: string
          title_ar?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          additional_services: Json | null
          booking_number: string
          booking_status: string | null
          car_id: string
          created_at: string
          customer_email: string
          customer_id: string
          customer_name: string
          customer_phone: string
          daily_rate: number
          deposit_paid: number | null
          id: string
          payment_status: string | null
          pickup_date: string
          pickup_location: string
          return_date: string
          return_location: string
          service_fees: number | null
          special_requests: string | null
          subtotal: number
          total_amount: number
          total_days: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          additional_services?: Json | null
          booking_number: string
          booking_status?: string | null
          car_id: string
          created_at?: string
          customer_email: string
          customer_id: string
          customer_name: string
          customer_phone: string
          daily_rate: number
          deposit_paid?: number | null
          id?: string
          payment_status?: string | null
          pickup_date: string
          pickup_location: string
          return_date: string
          return_location: string
          service_fees?: number | null
          special_requests?: string | null
          subtotal: number
          total_amount: number
          total_days: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          additional_services?: Json | null
          booking_number?: string
          booking_status?: string | null
          car_id?: string
          created_at?: string
          customer_email?: string
          customer_id?: string
          customer_name?: string
          customer_phone?: string
          daily_rate?: number
          deposit_paid?: number | null
          id?: string
          payment_status?: string | null
          pickup_date?: string
          pickup_location?: string
          return_date?: string
          return_location?: string
          service_fees?: number | null
          special_requests?: string | null
          subtotal?: number
          total_amount?: number
          total_days?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_profiles_user_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bookings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          address: string
          city: string
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          manager_name: string | null
          name: string
          phone: string | null
          vendor_id: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          manager_name?: string | null
          name: string
          phone?: string | null
          vendor_id: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          manager_name?: string | null
          name?: string
          phone?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "branches_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      car_additional_services: {
        Row: {
          car_id: string
          created_at: string
          custom_price: number | null
          id: string
          service_id: string
        }
        Insert: {
          car_id: string
          created_at?: string
          custom_price?: number | null
          id?: string
          service_id: string
        }
        Update: {
          car_id?: string
          created_at?: string
          custom_price?: number | null
          id?: string
          service_id?: string
        }
        Relationships: []
      }
      cars: {
        Row: {
          branch_id: string | null
          brand: string
          color: string | null
          condition: string | null
          created_at: string
          daily_rate: number
          deposit_amount: number | null
          dropoff_locations: string[] | null
          features: string[] | null
          fuel_type: string
          id: string
          images: string[] | null
          is_available: boolean | null
          is_featured: boolean | null
          license_plate: string | null
          mileage_limit: number | null
          model: string
          monthly_rate: number | null
          name: string
          paid_features: Json | null
          pickup_locations: string[] | null
          seats: number
          transmission: string
          type: string
          updated_at: string
          vendor_id: string
          weekly_rate: number | null
          year: number
        }
        Insert: {
          branch_id?: string | null
          brand: string
          color?: string | null
          condition?: string | null
          created_at?: string
          daily_rate: number
          deposit_amount?: number | null
          dropoff_locations?: string[] | null
          features?: string[] | null
          fuel_type: string
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          is_featured?: boolean | null
          license_plate?: string | null
          mileage_limit?: number | null
          model: string
          monthly_rate?: number | null
          name: string
          paid_features?: Json | null
          pickup_locations?: string[] | null
          seats: number
          transmission: string
          type: string
          updated_at?: string
          vendor_id: string
          weekly_rate?: number | null
          year: number
        }
        Update: {
          branch_id?: string | null
          brand?: string
          color?: string | null
          condition?: string | null
          created_at?: string
          daily_rate?: number
          deposit_amount?: number | null
          dropoff_locations?: string[] | null
          features?: string[] | null
          fuel_type?: string
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          is_featured?: boolean | null
          license_plate?: string | null
          mileage_limit?: number | null
          model?: string
          monthly_rate?: number | null
          name?: string
          paid_features?: Json | null
          pickup_locations?: string[] | null
          seats?: number
          transmission?: string
          type?: string
          updated_at?: string
          vendor_id?: string
          weekly_rate?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "cars_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cars_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          country_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name_ar: string
          name_en: string
          updated_at: string | null
        }
        Insert: {
          country_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name_ar: string
          name_en: string
          updated_at?: string | null
        }
        Update: {
          country_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name_ar?: string
          name_en?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cities_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          driver_license_number: string | null
          email: string
          id: string
          last_booking_date: string | null
          name: string
          phone: string | null
          status: string | null
          total_bookings: number | null
          total_spent: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          driver_license_number?: string | null
          email: string
          id?: string
          last_booking_date?: string | null
          name: string
          phone?: string | null
          status?: string | null
          total_bookings?: number | null
          total_spent?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          driver_license_number?: string | null
          email?: string
          id?: string
          last_booking_date?: string | null
          name?: string
          phone?: string | null
          status?: string | null
          total_bookings?: number | null
          total_spent?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      countries: {
        Row: {
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name_ar: string
          name_en: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name_ar: string
          name_en: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name_ar?: string
          name_en?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer_ar: string | null
          answer_en: string
          created_at: string
          id: string
          is_active: boolean | null
          order_index: number | null
          question_ar: string | null
          question_en: string
          updated_at: string
        }
        Insert: {
          answer_ar?: string | null
          answer_en: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          question_ar?: string | null
          question_en: string
          updated_at?: string
        }
        Update: {
          answer_ar?: string | null
          answer_en?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          question_ar?: string | null
          question_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          car_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          car_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          car_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_slides: {
        Row: {
          button_text: string | null
          button_text_ar: string | null
          button_url: string | null
          created_at: string
          id: string
          image_url: string
          is_active: boolean
          order_index: number
          subtitle: string
          subtitle_ar: string | null
          title: string
          title_ar: string | null
          updated_at: string
        }
        Insert: {
          button_text?: string | null
          button_text_ar?: string | null
          button_url?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean
          order_index?: number
          subtitle: string
          subtitle_ar?: string | null
          title: string
          title_ar?: string | null
          updated_at?: string
        }
        Update: {
          button_text?: string | null
          button_text_ar?: string | null
          button_url?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
          order_index?: number
          subtitle?: string
          subtitle_ar?: string | null
          title?: string
          title_ar?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          car_id: string
          created_at: string
          description: string
          description_ar: string | null
          discount_percentage: number
          id: string
          status: string
          title: string
          title_ar: string | null
          updated_at: string
          valid_until: string
          vendor_id: string
        }
        Insert: {
          car_id: string
          created_at?: string
          description: string
          description_ar?: string | null
          discount_percentage: number
          id?: string
          status?: string
          title: string
          title_ar?: string | null
          updated_at?: string
          valid_until: string
          vendor_id: string
        }
        Update: {
          car_id?: string
          created_at?: string
          description?: string
          description_ar?: string | null
          discount_percentage?: number
          id?: string
          status?: string
          title?: string
          title_ar?: string | null
          updated_at?: string
          valid_until?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      our_team: {
        Row: {
          bio: string | null
          created_at: string
          email: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          linkedin_url: string | null
          name: string
          order_index: number | null
          phone: string | null
          position: string
          twitter_url: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          linkedin_url?: string | null
          name: string
          order_index?: number | null
          phone?: string | null
          position: string
          twitter_url?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          linkedin_url?: string | null
          name?: string
          order_index?: number | null
          phone?: string | null
          position?: string
          twitter_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          id: string
          payment_date: string | null
          payment_method: string
          payment_status: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          id?: string
          payment_date?: string | null
          payment_method: string
          payment_status?: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          id?: string
          payment_date?: string | null
          payment_method?: string
          payment_status?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      privacy_policy: {
        Row: {
          content_ar: string | null
          content_en: string
          created_at: string
          id: string
          is_active: boolean | null
          updated_at: string
          version: number | null
        }
        Insert: {
          content_ar?: string | null
          content_en: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
          version?: number | null
        }
        Update: {
          content_ar?: string | null
          content_en?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          driver_license_number: string | null
          driving_license_image_url: string | null
          first_name: string | null
          id: string
          last_name: string | null
          national_id_image_url: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          driver_license_number?: string | null
          driving_license_image_url?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          national_id_image_url?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          driver_license_number?: string | null
          driving_license_image_url?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          national_id_image_url?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      terms_conditions: {
        Row: {
          content_ar: string | null
          content_en: string
          created_at: string
          id: string
          is_active: boolean | null
          updated_at: string
          version: number | null
        }
        Insert: {
          content_ar?: string | null
          content_en: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
          version?: number | null
        }
        Update: {
          content_ar?: string | null
          content_en?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          comment: string
          comment_ar: string | null
          created_at: string
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          location: string | null
          location_ar: string | null
          name: string
          name_ar: string | null
          order_index: number | null
          rating: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          comment: string
          comment_ar?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string | null
          location_ar?: string | null
          name: string
          name_ar?: string | null
          order_index?: number | null
          rating?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          comment?: string
          comment_ar?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string | null
          location_ar?: string | null
          name?: string
          name_ar?: string | null
          order_index?: number | null
          rating?: number
          updated_at?: string
        }
        Relationships: []
      }
      vendor_policies: {
        Row: {
          created_at: string
          description_ar: string | null
          description_en: string
          id: string
          is_active: boolean | null
          order_index: number | null
          policy_type: string
          title_ar: string | null
          title_en: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_en: string
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          policy_type?: string
          title_ar?: string | null
          title_en: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          description_en?: string
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          policy_type?: string
          title_ar?: string | null
          title_en?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_policies_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_users: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          permissions: Json | null
          role: string
          user_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role?: string
          user_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role?: string
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_users_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          can_create_offers: boolean | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          description: string | null
          email: string
          id: string
          is_active: boolean | null
          license_id: string | null
          license_id_back_image_url: string | null
          license_id_front_image_url: string | null
          location: string | null
          logo_url: string | null
          name: string
          national_id: string | null
          national_id_back_image_url: string | null
          national_id_front_image_url: string | null
          phone: string | null
          rating: number | null
          show_on_website: boolean | null
          total_reviews: number | null
          updated_at: string
          user_id: string | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          can_create_offers?: boolean | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          description?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          license_id?: string | null
          license_id_back_image_url?: string | null
          license_id_front_image_url?: string | null
          location?: string | null
          logo_url?: string | null
          name: string
          national_id?: string | null
          national_id_back_image_url?: string | null
          national_id_front_image_url?: string | null
          phone?: string | null
          rating?: number | null
          show_on_website?: boolean | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          can_create_offers?: boolean | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          description?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          license_id?: string | null
          license_id_back_image_url?: string | null
          license_id_front_image_url?: string | null
          location?: string | null
          logo_url?: string | null
          name?: string
          national_id?: string | null
          national_id_back_image_url?: string | null
          national_id_front_image_url?: string | null
          phone?: string | null
          rating?: number | null
          show_on_website?: boolean | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_car_return: {
        Args: { booking_id_param: string }
        Returns: undefined
      }
      generate_booking_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_all_bookings_admin: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          booking_number: string
          car_id: string
          vendor_id: string
          customer_id: string
          customer_name: string
          customer_email: string
          customer_phone: string
          pickup_date: string
          return_date: string
          total_amount: number
          booking_status: string
          payment_status: string
          created_at: string
          total_days: number
          car_name: string
          car_brand: string
          car_model: string
          vendor_name: string
        }[]
      }
      get_client_bookings: {
        Args: { client_user_id: string }
        Returns: {
          id: string
          booking_number: string
          car_id: string
          vendor_id: string
          customer_id: string
          customer_name: string
          customer_email: string
          customer_phone: string
          pickup_date: string
          return_date: string
          total_amount: number
          booking_status: string
          payment_status: string
          created_at: string
          car_name: string
          car_brand: string
          car_model: string
          vendor_name: string
        }[]
      }
      get_clients_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          email: string
          phone: string
          totalbookings: number
          totalspent: number
          lastbooking: string
          status: string
          joineddate: string
        }[]
      }
      is_vendor_owner: {
        Args:
          | { _vendor_id: string; _user_id: string }
          | { vendor_id_param: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "client" | "vendor"
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
      user_role: ["admin", "client", "vendor"],
    },
  },
} as const
