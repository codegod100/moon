<script lang="ts">
	import { startRegistration } from "@simplewebauthn/browser";
	import { onMount } from "svelte";
	import { actions } from "astro:actions";
	import { type Passkey } from "../passkeys/registration";
	onMount(async () => {

	});
</script>

<button
	id="register"
	onclick={async () => {
		const options = await actions
			.generateRegistrationOptions()
			.then((r) => r.data);
		const processed: PublicKeyCredentialCreationOptionsJSON =
			JSON.parse(options);
		console.log({ processed });
		const registration = await startRegistration(processed);
		console.log(registration);
		const verification = await actions
			.verifyRegistrationResponse({
				registration: JSON.stringify(registration),
				options: JSON.stringify(processed),
			})
			.then((r) => r.data);
		console.log({ verification });
		const registrationInfo = JSON.parse(verification).registrationInfo;
		console.log({ registrationInfo });

		const passkey: Passkey = {
			id: registrationInfo.credentialID,
			publicKey: registrationInfo.credentialPublicKey,
			user: { username: "foo", id: 42 },
			webauthnUserID: processed.user.id,
			counter: registrationInfo.counter,
			deviceType: registrationInfo.credentialDeviceType,
			backedUp: registrationInfo.credentialBackedUp,
		};
		console.log({ passkey });
		await actions.storePasskey(passkey);
	}}>register</button
>
