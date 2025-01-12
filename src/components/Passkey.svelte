<script lang="ts">
	import {
		startRegistration,
		startAuthentication,
	} from "@simplewebauthn/browser";
	import { onMount } from "svelte";
	import { actions } from "astro:actions";
	import { type Passkey } from "../passkeys/registration";
	import confetti from "canvas-confetti";
	let verified = $state(false);

	import { encodeBase64 } from "@std/encoding/base64";
	onMount(async () => {});
</script>

{#if verified}
	<h1>Successfully verified</h1>
{/if}

<button
	id="authenticate"
	onclick={async () => {
		const passkey = await actions.getPasskey().then((r) => r.data.value);
		console.log({ passkey });
		const authOptions = await actions
			.generateAuthenticationOptions()
			.then((r) => r.data);
		console.log({ authOptions });
		const auth = await startAuthentication(authOptions);
		console.log({ auth });
		const verification = await actions
			.verifyAuthenticationResponse({
				authentication: auth,
				options: authOptions,
			})
			.then((r) => r.data);
		console.log({ verification });
		if (verification.verified) {
			verified = true;
			confetti();
		}
	}}>authenticate</button
>

<button
	id="register"
	onclick={async () => {
		const options = await actions
			.generateRegistrationOptions()
			.then((r) => r.data);
		console.log({ options });
		const registration = await startRegistration(options);
		console.log({ registration });
		const verification = await actions
			.verifyRegistrationResponse({
				registration,
				options,
			})
			.then((r) => r.data);
		console.log({ verification });
		const registrationInfo = verification.registrationInfo;
		console.log({ registrationInfo });

		const id = encodeBase64(registrationInfo.credentialID);
		console.log({ id });
		const publicKey = encodeBase64(registrationInfo.credentialPublicKey);
		console.log({ publicKey });

		const passkey: Passkey = {
			id,
			publicKey,
			user: { username: "foo", id: 42 },
			webauthnUserID: options.user.id,
			counter: registrationInfo.counter,
			deviceType: registrationInfo.credentialDeviceType,
			backedUp: registrationInfo.credentialBackedUp,
		};
		console.log({ passkey });
		await actions.storePasskey(passkey);
	}}>register</button
>
