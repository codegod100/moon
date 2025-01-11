import {
	generateRegistrationOptions,
	verifyRegistrationResponse,
} from "@simplewebauthn/server";
import type {
	AuthenticatorTransportFuture,
	CredentialDeviceType,
	Base64URLString,
} from "@simplewebauthn/server";
/**
 * Human-readable title for your website
 */
const rpName = "SimpleWebAuthn Example";
/**
 * A unique identifier for your website. 'localhost' is okay for
 * local dev
 */
const rpID = "buildbox.tailfe3ae2.ts.net";
/**
 * The URL at which registrations and authentications should occur.
 * 'http://localhost' and 'http://localhost:PORT' are also valid.
 * Do NOT include any trailing /
 */
type UserModel = {
	id: any;
	username: string;
};
export type Passkey = {
	// SQL: Store as `TEXT`. Index this column
	id: Base64URLString;
	// SQL: Store raw bytes as `BYTEA`/`BLOB`/etc...
	//      Caution: Node ORM's may map this to a Buffer on retrieval,
	//      convert to Uint8Array as necessary
	publicKey: Uint8Array;
	// SQL: Foreign Key to an instance of your internal user model
	user: UserModel;
	// SQL: Store as `TEXT`. Index this column. A UNIQUE constraint on
	//      (webAuthnUserID + user) also achieves maximum user privacy
	webauthnUserID: Base64URLString;
	// SQL: Consider `BIGINT` since some authenticators return atomic timestamps as counters
	counter: number;
	// SQL: `VARCHAR(32)` or similar, longest possible value is currently 12 characters
	// Ex: 'singleDevice' | 'multiDevice'
	deviceType: CredentialDeviceType;
	// SQL: `BOOL` or whatever similar type is supported
	backedUp: boolean;
	// SQL: `VARCHAR(255)` and store string array as a CSV string
	// Ex: ['ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb']
	transports?: AuthenticatorTransportFuture[];
};
const origin = `http://${rpID}`;
const user = { username: "foo" };
const userPasskeys: Passkey[] = [];
export const options: PublicKeyCredentialCreationOptionsJSON =
	await generateRegistrationOptions({
		rpName,
		rpID,
		userName: user.username,
		// Don't prompt users for additional information about the authenticator
		// (Recommended for smoother UX)
		attestationType: "none",
		// Prevent users from re-registering existing authenticators
		excludeCredentials: userPasskeys.map((passkey) => ({
			id: passkey.id,
			// Optional
			transports: passkey.transports,
		})),
		// See "Guiding use of authenticators via authenticatorSelection" below
		authenticatorSelection: {
			// Defaults
			residentKey: "preferred",
			userVerification: "preferred",
			// Optional
			authenticatorAttachment: "platform",
		},
	});
