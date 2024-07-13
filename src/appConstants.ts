import dotenv from 'dotenv'
dotenv.config()

const appConstants = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  SUPER_ADMIN_PASSKEY: process.env.HASURA_GRAPHQL_ADMIN_SECRET,
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
  HASURA_GRAPHQL_URL: process.env.HASURA_GRAPHQL_URL,
  HASURA_GRAPHQL_ADMIN_SECRET: process.env.HASURA_GRAPHQL_ADMIN_SECRET,
  APP_BASE_URL: process.env.APP_BASE_URL,
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
  }
}

export default appConstants
