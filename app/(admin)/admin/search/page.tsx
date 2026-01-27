import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function AdminSearchPage() {
  return (
    <Suspense fallback={<div>Loading search…</div>}>
      <SearchClient />
    </Suspense>
  );
}
