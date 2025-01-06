import { atom, computed, onMount } from "nanostores";
import { factory } from "@findhow/zod-factory";
import { z } from "zod";
import { Faker, faker } from "@faker-js/faker";

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().int().positive(),
  username: z.string(),
  commit: z.string(),
  avatar: z.string(),
});

async function avatar(faker: Faker) {
  const url = faker.image.avatar();
  const response = await fetch(url).catch((e) => {
    console.log({ e, url });
    return new Response(null, { status: 404 });
  });
  if (!response.ok) {
    return await avatar(faker);
  }
  return url;
}

const UserFactory = factory(UserSchema, (faker) => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  age: faker.number.int({ min: 18, max: 99 }),
  username: faker.internet.userName(),
  commit: faker.git.commitEntry(),
  avatar: "",
}));

type User = z.infer<typeof UserSchema>;
async function newUser(name?: string) {
  const u = name ? UserFactory.create({ name }) : UserFactory.create();
  u.avatar = await avatar(faker);
  return u;
}
export const user = atom<User>(await newUser());
export const time = atom(Date.now());
export const t_string = computed(time, (time) =>
  new Date(time).toLocaleTimeString()
);

onMount(time, () => {
  const int = setInterval(async () => {
    time.set(Date.now());
    user.set(await newUser());
  }, 1000);
  return () => {
    clearInterval(int);
  };
});
