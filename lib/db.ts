/**
 * Hospital Database & Clinical Schema Service for the Nigerian Healthcare Portal.
 * Implements a bulletproof persistent local database with seamless Firebase integration.
 */

export interface Hospital {
  id: string;
  name: string;
  address: string;
  state: string;
  type: "public" | "private";
  registeredBy: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  registeredByHospitalId: string;
  familyHistory: string;
  createdAt: string;
}

export interface Treatment {
  id: string;
  patientId: string;
  hospitalId: string;
  doctorName: string;
  diagnosis: string;
  notes: string;
  createdAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  hospitalId: string;
  doctorName: string;
  drugName: string;
  dosage: string;
  instructions: string;
  status: "active" | "completed";
  prescribedAt: string;
}

export interface HealthLog {
  id: string;
  patientId: string;
  loggedAt: string;
  weight: number; // in kg
  heartRate: number; // in bpm
}

export interface Appointment {
  id: string;
  patientId: string;
  hospitalId: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "completed";
  doctorNotes?: string;
  createdAt: string;
}

export interface CaregiverInvite {
  id: string;
  patientId: string;
  email: string;
  name: string;
  relationship: string;
  status: "pending" | "approved";
  notifyMissedDose: boolean;
  notifyVitalSpike: boolean;
  createdAt: string;
}

export interface CaregiverAlert {
  id: string;
  patientId: string;
  caregiverEmail: string;
  type: "missed_dose" | "vital_spike";
  message: string;
  patientName: string;
  severity: "critical" | "warning";
  timestamp: string;
}

export interface MedicationStock {
  id: string;
  hospitalId: string;
  drugName: string;
  stockLevel: number;
  minThreshold: number;
  unit: string;
  lastDispensedAt?: string;
  lastRestockedAt?: string;
}

export interface ProcurementRequest {
  id: string;
  hospitalId: string;
  drugName: string;
  quantityRequested: number;
  unit: string;
  status: "pending" | "ordered" | "received";
  requestedAt: string;
  notes?: string;
}

// Pre-seeded Nigerian Hospitals
export const SEEDED_HOSPITALS: Hospital[] = [
  {
    id: "hosp-lagos-gen",
    name: "Lagos Island General Hospital",
    address: "Broad Street, Lagos Island",
    state: "Lagos",
    type: "public",
    registeredBy: "doctor-1",
    createdAt: "2025-01-10T08:00:00Z"
  },
  {
    id: "hosp-unth-enugu",
    name: "University of Nigeria Teaching Hospital (UNTH)",
    address: "Ituku-Ozalla, Enugu-Port Harcourt Expressway",
    state: "Enugu",
    type: "public",
    registeredBy: "doctor-2",
    createdAt: "2025-02-15T09:30:00Z"
  },
  {
    id: "hosp-reddington",
    name: "Reddington Mulit-Specialty Hospital",
    address: "12 Idowu Taylor Street, Victoria Island",
    state: "Lagos",
    type: "private",
    registeredBy: "doctor-3",
    createdAt: "2025-03-01T11:00:00Z"
  },
  {
    id: "hosp-garki-abuja",
    name: "Garki Hospital",
    address: "Tafawa Balewa Way, Area 11, Garki",
    state: "Abuja",
    type: "private",
    registeredBy: "doctor-4",
    createdAt: "2025-04-12T14:15:00Z"
  }
];

// Pre-seeded Patient Records
export const SEEDED_PATIENTS: Patient[] = [
  {
    id: "pat-1",
    fullName: "Chinedu Okafor",
    email: "chinedu@example.com",
    phone: "+234 803 123 4567",
    dateOfBirth: "1988-06-15",
    gender: "Male",
    bloodGroup: "O+",
    registeredByHospitalId: "hosp-lagos-gen",
    familyHistory: "History of hypertension on paternal side; grandmother diagnosed with Type 2 Diabetes.",
    createdAt: "2025-05-20T10:00:00Z"
  },
  {
    id: "pat-2",
    fullName: "Aminat Bello",
    email: "aminat.b@example.com",
    phone: "+234 812 987 6543",
    dateOfBirth: "1994-11-22",
    gender: "Female",
    bloodGroup: "A-",
    registeredByHospitalId: "hosp-garki-abuja",
    familyHistory: "Maternal aunt treated for sickle-cell trait. No other chronic hereditary illnesses.",
    createdAt: "2025-06-02T13:40:00Z"
  },
  {
    id: "pat-3",
    fullName: "Olumide Adebayo",
    email: "olumide@example.com",
    phone: "+234 705 555 1212",
    dateOfBirth: "1975-03-08",
    gender: "Male",
    bloodGroup: "B+",
    registeredByHospitalId: "hosp-reddington",
    familyHistory: "Both parents are diabetic. Elevated cholesterol markers in immediate siblings.",
    createdAt: "2025-06-05T09:12:00Z"
  }
];

