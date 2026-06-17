import { CareersSection } from "../components/CareersSection";
import { JobApplicationForm } from "../components/JobApplicationForm";

export function CareersPage() {
  return (
    <>
      <CareersSection ctaHref="#application" />
      <JobApplicationForm />
    </>
  );
}
