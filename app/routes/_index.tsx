import { Button } from "@/components/ui/button";
import { commitSession, getSession } from "@/session";
import {
  type V2_MetaFunction,
  type LoaderArgs,
  type ActionArgs,
  redirect,
} from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Hackathon" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const authToken = session.get("authToken");

  return {
    withLogin: !!authToken,
  };
}

export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const credentials = `${process.env.EMAIL}:${process.env.PASSWORD}`;
  const buffer = new Buffer(credentials);
  const data = buffer.toString("base64");

  const response = await fetch(`${process.env.API_URL}/sessions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${data}`,
    },
  });
  const result = await response.json();

  if (!result.data.token) {
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  session.set("authToken", result.data.token);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Index() {
  const fetcher = useFetcher();
  const loaderData = useLoaderData<typeof loader>();

  function handleLogin() {
    fetcher.submit(null, {
      method: "POST",
    });
  }

  return (
    <div className="h-full flex items-center justify-center flex-col gap-4">
      <Button onClick={handleLogin}>Login</Button>
      {loaderData.withLogin ? (
        <div className="flex flex-col gap-4">
          <Link prefetch="intent" to="/payroll">
            Ir a Payroll
          </Link>
          <Link prefetch="intent" to="/workers">
            Ir a Workers
          </Link>
        </div>
      ) : null}
    </div>
  );
}
