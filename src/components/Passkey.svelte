<script lang="ts">
	import { startRegistration } from "@simplewebauthn/browser";
	import { onMount } from "svelte";
	import { actions } from "astro:actions";
	import { type Passkey } from "../passkeys/registration";
	onMount(async () => {

	});
</script>

<button id="authenticate" onclick={async () =>{
	const passkey = await actions.getPasskey().then((r) => r.data.value);
	console.log({ passkey });
const authOptions = await actions.generateAuthenticationOptions().then((r) => r.data);
console.log({ authOptions });


}}>authenticate</button>

<button
	id="register"
	onclick={async () => {
		const options = await actions
			.generateRegistrationOptions()
			.then((r) => r.data);
		console.log({ options });
		const registration = await startRegistration(options);
		console.log(registration);
		const verification = await actions
			.verifyRegistrationResponse({
				registration,
				options,
			})
			.then((r) => r.data);
		console.log({ verification });
		const registrationInfo = verification.registrationInfo;
		console.log({ registrationInfo });

		const passkey: Passkey = {
			id: registrationInfo.credentialID,
			publicKey: registrationInfo.credentialPublicKey,
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