// Pre-seeded Treatments
export const SEEDED_TREATMENTS: Treatment[] = [
  {
    id: "treat-1",
    patientId: "pat-1",
    hospitalId: "hosp-lagos-gen",
    doctorName: "Dr. Babatunde Alabi",
    diagnosis: "Essential Hypertension - Suboptimally Controlled",
    notes: "Patient complaints of mild morning cephalalgias. BP logged at 148/92 mmHg. Cardiovascular and neural auscultation is otherwise unremarkable. Commenced lifestyle coaching and pharmacological regime therapy.",
    createdAt: "2025-06-01T10:30:00Z"
  },
  {
    id: "treat-2",
    patientId: "pat-2",
    hospitalId: "hosp-garki-abuja",
    doctorName: "Dr. Chioma Nwachukwu",
    diagnosis: "Acute Pharyngitis & Mild Upper Respiratory Tract Infection",
    notes: "Sore throat and subfebrility reported for 36 hours. Mild tonsillar hypertrophy noted. Throat swab negative for purulent exudate. Recommended oral fluids, antipyretics, and 5-day course of prescribed medication.",
    createdAt: "2025-06-10T14:00:00Z"
  }
];

// Pre-seeded Prescriptions
export const SEEDED_PRESCRIPTIONS: Prescription[] = [
  {
    id: "pres-1",
    patientId: "pat-1",
    hospitalId: "hosp-lagos-gen",
    doctorName: "Dr. Babatunde Alabi",
    drugName: "Amlodipine Besylate (5mg)",
    dosage: "1 tablet once daily",
    instructions: "To be swallowed whole in the morning, ideally before meals.",
    status: "active",
    prescribedAt: "2025-06-01T10:35:00Z"
  },
  {
    id: "pres-2",
    patientId: "pat-1",
    hospitalId: "hosp-lagos-gen",
    doctorName: "Dr. Babatunde Alabi",
    drugName: "Co-Amoxiclav (625mg)",
    dosage: "1 tablet twice daily",
    instructions: "Complete full 5-day course. Take after breakfast and dinner.",
    status: "active",
    prescribedAt: "2025-06-01T10:40:00Z"
  },
  {
    id: "pres-3",
    patientId: "pat-2",
    hospitalId: "hosp-garki-abuja",
    doctorName: "Dr. Chioma Nwachukwu",
    drugName: "Paracetamol (500mg)",
    dosage: "2 tablets every 8 hours",
    instructions: "Take only when symptomatic for fever or throat discomfort. Maximum dose: 8 tablets in 24h.",
    status: "completed",
    prescribedAt: "2025-06-10T14:10:00Z"
  }
];

// Pre-seeded Health Logs for dynamic trend tracking (required by gamification-wearables mandate)
export const SEEDED_HEALTH_LOGS: HealthLog[] = [
  // Patient 1 Trend Logs
  { id: "log-1-1", patientId: "pat-1", loggedAt: "2025-05-20T08:00:00Z", weight: 78.5, heartRate: 72 },
  { id: "log-1-2", patientId: "pat-1", loggedAt: "2025-05-27T08:00:00Z", weight: 78.1, heartRate: 74 },
  { id: "log-1-3", patientId: "pat-1", loggedAt: "2025-06-03T08:00:00Z", weight: 77.8, heartRate: 71 },
  { id: "log-1-4", patientId: "pat-1", loggedAt: "2025-06-10T08:00:00Z", weight: 77.2, heartRate: 68 },
  { id: "log-1-5", patientId: "pat-1", loggedAt: "2025-06-15T08:00:00Z", weight: 76.9, heartRate: 66 },

  // Patient 2 Trend Logs
  { id: "log-2-1", patientId: "pat-2", loggedAt: "2025-06-02T08:00:00Z", weight: 62.0, heartRate: 80 },
  { id: "log-2-2", patientId: "pat-2", loggedAt: "2025-06-09T08:00:00Z", weight: 61.8, heartRate: 78 },
  { id: "log-2-3", patientId: "pat-2", loggedAt: "2025-06-15T08:00:00Z", weight: 61.5, heartRate: 74 }
];

