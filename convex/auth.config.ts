export default {
  providers: [
    {
      domain: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL,
      applicationID: "convex", // Must match the `aud` claim in the JWT template
    },
  ],
}
