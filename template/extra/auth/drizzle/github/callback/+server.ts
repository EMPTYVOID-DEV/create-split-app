import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { db } from "$server/database/database";
import { keyTable } from "$server/database/schema";
import { fetchGithubUser, createSession } from "$lib/server/utils/authUtils";
import type { RequestEvent } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import { github } from "$lib/server/auth/github";
import type { GithubUser, key, user } from "$server/types.server";
import { insertUser } from "$lib/server/utils/databaseUtils";

export async function GET(event: RequestEvent): Promise<Response> {
  const code = event.url.searchParams.get("code");
  const state = event.url.searchParams.get("state");
  const storedState = event.cookies.get("github_oauth_state") ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUser: GithubUser = await fetchGithubUser(tokens);
    const userKey = await db.query.keyTable.findFirst({
      where: and(
        eq(keyTable.provider_name, "github"),
        eq(keyTable.provider_id, githubUser.id.toString())
      ),
    });

    if (userKey) {
      await createSession(event.cookies, userKey.userId);
    } else {
      const id = generateId(8);
      const newUser: user = {
        id,
        username: githubUser.login,
      };
      const key: key = {
        provider_name: "github",
        provider_id: githubUser.id.toString(),
        userId: id,
      };
      await insertUser(newUser, key);
      await createSession(event.cookies, id);
    }
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/account/dashboard",
      },
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