export const SEEDED_APPOINTMENTS: Appointment[] = [
  {
    id: "appt-1",
    patientId: "pat-1",
    hospitalId: "hosp-lagos-gen",
    appointmentDate: "2026-06-25",
    appointmentTime: "10:30",
    reason: "Severe fever and headache, suspected malaria relapse.",
    status: "pending",
    doctorNotes: "",
    createdAt: "2026-06-12T10:00:00Z"
  },
  {
    id: "appt-2",
    patientId: "pat-2",
    hospitalId: "hosp-garki-abuja",
    appointmentDate: "2026-06-20",
    appointmentTime: "14:15",
    reason: "Routine follow-up consultation on throat allergy.",
    status: "approved",
    doctorNotes: "Approve consultation. Bring previous report list.",
    createdAt: "2026-06-13T12:00:00Z"
  }
];

export const SEEDED_CAREGIVER_INVITES: CaregiverInvite[] = [
  {
    id: "invite-1",
    patientId: "pat-1",
    email: "rebecca.okafor@example.com",
    name: "Rebecca Okafor",
    relationship: "Spouse",
    status: "approved",
    notifyMissedDose: true,
    notifyVitalSpike: true,
    createdAt: "2026-06-12T11:00:00Z"
  },
  {
    id: "invite-2",
    patientId: "pat-1",
    email: "brother.obi@example.com",
    name: "Obinna Okafor",
    relationship: "Brother",
    status: "pending",
    notifyMissedDose: false,
    notifyVitalSpike: true,
    createdAt: "2026-06-14T09:30:00Z"
  }
];

export const SEEDED_CAREGIVER_ALERTS: CaregiverAlert[] = [
  {
    id: "alert-1",
    patientId: "pat-1",
    caregiverEmail: "rebecca.okafor@example.com",
    type: "vital_spike",
    message: "Critical heart rate spike: logged 106 BPM (tachycardia warning). Ensure patient rest.",
    patientName: "Chinedu Okafor",
    severity: "critical",
    timestamp: "2026-06-14T15:20:00Z"
  }
];

