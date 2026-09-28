import {
  addApplication,
  type SpecialRegistrationApplication,
  type SRDocument,
  type SRDocCategory,
} from "./repositories/specialRegistrationRepository";
import type { PassportHolderType } from "../components/special-registration/SpecialRegistrationForm";
import type { CountryCode } from "../data/countryOptions";

export type { PassportHolderType };

export interface SpecialRegAttachments {
  nid: File[];
  passport: File[];
  visa: File[];
  departure: File[];
}

export interface SpecialRegPayload {
  applicantName: string;
  nidNumber: string;
  tin: string;
  passportType: PassportHolderType;
  countryCode: CountryCode;
  country: string;
  address: string;
  phone: string; // E.164
  departureDate: string;
  email: string;
  attachments: SpecialRegAttachments;
  declarationAccepted: true;
  submittedAt: string;
}

export interface SpecialRegResult {
  applicationNumber: string;
  submittedAt: string;
  status: "Pending";
  email: string;
}

function generateApplicationNumber(): string {
  const today = new Date();
  const yyyymmdd = today.toISOString().slice(0, 10).replace(/-/g, "");
  const seq = String(Math.floor(1000 + Math.random() * 9000));
  return `SR-NRB-${yyyymmdd}-${seq}`;
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function filesToDocs(files: File[], category: SRDocCategory, submittedAt: string): SRDocument[] {
  return files.map(file => ({
    id: makeId(),
    category,
    file,
    uploadedAt: submittedAt,
  }));
}

// Build FormData so real files can be sent when a backend is available.
function buildFormData(payload: SpecialRegPayload): FormData {
  const fd = new FormData();
  fd.append("applicantName", payload.applicantName);
  fd.append("nidNumber", payload.nidNumber);
  fd.append("tin", payload.tin);
  fd.append("passportType", payload.passportType);
  fd.append("countryCode", payload.countryCode);
  fd.append("country", payload.country);
  fd.append("address", payload.address);
  fd.append("phone", payload.phone);
  fd.append("departureDate", payload.departureDate);
  fd.append("email", payload.email);
  fd.append("declarationAccepted", String(payload.declarationAccepted));
  fd.append("submittedAt", payload.submittedAt);
  payload.attachments.nid.forEach(f => fd.append("nid", f));
  payload.attachments.passport.forEach(f => fd.append("passport", f));
  payload.attachments.visa.forEach(f => fd.append("visa", f));
  payload.attachments.departure.forEach(f => fd.append("departure", f));
  return fd;
}

export async function submitSpecialRegistration(
  payload: SpecialRegPayload,
): Promise<SpecialRegResult> {
  // Build FormData (ready for real API — not sent in this mock)
  buildFormData(payload);

  // Mock network delay
  await new Promise<void>(resolve => setTimeout(resolve, 1500));

  const applicationNumber = generateApplicationNumber();
  const id = makeId();
  const now = payload.submittedAt;

  const documents: SRDocument[] = [
    ...filesToDocs(payload.attachments.nid, "NID_OR_SMART_ID", now),
    ...filesToDocs(payload.attachments.passport, "PASSPORT_BIO_PAGE", now),
    ...filesToDocs(payload.attachments.visa, "VISA_OR_RESIDENCE_PAGE", now),
    ...filesToDocs(payload.attachments.departure, "LATEST_DEPARTURE_SEAL", now),
  ];

  const app: SpecialRegistrationApplication = {
    id,
    applicationNumber,
    applicantName: payload.applicantName,
    nidNumber: payload.nidNumber,
    tin: payload.tin,
    passportType: payload.passportType,
    countryCode: payload.countryCode,
    country: payload.country,
    address: payload.address,
    phone: payload.phone,
    departureDate: payload.departureDate,
    email: payload.email,
    documents,
    declarationAccepted: true,
    declarationTimestamp: now,
    submittedAt: now,
    status: "PENDING_REVIEW",
    decisionHistory: [
      {
        decisionType: "SUBMITTED",
        previousStatus: null,
        newStatus: "PENDING_REVIEW",
        officerId: "citizen",
        officerName: payload.applicantName,
        officerDesignation: "Applicant",
        timestamp: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  addApplication(app);

  return {
    applicationNumber,
    submittedAt: now,
    status: "Pending",
    email: payload.email,
  };
}
