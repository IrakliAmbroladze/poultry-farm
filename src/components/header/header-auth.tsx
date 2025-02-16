import { signOut } from "@/utils/supabase/actions";
import { createClient } from "@/utils/supabase/server";
import { PowerIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/ui/fonts";
import Link from "next/link";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div
      className={`${lusitana.className} flex dark:text-white text-black items-center gap-4`}
    >
      <Link href={"/profile"} className="text-xs sm:text-base">
        {user?.user_metadata?.user_name || user.email}
      </Link>

      <form action={signOut} className="flex items-center">
        <button type="submit">
          <PowerIcon className="w-4" />
        </button>
      </form>
    </div>
  ) : (
    <div
      className={`${lusitana.className} flex gap-2 dark:text-white text-black`}
    >
      <button>
        <Link data-cy="sign-in" href="/sign-in"></Link>
      </button>
      <button>
        <Link href="/sign-up"></Link>
      </button>
    </div>
  );
}
