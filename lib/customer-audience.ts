import type { MediaAudience } from "./media-storage";

export function isAuthenticatedCustomer(request: Request) {
  const cookie = request.headers.get("cookie")?.split(";").map((item) => item.trim()).find((item) => item.startsWith("hunibangun_customer_session="));
  return Boolean(cookie && cookie.slice("hunibangun_customer_session=".length));
}

export function audienceAllows(audience: MediaAudience, authenticated: boolean) {
  // Paid assets are intentionally not exposed by the public catalog/media URL.
  // The paid package/download flow must grant access explicitly after payment.
  if (audience === "HIDDEN" || audience === "PAID") return false;
  if (audience === "ALL") return true;
  return authenticated ? audience === "AUTHENTICATED" : audience === "GUEST";
}
