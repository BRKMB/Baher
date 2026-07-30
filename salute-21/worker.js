/**
 * Thin Worker so SPA routes (/menu, /reserve, …) always resolve
 * through the Assets binding with not_found_handling = SPA.
 */
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request)
  },
}
