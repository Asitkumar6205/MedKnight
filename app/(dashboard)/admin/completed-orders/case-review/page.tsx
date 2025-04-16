import { Suspense } from "react";
import CaseReview from "../_components/CaseReview";

function Page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <CaseReview />
      </Suspense>
    </div>
  );
}

export default Page;