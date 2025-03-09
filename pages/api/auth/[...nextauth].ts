import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // ...add more providers here
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('SignIn Callback:', { user, account, profile });
      return true;
    },
    async session({ session, token, user }: any) {
      console.log('Session Callback:', { session, token, user });
      session.user.username = session?.user?.name
        .split(" ")
        .join("")
        .toLocaleLowerCase();

      session.user.uid = token.sub;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  logger: {
    error: (code, ...message) => {
      console.error(code, ...message);
    },
    warn: (code, ...message) => {
      console.warn(code, ...message);
    },
    debug: (code, ...message) => {
      console.debug(code, ...message);
    },
  },
});
