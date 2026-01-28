export const apiPaths = {
  Login: {
    auth: "/auth",
  },
  Booking: {
    ByID: "/booking/{id}",
  },
} as const

export type ApiPaths = typeof apiPaths
