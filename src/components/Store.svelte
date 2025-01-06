<script>
  import { user, t_string } from "../store/user.ts";
</script>

<div class="text-xl">
  <img src={$user.avatar} class="max-w-40" /> Hello my name is {$user.name}, I
  am {$user.age} years old.
</div>
