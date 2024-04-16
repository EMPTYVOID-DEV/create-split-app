import { lucia } from "$server/auth/lucia";
import type { Cookies } from "@sveltejs/kit";
import type { GitHubTokens } from "arctic";

export async function createSession(cookies: Cookies, id: string) {
  const session = await lucia.createSession(id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies.set(sessionCookie.name, sessionCookie.value, {
    ...sessionCookie.attributes,
    path: "/",
  });
}

export async function fetchGithubUser(tokens: GitHubTokens) {
  const githubUserResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
    },
  });
  return githubUserResponse.json();
}
