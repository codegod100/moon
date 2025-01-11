import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { db, User, eq, Post } from "astro:db";
import { options, type Passkey, rpID } from "../passkeys/registration";
import PasskeyComp from "../components/Passkey.svelte";
import "@std/dotenv/load";
import {
	generateAuthenticationOptions,
	verifyRegistrationResponse,
	type VerifyRegistrationResponseOpts,
} from "@simplewebauthn/server";
const kv = await Deno.openKv();

export const server = {
	storePasskey: defineAction({
		handler: async (passkey: Passkey) => {
			await kv.set(["passkey"], passkey);
		},
	}),
	getPasskey: defineAction({
		handler: async () => {
			const passkey = await kv.get(["passkey"]);
			return passkey;
		},
	}),
	generateAuthenticationOptions: defineAction({
		handler: async () => {
			const passkey = await kv.get(["passkey"]);
			return await generateAuthenticationOptions({
				rpID,
				allowCredentials: [{ id: passkey.id, type: "public-key" }],
			});
		},
	}),

	generateRegistrationOptions: defineAction({
		handler: async () => {
			return options;
		},
	}),
	verifyRegistrationResponse: defineAction({
		handler: async ({ registration, options }) => {
			const expectedChallenge = options.challenge;
			const expectedRPID = options.rp.id;
			const expectedOrigin = `https://${expectedRPID}`;
			console.log({ expectedOrigin });

			return await verifyRegistrationResponse({
				response: registration,
				expectedChallenge,
				expectedOrigin,
				expectedRPID,
			});
		},
	}),
	insertUser: defineAction({
		input: z.object({ username: z.string() }),
		handler: async (input) => {
			return await db.insert(User).values({ username: input.username });
		},
	}),
	getUsers: defineAction({
		handler: async () => {
			return await db.select().from(User).all();
		},
	}),
	deleteUser: defineAction({
		input: z.object({ id: z.number() }),
		handler: async (input) => {
			console.log("delete");
			return await db.delete(User).where(eq(User.id, input.id));
		},
	}),
	createPost: defineAction({
		input: z.object({ title: z.string(), content: z.string() }),
		handler: async (input) => {
			return await db
				.insert(Post)
				.values({ title: input.title, content: input.content });
		},
	}),
	getPosts: defineAction({
		handler: async () => {
			return await db.select().from(Post).all();
		},
	}),
	deletePost: defineAction({
		input: z.object({ id: z.number() }),
		handler: async (input) => {
			return await db.delete(Post).where(eq(Post.id, input.id));
		},
	}),
};
