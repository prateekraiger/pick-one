import * as React from "react";
import { Suspense } from "react";

import { HomeClient } from "@/components/HomeClient";

/**
 * Server component wrapper — `useSearchParams` (used by HomeClient to
 * hydrate shared setups from the `?s=` query param) requires a Suspense
 * boundary for static rendering in the Next.js App Router.
 */
export default function Home(): React.ReactElement {
  return (
    <Suspense fallback={null}>
      <HomeClient />
    </Suspense>
  );
}
