declare global {
  interface ObjectConstructor {
    /**
     * Groups members of an iterable according to the return value of the passed callback.
     * @param items An iterable.
     * @param keySelector A callback which will be invoked for each item in items.
     */
    groupBy<K extends PropertyKey, T>(
      items: Iterable<T>,
      keySelector: (item: T, index: number) => K
    ): Partial<Record<K, T[]>>
  }
}

type Social = {
  name: string
  link: string
}

export interface IUser {
  user_id: string
  account_type: string
  created_at: string
  description?: string
  display_name: string
  email: string
  is_verified: boolean
  socials: Array<Social>
  password?: string
}

export interface Hospital {
  name: string
  id: string
  address: string
}

export interface Medication {
  drug: string
  duration: string
  frequency: string
}

interface Consultation {
  id: string
  other_remarks: string
  progressive_note: string
  is_draft: boolean
  vital_signs: {
    BP: string
    Pulse: number
    'Respiratory Rate': number
    Temperature: number
    'Urine Output': number
  }
  anthropometric_details: {
    'Arm Circumference': number
    BMI: number
    Height: number
    Weight: number
  }
  chief_complaints: string[]
  consultation_summary: string
  date: string
  diagnostic_hypothesis: string
  final_diagnosis: string
  history_of_illness: string
  physical_examination: string
  system_symptoms: {
    system: string
    symptom: string[]
  }[]
  treatment_plan: string
  labtests: {
    name: string
    indication: string
    id: string
    appointment_id: string
  }[]
  labtests_files: {
    name: string
    upload_date: string
    download_url: string
    size: number
  }[]
  medications: {
    frequency: string
    duration: string
    drug: string
  }[]
  followup_appointment_id: string
  followup_appointment?: {
    id: string
    date: string
    start_time: string
    end_time: string
  }
  referred_doctor_id: string
  referred_doctor?: {
    id: string
    basedemographicinfo: {
      first_name: string
      last_name: string
    }
    specialist: string
    profile_image: string
  }
}

export interface MedicalRecord {
  id: string
  conclusion: string
  date: string
  start_time: string
  medium: string
  status: string
  patient: Partial<Patient>
  hospital: {
    id: string
    name: string
    address: string
  }
  doctor: {
    id: string
    employee: {
      basedemographicinfo: {
        first_name: string
        last_name: string
      }
      profile_image: string
    }
    specialist: string
  }
  consultation?: Partial<Consultation>
}

export interface Patient {
  basedemographicinfo: {
    first_name: string
    last_name: string
    gender: string
    date_of_birth: string
    role: string
    phone_number: string
    address: string
    country: string
    marital_status: string
    religion: string
    state: string
  }
  guardian: {
    guardian_address: string
    guardian_country: string
    guardian_date_of_birth: string
    guardian_full_name: string
    guardian_gender: string
    guardian_phone_number: string
    guardian_phone_number_2: string
    guardian_state: string
  }
  profession: string
  is_insured: boolean
  profile_image: string
  id: string
  next_of_kin: {
    name: string
    address: string
    contact: string
    sex: string
    date_of_birth: string
  }
  status: 'pending' | 'in-patient' | 'out-patient'
}

export interface HistoryItem {
  created_at: string
}
export interface MedicalHistoryItem extends HistoryItem {
  info: string
}
export interface SurgicalHistoryItem extends HistoryItem {
  surgery: string
  date: string
  details: string
}

export interface HabitItem extends HistoryItem {
  habit: string
  details: string
}

export interface AllergyItem extends HistoryItem {
  allergy: string
  details: string
}
export interface VaccineItem extends HistoryItem {
  vaccine: string
  year: string
}

export interface ObstetricHistoryItem extends HistoryItem {
  date: string
  details: string
}

export interface PediatricHistoryItem extends HistoryItem {
  title: string
  details: string
}

export interface FamilyHistoryItem extends HistoryItem {
  title: string
  details: string
}
export interface GynecologicHistoryItem extends HistoryItem {
  title: string
  details: string
}

export interface MedicalHistory {
  allergies: Array<AllergyItem>
  blood_group: string
  family_history: Array<FamilyHistoryItem>
  gynecologic_history: Array<GynecologicHistoryItem>
  habits: Array<HabitItem>
  hemoglobin: string
  id: string
  medical_history: Array<MedicalHistoryItem>
  obstetric_history: Array<ObstetricHistoryItem>
  pediatric_history: Array<PediatricHistoryItem>
  surgical_history: Array<SurgicalHistoryItem>
  vaccines: Array<VaccineItem>
  patient_id: string
}

interface TreatmentPlanMedication {
  name_dosage: string
  date_time: Array<string>
  status: "ongoing" | "paused" | "stopped"
}

interface TreatmentPlanVital {
  date: string
  bp: string
  pulse: number
  temperature: number
  respiratory_rate: number
  time: string
  taken_by: {
    name: string
    role: string
    image?: string
    id: string
  }
}

export interface TreatmentPlanDrugChart {
  date: string
  drug: string
  route: string
  source: string
  materials: string
  time_administered: string
  time_next_dosage: string
  administered_by: {
    name: string
    role: string
    image?: string
    id: string
  }
}

interface TreatmentPlanLabTest {
  date: string
  name: string
  indication: string
  requested_by: {
    name: string
    role: string
    image?: string
    id: string
  }
}

interface TreatmentPlanLabTestFile {
  name: string
  date: string
  upload_date: string
  download_url: string
  size: number
}

interface TreatmentPlanNote {
  date: string
  details: string
  written_by: {
    name: string
    role: string
    image?: string
    id: string
  }
}
export interface TreatmentPlan {
  dates: Array<string>
  vitals: Array<TreatmentPlanVital>
  drug_chart: Array<TreatmentPlanDrugChart>
  medications: Array<TreatmentPlanMedication>
  labtests: Array<TreatmentPlanLabTest>
  notes: Array<TreatmentPlanNote>
  labtests_files: Array<TreatmentPlanLabTestFile>
}


export interface Hospitalization {
  id: string
  patient: Partial<Patient>
  date: string
  time: string
  department_id: string
  treatment_plan?: TreatmentPlan
  initial_treatment_plan: string
  nursing_guide: string
  diagnoses: string
  bed_information: {
    ward: string
    bed: string
    unit: string
  }
  doctor: {
    id: string
    profile_image: string
    specialist: string
    employee:{
      basedemographicinfo: {
      first_name: string
      last_name: string
    }
    }
  }
  hospital: {
    name: string
    id: string
    address: string
  }
  health_team?: Array<{
    name: string
    role: string
    image?: string
    id: string
  }>
}

interface PlanVital {
  time: string
  date: string
  bp: string
  pulse: number
  temperature: number
  respiratory_rate: number
  taken_by: {
    name: string
    role: string
    image?: string
    id: string
  }
}

interface PlanDrugChart {
  name: string
  details: Array<TreatmentPlanDrugChart>
}

interface PlanMedication {
  name_dosage: string
  times: Array<string>
  status: "ongoing" | "paused" | "stopped"
}
export interface Plan {
  date: string
  vitals: Array<PlanVital>
  drug_chart: Array<PlanDrugChart>
  medications: Array<PlanMedication>
  labtests: Array<TreatmentPlanLabTest>
  labtests_files: Array<TreatmentPlanLabTestFile>
  note: TreatmentPlanNote
}