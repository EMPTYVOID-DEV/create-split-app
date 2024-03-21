import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { db } from "$lib/database/database";
import { userTable } from "$lib/database/schema";
import {
  fetchGithubEmail,
  fetchGithubUser,
  createSession,
} from "$lib/utils/authUtils";
import type { RequestEvent } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { github } from "$lib/auth/github";

type GithubUser = {
  id: number;
  login: string;
  email: string;
};

type GithubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
};

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
    const existingUser = await db.query.userTable.findFirst({
      where: eq(userTable.github_id, githubUser.id),
    });

    if (existingUser) {
      await createSession(
        event.cookies,
        {
          httpOnly: true,
          path: "/",
        },
        existingUser.id
      );
    } else {
      const githubEmail: GithubEmail[] = await fetchGithubEmail(tokens);
      const primaryEmail = githubEmail.find((el) => el.primary);
      const userId = generateId(12);
      await db.insert(userTable).values({
        id: userId,
        github_id: githubUser.id,
        username: githubUser.login,
        email: primaryEmail.email,
      });
      await createSession(
        event.cookies,
        {
          httpOnly: true,
          path: "/",
        },
        userId
      );
    }
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
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
