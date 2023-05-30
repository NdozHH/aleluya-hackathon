import { getSession } from "@/session";
import type { LoaderArgs } from "@remix-run/node";
export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const authToken = session.get("authToken");

  console.log("authTken", authToken);

  return {
    authToken,
  };
}

export default function Payroll() {
  return (
    <div className="h-full">
      <h3>Payroll route</h3>
    </div>
  );
}