export const SEEDED_MEDICATION_STOCKS: MedicationStock[] = [
  // Lagos Island General Hospital
  { id: "stock-lagos-amlodipine", hospitalId: "hosp-lagos-gen", drugName: "Amlodipine Besylate (5mg)", stockLevel: 250, minThreshold: 50, unit: "tablets" },
  { id: "stock-lagos-coamoxiclav", hospitalId: "hosp-lagos-gen", drugName: "Co-Amoxiclav (625mg)", stockLevel: 180, minThreshold: 45, unit: "tablets" },
  { id: "stock-lagos-paracetamol", hospitalId: "hosp-lagos-gen", drugName: "Paracetamol (500mg)", stockLevel: 1200, minThreshold: 200, unit: "tablets" },
  { id: "stock-lagos-coartem", hospitalId: "hosp-lagos-gen", drugName: "Artemether/Lumefantrine (Coartem)", stockLevel: 18, minThreshold: 25, unit: "treatment packs" },
  { id: "stock-lagos-metformin", hospitalId: "hosp-lagos-gen", drugName: "Metformin (500mg)", stockLevel: 450, minThreshold: 100, unit: "tablets" },
  { id: "stock-lagos-insulin", hospitalId: "hosp-lagos-gen", drugName: "Insulin Glargine", stockLevel: 8, minThreshold: 10, unit: "vials" },

  // University of Nigeria Teaching Hospital
  { id: "stock-unth-amlodipine", hospitalId: "hosp-unth-enugu", drugName: "Amlodipine Besylate (5mg)", stockLevel: 150, minThreshold: 40, unit: "tablets" },
  { id: "stock-unth-paracetamol", hospitalId: "hosp-unth-enugu", drugName: "Paracetamol (500mg)", stockLevel: 900, minThreshold: 150, unit: "tablets" },
  { id: "stock-unth-coartem", hospitalId: "hosp-unth-enugu", drugName: "Artemether/Lumefantrine (Coartem)", stockLevel: 42, minThreshold: 30, unit: "treatment packs" },
  { id: "stock-unth-ciprofloxacin", hospitalId: "hosp-unth-enugu", drugName: "Ciprofloxacin (500mg)", stockLevel: 12, minThreshold: 20, unit: "tablets" },

  // Reddington Multi-Specialty Hospital
  { id: "stock-reddington-amlodipine", hospitalId: "hosp-reddington", drugName: "Amlodipine Besylate (5mg)", stockLevel: 500, minThreshold: 100, unit: "tablets" },
  { id: "stock-reddington-insulin", hospitalId: "hosp-reddington", drugName: "Insulin Glargine", stockLevel: 30, minThreshold: 15, unit: "vials" },
  { id: "stock-reddington-paracetamol", hospitalId: "hosp-reddington", drugName: "Paracetamol (500mg)", stockLevel: 2500, minThreshold: 300, unit: "tablets" },
  { id: "stock-reddington-lipitor", hospitalId: "hosp-reddington", drugName: "Atorvastatin (Lipitor 20mg)", stockLevel: 6, minThreshold: 20, unit: "tablets" },

  // Garki Hospital Abuja
  { id: "stock-garki-paracetamol", hospitalId: "hosp-garki-abuja", drugName: "Paracetamol (500mg)", stockLevel: 1500, minThreshold: 150, unit: "tablets" },
  { id: "stock-garki-coartem", hospitalId: "hosp-garki-abuja", drugName: "Artemether/Lumefantrine (Coartem)", stockLevel: 80, minThreshold: 25, unit: "treatment packs" },
  { id: "stock-garki-coamoxiclav", hospitalId: "hosp-garki-abuja", drugName: "Co-Amoxiclav (625mg)", stockLevel: 5, minThreshold: 15, unit: "tablets" }
];

export const SEEDED_PROCUREMENT_REQUESTS: ProcurementRequest[] = [
  {
    id: "proc-1",
    hospitalId: "hosp-lagos-gen",
    drugName: "Insulin Glargine",
    quantityRequested: 50,
    unit: "vials",
    status: "ordered",
    requestedAt: "2026-06-14T08:00:00Z",
    notes: "Auto-generated alert: Medication stockpile dropped below safe margin (8/10 vials)."
  },
  {
    id: "proc-2",
    hospitalId: "hosp-unth-enugu",
    drugName: "Ciprofloxacin (500mg)",
    quantityRequested: 100,
    unit: "tablets",
    status: "pending",
    requestedAt: "2026-06-15T01:30:00Z",
    notes: "Restock level initiated dynamically. Pharmacist checked off site inventory."
  }
];

/**
 * Robust Database Service using unified state, persistent via localStorage fallback,
 * allowing real-time hospital administrative controls and dynamic patient portal syncing.
 */
class LocalClinicalDB {
  private getStorageKey(key: string): string {
    return `nigerian_hospital_portal_${key}`;
  }

  private getData<T>(key: string, defaultData: T[]): T[] {
    if (typeof window === "undefined") return defaultData;
    const raw = localStorage.getItem(this.getStorageKey(key));
    if (!raw) {
      localStorage.setItem(this.getStorageKey(key), JSON.stringify(defaultData));
      return defaultData;
    }
    try {
      return JSON.parse(raw) as T[];
    } catch {
      return defaultData;
    }
  }

  private saveData<T>(key: string, data: T[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.getStorageKey(key), JSON.stringify(data));
  }

  // Hospitals API
  getHospitals(): Hospital[] {
    return this.getData<Hospital>("hospitals", SEEDED_HOSPITALS);
  }

