"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  HeartPulse,
  Activity,
  MapPin,
  User,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Clock,
  Pill,
  FileText,
  CheckCircle,
  Calendar,
  Building2,
  Phone,
  UserCheck,
  TrendingUp,
  Droplet,
  PlusCircle,
  Lock,
  ChevronRight,
  Stethoscope,
  Info,
  Bell,
  Trash2,
  UserPlus,
  AlertTriangle,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

import { cn } from "@/lib/utils";
import {
  clinicalDB,
  Hospital,
  Patient,
  Treatment,
  Prescription,
  HealthLog,
  Appointment,
  CaregiverInvite,
  CaregiverAlert,
  MedicationStock,
  ProcurementRequest,
  UserAccount
} from "@/lib/db";
import { getFacilityLocations, FacilityLocation } from "@/lib/overpass";

export default function Page() {
  // --- Authentication / Authorized Session States ---
  const [activeRole, setActiveRole] = useState<"public" | "doctor" | "patient" | "caregiver" | "pharmacy" | "nurse" | "admin" | "blood_bank">("public");
  const [currentUserAccount, setCurrentUserAccount] = useState<UserAccount | null>(null);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState("patient");
  const [loginError, setLoginError] = useState("");

  // Sign up state variables
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpRole, setSignUpRole] = useState("patient");
  const [signUpHospitalId, setSignUpHospitalId] = useState("hosp-lagos-gen");
  const [signUpLicense, setSignUpLicense] = useState("");
  const [signUpBloodGroup, setSignUpBloodGroup] = useState("O+");
  const [signUpDOB, setSignUpDOB] = useState("");
  const [signUpHistory, setSignUpHistory] = useState("");
  const [signUpPatientEmail, setSignUpPatientEmail] = useState("");
  const [signUpRelationship, setSignUpRelationship] = useState("Spouse");

  // Caregiver Portal & Alert States
  const [caregiverEmailForm, setCaregiverEmailForm] = useState("rebecca.okafor@example.com");
  const [authenticatedCaregiverEmail, setAuthenticatedCaregiverEmail] = useState("");
  const [caregiverInvites, setCaregiverInvites] = useState<CaregiverInvite[]>([]);
  const [caregiverAlerts, setCaregiverAlerts] = useState<CaregiverAlert[]>([]);
  const [caregiverLoginError, setCaregiverLoginError] = useState("");

  // Patient inviting a caregiver States
  const [newCaregiverName, setNewCaregiverName] = useState("");
  const [newCaregiverEmail, setNewCaregiverEmail] = useState("");
  const [newCaregiverRelation, setNewCaregiverRelation] = useState("Spouse");
  const [newCaregiverNotifySpike, setNewCaregiverNotifySpike] = useState(true);
  const [newCaregiverNotifyMissed, setNewCaregiverNotifyMissed] = useState(true);

  // Simulation parameters
  const [selectedSimMed, setSelectedSimMed] = useState("");
  
  // Doctor Board States
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>("hosp-lagos-gen");
  const [isAddingHospital, setIsAddingHospital] = useState(false);
  const [newHospName, setNewHospName] = useState("");
  const [newHospAddress, setNewHospAddress] = useState("");
  const [newHospState, setNewHospState] = useState("Lagos");
  const [newHospType, setNewHospType] = useState<"public" | "private">("private");
  const [doctorAuthKey, setDoctorAuthKey] = useState("DOC-NG-938");
  const [isAuthenticatedDoctor, setIsAuthenticatedDoctor] = useState(true);

  // Doctor Patient Intake & Treatment Form States
  const [selectedPatientId, setSelectedPatientId] = useState<string>("pat-1");
  const [searchPatientQuery, setSearchPatientQuery] = useState("");
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  
  // New Patient Inputs
  const [patName, setPatName] = useState("");
  const [patEmail, setPatEmail] = useState("");
  const [patPhone, setPatPhone] = useState("");
  const [patDOB, setPatDOB] = useState("");
  const [patGender, setPatGender] = useState("Male");
  const [patBlood, setPatBlood] = useState("O+");
  const [patHistory, setPatHistory] = useState("");

  // New Treatment Inputs
  const [docName, setDocName] = useState("Dr. Amadi Bello");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentNotes, setTreatmentNotes] = useState("");
  
  // New Prescription Inputs
  const [drugName, setDrugName] = useState("");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");

  // Patient Portal States
  const [patientEmail, setPatientEmail] = useState("chinedu@example.com");
  const [authenticatedPatient, setAuthenticatedPatient] = useState<Patient | null>(null);
  const [patientLoginError, setPatientLoginError] = useState("");

  // Vitals Tracking Input (Wearables Hub)
  const [syncWeight, setSyncWeight] = useState("76.5");
  const [syncHeartRate, setSyncHeartRate] = useState("72");
  const [syncSuccessMessage, setSyncSuccessMessage] = useState("");

  // --- Real Location Finder States (Nigeria) ---
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedStateFilter, setSelectedStateFilter] = useState("Lagos");
  const [searchBanners, setSearchBanners] = useState("");
  const [facilities, setFacilities] = useState<FacilityLocation[]>([]);
  const [isLocatingNearMe, setIsLocatingNearMe] = useState(false);
  const [proximityCoords, setProximityCoords] = useState<{ lat: number; lon: number } | null>(null);

  // Success Notification banner
  const [toastMessage, setToastMessage] = useState("");

  // Loaded database references
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Pharmacy Portal States
  const [medicationStocks, setMedicationStocks] = useState<MedicationStock[]>([]);
  const [procurementRequests, setProcurementRequests] = useState<ProcurementRequest[]>([]);
  const [pharmacyActiveTab, setPharmacyActiveTab] = useState<"inventory" | "prescriptions" | "procurement">("inventory");
  const [pharmacySearchQuery, setPharmacySearchQuery] = useState("");
  const [pharmacySelectedHospId, setPharmacySelectedHospId] = useState("hosp-lagos-gen");
  
  // Manual Stock Line Addition Form
  const [newStockDrugName, setNewStockDrugName] = useState("");
  const [newStockQty, setNewStockQty] = useState("");
  const [newStockThreshold, setNewStockThreshold] = useState("");
  const [newStockUnit, setNewStockUnit] = useState("tablets");
  const [isAddingStockLine, setIsAddingStockLine] = useState(false);

  // Manual Procurement Request Form
  const [newProcDrugName, setNewProcDrugName] = useState("");
  const [newProcQty, setNewProcQty] = useState("");
  const [newProcUnit, setNewProcUnit] = useState("tablets");
  const [newProcNotes, setNewProcNotes] = useState("");
  const [isAddingProcRequest, setIsAddingProcRequest] = useState(false);

  // Manual dispense state for prescription
  const [dispenseQtyMap, setDispenseQtyMap] = useState<Record<string, number>>({});

  // Appointment states
  const [apptDate, setApptDate] = useState("");
  const [apptTime, setApptTime] = useState("10:00");
  const [apptReason, setApptReason] = useState("");
  const [editingApptId, setEditingApptId] = useState<string | null>(null);
  const [apptDoctorNotes, setApptDoctorNotes] = useState("");

  // Show dynamic toast helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Reload collections from DB service
  const reloadMetadata = () => {
    setHospitals(clinicalDB.getHospitals());
    setPatients(clinicalDB.getPatients());
    setAppointments(clinicalDB.getAppointments());
    setCaregiverInvites(clinicalDB.getCaregiverInvites());
    setCaregiverAlerts(clinicalDB.getCaregiverAlerts());
    setMedicationStocks(clinicalDB.getMedicationStocks());
    setProcurementRequests(clinicalDB.getProcurementRequests());
  };

  // Run on mount
  useEffect(() => {
    reloadMetadata();
    // Default patient login
    const patientObj = clinicalDB.getPatientByEmail("chinedu@example.com");
    if (patientObj) {
      setAuthenticatedPatient(patientObj);
    }
    // Fetch initial fallback Nigerian locations
    getFacilityLocations("", "Lagos").then(data => {
      setFacilities(data);
    });
  }, []);

  // Update lists when role or selections change
  const currentHospital = useMemo(() => {
    return hospitals.find(h => h.id === selectedHospitalId);
  }, [hospitals, selectedHospitalId]);

  const currentPatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId);
  }, [patients, selectedPatientId]);

  // Patients registered under currently selected clinic
  const filteredPatients = useMemo(() => {
    return patients.filter(p => p.registeredByHospitalId === selectedHospitalId);
  }, [patients, selectedHospitalId]);

  // All treatments and prescriptions for our selected active patient
  const patientTreatments = useMemo(() => {
    return currentPatient ? clinicalDB.getTreatmentsForPatient(currentPatient.id) : [];
  }, [currentPatient]);

  const patientPrescriptions = useMemo(() => {
    return currentPatient ? clinicalDB.getPrescriptionsForPatient(currentPatient.id) : [];
  }, [currentPatient]);

  const patientHealthLogs = useMemo(() => {
    return currentPatient ? clinicalDB.getHealthLogsForPatient(currentPatient.id) : [];
  }, [currentPatient]);

  // Unified portal authentication & sign-up triggers
  const handlePortalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const account = clinicalDB.authenticateAccount(loginEmail, loginRole, loginPassword);
    if (account) {
      setCurrentUserAccount(account);
      setActiveRole(account.role as any);
      triggerToast(`Authenticated successfully as ${account.fullName}!`);
      
      // Auto-populate underlying clinical sessions
      if (account.role === "patient") {
        const mat = clinicalDB.getPatientByEmail(account.email);
        if (mat) {
          setAuthenticatedPatient(mat);
        }
      } else if (account.role === "caregiver") {
        setAuthenticatedCaregiverEmail(account.email);
        setCaregiverEmailForm(account.email);
      } else if (account.role === "doctor") {
        setIsAuthenticatedDoctor(true);
        if (account.hospitalId) {
          setSelectedHospitalId(account.hospitalId);
        }
      } else if (account.role === "nurse") {
        if (account.hospitalId) {
          setSelectedHospitalId(account.hospitalId);
        }
      } else if (account.role === "pharmacy") {
        if (account.hospitalId) {
          setPharmacySelectedHospId(account.hospitalId);
        }
      }
    } else {
      setLoginError("Invalid email, password, or incorrect role configuration. Try pre-seeded accounts! (Password: Password123)");
    }
  };

  const handlePortalSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPassword) {
      triggerToast("Please fill in Name, Email, and Password.");
      return;
    }
    
    // Check if account already exists
    const existing = clinicalDB.getAccounts().find(a => a.email.toLowerCase() === signUpEmail.toLowerCase() && a.role === signUpRole);
    if (existing) {
      triggerToast("An account already exists with this email for the selected role.");
      return;
    }

    const created = clinicalDB.addAccount({
      fullName: signUpName,
      email: signUpEmail,
      password: signUpPassword,
      role: signUpRole as any,
      phone: signUpPhone,
      hospitalId: signUpHospitalId,
      licenseNumber: signUpLicense,
      associatedPatientEmail: signUpPatientEmail,
      relationshipName: signUpRelationship,
      bloodGroup: signUpBloodGroup,
      dateOfBirth: signUpDOB || "1990-01-01",
      familyHistory: signUpHistory
    });

    // Automatically log them in
    setCurrentUserAccount(created);
    setActiveRole(created.role as any);
    triggerToast(`Account created and authorized for ${created.fullName}!`);

    // Setup sessions
    if (created.role === "patient") {
      const mat = clinicalDB.getPatientByEmail(created.email);
      if (mat) {
        setAuthenticatedPatient(mat);
      }
    } else if (created.role === "caregiver") {
      setAuthenticatedCaregiverEmail(created.email);
      setCaregiverEmailForm(created.email);
    } else if (created.role === "doctor") {
      setIsAuthenticatedDoctor(true);
      if (created.hospitalId) {
        setSelectedHospitalId(created.hospitalId);
      }
    } else if (created.role === "nurse") {
      if (created.hospitalId) {
        setSelectedHospitalId(created.hospitalId);
      }
    } else if (created.role === "pharmacy") {
      if (created.hospitalId) {
        setPharmacySelectedHospId(created.hospitalId);
      }
    }

    // Reset fields
    setSignUpName("");
    setSignUpEmail("");
    setSignUpPassword("");
    setSignUpPhone("");
    setSignUpLicense("");
    setSignUpPatientEmail("");
    setSignUpRelationship("Spouse");
    setSignUpBloodGroup("O+");
    setSignUpDOB("");
    setSignUpHistory("");
    setIsSignUpMode(false);
  };

  const handleLogout = () => {
    setCurrentUserAccount(null);
    setActiveRole("public");
    triggerToast("Your session has been successfully logged out.");
  };

  // Auth check for direct patient login request
  const handlePatientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPatientLoginError("");
    const matched = clinicalDB.getPatientByEmail(patientEmail);
    if (matched) {
      setAuthenticatedPatient(matched);
      triggerToast(`Welcome back, ${matched.fullName}! Patient session authorized.`);
    } else {
      setPatientLoginError("Email address not found. Ensure the hospital has registered your clinical record profile.");
    }
  };

  // Doctor - Custom Hospital Registration
  const handleAddHospitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHospName.trim() || !newHospAddress.trim()) {
      triggerToast("Please provide hospital name and location address.");
      return;
    }
    const added = clinicalDB.addHospital({
      name: newHospName,
      address: newHospAddress,
      state: newHospState,
      type: newHospType,
      registeredBy: "doctor-user-authorized"
    });
    reloadMetadata();
    setSelectedHospitalId(added.id);
    setIsAddingHospital(false);
    setNewHospName("");
    setNewHospAddress("");
    triggerToast(`Hospital "${added.name}" registered successfully!`);
  };

  // Doctor - Patient Registration Intake
  const handleAddPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patName || !patEmail || !patPhone || !patDOB) {
      triggerToast("Kindly fill in all the mandatory fields.");
      return;
    }
    const added = clinicalDB.addPatient({
      fullName: patName,
      email: patEmail,
      phone: patPhone,
      dateOfBirth: patDOB,
      gender: patGender,
      bloodGroup: patBlood,
      registeredByHospitalId: selectedHospitalId,
      familyHistory: patHistory || "No chronic genetic illness stated."
    });
    reloadMetadata();
    setSelectedPatientId(added.id);
    setIsAddingPatient(false);
    // Reset forms
    setPatName("");
    setPatEmail("");
    setPatPhone("");
    setPatDOB("");
    setPatHistory("");
    triggerToast(`Official medical file created for patient: ${added.fullName}`);
  };

  // Doctor - Submit Treatment Diagnosis Entry
  const handleAddTreatmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      triggerToast("No patient selected.");
      return;
    }
    if (!diagnosis.trim() || !treatmentNotes.trim()) {
      triggerToast("Please enter a valid diagnosis and clinical notes.");
      return;
    }
    clinicalDB.addTreatment({
      patientId: selectedPatientId,
      hospitalId: selectedHospitalId,
      doctorName: docName,
      diagnosis: diagnosis,
      notes: treatmentNotes
    });
    setDiagnosis("");
    setTreatmentNotes("");
    triggerToast("Diagnosis notes published securely to patient dashboard.");
  };

  // Doctor - Add Prescription
  const handleAddPrescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      triggerToast("Please select a patient first.");
      return;
    }
    if (!drugName.trim() || !dosage.trim()) {
      triggerToast("Chemical name & daily dosage instructions are required.");
      return;
    }
    clinicalDB.addPrescription({
      patientId: selectedPatientId,
      hospitalId: selectedHospitalId,
      doctorName: docName,
      drugName: drugName,
      dosage: dosage,
      instructions: instructions || "Take with water.",
      status: "active"
    });
    setDrugName("");
    setDosage("");
    setInstructions("");
    triggerToast("Prescription issued and synced to the patient dashboard.");
  };

  // Manual trigger for biometric log sync
  const handleVitalsSync = (e: React.FormEvent) => {
    e.preventDefault();
    const activePatientId = authenticatedPatient?.id;
    if (!activePatientId) return;

    const wValue = parseFloat(syncWeight);
    const hrValue = parseInt(syncHeartRate);

    if (isNaN(wValue) || isNaN(hrValue) || wValue <= 0 || hrValue <= 0) {
      triggerToast("Invalid vitals entered.");
      return;
    }

    clinicalDB.addHealthLog({
      patientId: activePatientId,
      weight: wValue,
      heartRate: hrValue
    });

    // Check for critical vital spikes
    const isSpike = hrValue > 100 || hrValue < 50;
    if (isSpike) {
      // Find caregivers with notifyVitalSpike = true
      const invites = clinicalDB.getCaregiverInvitesForPatient(activePatientId)
        .filter(i => i.status === "approved" && i.notifyVitalSpike);

      invites.forEach(caregiver => {
        clinicalDB.addCaregiverAlert({
          patientId: activePatientId,
          caregiverEmail: caregiver.email,
          type: "vital_spike",
          message: `CRITICAL ALERT: Abnormal pulse logged: ${hrValue} BPM (${hrValue > 100 ? "Tachycardia Spike" : "Bradycardia Drop"}). Direct confirmation is advised.`,
          patientName: authenticatedPatient.fullName,
          severity: "critical"
        });
      });

      if (invites.length > 0) {
        triggerToast(`Warning: Critical Heart Rate (${hrValue} BPM)! Automated alerts sent to ${invites.length} caregivers.`);
      }
    }

    // Update authenticated patient instance cache
    reloadMetadata();
    setSyncSuccessMessage("Vitals synced with smartwatch. Historical charts updated.");
    setTimeout(() => setSyncSuccessMessage(""), 4000);
    triggerToast("Smartwatch sync complete!");
  };

  // Caregiver Handlers
  const handleInviteCaregiver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticatedPatient) {
      triggerToast("Please authenticate in the Patient Dashboard first.");
      return;
    }
    if (!newCaregiverName.trim() || !newCaregiverEmail.trim()) {
      triggerToast("Kindly fill out the caregiver's name and email address.");
      return;
    }

    // Check duplicate invites
    const existingInvites = clinicalDB.getCaregiverInvitesForPatient(authenticatedPatient.id);
    if (existingInvites.some(i => i.email.toLowerCase() === newCaregiverEmail.trim().toLowerCase())) {
      triggerToast("An invitation is already active or pending for this email address.");
      return;
    }

    clinicalDB.addCaregiverInvite({
      patientId: authenticatedPatient.id,
      email: newCaregiverEmail.trim(),
      name: newCaregiverName.trim(),
      relationship: newCaregiverRelation,
      status: "pending",
      notifyMissedDose: newCaregiverNotifyMissed,
      notifyVitalSpike: newCaregiverNotifySpike
    });

    setNewCaregiverName("");
    setNewCaregiverEmail("");
    reloadMetadata();
    triggerToast(`A secure invitation alert has been initiated to ${newCaregiverEmail}!`);
  };

  const handleRemoveCaregiver = (inviteId: string) => {
    clinicalDB.removeCaregiverInvite(inviteId);
    reloadMetadata();
    triggerToast("Caregiver association revoked successfully.");
  };

  const handleCaregiverLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCaregiverLoginError("");
    if (!caregiverEmailForm.trim()) {
      setCaregiverLoginError("Email is required.");
      return;
    }
    const email = caregiverEmailForm.trim().toLowerCase();
    const matches = clinicalDB.getCaregiverInvitesForEmail(email);
    if (matches.length > 0) {
      setAuthenticatedCaregiverEmail(email);
      triggerToast(`Caregiver session authorized for: ${email}`);
    } else {
      setCaregiverLoginError("No caregiver invitation found for this email. Have the patient invite you first.");
    }
  };

  const handleAcceptCaregiverInvite = (inviteId: string) => {
    clinicalDB.updateCaregiverInviteStatus(inviteId, "approved");
    reloadMetadata();
    triggerToast("Congratulations! You have accepted the tracking role. Live biometrics opened.");
  };

  const handleSimulateMissedDose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticatedPatient) return;
    if (!selectedSimMed) {
      triggerToast("Select a medication drug first.");
      return;
    }

    // Get approved caregivers who have notifyMissedDose enabled
    const invites = clinicalDB.getCaregiverInvitesForPatient(authenticatedPatient.id)
      .filter(i => i.status === "approved" && i.notifyMissedDose);

    if (invites.length === 0) {
      triggerToast(`Simulation: Missed dose logged, but no active caregiver is configured for Missed Dose alerts.`);
      return;
    }

    invites.forEach(caregiver => {
      clinicalDB.addCaregiverAlert({
        patientId: authenticatedPatient.id,
        caregiverEmail: caregiver.email,
        type: "missed_dose",
        message: `ALERT: Patient missed scheduled dose of "${selectedSimMed}". No compliance signal received.`,
        patientName: authenticatedPatient.fullName,
        severity: "critical"
      });
    });

    reloadMetadata();
    triggerToast(`Automated Alert dispatched regarding Missed Dose of ${selectedSimMed} to ${invites.length} Caregiver(s)!`);
  };

  // Toggle prescription status (e.g. mark as completed)
  const handleTogglePrescription = (presId: string, currentStatus: "active" | "completed") => {
    const nextStatus = currentStatus === "active" ? "completed" : "active";
    clinicalDB.updatePrescriptionStatus(presId, nextStatus);
    reloadMetadata();
    // Refresh patient dashboard views
    if (authenticatedPatient) {
      const refreshedObj = clinicalDB.getPatientByEmail(authenticatedPatient.email);
      if (refreshedObj) setAuthenticatedPatient(refreshedObj);
    }
    triggerToast(`Prescription marked as ${nextStatus}.`);
  };

  // Pharmacy: Add manual medication stock line
  const handleAddStockLineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStockDrugName.trim() || !newStockQty.trim() || !newStockThreshold.trim()) {
      triggerToast("All stock detail fields are required.");
      return;
    }
    const level = parseInt(newStockQty);
    const threshold = parseInt(newStockThreshold);
    if (isNaN(level) || isNaN(threshold) || level < 0 || threshold < 0) {
      triggerToast("Quantity and Threshold must be non-negative integers.");
      return;
    }

    clinicalDB.addMedicationStock({
      hospitalId: pharmacySelectedHospId,
      drugName: newStockDrugName.trim(),
      stockLevel: level,
      minThreshold: threshold,
      unit: newStockUnit
    });
    
    reloadMetadata();
    setIsAddingStockLine(false);
    setNewStockDrugName("");
    setNewStockQty("");
    setNewStockThreshold("");
    triggerToast(`Added ${newStockDrugName.trim()} to Pharmacy Stock Index.`);
  };

  // Pharmacy: Create manual procurement request
  const handleAddProcurementRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProcDrugName.trim() || !newProcQty.trim()) {
      triggerToast("Drug name and quantity are required.");
      return;
    }
    const qty = parseInt(newProcQty);
    if (isNaN(qty) || qty <= 0) {
      triggerToast("Quantity must be a positive integer.");
      return;
    }

    clinicalDB.addProcurementRequest({
      hospitalId: pharmacySelectedHospId,
      drugName: newProcDrugName.trim(),
      quantityRequested: qty,
      unit: newProcUnit,
      notes: newProcNotes.trim() || "Manual emergency requisition by on-duty clinical pharmacist."
    });

    reloadMetadata();
    setIsAddingProcRequest(false);
    setNewProcDrugName("");
    setNewProcQty("");
    setNewProcNotes("");
    triggerToast(`Procurement requisition filed for ${qty} ${newProcUnit} of ${newProcDrugName}.`);
  };

  // Pharmacy: Dispense medication based on prescription
  const handleDispensePrescription = (pres: Prescription, qtyToDispense: number) => {
    if (!qtyToDispense || qtyToDispense <= 0) {
      triggerToast("Please input a valid dispense quantity.");
      return;
    }

    const res = clinicalDB.dispenseMedication(
      pres.hospitalId,
      pres.drugName,
      qtyToDispense,
      `Dispensed prescription for ${pres.drugName}. Instructions: ${pres.instructions}.`
    );

    if (res.success) {
      clinicalDB.updatePrescriptionStatus(pres.id, "completed");
      reloadMetadata();
      triggerToast(res.message);
    } else {
      triggerToast(res.message);
    }
  };

  // Pharmacy: Update procurement status
  const handleUpdateProcurementStatus = (reqId: string, status: "pending" | "ordered" | "received") => {
    const success = clinicalDB.updateProcurementStatus(reqId, status);
    if (success) {
      reloadMetadata();
      triggerToast(`Order status updated to "${status}". Inventory updated automatically if received.`);
    } else {
      triggerToast("Failed to update status.");
    }
  };

  // Appointments handlers
  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticatedPatient) {
      triggerToast("Error: No patient authenticated.");
      return;
    }
    if (!apptDate || !apptTime || !apptReason.trim()) {
      triggerToast("Kindly fill in the schedule date, time, and consultation reasons.");
      return;
    }
    const booked = clinicalDB.addAppointment({
      patientId: authenticatedPatient.id,
      hospitalId: authenticatedPatient.registeredByHospitalId,
      appointmentDate: apptDate,
      appointmentTime: apptTime,
      reason: apptReason
    });
    reloadMetadata();
    setApptDate("");
    setApptTime("10:00");
    setApptReason("");
    triggerToast(`Clinical appointment scheduled successfully! Ref: ${booked.id}`);
  };

  const handleUpdateAppointmentStatus = (apptId: string, status: Appointment["status"]) => {
    clinicalDB.updateAppointmentStatus(apptId, status, apptDoctorNotes);
    reloadMetadata();
    setEditingApptId(null);
    setApptDoctorNotes("");
    triggerToast(`Appointment status updated to: ${status}`);
  };

  // Location Query Triggers
  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchBanners("Querying registry...");
    try {
      const results = await getFacilityLocations(locationSearch, selectedStateFilter, proximityCoords?.lat, proximityCoords?.lon);
      setFacilities(results);
      if (results.length === 0) {
        setSearchBanners("No registered facilities matched this filter in Nigeria.");
      } else {
        setSearchBanners("");
      }
    } catch {
      setSearchBanners("System temporary error searching Overpass Geo engine.");
    }
  };

  // Geolocation trigger for nearest hospitals (Real location API using Overpass)
  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      triggerToast("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocatingNearMe(true);
    setSearchBanners("Acquiring GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setProximityCoords({ lat: latitude, lon: longitude });
        triggerToast(`GPS matched: (${latitude.toFixed(4)}, ${longitude.toFixed(4)}). Querying nearest facilities...`);
        
        try {
          const results = await getFacilityLocations("", "", latitude, longitude);
          setFacilities(results);
          setIsLocatingNearMe(false);
          setSearchBanners(`Nearest facilities loaded in Nigeria (${results.length} found within 15km).`);
        } catch {
          setIsLocatingNearMe(false);
          setSearchBanners("Failed calling Overpass. Try selecting a State instead.");
        }
      },
      (error) => {
        console.error(error);
        setIsLocatingNearMe(false);
        triggerToast("Location access denied or timed out. Defaulting to state-level registry.");
        setSearchBanners("Location permissions unavailable. Showing standard Nigerian registry.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Dynamic Security Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-900 border border-teal-700 text-teal-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Modern High-End Clinical Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-teal-100">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                Kelechi
                <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100 font-sans font-semibold uppercase tracking-wider">
                  Nigeria Portal
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-mono">Secured Patient Health & Locator System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUserAccount ? (
              <div className="flex items-center gap-3">
                <span className="text-xs bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 hidden sm:inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  Logged in as <strong className="text-slate-900 font-semibold">{currentUserAccount.fullName}</strong> ({currentUserAccount.role.toUpperCase()})
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  id="portal-logout-btn"
                >
                  <Lock className="w-3.5 h-3.5 text-red-500" />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest hidden sm:inline mr-2">GUEST MODE</span>
                {activeRole === "public" ? (
                  <button
                    onClick={() => {
                      setLoginRole("patient");
                      setActiveRole("patient");
                      setIsSignUpMode(false);
                    }}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg border border-teal-700 transition-all cursor-pointer shadow-sm flex items-center gap-1"
                    id="header-signin-btn"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Sign In Portal
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveRole("public");
                    }}
                    className="bg-teal-50 text-teal-900 hover:bg-teal-100 font-semibold text-xs px-3.5 py-2 rounded-lg border border-teal-200 transition-all cursor-pointer flex items-center gap-1"
                    id="header-explore-btn"
                  >
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    Interactive Map
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation & Portal Entry selection */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveRole("public")}
            className={cn(
              "py-3 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
              activeRole === "public"
                ? "bg-white text-teal-900 shadow-sm font-semibold border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            )}
            id="role-public-btn"
          >
            <MapPin className="w-4 h-4 text-teal-600" />
            <span className="hidden sm:inline">Map & Hospital Locator</span>
            <span className="sm:hidden">Locator</span>
          </button>
          <button
            onClick={() => setActiveRole("doctor")}
            className={cn(
              "py-3 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
              activeRole === "doctor"
                ? "bg-white text-teal-900 shadow-sm font-semibold border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            )}
            id="role-doctor-btn"
          >
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span className="hidden sm:inline">Hospitals & Doctors Terminal</span>
            <span className="sm:hidden">Clinicians</span>
          </button>
          <button
            onClick={() => setActiveRole("patient")}
            className={cn(
              "py-3 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
              activeRole === "patient"
                ? "bg-white text-teal-900 shadow-sm font-semibold border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            )}
            id="role-patient-btn"
          >
            <User className="w-4 h-4 text-teal-600" />
            <span className="hidden sm:inline">Secure Patient Dashboard</span>
            <span className="sm:hidden">Patients</span>
          </button>
          <button
            onClick={() => setActiveRole("caregiver")}
            className={cn(
              "py-3 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
              activeRole === "caregiver"
                ? "bg-white text-teal-900 shadow-sm font-semibold border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            )}
            id="role-caregiver-btn"
          >
            <Users className="w-4 h-4 text-teal-600" />
            <span className="hidden sm:inline">Family Caregiver Portal</span>
            <span className="sm:hidden">Caregivers</span>
          </button>
          <button
            onClick={() => setActiveRole("pharmacy")}
            className={cn(
              "py-3 col-span-2 md:col-span-1 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
              activeRole === "pharmacy"
                ? "bg-white text-teal-900 shadow-sm font-semibold border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            )}
            id="role-pharmacy-btn"
          >
            <Pill className="w-4 h-4 text-teal-600" />
            <span className="hidden sm:inline">Hospital Pharmacy View</span>
            <span className="sm:hidden">Pharmacy</span>
          </button>
        </div>

        {/* Content Views */}
        <AnimatePresence mode="wait">
          {/* ================= PUBLIC MAP & HOSPITAL LOCATOR VIEW ================= */}
          {activeRole === "public" && (
            <motion.div
              key="public"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Promo Banner */}
              <div className="bg-gradient-to-r from-teal-800 to-teal-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 w-72 h-72 rounded-full bg-teal-600/15" />
                <div className="relative z-10 max-w-2xl space-y-4">
                  <span className="bg-teal-700/60 text-teal-300 font-mono text-xs uppercase tracking-wider px-3 py-1 rounded-full font-semibold border border-teal-500/30">
                    Verified Geo-Infrastructures
                  </span>
                  <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
                    Nigerian Nearest Emergency Hospitals & Blood Banks
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Access completely real geographical healthcare structures. Retrieve public and private emergency centers or blood donor nodes nearby using live Overpass API query integration or find facilities based in your State of presence.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={handleGeolocate}
                      disabled={isLocatingNearMe}
                      className="bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 disabled:text-teal-400 font-medium text-slate-950 px-5 py-2.5 rounded-xl transition duration-150 flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-500/10 text-xs sm:text-sm"
                      id="gps-locate-btn"
                    >
                      <Activity className={cn("w-4 h-4", isLocatingNearMe && "animate-spin")} />
                      {isLocatingNearMe ? "Matching Coordinates..." : "Locate Near Me (via GPS)"}
                    </button>
                    <span className="text-xs text-teal-300 self-center font-mono">
                      *Geo-access triggers raw OpenStreetMap querying.
                    </span>
                  </div>
                </div>
              </div>

              {/* Filtering Registry Container */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-display text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Search className="w-4 h-4 text-teal-600" />
                  Search Over 40+ Verified Nigerian Medical Hubs
                </h3>

                <form onSubmit={handleLocationSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      State / Location Scope
                    </label>
                    <select
                      value={selectedStateFilter}
                      onChange={(e) => setSelectedStateFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500"
                    >
                      <option value="">-- All Nigerian States --</option>
                      <option value="Lagos">Lagos State</option>
                      <option value="Abuja">Abuja (FCT)</option>
                      <option value="Oyo">Oyo State</option>
                      <option value="Enugu">Enugu State</option>
                      <option value="Rivers">Rivers State</option>
                      <option value="Kano">K Kano State</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Clinic, Hospital or Blood Bank Keyword
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. Reddington, General Hospital, LUTH, Blood Transfusion"
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition text-sm cursor-pointer"
                    >
                      Filter Directory
                    </button>
                  </div>
                </form>

                {searchBanners && (
                  <div className="mt-4 p-3 bg-teal-50 rounded-xl border border-teal-100 text-xs text-teal-800 flex items-center gap-2">
                    <Info className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{searchBanners}</span>
                  </div>
                )}
              </div>

              {/* Facility Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facilities.map((fac) => (
                  <div
                    key={fac.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                            fac.type === "blood_bank"
                              ? "bg-rose-50 text-rose-700 border border-rose-100"
                              : "bg-teal-50 text-teal-700 border border-teal-100"
                          )}
                        >
                          {fac.type === "blood_bank" ? "🩸 Blood Bank" : "🏥 Hospital / Clinic"}
                        </span>
                        
                        {fac.ownership && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold uppercase">
                            {fac.ownership}
                          </span>
                        )}
                      </div>

                      <h4 className="font-display font-medium text-slate-900 text-base mb-1.5 leading-snug">
                        {fac.name}
                      </h4>
                      <p className="text-slate-500 text-xs mb-3 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
                        <span>{fac.address}, {fac.state}</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {fac.hasEmergency && (
                          <span className="text-[10px] font-medium bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100">
                            🚨 24/7 ER Emergency
                          </span>
                        )}
                        {fac.hasBloodBank && fac.type !== "blood_bank" && (
                          <span className="text-[10px] font-medium bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-100">
                            🩸 Blood Units Stored
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        {fac.phone ? (
                          <a
                            href={`tel:${fac.phone}`}
                            className="text-teal-600 hover:underline font-semibold flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            {fac.phone}
                          </a>
                        ) : (
                          <span className="text-slate-400 font-mono italic">No phone logged</span>
                        )}

                        {fac.distanceInKm !== undefined && (
                          <span className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded font-bold">
                            📍 {fac.distanceInKm} km away
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ================= DOCTOR & CLINICAL PORTAL VIEW ================= */}
          {activeRole === "doctor" && (
            <motion.div
              key="doctor"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Role lock status */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-slate-900 text-sm">
                      Authorized Medical Staff Access Code Verified
                    </h3>
                    <p className="text-xs text-slate-500">
                      Credentials mapped: <span className="font-mono text-slate-800 font-bold">{doctorAuthKey}</span> (Authorized Practitioner)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-500 font-semibold">Active Facility Center:</label>
                  <select
                    value={selectedHospitalId}
                    onChange={(e) => setSelectedHospitalId(e.target.value)}
                    className="bg-white border border-slate-200 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500"
                  >
                    {hospitals.map(h => (
                      <option key={h.id} value={h.id}>{h.name} ({h.state})</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setIsAddingHospital(!isAddingHospital)}
                    className="bg-slate-900 text-white font-medium p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer text-xs"
                    title="Register New Hospital"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dropdown Form for Adding Hospital */}
              {isAddingHospital && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-inner"
                >
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold uppercase">
                    Admin Hospital Registry Setup
                  </span>
                  <h4 className="font-display font-semibold text-sm text-slate-800 mt-2 mb-4">
                    Register a New Physical Medical Center / General Hospital in Nigeria
                  </h4>

                  <form onSubmit={handleAddHospitalSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Hospital Name</label>
                      <input
                        type="text"
                        required
                        value={newHospName}
                        onChange={(e) => setNewHospName(e.target.value)}
                        placeholder="e.g. University College Hospital"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">State</label>
                      <select
                        value={newHospState}
                        onChange={(e) => setNewHospState(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500"
                      >
                        <option value="Lagos">Lagos State</option>
                        <option value="Abuja">Abuja (FCT)</option>
                        <option value="Oyo">Oyo State</option>
                        <option value="Enugu">Enugu State</option>
                        <option value="Rivers">Rivers State</option>
                        <option value="Kano">Kano State</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Address Detail</label>
                      <input
                        type="text"
                        required
                        value={newHospAddress}
                        onChange={(e) => setNewHospAddress(e.target.value)}
                        placeholder="e.g. Ring Road Road, Ibadan"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Ownership Sector</label>
                      <div className="flex gap-2">
                        <select
                          value={newHospType}
                          onChange={(e) => setNewHospType(e.target.value as "public" | "private")}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500"
                        >
                          <option value="public">Public / Government</option>
                          <option value="private">Private Ownership</option>
                        </select>
                        <button
                          type="submit"
                          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 rounded-lg text-xs"
                        >
                          Register
                        </button>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Core Doctor Interface Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lateral Patients Navigation */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-display font-semibold text-slate-900 text-sm">
                        Facility Intakes
                      </h4>
                      <p className="text-[11px] text-slate-500">Registered at {currentHospital?.name}</p>
                    </div>

                    <button
                      onClick={() => setIsAddingPatient(!isAddingPatient)}
                      className="bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Patient
                    </button>
                  </div>

                  {/* Add Patient Intake Overlay Form */}
                  {isAddingPatient && (
                    <motion.form
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onSubmit={handleAddPatientSubmit}
                      className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-700">New Clinical Patient Files</span>
                        <button
                          type="button"
                          onClick={() => setIsAddingPatient(false)}
                          className="text-[10px] text-rose-500 font-bold"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="text"
                          required
                          value={patName}
                          onChange={(e) => setPatName(e.target.value)}
                          placeholder="Full Name (e.g. Emeka Okafor)"
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                        />
                        <input
                          type="email"
                          required
                          value={patEmail}
                          onChange={(e) => setPatEmail(e.target.value)}
                          placeholder="Email (for Patient Logins)"
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none opacity-90"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            value={patPhone}
                            onChange={(e) => setPatPhone(e.target.value)}
                            placeholder="Phone Number"
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                          />
                          <input
                            type="date"
                            required
                            value={patDOB}
                            onChange={(e) => setPatDOB(e.target.value)}
                            placeholder="DOB"
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={patGender}
                            onChange={(e) => setPatGender(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs focus:outline-none"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                          <select
                            value={patBlood}
                            onChange={(e) => setPatBlood(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs focus:outline-none"
                          >
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                          </select>
                        </div>
                        <div>
                          <textarea
                            placeholder="Patient's Family Medical History (hereditary pathologies, details)"
                            value={patHistory}
                            onChange={(e) => setPatHistory(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none h-16 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg text-xs"
                        >
                          Complete Intake Entry
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {/* List of Intakes */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Select Patient Profile:
                    </label>
                    {filteredPatients.length === 0 ? (
                      <div className="p-4 bg-slate-50 text-center rounded-xl border border-dashed border-slate-200">
                        <p className="text-xs text-slate-500">No active patients registered at this center yet.</p>
                      </div>
                    ) : (
                      filteredPatients.map(p => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedPatientId(p.id)}
                          className={cn(
                            "w-full text-left p-3 rounded-xl border transition flex items-center justify-between",
                            selectedPatientId === p.id
                              ? "bg-slate-950 border-slate-950 text-white shadow-md shadow-slate-950/10"
                              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                          )}
                        >
                          <div>
                            <p className="font-medium text-xs sm:text-sm">{p.fullName}</p>
                            <p className="text-[10px] opacity-80 font-mono mt-0.5">{p.id} • {p.bloodGroup}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 opacity-70" />
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Patient Clinical Room Sheet */}
                {currentPatient ? (
                  <div className="lg:col-span-2 space-y-6">
                    {/* Clinical Profile Header */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                      <span className="text-[10px] bg-teal-50 text-teal-700 font-mono font-bold px-2.5 py-0.5 rounded border border-teal-100">
                        ACTIVE CONSULTATION FILE
                      </span>
                      <h3 className="font-display font-bold text-slate-900 text-lg sm:text-xl mt-2">
                        {currentPatient.fullName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Age Cohort Reference DOB: <span className="text-slate-800 font-medium">{currentPatient.dateOfBirth}</span> ({currentPatient.gender}) • Contact Phone: <span className="text-slate-800 font-medium">{currentPatient.phone}</span>
                      </p>

                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                        <p className="font-semibold flex items-center gap-1.5 text-amber-800">
                          <FileText className="w-3.5 h-3.5" />
                          Family History & Hereditary Register:
                        </p>
                        <p className="mt-1 font-sans leading-relaxed">{currentPatient.familyHistory}</p>
                      </div>
                    </div>

                    {/* Diagnose Treatment & Prescription Creation Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Treatment diagnosis form */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                          <Stethoscope className="w-4 h-4 text-teal-600" />
                          <h4 className="font-display font-semibold text-slate-900 text-sm">
                            Publish Clinical Treatment Record
                          </h4>
                        </div>

                        <form onSubmit={handleAddTreatmentSubmit} className="space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">
                              Attending Clinical Doctor Name
                            </label>
                            <input
                              type="text"
                              required
                              value={docName}
                              onChange={(e) => setDocName(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-teal-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">
                              Clinical Diagnosis / Symptom
                            </label>
                            <input
                              type="text"
                              required
                              value={diagnosis}
                              onChange={(e) => setDiagnosis(e.target.value)}
                              placeholder="e.g. Acute Typhoid Enteritis"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-teal-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">
                              Diagnosis and Treatment Notes
                            </label>
                            <textarea
                              required
                              value={treatmentNotes}
                              onChange={(e) => setTreatmentNotes(e.target.value)}
                              placeholder="Record vitals checked, medical procedures, prescription links, or physical findings."
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none h-24 resize-none"
                            />
                          </div>

                          <button
                            type="submit"
                            className="bg-slate-950 hover:bg-slate-800 text-white font-semibold w-full py-2 rounded-lg text-xs cursor-pointer"
                          >
                            Save Clinical Treatment Note
                          </button>
                        </form>
                      </div>

                      {/* Add Prescription Form */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                          <Pill className="w-4 h-4 text-teal-600" />
                          <h4 className="font-display font-semibold text-slate-900 text-sm">
                            Dispense Drug Prescription
                          </h4>
                        </div>

                        <form onSubmit={handleAddPrescriptionSubmit} className="space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">
                              Drug / Chemical Generic Name
                            </label>
                            <input
                              type="text"
                              required
                              value={drugName}
                              onChange={(e) => setDrugName(e.target.value)}
                              placeholder="e.g. Artemether/Lumefantrine"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-teal-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">
                              Dosage Regime
                            </label>
                            <input
                              type="text"
                              required
                              value={dosage}
                              onChange={(e) => setDosage(e.target.value)}
                              placeholder="e.g. 1 tablet every 12 hours"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-teal-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">
                              Administration Instructions
                            </label>
                            <textarea
                              value={instructions}
                              onChange={(e) => setInstructions(e.target.value)}
                              placeholder="e.g. Patient must consume fully after meal intake. Do not combine with grapefruit juices."
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none h-24 resize-none"
                            />
                          </div>

                          <button
                            type="submit"
                            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold w-full py-2 rounded-lg text-xs cursor-pointer"
                          >
                            Authorize Prescription Dispense
                          </button>
                        </form>
                      </div>
                    </div>

                    {/* Historical clinical sheet summary for the selected profile */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                      <h4 className="font-display font-semibold text-xs text-slate-500 uppercase tracking-wider mb-4">
                        Locked Consultation & Prescriptions Audits
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <h5 className="text-xs font-bold text-slate-800 mb-2">Prescriptions Logs:</h5>
                          {patientPrescriptions.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No prescriptions recorded for this patient.</p>
                          ) : (
                            <div className="space-y-2">
                              {patientPrescriptions.map(p => (
                                <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                                  <div>
                                    <p className="font-semibold text-slate-800">{p.drugName} ({p.dosage})</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">Dispensed by {p.doctorName} • Status: {p.status}</p>
                                  </div>
                                  <span className={cn(
                                    "px-2 py-0.5 rounded text-[9px] font-bold uppercase border",
                                    p.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"
                                  )}>
                                    {p.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-2">
                          <h5 className="text-xs font-bold text-slate-800 mb-2">Diagnostic Notes Logs:</h5>
                          {patientTreatments.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No historical diagnoses logged.</p>
                          ) : (
                            <div className="space-y-2">
                              {patientTreatments.map(t => (
                                <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                                  <p className="font-semibold text-slate-800">{t.diagnosis}</p>
                                  <p className="text-slate-500 text-[11px] leading-relaxed mt-1">{t.notes}</p>
                                  <p className="text-[9px] text-slate-400 mt-2 font-mono">Attending: {t.doctorName} • Date: {new Date(t.createdAt).toLocaleDateString()}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="lg:col-span-2 bg-slate-100 rounded-2xl border border-dashed border-slate-300 p-8 flex flex-col items-center justify-center text-center text-slate-500 py-24">
                    <Building2 className="w-12 h-12 text-slate-400 mb-3" />
                    <p className="font-medium">No Active Patient Profile Selected</p>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">Select a patient card in the left registry panel or register a new patient file to record treatments and clinical drugs.</p>
                  </div>
                )}
              </div>

              {/* Facility Appointments & Consultations Desk */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mt-8">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3.5 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-teal-600 animate-pulse" />
                    <div>
                      <h4 className="font-display font-semibold text-slate-900 text-sm">
                        Facility Appointments & Consultations Desk
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Managing booked consultations for <strong className="text-slate-700 font-bold">{hospitals.find(h => h.id === selectedHospitalId)?.name || "Active Facility"}</strong>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-amber-50 border border-amber-200 text-amber-700 font-bold px-2.5 py-1 rounded-full font-mono">
                    {appointments.filter(a => a.hospitalId === selectedHospitalId && a.status === "pending").length} Pending Requests
                  </span>
                </div>

                {appointments.filter(a => a.hospitalId === selectedHospitalId).length === 0 ? (
                  <div className="text-center p-8 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <p className="text-xs text-slate-500 italic">No scheduled appointments exist for this hospital facility.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {appointments
                      .filter(a => a.hospitalId === selectedHospitalId)
                      .map((appt) => {
                        const apptPatient = patients.find(p => p.id === appt.patientId);
                        return (
                          <div key={appt.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 hover:border-slate-350 transition-colors flex flex-col justify-between space-y-3">
                            <div>
                              <div className="flex justify-between items-start gap-1">
                                <div>
                                  <span className="text-[9px] uppercase font-mono bg-slate-200 hover:bg-slate-250 text-slate-700 px-1.5 py-0.5 rounded border border-slate-300">
                                    Ref: {appt.id}
                                  </span>
                                  <h5 className="font-semibold text-slate-900 text-xs mt-1.5">
                                    {apptPatient?.fullName || "Unlinked Patient"}
                                  </h5>
                                  <p className="text-[10px] text-slate-500">{apptPatient?.phone || "No phone linked"}</p>
                                </div>
                                <span className={`text-[10px] font-mono tracking-wide font-semibold px-2 py-0.5 rounded-full border ${
                                  appt.status === "pending"
                                    ? "bg-amber-50 border-amber-200 text-amber-700" 
                                    : appt.status === "approved"
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-805"
                                    : appt.status === "rejected"
                                    ? "bg-rose-50 border-rose-200 text-rose-805"
                                    : "bg-slate-100 border-slate-250 text-slate-700"
                                }`}>
                                  {appt.status.toUpperCase()}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-1 bg-white p-2 rounded-lg border border-slate-150 text-[11px] my-2 font-mono text-slate-650">
                                <div>Date: <span className="font-sans text-slate-900 font-bold">{appt.appointmentDate}</span></div>
                                <div>Timeblock: <span className="font-sans text-slate-900 font-bold">{appt.appointmentTime}</span></div>
                              </div>

                              <div className="text-[11px] text-slate-700 leading-relaxed bg-white p-2 rounded-lg border border-slate-150 space-y-1">
                                <strong className="text-slate-900 block text-[9.5px] uppercase font-bold text-slate-450">Symptom / Booking Note:</strong>
                                <p>{appt.reason}</p>
                              </div>

                              {appt.doctorNotes && (
                                <div className="text-[11px] text-teal-800 mt-2 bg-teal-50 p-2 rounded-lg border border-teal-150 space-y-1">
                                  <strong className="text-teal-950 block text-[9.5px] uppercase font-bold">Attending Remarks:</strong>
                                  <p>{appt.doctorNotes}</p>
                                </div>
                              )}
                            </div>

                            {/* Medical Staff Action Controls */}
                            <div className="pt-2 border-t border-slate-200">
                              {editingApptId === appt.id ? (
                                <div className="space-y-2">
                                  <label className="block text-[10px] font-bold text-slate-500">Practitioner Remarks & Guidelines</label>
                                  <textarea
                                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 outline-none focus:ring-1 focus:ring-teal-500"
                                    rows={2}
                                    placeholder="Clinic location comment, e.g. 'Approved. See Dr. Bello in Room 3 on arrival.'"
                                    value={apptDoctorNotes}
                                    onChange={(e) => setApptDoctorNotes(e.target.value)}
                                  />
                                  <div className="flex gap-1 justify-end">
                                    <button
                                      onClick={() => setEditingApptId(null)}
                                      className="text-[10px] bg-slate-200 hover:bg-slate-250 px-2.5 py-1 rounded font-semibold cursor-pointer text-slate-705"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleUpdateAppointmentStatus(appt.id, "approved")}
                                      className="text-[10px] bg-emerald-600 hover:bg-emerald-750 text-white px-2.5 py-1 rounded font-semibold cursor-pointer"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleUpdateAppointmentStatus(appt.id, "rejected")}
                                      className="text-[10px] bg-rose-600 hover:bg-rose-750 text-white px-2.5 py-1 rounded font-semibold cursor-pointer"
                                    >
                                      Decline
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex gap-1 justify-end">
                                  {appt.status === "pending" && (
                                    <button
                                      onClick={() => {
                                        setEditingApptId(appt.id);
                                        setApptDoctorNotes(appt.doctorNotes || "");
                                      }}
                                      className="text-[10.5px] font-semibold bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                                    >
                                      Review & Respond
                                    </button>
                                  )}
                                  {appt.status === "approved" && (
                                    <>
                                      <button
                                        onClick={() => {
                                          setEditingApptId(appt.id);
                                          setApptDoctorNotes(appt.doctorNotes || "");
                                        }}
                                        className="text-[10.5px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-705 px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer mr-auto border border-slate-200"
                                      >
                                        Edit Remarks
                                      </button>
                                      <button
                                        onClick={() => {
                                          setApptDoctorNotes("Completed clinical visit.");
                                          handleUpdateAppointmentStatus(appt.id, "completed");
                                        }}
                                        className="text-[10.5px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                                      >
                                        Mark Completed
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ================= SECURE PATIENT DASHBOARD VIEW ================= */}
          {activeRole === "patient" && (
            <motion.div
              key="patient"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Authenticated Patient Validation Gate */}
              {!authenticatedPatient ? (
                <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-xl space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mx-auto border border-teal-100">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-slate-900 text-lg">
                      Secure Patient Authorization
                    </h3>
                    <p className="text-xs text-slate-500">
                      Input your registered clinical email to access your personal dashboard, active treatments, prescriptions, and biometrics trend chart.
                    </p>
                  </div>

                  <form onSubmit={handlePatientLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2">Registered Patient Email</label>
                      <input
                        type="email"
                        required
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        placeholder="e.g. chinedu@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    {patientLoginError && (
                      <p className="text-xs text-rose-500 leading-normal bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                        {patientLoginError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-slate-950 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl transition text-sm cursor-pointer"
                    >
                      Verify Credentials & Log In
                    </button>
                  </form>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px] text-slate-500">
                    <p className="font-semibold text-slate-700 flex items-center gap-1 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                      Try Seed Demo Credentials:
                    </p>
                    <ul className="list-disc list-inside space-y-1 font-mono">
                      <li>chinedu@example.com</li>
                      <li>aminat.b@example.com</li>
                      <li>olumide@example.com</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Patient Portal welcome banner */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-800 font-bold border border-teal-200">
                        {authenticatedPatient.fullName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-display font-medium text-slate-900 text-lg sm:text-xl">
                          {authenticatedPatient.fullName}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Secure ID: <span className="font-mono text-slate-800">{authenticatedPatient.id}</span> • Registered Facility: <span className="text-slate-800 font-semibold">{hospitals.find(h => h.id === authenticatedPatient.registeredByHospitalId)?.name || "Nigerian General Hospital"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <span className="text-xs bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-mono">
                        Blood Group: <strong className="text-slate-950">{authenticatedPatient.bloodGroup}</strong>
                      </span>
                      <button
                        onClick={() => setAuthenticatedPatient(null)}
                        className="text-xs text-rose-600 hover:bg-rose-50 border border-slate-200 px-3 py-1.5 rounded-lg font-semibold cursor-pointer"
                      >
                        Exit Portal
                      </button>
                    </div>
                  </div>

                  {/* Patient Clinical Records Panel */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Prescriptions & History Log */}
                    <div className="lg:col-span-2 space-y-6">

                      {/* Caregiver & Family Alerts Management Section */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                          <h4 className="font-display font-semibold text-slate-900 text-sm flex items-center gap-2">
                            <Users className="w-4.5 h-4.5 text-teal-600 animate-pulse" />
                            Caregiver & Family Support Network
                          </h4>
                          <span className="text-xs bg-teal-50 border border-teal-100 text-teal-700 px-2.5 py-1 rounded-full font-mono">
                            {caregiverInvites.filter(i => i.patientId === authenticatedPatient.id).length} Linked
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed mb-6">
                          Invite trusted family members to receive automated digital alerts if you miss a prescribed medicine dose or if your connected biometrics show any critical spikes.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-100 pb-6 mb-6">
                          {/* Invite Form */}
                          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <h5 className="font-semibold text-xs text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                              <UserPlus className="w-3.5 h-3.5 text-teal-600" />
                              Invite New Caregiver
                            </h5>

                            <form onSubmit={handleInviteCaregiver} className="space-y-3">
                              <div>
                                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Caregiver's Name</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Rebecca Okafor"
                                  value={newCaregiverName}
                                  onChange={(e) => setNewCaregiverName(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Email Coordinates</label>
                                <input
                                  type="email"
                                  required
                                  placeholder="e.g. rebecca.okafor@example.com"
                                  value={newCaregiverEmail}
                                  onChange={(e) => setNewCaregiverEmail(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Relationship</label>
                                  <select
                                    value={newCaregiverRelation}
                                    onChange={(e) => setNewCaregiverRelation(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                                  >
                                    <option value="Spouse">Spouse</option>
                                    <option value="Parent">Parent</option>
                                    <option value="Sibling">Sibling</option>
                                    <option value="Child">Child</option>
                                    <option value="Guardian">Guardian</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>

                                <div className="flex flex-col justify-end">
                                  <button
                                    type="submit"
                                    className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer"
                                  >
                                    Send Invitation
                                  </button>
                                </div>
                              </div>

                              <div className="pt-2 bg-white rounded-lg p-2.5 border border-slate-150 space-y-2">
                                <label className="block text-[9.5px] uppercase font-bold text-slate-400">Automated Alert Triggers</label>
                                <div className="space-y-1 text-xs">
                                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900 select-none">
                                    <input
                                      type="checkbox"
                                      checked={newCaregiverNotifyMissed}
                                      onChange={(e) => setNewCaregiverNotifyMissed(e.target.checked)}
                                      className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                                    />
                                    <span>Missed Dose Alerts</span>
                                  </label>
                                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900 select-none">
                                    <input
                                      type="checkbox"
                                      checked={newCaregiverNotifySpike}
                                      onChange={(e) => setNewCaregiverNotifySpike(e.target.checked)}
                                      className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                                    />
                                    <span>Vitals Critical Spikes</span>
                                  </label>
                                </div>
                              </div>
                            </form>
                          </div>

                          {/* Configured Caregivers status */}
                          <div className="space-y-4">
                            <h5 className="font-semibold text-xs text-slate-900 uppercase tracking-wide flex items-center gap-1 px-1">
                              🛡 Authorized Caregivers
                            </h5>

                            {caregiverInvites.filter(i => i.patientId === authenticatedPatient.id).length === 0 ? (
                              <div className="text-center p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center space-y-2">
                                <Users className="w-8 h-8 text-slate-300" />
                                <p className="text-xs text-slate-500 italic">No family caregivers registered for this account.</p>
                              </div>
                            ) : (
                              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                                {caregiverInvites
                                  .filter(i => i.patientId === authenticatedPatient.id)
                                  .map((invite) => (
                                    <div key={invite.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h6 className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                                            {invite.name}
                                            <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full font-mono">
                                              {invite.relationship}
                                            </span>
                                          </h6>
                                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{invite.email}</p>
                                        </div>

                                        <button
                                          onClick={() => handleRemoveCaregiver(invite.id)}
                                          className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                                          title="Revoke Permission"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>

                                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-150 text-[10px]">
                                        <div className="flex gap-1.5">
                                          {invite.notifyMissedDose && (
                                            <span className="bg-amber-50 border border-amber-200 text-amber-700 px-1.5 py-0.5 rounded flex items-center gap-0.5" title="Notified on missed medicine doses">
                                              <Bell className="w-2.5 h-2.5" /> Dose
                                            </span>
                                          )}
                                          {invite.notifyVitalSpike && (
                                            <span className="bg-rose-50 border border-rose-200 text-rose-700 px-1.5 py-0.5 rounded flex items-center gap-0.5" title="Notified on critical pulse spikes">
                                              <AlertTriangle className="w-2.5 h-2.5" /> Vitals
                                            </span>
                                          )}
                                        </div>

                                        <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold ${
                                          invite.status === "approved"
                                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                            : "bg-amber-100 text-amber-800 border border-amber-200 animate-pulse"
                                        }`}>
                                          {invite.status === "approved" ? "ACTIVE SUPPORT ✔" : "PENDING CONSENT"}
                                        </span>
                                      </div>

                                      {invite.status === "pending" && (
                                        <div className="text-[9px] text-slate-400 italic bg-amber-50/50 p-1.5 rounded border border-amber-100">
                                          Have them accept in the <strong>Caregiver Portal</strong> using email: {invite.email}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Interactive Caregiver Simulation Panel */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="p-1 bg-amber-100 rounded-lg text-amber-800">
                              <AlertTriangle className="w-4 h-4 animate-bounce" />
                            </span>
                            <div>
                              <h5 className="font-semibold text-xs text-slate-900 uppercase tracking-wide">
                                Caregiver Alert Simulator
                              </h5>
                              <p className="text-[10px] text-slate-500">
                                Trigger fully functional clinical compliance notifications to demonstrate automated triggers.
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                            {/* Dose Simulation */}
                            <form onSubmit={handleSimulateMissedDose} className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-200">
                              <div className="sm:col-span-2">
                                <label className="block text-[8.5px] uppercase font-bold text-slate-500 mb-1">Simulate Missed Drug</label>
                                <select
                                  value={selectedSimMed}
                                  onChange={(e) => setSelectedSimMed(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs outline-none"
                                >
                                  <option value="">-- Active Drugs --</option>
                                  {clinicalDB.getPrescriptionsForPatient(authenticatedPatient.id).length === 0 ? (
                                    <option value="Coartem (Artemether)">Coartem (Artemether)</option>
                                  ) : (
                                    clinicalDB.getPrescriptionsForPatient(authenticatedPatient.id).map(p => (
                                      <option key={p.id} value={`${p.drugName} (${p.dosage})`}>{p.drugName}</option>
                                    ))
                                  )}
                                </select>
                              </div>

                              <div className="flex items-end">
                                <button
                                  type="submit"
                                  className="w-full bg-amber-600 hover:bg-amber-700 text-white text-[10.5px] font-semibold py-1.5 rounded transition cursor-pointer"
                                >
                                  Trigger Alert
                                </button>
                              </div>
                            </form>

                            {/* Vitals Spike Simulation Guide */}
                            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 flex flex-col justify-between">
                              <div>
                                <strong className="text-slate-900 block text-[9px] uppercase font-bold">Simulate Vitals Spikes:</strong>
                                <p className="text-[11px] text-slate-500 mt-1">
                                  Use the <strong>Wearables Sync Hub</strong> above to log a heart rate above 100 BPM (e.g. clocking <strong>108 BPM</strong>) or below 50. Automatic emergency warnings will instantly escalate alert logs to approved guardians.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Clinical Bookings & Appointments Section */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                          <h4 className="font-display font-semibold text-slate-900 text-sm flex items-center gap-2">
                            <Calendar className="w-4.5 h-4.5 text-teal-600" />
                            My Consultations & Bookings
                          </h4>
                          <span className="text-xs bg-teal-50 border border-teal-100 text-teal-700 px-2.5 py-1 rounded-full font-semibold">
                            {appointments.filter(a => a.patientId === authenticatedPatient.id).length} Scheduled
                          </span>
                        </div>

                        {/* Interactive Appointment Scheduler Box */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 mb-6">
                          <h5 className="font-semibold text-xs text-slate-800 mb-3 flex items-center gap-1.5">
                            <Plus className="w-3.5 h-3.5 text-teal-600" />
                            Schedule New Consultation
                          </h5>
                          <form onSubmit={handleBookAppointment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-medium text-slate-500 mb-1">Proposed Consultation Date</label>
                              <input
                                type="date"
                                required
                                value={apptDate}
                                onChange={(e) => setApptDate(e.target.value)}
                                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-teal-500 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-medium text-slate-500 mb-1">Preferred Time Block</label>
                              <input
                                type="time"
                                required
                                value={apptTime}
                                onChange={(e) => setApptTime(e.target.value)}
                                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-teal-500 outline-none"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[11px] font-medium text-slate-500 mb-1">Reason for Visit & Core Symptoms</label>
                              <textarea
                                required
                                rows={2}
                                placeholder="E.g., High body temperature, recurring malaria symptoms, throat pain, routine toothache checkup..."
                                value={apptReason}
                                onChange={(e) => setApptReason(e.target.value)}
                                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-teal-500 outline-none hover:border-slate-350 focus:border-slate-400"
                              />
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                              <button
                                type="submit"
                                className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                Submit Request to Clinic
                              </button>
                            </div>
                          </form>
                        </div>

                        {/* Appointments Listing */}
                        <div className="space-y-4">
                          {appointments.filter(a => a.patientId === authenticatedPatient.id).length === 0 ? (
                            <div className="text-center p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                              <p className="text-xs text-slate-450 italic">No historical or active appointments booked.</p>
                            </div>
                          ) : (
                            appointments
                              .filter(a => a.patientId === authenticatedPatient.id)
                              .map((appt) => (
                                <div key={appt.id} className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs hover:border-slate-300 transition-colors">
                                  <div className="flex justify-between items-start gap-2 mb-2">
                                    <div>
                                      <span className="text-[10px] uppercase tracking-wider font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-250">
                                        Ref: {appt.id}
                                      </span>
                                      <h6 className="font-semibold text-slate-900 text-xs mt-1.5 flex items-center gap-1.5">
                                        Clinical Center: {hospitals.find(h => h.id === appt.hospitalId)?.name || "Nigerian Health Center"}
                                      </h6>
                                    </div>
                                    <span className={`text-[10px] font-mono tracking-wide font-semibold px-2.5 py-1 rounded-full border ${
                                      appt.status === "pending"
                                        ? "bg-amber-50 border-amber-200 text-amber-700" 
                                        : appt.status === "approved"
                                        ? "bg-emerald-50 border-emerald-200 text-emerald-850"
                                        : appt.status === "rejected"
                                        ? "bg-rose-50 border-rose-200 text-rose-805"
                                        : "bg-slate-50 border-slate-200 text-slate-600"
                                    }`}>
                                      {appt.status.toUpperCase()}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 mb-2">
                                    <p className="text-slate-500 font-mono text-[11px]">
                                      Date: <span className="text-slate-800 font-sans font-semibold">{appt.appointmentDate}</span>
                                    </p>
                                    <p className="text-slate-500 font-mono text-[11px]">
                                      Timeblock: <span className="text-slate-800 font-sans font-semibold">{appt.appointmentTime}</span>
                                    </p>
                                  </div>

                                  <div className="text-xs space-y-1.5 text-slate-700">
                                    <p><strong className="text-slate-900">Patient Note:</strong> {appt.reason}</p>
                                    {appt.doctorNotes && (
                                      <div className="p-2.5 bg-cyan-50 border border-cyan-150 rounded-lg text-cyan-900">
                                        <p className="font-medium text-[11px] mb-0.5 text-cyan-950 flex items-center gap-1">
                                          <Sparkles className="w-3 h-3 text-cyan-700" /> Attending Practitioner Remarks:
                                        </p>
                                        <p className="text-xs">{appt.doctorNotes}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                          )}
                        </div>
                      </div>

                      {/* Prescriptions Section */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h4 className="font-display font-semibold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                          <Pill className="w-4.5 h-4.5 text-teal-600" />
                          My Prescribed Drug Treatments
                        </h4>

                        {clinicalDB.getPrescriptionsForPatient(authenticatedPatient.id).length === 0 ? (
                          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-xs text-slate-500 italic">No prescriptions issued by your attending dentist/physician.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {clinicalDB.getPrescriptionsForPatient(authenticatedPatient.id).map(p => (
                              <div
                                key={p.id}
                                className={cn(
                                  "p-4 rounded-xl border transition flex flex-col justify-between",
                                  p.status === "active"
                                    ? "bg-teal-50/10 border-teal-100 shadow-sm"
                                    : "bg-slate-50 border-slate-200"
                                )}
                              >
                                <div>
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="font-mono text-[9px] text-slate-400">{p.id}</span>
                                    <button
                                      onClick={() => handleTogglePrescription(p.id, p.status)}
                                      className={cn(
                                        "px-2 py-0.5 rounded text-[8px] font-bold uppercase border cursor-pointer",
                                        p.status === "active"
                                          ? "bg-teal-700 text-teal-50 border-teal-600"
                                          : "bg-slate-100 text-slate-500 border-slate-200"
                                      )}
                                      title="Toggle status"
                                    >
                                      {p.status}
                                    </button>
                                  </div>

                                  <h5 className="font-display font-semibold text-slate-900 text-xs sm:text-sm">
                                    {p.drugName}
                                  </h5>
                                  <p className="text-slate-800 text-xs font-semibold mt-1">
                                    Dosage: {p.dosage}
                                  </p>
                                  <p className="text-slate-500 text-[11px] leading-relaxed mt-2 p-2 bg-white/70 rounded-lg border border-slate-100">
                                    {p.instructions}
                                  </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                                  <span>Physician: <strong>{p.doctorName}</strong></span>
                                  <span>{new Date(p.prescribedAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Diagnostic treatment logs */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h4 className="font-display font-semibold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                          <FileText className="w-4.5 h-4.5 text-teal-600" />
                          Diagnostic Treat File History
                        </h4>

                        {clinicalDB.getTreatmentsForPatient(authenticatedPatient.id).length === 0 ? (
                          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-xs text-slate-400 italic">No formal medical diagnoses logged under your patient profile.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {clinicalDB.getTreatmentsForPatient(authenticatedPatient.id).map(t => (
                              <div key={t.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                                <div className="flex justify-between items-start gap-2 mb-2">
                                  <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-100 text-[10px] font-bold">
                                    Physician Diagnosed
                                  </span>
                                  <span className="text-slate-400 font-mono text-[10px]">{new Date(t.createdAt).toLocaleDateString()}</span>
                                </div>

                                <h5 className="font-semibold text-slate-800 text-sm">{t.diagnosis}</h5>
                                <p className="text-slate-600 mt-2 leading-relaxed whitespace-pre-line text-xs">{t.notes}</p>
                                
                                <div className="mt-3 pt-2.5 border-t border-slate-200/50 flex justify-between text-[10px] text-slate-400">
                                  <span>Attending Practitioner: <strong>{t.doctorName}</strong></span>
                                  <span>Registered Clinic ID: <strong className="font-mono">{t.hospitalId}</strong></span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vitals & Smartwatch Synced Trends Segment ("gamification-wearables-section") */}
                    <div className="space-y-6">
                      
                      {/* Wearable Biometric Panel */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4" id="gamification-wearables-section">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-1.5">
                            <Activity className="w-5 h-5 text-teal-600" />
                            <h4 className="font-display font-semibold text-slate-900 text-sm">
                              Smartwatch Biometric Sync
                            </h4>
                          </div>
                          
                          <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-100 font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-sky-500 animate-pulse" />
                            Garmin & Fit Sync
                          </span>
                        </div>

                        {/* Wearable syncing mock logs form */}
                        <form onSubmit={handleVitalsSync} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                          <p className="text-[11px] text-slate-500 leading-normal">
                            Connect your mobile health device or log today's diagnostic biometric vitals to calculate healthy streak awards.
                          </p>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] text-slate-400 font-bold mb-1">WEIGHT (KG)</label>
                              <input
                                type="number"
                                step="0.1"
                                required
                                value={syncWeight}
                                onChange={(e) => setSyncWeight(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-400 font-bold mb-1 font-mono">PULSE (BPM)</label>
                              <input
                                type="number"
                                required
                                value={syncHeartRate}
                                onChange={(e) => setSyncHeartRate(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none"
                              />
                            </div>
                          </div>

                          {syncSuccessMessage && (
                            <p className="text-[10px] text-emerald-700 font-medium">
                              {syncSuccessMessage}
                            </p>
                          )}

                          <button
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 rounded-lg text-[11px]"
                          >
                            Sync Wearable Device Today
                          </button>
                        </form>

                        {/* Gamification Milestone Reward system */}
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-800">🏆 Smart Sync Streak</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">Consecutive health tracking: 5 Days</p>
                          </div>
                          <span className="font-mono text-lg bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded font-bold">
                            +150 XP
                          </span>
                        </div>
                      </div>

                      {/* Historical Biometrics Trend Chart - Weight and Heart Rate ("historical trend chart") */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                          <TrendingUp className="w-4 h-4 text-teal-600" />
                          <h4 className="font-display font-semibold text-slate-900 text-sm">
                            Vitals Historical Trend
                          </h4>
                        </div>

                        {patientHealthLogs.length === 0 ? (
                          <div className="py-12 text-center text-slate-400 text-xs italic">
                            No telemetry logs found. Record a wearable sync to visualize your vitals timeline.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {/* Graphic Chart representation using Recharts */}
                            <div className="h-48 w-full text-xs font-mono">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                  data={patientHealthLogs.map(log => ({
                                    date: new Date(log.loggedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
                                    weight: log.weight,
                                    heartRate: log.heartRate
                                  }))}
                                  margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                  <XAxis dataKey="date" stroke="#94a3b8" />
                                  <YAxis yAxisId="left" stroke="#14b8a6" domain={["dataMin - 2", "dataMax + 2"]} />
                                  <YAxis yAxisId="right" orientation="right" stroke="#6366f1" domain={["dataMin - 10", "dataMax + 10"]} />
                                  <Tooltip />
                                  <Legend wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />
                                  <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="weight"
                                    name="Weight (kg)"
                                    stroke="#14b8a6"
                                    strokeWidth={2.5}
                                    activeDot={{ r: 6 }}
                                  />
                                  <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="heartRate"
                                    name="Pulse (bpm)"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>

                            {/* Details feed */}
                            <div className="pt-2 border-t border-slate-100 space-y-2">
                              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Logged Telemetry Feed
                              </span>
                              
                              <div className="space-y-1 max-h-32 overflow-y-auto">
                                {[...patientHealthLogs].reverse().map(log => (
                                  <div key={log.id} className="flex justify-between items-center text-[10px] font-mono py-1 border-b border-dashed border-slate-100 last:border-0">
                                    <span className="text-slate-500">{new Date(log.loggedAt).toLocaleDateString()} {new Date(log.loggedAt).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"})}</span>
                                    <span className="text-slate-900 font-semibold font-sans">
                                      {log.weight} kg • {log.heartRate} bpm
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Public Clinical Advisory Info */}
                      <div className="bg-slate-950 text-slate-400 rounded-2xl p-5 border border-slate-800 space-y-3">
                        <h5 className="font-display text-xs text-white font-semibold flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          Health Data Privacy Guard
                        </h5>
                        <p className="text-[11px] leading-relaxed">
                          Your digital clinical files and biometric trend values are strictly authorization-locked and protected against any direct unauthenticated searches. Only you and authorized physicians at registering Nigerian Medical Centers have active access keys.
                        </p>
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ================= FAMILY CAREGIVER PORTAL ================= */}
          {activeRole === "caregiver" && (
            <motion.div
              key="caregiver"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 animate-fade-in"
            >
              {/* Caregiver Portal Header / Login */}
              {!authenticatedCaregiverEmail ? (
                <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-teal-100/80 rounded-2xl flex items-center justify-center text-teal-700 mx-auto">
                      <Users className="w-6 h-6 animate-pulse" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-slate-800">Family Caregiver Portal</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Enter your email address below to access patient telemetry tracking, compliance signals, and active alerts.
                    </p>
                  </div>

                  <form onSubmit={handleCaregiverLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        My Caregiver Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rebecca.okafor@example.com"
                        value={caregiverEmailForm}
                        onChange={(e) => setCaregiverEmailForm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block leading-relaxed">
                        💡 Try pre-seeded email: <strong className="text-slate-600">rebecca.okafor@example.com</strong> or your invited address.
                      </span>
                    </div>

                    {caregiverLoginError && (
                      <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-2.5 rounded border border-rose-100">
                        {caregiverLoginError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition text-sm cursor-pointer"
                    >
                      Authenticate Caregiver Session
                    </button>
                  </form>
                </div>
              ) : (
                // Caregiver is Authenticated!
                <div className="space-y-6">
                  {/* Active Session Info Panel */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-650/10 rounded-xl flex items-center justify-center text-teal-750 font-semibold">
                        <Users className="w-5 h-5 text-teal-650" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-900">
                          Active Caregiver Session: <span className="text-teal-700 font-mono">{authenticatedCaregiverEmail}</span>
                        </h4>
                        <p className="text-[11.5px] text-slate-500">
                          Secure family tracking keys mapped directly from local clinical registries.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setAuthenticatedCaregiverEmail("")}
                      className="text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-2 rounded-xl font-semibold transition cursor-pointer"
                    >
                      Disconnect Portal
                    </button>
                  </div>

                  {/* Invitations List / Pending Accept Area */}
                  {(() => {
                    const invites = caregiverInvites.filter(
                      i => i.email.toLowerCase() === authenticatedCaregiverEmail.toLowerCase()
                    );

                    if (invites.length === 0) {
                      return (
                        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto space-y-3">
                          <Users className="w-12 h-12 text-slate-300 mx-auto" />
                          <h4 className="font-semibold text-sm text-slate-900">No Patient Linkages Found</h4>
                          <p className="text-xs text-slate-500">
                            You don't have any active invitations matching <strong>{authenticatedCaregiverEmail}</strong>. Please have the patient invite you first from their dashboard.
                          </p>
                        </div>
                      );
                    }

                    const pendingInvites = invites.filter(i => i.status === "pending");
                    const approvedInvites = invites.filter(i => i.status === "approved");

                    return (
                      <div className="space-y-6">
                        {/* Pending Invites Alert */}
                        {pendingInvites.length > 0 && (
                          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-4">
                            <h4 className="font-display font-semibold text-amber-800 text-sm flex items-center gap-2">
                              📬 Pending Health Caregiver Invitations ({pendingInvites.length})
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {pendingInvites.map((invite) => {
                                const patient = clinicalDB.getPatients().find(p => p.id === invite.patientId);
                                return (
                                  <div key={invite.id} className="bg-white border border-amber-250 p-4 rounded-xl space-y-3">
                                    <div className="space-y-1">
                                      <h5 className="font-semibold text-xs text-slate-900">
                                        Invitation from: {patient ? patient.fullName : "Unknown Patient"}
                                      </h5>
                                      <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
                                        Relationship Role: <strong className="text-slate-800">{invite.relationship}</strong>
                                      </p>
                                      <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                                        Wants to notify you on:{" "}
                                        {invite.notifyMissedDose && "💊 Missed Doses"}{" "}
                                        {invite.notifyMissedDose && invite.notifyVitalSpike && "& "}{" "}
                                        {invite.notifyVitalSpike && "⚠️ Biometric Pulse Spikes"}.
                                      </p>
                                    </div>

                                    <button
                                      onClick={() => handleAcceptCaregiverInvite(invite.id)}
                                      className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-2 rounded-lg transition"
                                    >
                                      Accept & Initiate Tracking
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Approved Caregiver Dashboards */}
                        {approvedInvites.length === 0 ? (
                          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto">
                            <p className="text-xs text-slate-500 italic">
                              Accept any pending invitations above to open live telemetry tracking.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-8">
                            {approvedInvites.map((invite) => {
                              const patient = clinicalDB.getPatients().find(p => p.id === invite.patientId);
                              if (!patient) return null;

                              const patientAlerts = caregiverAlerts.filter(
                                a => a.patientId === patient.id && a.caregiverEmail.toLowerCase() === authenticatedCaregiverEmail.toLowerCase()
                              );

                              // Get patient's latest synced health logs for vitals tracker!
                              const patientLogs = clinicalDB.getHealthLogsForPatient(patient.id);
                              const latestLog = patientLogs[patientLogs.length - 1];

                              return (
                                <div key={invite.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                                  {/* Patient Profile Card */}
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                                    <div>
                                      <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase text-[9px]">
                                        Connected Patient Live Registry
                                      </span>
                                      <h4 className="font-display font-semibold text-base text-slate-900 mt-1 flex items-center gap-2">
                                        {patient.fullName}
                                        <span className="text-xs bg-slate-100 text-slate-705 px-2 py-0.5 rounded-full border border-slate-200">
                                          {invite.relationship} to Patient
                                        </span>
                                      </h4>
                                    </div>

                                    <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                                      <span className="bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded">
                                        Age: {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}
                                      </span>
                                      <span className="bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded">
                                        Blood: {patient.bloodGroup}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left Panel: Real-Time Biometric Pulse Watcher */}
                                    <div className="bg-slate-50 rounded-xl p-4.5 border border-slate-200 space-y-4">
                                      <h5 className="font-semibold text-xs text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
                                        Live Pulse & Vitals Monitor
                                      </h5>

                                      {latestLog ? (
                                        <div className="space-y-4">
                                          <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1">
                                              <span className="text-[10px] font-bold text-slate-400 block uppercase">Pulse Rate</span>
                                              <div className="flex items-baseline gap-1">
                                                <span className={`text-xl font-bold tracking-tight ${
                                                  latestLog.heartRate > 100 || latestLog.heartRate < 55 ? "text-rose-600 animate-pulse" : "text-slate-900"
                                                }`}>
                                                  {latestLog.heartRate}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-mono">BPM</span>
                                              </div>
                                              <div>
                                                {latestLog.heartRate > 100 ? (
                                                  <span className="text-[8px] bg-rose-50 border border-rose-200 text-rose-700 px-1 py-0.5 rounded font-mono font-bold animate-pulse">Abnormal Spike</span>
                                                ) : latestLog.heartRate < 55 ? (
                                                  <span className="text-[8px] bg-amber-50 border border-amber-200 text-amber-700 px-1 py-0.5 rounded font-mono font-bold animate-pulse">Pulse Drop</span>
                                                ) : (
                                                  <span className="text-[8px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-1 py-0.5 rounded font-mono font-bold">Stable</span>
                                                )}
                                              </div>
                                            </div>

                                            <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1">
                                              <span className="text-[10px] font-bold text-slate-400 block uppercase">Body Weight</span>
                                              <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-bold text-slate-900 tracking-tight">{latestLog.weight}</span>
                                                <span className="text-[10px] text-slate-400 font-mono">KG</span>
                                              </div>
                                              <span className="text-[9px] text-slate-400 block">Smartscale Synced</span>
                                            </div>
                                          </div>

                                          <div className="bg-teal-50 border border-teal-100 p-2.5 rounded-lg flex items-center justify-between text-[10.5px]">
                                            <span className="text-teal-800 font-medium">Smartwatch Status:</span>
                                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                                              CONNECTED
                                            </span>
                                          </div>

                                          <div className="text-[9.5px] text-slate-400 italic">
                                            Last sync: {new Date(latestLog.loggedAt).toLocaleDateString()} at {new Date(latestLog.loggedAt).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="text-center p-6 border border-dashed border-slate-250 rounded-xl bg-white space-y-2">
                                          <Activity className="w-8 h-8 text-slate-300 mx-auto" />
                                          <p className="text-xs text-slate-500 italic">No live smartwatch records yet.</p>
                                        </div>
                                      )}
                                    </div>

                                    {/* Middle Panel: Secure Automated Alert Feed */}
                                    <div className="bg-slate-50 rounded-xl p-4.5 border border-slate-200 space-y-4 lg:col-span-2">
                                      <div className="flex justify-between items-center">
                                        <h5 className="font-semibold text-xs text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                          <Bell className="w-4 h-4 text-amber-500 animate-pulse" />
                                          Automated Alert Dispatch Feed
                                        </h5>
                                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono font-bold text-[9px]">
                                          {patientAlerts.length} Dispatched
                                        </span>
                                      </div>

                                      {patientAlerts.length === 0 ? (
                                        <div className="text-center py-12 border border-dashed border-slate-250 rounded-xl bg-white flex flex-col items-center justify-center space-y-2">
                                          <ShieldCheck className="w-8 h-8 text-emerald-500" />
                                          <p className="text-xs text-slate-700 font-semibold">System Clear & Compliant</p>
                                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">No telemetry compliance warnings have been tripped so far.</p>
                                        </div>
                                      ) : (
                                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                                          {[...patientAlerts].reverse().map((alert) => (
                                            <div key={alert.id} className="border border-rose-200 rounded-xl p-3 bg-white space-y-1.5 shadow-sm">
                                              <div className="flex items-center justify-between col-gap-2">
                                                <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                                                  alert.type === "vital_spike"
                                                    ? "bg-rose-100 text-rose-800 border border-rose-250"
                                                    : "bg-amber-100 text-amber-800 border border-amber-250"
                                                }`}>
                                                  {alert.type === "vital_spike" ? "⚠️ CRITICAL VITAL HAZARD" : "💊 MISSED DOSE WARNING"}
                                                </span>

                                                <span className="text-[9px] text-slate-400 font-mono">
                                                  {new Date(alert.createdAt).toLocaleString([], {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                  })}
                                                </span>
                                              </div>

                                              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                                                {alert.message}
                                              </p>

                                              <div className="text-[9px] text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded flex items-center gap-1.5 border border-slate-150">
                                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                                <span>Encrypted Broadcast Verification Checksum</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Medication Compliance Track */}
                                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3.5">
                                    <h5 className="font-semibold text-xs text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                                      <Pill className="w-4 h-4 text-emerald-600" />
                                      Patient Prescription Compliance
                                    </h5>

                                    {clinicalDB.getPrescriptionsForPatient(patient.id).length === 0 ? (
                                      <p className="text-xs text-slate-500 italic px-1">No active treatment prescriptions currently synced.</p>
                                    ) : (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                                        {clinicalDB.getPrescriptionsForPatient(patient.id).map((pres) => (
                                          <div key={pres.id} className="bg-white border border-slate-200 p-3 rounded-xl space-y-1">
                                            <div className="flex justify-between items-start">
                                              <strong className="text-slate-950 text-[11px] font-sans truncate">{pres.drugName}</strong>
                                              <span className={`text-[8.5px] px-1.5 py-0.5 rounded-full font-mono uppercase font-bold border ${
                                                pres.status === "active"
                                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                                  : "bg-slate-50 text-slate-600 border-slate-200"
                                              }`}>
                                                {pres.status}
                                              </span>
                                            </div>
                                            <p className="text-[10px] text-teal-800 font-semibold">{pres.dosage}</p>
                                            <p className="text-[9.5px] text-slate-500 italic mt-1 line-clamp-2">{pres.instructions}</p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                    </div>
                  )}
            </motion.div>
          )}

          {/* ================= HOSPITAL PHARMACY PORTAL VIEW ================= */}
          {activeRole === "pharmacy" && (
            <motion.div
              key="pharmacy"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
              id="role-pharmacy-workspace"
            >
              <div className="bg-gradient-to-r from-teal-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
                <div className="relative z-10 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 rounded-full border border-teal-400/30 text-teal-300 text-[11px] font-mono font-semibold uppercase tracking-wider">
                    <Pill className="w-3.5 h-3.5" /> Pharmacy Dispenser & Requisitions Console
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Nigeria Central Pharmacy Portal
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                    Verify doctor-issued prescriptions, monitor live clinical stock limits, adjust low-level triggers, and manage supply procurement flows in synchronized real-time.
                  </p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12 select-none pointer-events-none">
                  <Pill className="w-96 h-96 text-white" />
                </div>
              </div>

              {/* Hospital Selection Header */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Active Hospital Facility Registry
                  </label>
                  <select
                    value={pharmacySelectedHospId}
                    onChange={(e) => {
                      setPharmacySelectedHospId(e.target.value);
                      triggerToast(`Switched pharmacy terminal to ${hospitals.find(h => h.id === e.target.value)?.name}`);
                    }}
                    className="bg-slate-50 border border-slate-250 rounded-lg py-2 px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-[280px]"
                  >
                    {hospitals.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.state})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dashboard Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl self-end md:self-center">
                  <button
                    onClick={() => setPharmacyActiveTab("inventory")}
                    className={cn(
                      "px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5",
                      pharmacyActiveTab === "inventory"
                        ? "bg-white text-teal-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    Inventory ({medicationStocks.filter(s => s.hospitalId === pharmacySelectedHospId).length})
                  </button>
                  <button
                    onClick={() => {
                      setPharmacyActiveTab("prescriptions");
                      const activePrescriptions = clinicalDB.getPrescriptions()
                        .filter(p => p.hospitalId === pharmacySelectedHospId && p.status === "active");
                      const updatedMap = { ...dispenseQtyMap };
                      activePrescriptions.forEach(p => {
                        if (!updatedMap[p.id]) {
                          const instructionsLower = p.instructions.toLowerCase();
                          if (instructionsLower.includes("twice") || instructionsLower.includes("2 times")) {
                            updatedMap[p.id] = 60;
                          } else if (instructionsLower.includes("thrice") || instructionsLower.includes("3 times") || instructionsLower.includes("8 hours")) {
                            updatedMap[p.id] = 90;
                          } else {
                            updatedMap[p.id] = 30;
                          }
                        }
                      });
                      setDispenseQtyMap(updatedMap);
                    }}
                    className={cn(
                      "px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5",
                      pharmacyActiveTab === "prescriptions"
                        ? "bg-white text-teal-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Pending Prescriptions ({
                      clinicalDB.getPrescriptions().filter(p => p.hospitalId === pharmacySelectedHospId && p.status === "active").length
                    })
                  </button>
                  <button
                    onClick={() => setPharmacyActiveTab("procurement")}
                    className={cn(
                      "px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5",
                      pharmacyActiveTab === "procurement"
                        ? "bg-white text-teal-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Supply Pipelines ({
                      procurementRequests.filter(p => p.hospitalId === pharmacySelectedHospId && p.status !== "received").length
                    } Active)
                  </button>
                </div>
              </div>

              {/* STATS TILES BANNER */}
              {(() => {
                const facilityStocks = medicationStocks.filter(s => s.hospitalId === pharmacySelectedHospId);
                const lowStockCount = facilityStocks.filter(s => s.stockLevel <= s.minThreshold).length;
                const activeProcSupply = procurementRequests.filter(p => p.hospitalId === pharmacySelectedHospId && p.status !== "received").length;
                const totalDispenses = facilityStocks.filter(s => s.lastDispensedAt).length;

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                      <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Catalog Items</span>
                        <div className="text-xl font-extrabold text-slate-900">{facilityStocks.length} Registered</div>
                      </div>
                    </div>

                    <div className={cn(
                      "border p-5 rounded-2xl flex items-center gap-4 shadow-sm transition-all",
                      lowStockCount > 0 
                        ? "bg-rose-50 border-rose-250 text-rose-950" 
                        : "bg-white border-slate-200 text-slate-900"
                    )}>
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        lowStockCount > 0 ? "bg-rose-100 text-rose-600 animate-pulse" : "bg-teal-50 text-teal-600"
                      )}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Critically Low Stock</span>
                        <div className="text-xl font-extrabold flex items-center gap-1.5 font-sans">
                          {lowStockCount} Items
                          {lowStockCount > 0 && (
                            <span className="text-[9px] bg-rose-200 text-rose-800 px-2 py-0.5 rounded font-mono font-bold uppercase animate-ping">ALERT</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center gap-4 shadow-sm">
                      <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Procurement Orders</span>
                        <div className="text-xl font-extrabold text-slate-900">{activeProcSupply} Pending</div>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Dispense Events</span>
                        <div className="text-xl font-extrabold text-slate-900">{totalDispenses} Handled</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ================= TAB 1: MEDICATION CATALOG / INVENTORY ================= */}
              {pharmacyActiveTab === "inventory" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="relative w-full sm:max-w-md">
                      <input
                        type="text"
                        placeholder="Search stock catalogue (e.g. insulin, amoxicillin)..."
                        value={pharmacySearchQuery}
                        onChange={(e) => setPharmacySearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-250 py-2.5 pl-10 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-400 text-slate-800 font-sans"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>

                    <button
                      onClick={() => setIsAddingStockLine(!isAddingStockLine)}
                      className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all self-stretch sm:self-auto justify-center animate-pulse-slow"
                      id="pharmacist-add-stock-btn"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Establish New Generic Stock
                    </button>
                  </div>

                  {/* Manual Stock Line Form details */}
                  {isAddingStockLine && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddStockLineSubmit}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-inner"
                    >
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Plus className="w-4 h-4 text-teal-600" /> New Drug Inventory Line
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">Chemical Compound Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Metformin (505mg)"
                            value={newStockDrugName}
                            onChange={(e) => setNewStockDrugName(e.target.value)}
                            className="w-full bg-white border border-slate-250 rounded-lg p-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">Initial Quantity On Site</label>
                          <input
                            type="number"
                            required
                            min="0"
                            placeholder="e.g. 500"
                            value={newStockQty}
                            onChange={(e) => setNewStockQty(e.target.value)}
                            className="w-full bg-white border border-slate-250 rounded-lg p-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">Min Alarm Level (Threshold)</label>
                          <input
                            type="number"
                            required
                            min="0"
                            placeholder="e.g. 40"
                            value={newStockThreshold}
                            onChange={(e) => setNewStockThreshold(e.target.value)}
                            className="w-full bg-white border border-slate-250 rounded-lg p-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">Physical Dispense Unit</label>
                          <select
                            value={newStockUnit}
                            onChange={(e) => setNewStockUnit(e.target.value)}
                            className="w-full bg-white border border-slate-250 rounded-lg p-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                          >
                            <option value="tablets">tablets</option>
                            <option value="capsules">capsules</option>
                            <option value="vials">vials</option>
                            <option value="bottles">bottles</option>
                            <option value="packs">packs</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3.5 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingStockLine(false)}
                          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-sm"
                        >
                          Establish Stock Segment
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {/* Stock Registry Table / Cards */}
                  {(() => {
                    const baseStocks = medicationStocks.filter(s => s.hospitalId === pharmacySelectedHospId);
                    const filtered = baseStocks.filter(s => 
                      s.drugName.toLowerCase().includes(pharmacySearchQuery.toLowerCase())
                    );

                    if (filtered.length === 0) {
                      return (
                        <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl bg-white space-y-4">
                          <Pill className="w-12 h-12 text-slate-300 mx-auto" />
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-slate-700">No catalogue items found</h4>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                              No supply records matched your filters. Initialize some stock records or add a new brand line above.
                            </p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50/75 border-b border-slate-250 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <th className="py-4 px-5">Drug Formulation Name</th>
                                <th className="py-4 px-5">Stock In-Hand</th>
                                <th className="py-4 px-5">Min Alarm Level</th>
                                <th className="py-4 px-5">Gauge Ratio</th>
                                <th className="py-4 px-5">Tracking Events</th>
                                <th className="py-4 px-5 text-right">System Guard Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-150 text-xs text-slate-700">
                              {filtered.map((stock) => {
                                const isCritical = stock.stockLevel <= stock.minThreshold;
                                const pctRemaining = Math.max(Math.min((stock.stockLevel / (stock.minThreshold * 3.5 || 100)) * 100, 100), 5);

                                return (
                                  <tr key={stock.id} className={cn(
                                    "hover:bg-slate-50/50 transition-colors",
                                    isCritical ? "bg-rose-50/20" : ""
                                  )}>
                                    <td className="py-4 px-5 font-semibold text-slate-950">
                                      <div className="flex items-center gap-2">
                                        <div className={cn(
                                          "w-2 h-2 rounded-full",
                                          isCritical ? "bg-rose-500 animate-ping" : "bg-emerald-500"
                                        )} />
                                        <span>{stock.drugName}</span>
                                      </div>
                                    </td>

                                    <td className="py-4 px-5 font-mono text-[11px] font-bold">
                                      <span className={cn(
                                        "px-2 py-1 rounded-md border font-mono",
                                        isCritical 
                                          ? "bg-rose-100 border-rose-200 text-rose-800" 
                                          : "bg-teal-50 border-teal-100 text-teal-850"
                                      )}>
                                        {stock.stockLevel} {stock.unit}
                                      </span>
                                    </td>

                                    <td className="py-4 px-5 font-mono text-slate-500">
                                      ≤ {stock.minThreshold} {stock.unit}
                                    </td>

                                    <td className="py-2.5 px-5 min-w-[140px]">
                                      <div className="space-y-1">
                                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden font-sans">
                                          <div 
                                            className={cn(
                                              "h-full rounded-full transition-all",
                                              isCritical ? "bg-rose-500" : pctRemaining < 50 ? "bg-amber-400" : "bg-emerald-500"
                                            )} 
                                            style={{ width: `${pctRemaining}%` }}
                                          />
                                        </div>
                                        <div className="flex items-center justify-between text-[7px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                                          <span>exhausted</span>
                                          <span>safe level</span>
                                        </div>
                                      </div>
                                    </td>

                                    <td className="py-4 px-5 text-slate-500 space-y-0.5">
                                      {stock.lastDispensedAt && (
                                        <div className="text-[10px]">
                                          Dispensed: <span className="font-mono text-slate-700">{new Date(stock.lastDispensedAt).toLocaleDateString()}</span>
                                        </div>
                                      )}
                                      {stock.lastRestockedAt ? (
                                        <div className="text-[10px] text-teal-850 font-semibold">
                                          Restocked: <span className="font-mono">{new Date(stock.lastRestockedAt).toLocaleDateString()}</span>
                                        </div>
                                      ) : (
                                        <span className="text-[9px] text-slate-350">No restocks logged</span>
                                      )}
                                    </td>

                                    <td className="py-4 px-5 text-right">
                                      {isCritical ? (
                                        <div className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg text-[9.5px] font-bold select-none whitespace-nowrap animate-pulse">
                                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                                          Requisition Automatically Filed
                                        </div>
                                      ) : (
                                        <div className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg text-[9.5px] font-bold select-none whitespace-nowrap">
                                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                          Compliant Safe
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ================= TAB 2: CLINICALLY ISSUED PRESCRIPTIONS FOR DISPENSING ================= */}
              {pharmacyActiveTab === "prescriptions" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-teal-200">
                    <p className="text-xs text-slate-650 leading-relaxed flex items-center gap-2">
                      <Info className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>
                        <strong>Prescription Dispensation Engine:</strong> Review clinical scripts ordered by verified doctors. Dispensing on-hand items automatically decrements compound balances. If levels breach safe margins, real-time supply orders are issued.
                      </span>
                    </p>
                  </div>

                  {(() => {
                    const activePrescriptions = clinicalDB.getPrescriptions()
                      .filter(p => p.hospitalId === pharmacySelectedHospId && p.status === "active");
                    const completedPrescriptions = clinicalDB.getPrescriptions()
                      .filter(p => p.hospitalId === pharmacySelectedHospId && p.status === "completed");

                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-4 lg:col-span-2">
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-4 h-4 text-teal-600 animate-pulse" />
                            Active Clinical Prescription Queue ({activePrescriptions.length})
                          </h4>

                          {activePrescriptions.length === 0 ? (
                            <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white space-y-3">
                              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                              <h5 className="text-sm font-semibold text-slate-800">Clear queue!</h5>
                              <p className="text-xs text-slate-500">Every prescription issued has been satisfied.</p>
                            </div>
                          ) : (
                            <div className="space-y-4 font-sans">
                              {activePrescriptions.map((pres) => {
                                const matchedPatient = patients.find(p => p.id === pres.patientId);
                                const defaultQty = dispenseQtyMap[pres.id] || 30;
                                const stockItem = medicationStocks.find(s => 
                                  s.hospitalId === pharmacySelectedHospId && 
                                  s.drugName.toLowerCase() === pres.drugName.toLowerCase()
                                );
                                const hasAvailableSupply = stockItem ? stockItem.stockLevel >= defaultQty : true;

                                return (
                                  <div key={pres.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-teal-500/40 transition-all">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                      <div className="space-y-1.5 max-w-md">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] bg-sky-50 border border-sky-200 text-sky-800 px-2 py-0.5 rounded font-mono font-bold uppercase select-none">
                                            Awaiting Dispatch
                                          </span>
                                          <span className="text-[9px] text-slate-400 font-mono">
                                            ID: {pres.id}
                                          </span>
                                        </div>

                                        <h5 className="font-display font-medium text-slate-900 text-sm">
                                          Prescribed drug: <span className="text-teal-900 font-extrabold text-base">{pres.drugName}</span>
                                        </h5>

                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1 text-xs text-slate-650">
                                          <div>
                                            <span className="text-slate-400 font-mono text-[10px]">Patient Name:</span> <strong className="text-slate-800 block text-sm mt-0.5">{matchedPatient?.fullName || pres.patientId}</strong>
                                          </div>
                                          <div>
                                            <span className="text-slate-400 font-mono text-[10px]">Clinician:</span> <span className="text-slate-800 font-semibold block text-sm mt-0.5">{pres.doctorName}</span>
                                          </div>
                                          <div className="col-span-2 mt-2 bg-teal-50 border border-teal-100/50 p-2.5 rounded-lg text-teal-950">
                                            <span className="text-teal-800 font-mono font-bold block uppercase text-[9px] tracking-wider mb-0.5">Official Dosages</span>
                                            <span className="font-semibold text-[11px] leading-relaxed block">{pres.dosage} — {pres.instructions}</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* SUPPLY ESTIMATOR */}
                                      <div className="bg-slate-50 border border-slate-205 rounded-xl p-3.5 space-y-1 text-xs text-slate-550 text-center w-full sm:max-w-[200px] shrink-0">
                                        <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block">Available Stock on Premise</span>
                                        {stockItem ? (
                                          <div className="space-y-1">
                                            <span className={cn(
                                              "text-base font-extrabold font-mono block",
                                              stockItem.stockLevel <= stockItem.minThreshold ? "text-rose-600 animate-pulse" : "text-emerald-700"
                                            )}>
                                              {stockItem.stockLevel} {stockItem.unit}
                                            </span>
                                            {stockItem.stockLevel <= stockItem.minThreshold ? (
                                              <span className="text-[8px] bg-rose-150 border border-rose-250 text-rose-800 font-bold px-1.5 py-0.5 rounded font-mono block">Level Alarm Tripped</span>
                                            ) : (
                                              <span className="text-[8px] bg-emerald-100 border border-emerald-250 text-emerald-800 font-bold px-1.5 py-0.5 rounded font-mono block">In Stock</span>
                                            )}
                                          </div>
                                        ) : (
                                          <div className="space-y-1">
                                            <span className="text-slate-400 italic block">Unregistered Drug</span>
                                            <span className="text-[8.5px] bg-sky-100 text-sky-850 font-bold px-1.5 py-0.5 rounded font-mono block animate-pulse">Auto-Instantiates</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* DISPENSE FOR ACTION */}
                                    <div className="border-t border-slate-150 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                      <div className="flex items-center gap-3">
                                        <label className="text-[10.5px] font-semibold text-slate-650 whitespace-nowrap">
                                          Physical Dispensed Qty:
                                        </label>
                                        <div className="flex items-center gap-1.5">
                                          <input
                                            type="number"
                                            min="1"
                                            value={defaultQty}
                                            onChange={(e) => {
                                              const val = parseInt(e.target.value) || 0;
                                              setDispenseQtyMap(prev => ({ ...prev, [pres.id]: val }));
                                            }}
                                            className="w-16 bg-slate-50 border border-slate-250 rounded py-1 px-1.5 text-xs text-center text-slate-850 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                                          />
                                          <span className="text-xs text-slate-400 font-mono">
                                            {stockItem?.unit || "tablets"}
                                          </span>
                                        </div>
                                      </div>

                                      <button
                                        type="button"
                                        disabled={stockItem ? stockItem.stockLevel < defaultQty : false}
                                        onClick={() => handleDispensePrescription(pres, defaultQty)}
                                        className={cn(
                                          "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm",
                                          stockItem && stockItem.stockLevel < defaultQty
                                            ? "bg-slate-250 text-slate-400 border border-slate-300 cursor-not-allowed"
                                            : "bg-teal-600 hover:bg-teal-700 text-white"
                                        )}
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                        {stockItem && stockItem.stockLevel < defaultQty ? "Insufficient Pharmacy Stock" : "Confirm Dispensation & Deduct Inventory"}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* RIGHT COLUMN: RECENTLY FULFILLED ARCHIVE */}
                        <div className="space-y-4 font-sans">
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-emerald-600" /> Dispensed Archive (Completed)
                          </h4>

                          {completedPrescriptions.length === 0 ? (
                            <div className="p-6 border border-dashed border-slate-205 rounded-2xl bg-white text-center text-xs text-slate-400 italic">
                              No fulfilled records on file.
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                              {[...completedPrescriptions].reverse().map((pres) => {
                                const patientObj = patients.find(p => p.id === pres.patientId);

                                return (
                                  <div key={pres.id} className="bg-white border border-slate-200 p-4 rounded-xl space-y-1.5 text-xs relative overflow-hidden shadow-sm">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 translate-x-8 -translate-y-8 rounded-full pointer-events-none" />
                                    
                                    <div className="flex items-center justify-between">
                                      <strong className="text-teal-900 font-semibold truncate max-w-[130px]">{pres.drugName}</strong>
                                      <span className="text-[8px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono font-bold uppercase">
                                        Dispensed
                                      </span>
                                    </div>

                                    <div className="space-y-0.5 text-[10.5px] leading-relaxed">
                                      <div className="text-slate-500">
                                        Patient: <span className="text-slate-850 font-semibold">{patientObj?.fullName || pres.patientId}</span>
                                      </div>
                                      <div className="text-slate-500">
                                        Clinician: <span className="text-slate-800 font-medium">{pres.doctorName}</span>
                                      </div>
                                    </div>

                                    <div className="text-[9px] italic text-slate-400 bg-slate-50 p-1.5 rounded border border-slate-150">
                                      Dosage Instructions: {pres.dosage}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ================= TAB 3: PROCUREMENT PIPELINE / ALERTS ================= */}
              {pharmacyActiveTab === "procurement" && (
                <div className="space-y-6 animate-fadeIn font-sans">
                  
                  {/* Automated alert summary trigger panel */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-6 border border-amber-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-xl">
                      <h4 className="text-sm font-extrabold text-slate-850 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500 animate-pulse" /> Procurement & Supply Pipeline
                      </h4>
                      <p className="text-xs text-slate-650 leading-relaxed font-sans">
                        Whenever active stock of a medication breaches safety thresholds established by clinical staff, the system <strong>issues an automatic procurement request immediately</strong>. The procurement division monitors state-level supply lines, crediting stockpile assets when shipments are received.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddingProcRequest(!isAddingProcRequest)}
                      className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shrink-0 shadow-sm flex items-center justify-center gap-1.5 transition-all"
                      id="pharmacist-proc-req-btn"
                    >
                      <Plus className="w-4 h-4" />
                      Issue Manual Requisition Reorder
                    </button>
                  </div>

                  {/* Manual Procurement form logic */}
                  {isAddingProcRequest && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddProcurementRequestSubmit}
                      className="bg-white border border-slate-205 rounded-2xl p-5 space-y-4 shadow-sm"
                    >
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-teal-600" /> New Procurement Requisition Order
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">Chemical Formulation Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Atorvastatin (40mg)"
                            value={newProcDrugName}
                            onChange={(e) => setNewProcDrugName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">Quantity Requisitioned</label>
                          <input
                            type="number"
                            required
                            min="1"
                            placeholder="e.g. 200"
                            value={newProcQty}
                            onChange={(e) => setNewProcQty(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">Physical Packaging Unit</label>
                          <select
                            value={newProcUnit}
                            onChange={(e) => setNewProcUnit(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                          >
                            <option value="tablets">tablets</option>
                            <option value="capsules">capsules</option>
                            <option value="vials">vials</option>
                            <option value="bottles">bottles</option>
                            <option value="packs">packs</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Procurement justification / notes</label>
                        <textarea
                          placeholder="Provide clinical reasons (e.g. High volume clinic day, state vaccine initiative)..."
                          value={newProcNotes}
                          onChange={(e) => setNewProcNotes(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 h-16 resize-none focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>

                      <div className="flex justify-end gap-3.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsAddingProcRequest(false)}
                          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-semibold text-slate-700 font-sans"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold"
                        >
                          Submit Requisition Order
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {/* Procurement Request list cards representing pipelines */}
                  {(() => {
                    const reqs = procurementRequests.filter(p => p.hospitalId === pharmacySelectedHospId);

                    if (reqs.length === 0) {
                      return (
                        <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white text-slate-400 text-xs italic">
                          No pipeline elements registered. Check back once inventory triggers have been crossed.
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reqs.map((req) => {
                          return (
                            <div key={req.id} className="bg-white border border-slate-205 p-5 rounded-2xl shadow-sm hover:border-slate-300/85 transition-all space-y-4 relative">
                              <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] text-slate-400 font-mono">
                                      ID: {req.id}
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-mono">
                                      Requested: {new Date(req.requestedAt).toLocaleDateString()}
                                    </span>
                                  </div>

                                  <h5 className="font-display font-bold text-slate-955 text-base">
                                    {req.drugName}
                                  </h5>

                                  <p className="text-teal-900 font-mono font-bold text-sm">
                                    Quantity: {req.quantityRequested} {req.unit}
                                  </p>
                                </div>

                                {/* STATUS BADGE */}
                                <div className="text-right shrink-0">
                                  <span className={cn(
                                    "px-2 py-1 rounded text-[9px] font-mono font-bold uppercase block border text-center select-none",
                                    req.status === "pending" 
                                      ? "bg-amber-55 border-amber-200 text-amber-800"
                                      : req.status === "ordered"
                                      ? "bg-blue-55 border-blue-250 text-blue-800"
                                      : "bg-emerald-55 border-emerald-250 text-emerald-800"
                                  )}>
                                    {req.status === "pending" && "⏳ Pending Reorder"}
                                    {req.status === "ordered" && "📦 Shipment Transit"}
                                    {req.status === "received" && "✅ Shipment Received"}
                                  </span>
                                </div>
                              </div>

                              <div className="bg-slate-50 border border-slate-150 p-3 rounded-lg text-xs leading-relaxed text-slate-655 italic">
                                {req.notes}
                              </div>

                              {req.status !== "received" && (
                                <div className="border-t border-slate-100 pt-3 flex justify-end gap-2 text-[10.5px]">
                                  {req.status === "pending" && (
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateProcurementStatus(req.id, "ordered")}
                                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-105 text-blue-850 border border-blue-200 rounded-lg font-semibold transition-all shadow-xs"
                                    >
                                      Authorize Reorder (Transit Shipment)
                                    </button>
                                  )}
                                  {req.status === "ordered" && (
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateProcurementStatus(req.id, "received")}
                                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-all shadow-sm"
                                    >
                                      Confirm Delivery (Credit Stock)
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Aesthetic pairing Humble Footer */}
      <footer className="bg-white border-t border-slate-200 mt-24 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p className="font-mono">
            © 2026 Nigerian Digital Hospital Portal • Secure Clinical Ecosystem V1.2
          </p>

          <p className="text-center md:text-right font-sans">
            Built for hospitals and citizens in Nigeria to track treatments, active prescriptions, and nearest blood centers.
          </p>
        </div>
      </footer>
    </div>
  );
}
