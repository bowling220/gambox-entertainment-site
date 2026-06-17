import {
  collection,
  deleteField,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
  type DocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "./firebase";

export type JobApplicationStatus = "pending" | "accepted" | "declined";

export type JobApplicationInput = {
  name: string;
  contact: string;
  role: string;
  robloxUsername: string;
  portfolioUrl: string;
  experience: string;
  reason: string;
};

export type JobApplication = JobApplicationInput & {
  id: string;
  applicantUid: string;
  applicantEmail: string;
  status: JobApplicationStatus;
  createdAt?: {
    seconds: number;
  } | null;
  updatedAt?: {
    seconds: number;
  } | null;
  reviewedAt?: {
    seconds: number;
  } | null;
  reviewedBy?: string;
};

function toJobApplication(snapshot: DocumentSnapshot<DocumentData>): JobApplication {
  const data = snapshot.data() ?? {};

  return {
    id: snapshot.id,
    applicantUid: String(data.applicantUid ?? snapshot.id),
    applicantEmail: String(data.applicantEmail ?? ""),
    name: String(data.name ?? ""),
    contact: String(data.contact ?? ""),
    role: String(data.role ?? ""),
    robloxUsername: String(data.robloxUsername ?? ""),
    portfolioUrl: String(data.portfolioUrl ?? ""),
    experience: String(data.experience ?? ""),
    reason: String(data.reason ?? ""),
    status: data.status === "accepted" || data.status === "declined" ? data.status : "pending",
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
    reviewedAt: data.reviewedAt ?? null,
    reviewedBy: typeof data.reviewedBy === "string" ? data.reviewedBy : undefined,
  };
}

function cleanApplication(application: JobApplicationInput) {
  return {
    name: application.name.trim(),
    contact: application.contact.trim(),
    role: application.role.trim(),
    robloxUsername: application.robloxUsername.trim(),
    portfolioUrl: application.portfolioUrl.trim(),
    experience: application.experience.trim(),
    reason: application.reason.trim(),
  };
}

export function watchApplicantApplication(
  applicantUid: string,
  onUpdate: (application: JobApplication | null) => void,
  onError: (message: string) => void,
): Unsubscribe {
  return onSnapshot(
    doc(db, "jobApplications", applicantUid),
    (snapshot) => onUpdate(snapshot.exists() ? toJobApplication(snapshot) : null),
    (error) => onError(error.message),
  );
}

export function saveJobApplication(applicant: User, application: JobApplicationInput, existingApplication: JobApplication | null) {
  const applicationRef = doc(db, "jobApplications", applicant.uid);
  const cleanedApplication = cleanApplication(application);
  const applicantEmail = applicant.email?.trim() ?? "";

  if (!applicantEmail || applicant.isAnonymous) {
    return Promise.reject(new Error("Sign in with email before submitting an application."));
  }

  if (existingApplication?.status === "accepted") {
    return Promise.reject(new Error("Accepted applications cannot be changed."));
  }

  if (existingApplication?.status === "pending") {
    return updateDoc(applicationRef, {
      ...cleanedApplication,
      updatedAt: serverTimestamp(),
    });
  }

  return setDoc(applicationRef, {
    ...cleanedApplication,
    applicantUid: applicant.uid,
    applicantEmail,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function watchJobApplications(onUpdate: (items: JobApplication[]) => void, onError: (message: string) => void): Unsubscribe {
  const applicationsQuery = query(collection(db, "jobApplications"), orderBy("createdAt", "desc"));

  return onSnapshot(
    applicationsQuery,
    (snapshot) => onUpdate(snapshot.docs.map(toJobApplication)),
    (error) => onError(error.message),
  );
}

export function updateJobApplicationStatus(applicationId: string, status: JobApplicationStatus, reviewer: User) {
  const reviewedBy = reviewer.email || reviewer.displayName || reviewer.uid;

  if (status === "pending") {
    return updateDoc(doc(db, "jobApplications", applicationId), {
      status,
      reviewedAt: deleteField(),
      reviewedBy: deleteField(),
      updatedAt: serverTimestamp(),
    });
  }

  return updateDoc(doc(db, "jobApplications", applicationId), {
    status,
    reviewedAt: serverTimestamp(),
    reviewedBy,
    updatedAt: serverTimestamp(),
  });
}

export function deleteJobApplication(applicationId: string) {
  return deleteDoc(doc(db, "jobApplications", applicationId));
}
