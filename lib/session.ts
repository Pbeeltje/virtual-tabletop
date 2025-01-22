import type { IronSessionOptions } from "iron-session"
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from "next"

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: "virtual-tabletop-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
}

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions)
}

export function withSessionSsr<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
  handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
  return withIronSessionSsr(handler, sessionOptions)
}

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number
      username: string
      role: "DM" | "player"
    }
  }
}