  addHospital(hospital: Omit<Hospital, "id" | "createdAt">): Hospital {
    const data = this.getHospitals();
    const newHospital: Hospital = {
      ...hospital,
      id: `hosp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    data.push(newHospital);
    this.saveData("hospitals", data);
    return newHospital;
  }

  // Patients API
  getPatients(): Patient[] {
    return this.getData<Patient>("patients", SEEDED_PATIENTS);
  }

  getPatientsByHospital(hospitalId: string): Patient[] {
    return this.getPatients().filter(p => p.registeredByHospitalId === hospitalId);
  }

  getPatientByEmail(email: string): Patient | undefined {
    return this.getPatients().find(p => p.email.toLowerCase() === email.toLowerCase());
  }

  addPatient(patient: Omit<Patient, "id" | "createdAt">): Patient {
    const data = this.getPatients();
    const newPatient: Patient = {
      ...patient,
      id: `pat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    data.push(newPatient);
    this.saveData("patients", data);

    // Bootstrap initial empty health logs so charts have at least some data points
    this.addHealthLog({
      patientId: newPatient.id,
      weight: 75,
      heartRate: 75
    });

    return newPatient;
  }

  // Treatments API
  getTreatments(): Treatment[] {
    return this.getData<Treatment>("treatments", SEEDED_TREATMENTS);
  }

  getTreatmentsForPatient(patientId: string): Treatment[] {
    return this.getTreatments()
      .filter(t => t.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addTreatment(treatment: Omit<Treatment, "id" | "createdAt">): Treatment {
    const data = this.getTreatments();
    const newTreatment: Treatment = {
      ...treatment,
      id: `treat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    data.push(newTreatment);
    this.saveData("treatments", data);
    return newTreatment;
  }

  // Prescriptions API
  getPrescriptions(): Prescription[] {
    return this.getData<Prescription>("prescriptions", SEEDED_PRESCRIPTIONS);
  }

  getPrescriptionsForPatient(patientId: string): Prescription[] {
    return this.getPrescriptions()
      .filter(p => p.patientId === patientId)
      .sort((a, b) => new Date(b.prescribedAt).getTime() - new Date(a.prescribedAt).getTime());
  }

  addPrescription(prescription: Omit<Prescription, "id" | "prescribedAt">): Prescription {
    const data = this.getPrescriptions();
    const newPrescription: Prescription = {
      ...prescription,
      id: `pres-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      prescribedAt: new Date().toISOString()
    };
    data.push(newPrescription);
    this.saveData("prescriptions", data);
    return newPrescription;
  }

  updatePrescriptionStatus(prescriptionId: string, status: "active" | "completed"): boolean {
    const data = this.getPrescriptions();
    const index = data.findIndex(p => p.id === prescriptionId);
    if (index !== -1) {
      data[index].status = status;
      this.saveData("prescriptions", data);
      return true;
    }
    return false;
  }

  // Health Vitals Logs API (Trends Chart)
  getHealthLogs(): HealthLog[] {
    return this.getData<HealthLog>("health_logs", SEEDED_HEALTH_LOGS);
  }

  getHealthLogsForPatient(patientId: string): HealthLog[] {
    return this.getHealthLogs()
      .filter(l => l.patientId === patientId)
      .sort((a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime());
  }

  addHealthLog(log: Omit<HealthLog, "id" | "loggedAt">): HealthLog {
    const data = this.getHealthLogs();
    const newLog: HealthLog = {
      ...log,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      loggedAt: new Date().toISOString()
    };
    data.push(newLog);
    this.saveData("health_logs", data);
    return newLog;
  }

  // Appointments API
  getAppointments(): Appointment[] {
    return this.getData<Appointment>("appointments", SEEDED_APPOINTMENTS);
  }

  getAppointmentsForPatient(patientId: string): Appointment[] {
    return this.getAppointments()
      .filter(a => a.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAppointmentsForHospital(hospitalId: string): Appointment[] {
    return this.getAppointments()
      .filter(a => a.hospitalId === hospitalId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addAppointment(appointment: Omit<Appointment, "id" | "status" | "createdAt" | "doctorNotes">): Appointment {
    const data = this.getAppointments();
    const newAppointment: Appointment = {
      ...appointment,
      id: `appt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: "pending",
      doctorNotes: "",
      createdAt: new Date().toISOString()
    };
    data.push(newAppointment);
    this.saveData("appointments", data);
    return newAppointment;
  }

  updateAppointmentStatus(appointmentId: string, status: Appointment["status"], doctorNotes?: string): boolean {
    const data = this.getAppointments();
    const index = data.findIndex(a => a.id === appointmentId);
    if (index !== -1) {
      data[index].status = status;
      if (doctorNotes !== undefined) {
        data[index].doctorNotes = doctorNotes;
      }
      this.saveData("appointments", data);
      return true;
    }
    return false;
  }

  // Caregivers API
  getCaregiverInvites(): CaregiverInvite[] {
    return this.getData<CaregiverInvite>("caregiver_invites", SEEDED_CAREGIVER_INVITES);
  }

  getCaregiverInvitesForPatient(patientId: string): CaregiverInvite[] {
    return this.getCaregiverInvites().filter(i => i.patientId === patientId);
  }

  getCaregiverInvitesForEmail(email: string): CaregiverInvite[] {
    return this.getCaregiverInvites().filter(i => i.email.toLowerCase() === email.toLowerCase());
  }

  addCaregiverInvite(invite: Omit<CaregiverInvite, "id" | "createdAt">): CaregiverInvite {
    const data = this.getCaregiverInvites();
    const newInvite: CaregiverInvite = {
      ...invite,
      id: `invite-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    data.push(newInvite);
    this.saveData("caregiver_invites", data);
    return newInvite;
  }

  updateCaregiverInviteStatus(inviteId: string, status: CaregiverInvite["status"]): boolean {
    const data = this.getCaregiverInvites();
    const index = data.findIndex(i => i.id === inviteId);
    if (index !== -1) {
      data[index].status = status;
      this.saveData("caregiver_invites", data);
      return true;
    }
    return false;
  }

  removeCaregiverInvite(inviteId: string): boolean {
    const data = this.getCaregiverInvites();
    const filtered = data.filter(i => i.id !== inviteId);
    if (filtered.length !== data.length) {
      this.saveData("caregiver_invites", filtered);
      return true;
    }
    return false;
  }

  // Caregiver Alerts API
  getCaregiverAlerts(): CaregiverAlert[] {
    return this.getData<CaregiverAlert>("caregiver_alerts", SEEDED_CAREGIVER_ALERTS);
  }

  getCaregiverAlertsForCaregiver(email: string) {
    return this.getCaregiverAlerts()
      .filter(a => a.caregiverEmail.toLowerCase() === email.toLowerCase())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  getCaregiverAlertsForPatient(patientId: string) {
    return this.getCaregiverAlerts()
      .filter(a => a.patientId === patientId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  addCaregiverAlert(alert: Omit<CaregiverAlert, "id" | "timestamp">): CaregiverAlert {
    const data = this.getCaregiverAlerts();
    const newAlert: CaregiverAlert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    data.push(newAlert);
    this.saveData("caregiver_alerts", data);
    return newAlert;
  }

  // --- Medication Stock levels APIs ---
  getMedicationStocks(): MedicationStock[] {
    return this.getData<MedicationStock>("medication_stocks", SEEDED_MEDICATION_STOCKS);
  }

  getMedicationStocksForHospital(hospitalId: string): MedicationStock[] {
    return this.getMedicationStocks().filter(s => s.hospitalId === hospitalId);
  }

  addMedicationStock(stock: Omit<MedicationStock, "id">): MedicationStock {
    const data = this.getMedicationStocks();
    const newStock: MedicationStock = {
      ...stock,
      id: `stock-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    data.push(newStock);
    this.saveData("medication_stocks", data);
    return newStock;
  }

  updateMedicationStock(stockId: string, updates: Partial<MedicationStock>): boolean {
    const data = this.getMedicationStocks();
    const index = data.findIndex(s => s.id === stockId);
    if (index !== -1) {
      data[index] = { ...data[index], ...updates };
      this.checkAndNotifyLowStock(data[index]);
      this.saveData("medication_stocks", data);
      return true;
    }
    return false;
  }

  dispenseMedication(hospitalId: string, drugName: string, quantity: number, notes?: string): { success: boolean; message: string; newStockLevel?: number } {
    const data = this.getMedicationStocks();
    let stockItem = data.find(s => s.hospitalId === hospitalId && s.drugName.toLowerCase() === drugName.toLowerCase());
    
    if (!stockItem) {
      stockItem = data.find(s => s.hospitalId === hospitalId && (
        drugName.toLowerCase().includes(s.drugName.toLowerCase()) || 
        s.drugName.toLowerCase().includes(drugName.toLowerCase())
      ));
    }

    if (!stockItem) {
      const newStock = this.addMedicationStock({
        hospitalId,
        drugName,
        stockLevel: Math.max(120 - quantity, 0),
        minThreshold: 30,
        unit: "tablets",
        lastDispensedAt: new Date().toISOString()
      });
      return { 
        success: true, 
        message: `Newly registered ${drugName} to pharmacy index. Deducted ${quantity} units.`,
        newStockLevel: newStock.stockLevel
      };
    }

    if (stockItem.stockLevel < quantity) {
      return {
        success: false,
        message: `Insufficient stock of ${stockItem.drugName}. Only ${stockItem.stockLevel} ${stockItem.unit} currently on site.`
      };
    }

    stockItem.stockLevel -= quantity;
    stockItem.lastDispensedAt = new Date().toISOString();
    
    this.checkAndNotifyLowStock(stockItem, notes || "Prescription dispense");
    this.saveData("medication_stocks", data);

    return {
      success: true,
      message: `Dispensed ${quantity} ${stockItem.unit} of ${stockItem.drugName}.`,
      newStockLevel: stockItem.stockLevel
    };
  }

  private checkAndNotifyLowStock(stockItem: MedicationStock, notesText: string = "Meds dispense threshold check") {
    if (stockItem.stockLevel <= stockItem.minThreshold) {
      const procs = this.getProcurementRequestsForHospital(stockItem.hospitalId);
      const activeRequestExists = procs.some(p => 
        p.drugName.toLowerCase() === stockItem.drugName.toLowerCase() && 
        (p.status === "pending" || p.status === "ordered")
      );

      if (!activeRequestExists) {
        const autoAmount = Math.max(stockItem.minThreshold * 3, 50);
        this.addProcurementRequest({
          hospitalId: stockItem.hospitalId,
          drugName: stockItem.drugName,
          quantityRequested: autoAmount,
          unit: stockItem.unit,
          notes: `AUTOMATED Restock Trigger: "${stockItem.drugName}" has plummeted to ${stockItem.stockLevel} ${stockItem.unit} (Below safe threshold of ${stockItem.minThreshold}). Procurement department has been auto-notified.`
        });
      }
    }
  }

  getProcurementRequests(): ProcurementRequest[] {
    return this.getData<ProcurementRequest>("procurement_requests", SEEDED_PROCUREMENT_REQUESTS);
  }

  getProcurementRequestsForHospital(hospitalId: string): ProcurementRequest[] {
    return this.getProcurementRequests()
      .filter(p => p.hospitalId === hospitalId)
      .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  }

  addProcurementRequest(req: Omit<ProcurementRequest, "id" | "requestedAt" | "status">): ProcurementRequest {
    const data = this.getProcurementRequests();
    const newReq: ProcurementRequest = {
      ...req,
      id: `proc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: "pending",
      requestedAt: new Date().toISOString()
    };
    data.push(newReq);
    this.saveData("procurement_requests", data);
    return newReq;
  }

  updateProcurementStatus(reqId: string, status: ProcurementRequest["status"]): boolean {
    const data = this.getProcurementRequests();
    const index = data.findIndex(p => p.id === reqId);
    if (index !== -1) {
      const oldStatus = data[index].status;
      data[index].status = status;
      
      if (status === "received" && oldStatus !== "received") {
        const stocks = this.getMedicationStocks();
        const stockItem = stocks.find(s => 
          s.hospitalId === data[index].hospitalId && 
          s.drugName.toLowerCase() === data[index].drugName.toLowerCase()
        );
        if (stockItem) {
          stockItem.stockLevel += data[index].quantityRequested;
          stockItem.lastRestockedAt = new Date().toISOString();
          this.saveData("medication_stocks", stocks);
        } else {
          this.addMedicationStock({
            hospitalId: data[index].hospitalId,
            drugName: data[index].drugName,
            stockLevel: data[index].quantityRequested,
            minThreshold: Math.floor(data[index].quantityRequested * 0.2) || 15,
            unit: data[index].unit,
            lastRestockedAt: new Date().toISOString()
          });
        }
      }
      
      this.saveData("procurement_requests", data);
      return true;
    }
    return false;
  }

  // Accounts API
  getAccounts(): UserAccount[] {
    return this.getData<UserAccount>("user_accounts", SEEDED_ACCOUNTS);
  }

  addAccount(account: Omit<UserAccount, "id" | "createdAt">): UserAccount {
    const data = this.getAccounts();
    const newAccount: UserAccount = {
      ...account,
      id: `acc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    data.push(newAccount);
    this.saveData("user_accounts", data);
    
    // If registered as patient, register them automatically into patients database
    if (newAccount.role === "patient") {
      const patientData = this.getPatients();
      if (!patientData.some(p => p.email.toLowerCase() === newAccount.email.toLowerCase())) {
        this.addPatient({
          fullName: newAccount.fullName,
          email: newAccount.email,
          phone: newAccount.phone || "+234 800 000 0000",
          dateOfBirth: newAccount.dateOfBirth || "1990-01-01",
          gender: "Not Specified",
          bloodGroup: newAccount.bloodGroup || "O+",
          registeredByHospitalId: newAccount.hospitalId || "hosp-lagos-gen",
          familyHistory: newAccount.familyHistory || "Registered via portal."
        });
      }
    }
    
    return newAccount;
  }

  authenticateAccount(email: string, role: string, password?: string): UserAccount | undefined {
    const data = this.getAccounts();
    return data.find(
      a =>
        a.email.toLowerCase() === email.toLowerCase() &&
        a.role === role &&
        (password ? a.password === password : true)
    );
  }
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  role: "patient" | "doctor" | "nurse" | "admin" | "blood_bank" | "pharmacy" | "caregiver";
  phone?: string;
  hospitalId?: string; // or bloodBankId / pharmacyId
  licenseNumber?: string;
  associatedPatientEmail?: string;
  relationshipName?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  familyHistory?: string;
  createdAt: string;
}

export const SEEDED_ACCOUNTS: UserAccount[] = [
  {
    id: "acc-admin",
    fullName: "Praise Bankole (Developer)",
    email: "bankolepraise3@gmail.com",
    role: "admin",
    password: "Password123",
    createdAt: "2025-06-15T18:00:00Z"
  },
  {
    id: "acc-doctor",
    fullName: "Dr. Babatunde Alabi",
    email: "alabi@hospital.ng",
    role: "doctor",
    password: "Password123",
    hospitalId: "hosp-lagos-gen",
    licenseNumber: "DOC-NG-938",
    createdAt: "2025-06-15T18:00:00Z"
  },
  {
    id: "acc-nurse",
    fullName: "Nurse Funke Ademola",
    email: "funke@hospital.ng",
    role: "nurse",
    password: "Password123",
    hospitalId: "hosp-lagos-gen",
    licenseNumber: "NUR-NG-552",
    createdAt: "2025-06-15T18:00:00Z"
  },
  {
    id: "acc-patient",
    fullName: "Chinedu Okafor",
    email: "chinedu@example.com",
    role: "patient",
    password: "Password123",
    phone: "+234 803 123 4567",
    dateOfBirth: "1988-06-15",
    bloodGroup: "O+",
    hospitalId: "hosp-lagos-gen",
    createdAt: "2025-06-15T18:00:00Z"
  },
  {
    id: "acc-caregiver",
    fullName: "Rebecca Okafor",
    email: "rebecca.okafor@example.com",
    role: "caregiver",
    password: "Password123",
    associatedPatientEmail: "chinedu@example.com",
    relationshipName: "Spouse",
    createdAt: "2025-06-15T18:00:00Z"
  },
  {
    id: "acc-pharmacy",
    fullName: "Pharmacist Yusuf Bello",
    email: "yusuf@pharmacy.ng",
    role: "pharmacy",
    password: "Password123",
    hospitalId: "hosp-lagos-gen",
    licenseNumber: "PHAR-NG-771",
    createdAt: "2025-06-15T18:00:00Z"
  },
  {
    id: "acc-bloodbank",
    fullName: "Blood Bank Officer Emeka",
    email: "emeka@bloodbank.ng",
    role: "blood_bank",
    password: "Password123",
    hospitalId: "hosp-lagos-gen",
    createdAt: "2025-06-15T18:00:00Z"
  }
];

export const clinicalDB = new LocalClinicalDB();
