import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { db } from "$lib/server/database/database";
import { fetchGithubUser, createSession } from "$lib/server/utils/authUtils";
import type { RequestEvent } from "@sveltejs/kit";
import { github } from "$lib/server/auth/github";

type GithubUser = {
  id: number;
  login: string;
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
    const userKey = await db.key.findUnique({
      where: {
        provider_id_provider_name: {
          provider_id: githubUser.id.toString(),
          provider_name: "github",
        },
      },
    });

    if (userKey) {
      await createSession(event.cookies, userKey.userId);
    } else {
      const id = generateId(8);
      await db.user.create({
        data: {
          id,
          username: githubUser.login,
          Key: {
            create: {
              provider_name: "github",
              provider_id: githubUser.id.toString(),
            },
          },
        },
      });

      await createSession(event.cookies, id);
    }
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/account",
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
