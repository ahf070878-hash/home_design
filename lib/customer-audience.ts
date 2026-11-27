import type { NextRequest } from "next/server";
import type { MediaAudience } from "./media-storage";

export function isAuthenticatedCustomer(request: NextRequest) {
  return Boolean(request.cookies.get("hunibangun_customer_session")?.value);
}

export function audienceAllows(audience: MediaAudience, authenticated: boolean) {
  // Paid assets are intentionally not exposed by the public catalog/media URL.
  // The paid package/download flow must grant access explicitly after payment.
  if (audience === "HIDDEN" || audience === "PAID") return false;
  if (audience === "ALL") return true;
  return authenticated ? audience === "AUTHENTICATED" : audience === "GUEST";
}
