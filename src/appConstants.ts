import dotenv from 'dotenv'
dotenv.config()

const appConstants = {
  PORT: process.env.PORT,
  HASURA_GRAPHQL_URL: process.env.HASURA_GRAPHQL_URL,
  HASURA_GRAPHQL_ADMIN_SECRET: process.env.HASURA_GRAPHQL_ADMIN_SECRET,
  AES_ENC_KEY: process.env.AES_ENC_KEY,
  AES_ENC_IV: process.env.AES_ENC_IV,
  SUPABASE_DB_KEY: process.env.SUPABASE_DB_KEY,
  SUPABASE_PUBLIC_ANON_KEY: process.env.SUPABASE_PUBLIC_ANON_KEY,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_AUTH_CALLBACK: {
    LOCAL: 'http://localhost:5173/authcallback',
    STAGING: 'https://demo.jalphahealth.com/authcallback'
  },
  ROLES: {
    PATIENT: 'PATIENT',
    STAFF: 'STAFF',
    NURSE: 'NURSE',
    DOCTOR: 'DOCTOR',
    FRONT_DESK: 'FRONT-DESK',
    ADMIN: 'ADMIN'
  },
  PUSHER: {
    APP_ID: process.env.PUSHER_APP_ID!,
    KEY: process.env.PUSHER_KEY!,
    SECRET: process.env.PUSHER_SECRET!,
    CLUSTER: process.env.PUSHER_CLUSTER!,
    USE_TLS: false,
  }
}

export default appConstants
