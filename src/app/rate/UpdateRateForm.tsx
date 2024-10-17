"use client";

import { handleRateRefresh } from "./actions";

// import { useTransition } from "react";

export default function UpdateRateForm() {
  // const [isPending, startTransition] = useTransition();

  return (
    <form action={handleRateRefresh}>
      <button
        className="button"
        // disabled={isPending}
        type="submit"
      >
        {/* {isPending ? "Updating..." : "Update Exchange rate"} */}
        Update Exchange rate
      </button>
    </form>
  );
}
