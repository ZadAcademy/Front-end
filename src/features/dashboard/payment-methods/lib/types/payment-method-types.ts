/**
 * Country Payment Method — API Response Model
 */
export interface CountryPaymentMethodResponse {
  id: string;                     // Guid
  countryCode: string;            // ISO country code, UPPERCASE, max 5 chars (e.g. "EG", "SA")
  title: string;                  // Display title (e.g. "Vodafone Cash", "Bank Transfer")
  accountIdentifier: string;      // Account number / wallet / IBAN
  instructionDescription: string; // Step-by-step payment instructions
  logoUrl: string;                // Absolute URL of the uploaded logo image
}

/**
 * Payload for creating a payment method (maps to FormData fields)
 */
export interface CreatePaymentMethodPayload {
  countryCode: string;
  title: string;
  accountIdentifier: string;
  instructionDescription: string;
  logo: File;
}

/**
 * Payload for updating a payment method (maps to FormData fields)
 * logo is optional — omit to keep the existing logo.
 */
export interface UpdatePaymentMethodPayload {
  id: string;
  countryCode: string;
  title: string;
  accountIdentifier: string;
  instructionDescription: string;
  logo?: File | null;
}
