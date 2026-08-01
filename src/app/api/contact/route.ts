import { NextRequest } from "next/server";
import { handleContactRequest } from "@/lib/services/contact";
import { success, failure } from "@/lib/api/response";
import { MAX_PAYLOAD_SIZE } from "@/lib/domain/contact";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");
    if (contentType && !contentType.includes("application/json")) {
      return failure("Expected application/json", 415);
    }

    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_SIZE) {
      return failure("Request body too large", 413);
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return failure("Invalid JSON in request body", 400);
    }

    const result = await handleContactRequest({ body, ip });

    if (!result.success) {
      return failure(result.message, result.status, result.errors);
    }

    return success(result.message);
  } catch (error) {
    logger.error("Unhandled contact route error", { error: String(error) });
    return failure("Something went wrong. Please try again later.", 500);
  }
}
