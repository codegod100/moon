import { atom, computed, onMount } from "nanostores";
import { factory } from "@findhow/zod-factory";
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().int().positive(),
  username: z.string(),
  commit: z.string(),
});

const UserFactory = factory(UserSchema, (faker) => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  age: faker.number.int({ min: 18, max: 99 }),
  username: faker.internet.userName(),
  commit: faker.git.commitEntry(),
}));

type User = z.infer<typeof UserSchema>;

export const $user = atom<User>(UserFactory.create());
export const $time = atom(Date.now());
export const $t_string = computed($time, (time) =>
  new Date(time).toLocaleTimeString()
);

onMount($time, () => {
  const int = setInterval(() => {
    $time.set(Date.now());
    $user.set(UserFactory.create());
  }, 1000);
  return () => {
    clearInterval(int);
  };
});
