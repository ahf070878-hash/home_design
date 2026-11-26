import type { NextRequest } from "next/server";
import type { MediaAudience } from "./media-storage";

export function isAuthenticatedCustomer(request: NextRequest) {
  return Boolean(request.cookies.get("hunibangun_customer_session")?.value);
}

export function audienceAllows(audience: MediaAudience, authenticated: boolean) {
  if (audience === "HIDDEN") return false;
  if (audience === "ALL") return true;
  return authenticated ? audience === "AUTHENTICATED" : audience === "GUEST";
}
