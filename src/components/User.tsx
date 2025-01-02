import { useStore } from "@nanostores/preact";
import { $user, $t_string } from "../store/user.ts";
export default function () {
  const user = useStore($user);
  const t_string = useStore($t_string);
  return (
    <>
      <div>{t_string}</div>
      <div>
        {user.name} {user.username} age {user.age} &lt;{user.email}&gt;{" "}
        <div>
          <pre>{user.commit}</pre>
        </div>
      </div>
    </>
  );
}
