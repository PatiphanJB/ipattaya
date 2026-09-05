import { cookies, headers } from 'next/headers';

import { DEV_USER_ID } from './container.ts';

/**
 * Who is making this request.
 *
 * There is no real authentication yet. Firebase Auth (phone number, which is
 * the identity Vietnamese users actually have) replaces the body of
 * `currentUserId` and nothing above it changes, because callers only ever see
 * "a user id or null".
 *
 * The development shortcut below is fenced by NODE_ENV rather than by a flag
 * someone could forget to unset: in production this function has exactly one
 * behaviour, which is to find no user until real auth is wired in. An
 * authentication bypass that is merely configured off is an authentication
 * bypass.
 */

const DEV_USER_HEADER = 'x-dev-user-id';
const DEV_USER_COOKIE = 'dev_user_id';

export async function currentUserId(): Promise<string | null> {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const headerList = await headers();
  const fromHeader = headerList.get(DEV_USER_HEADER);
  if (fromHeader) return fromHeader;

  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(DEV_USER_COOKIE)?.value;
  if (fromCookie) return fromCookie;

  return DEV_USER_ID;
}
