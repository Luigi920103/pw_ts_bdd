export const apiPaths = {
  Login: {
    auth: "/auth",
  },
  Booking: {
    ByID: "/booking/{id}",
  },
} as const

export type ApiPaths = typeof apiPaths

export type ExtractRouteParams<T extends string> =
  T extends `${infer _Start}{${infer Param}}${infer Rest}`
    ? Param | ExtractRouteParams<Rest>
    : never
