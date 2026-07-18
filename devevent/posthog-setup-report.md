# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Dev Event hub project. PostHog is now initialized client-side via `instrumentation-client.ts` (the Next.js 15.3+ recommended approach), with a reverse proxy configured in `next.config.ts` to route analytics traffic through `/ingest` — avoiding ad blockers. Two client-side events are tracked: one when users click the hero Explore button, and one when users click Learn More on any featured event card. A new `EventLearnMoreBtn` client component was created to enable tracking on the server-rendered event list, and `lib/posthog-server.ts` was added as a ready-to-use server-side PostHog client for future API routes.

| Event name | Description | File |
|---|---|---|
| `explore_clicked` | User clicked the Explore button on the hero section to scroll to featured events. | `components/ExploreBtn.tsx` |
| `learn_more_clicked` | User clicked the Learn More button on a featured event card (property: `event_id`). | `components/EventLearnMoreBtn.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://eu.posthog.com/project/227379/dashboard/831697)
- [Explore button clicks (wizard)](https://eu.posthog.com/project/227379/insights/dTGpmmzW)
- [Learn More clicks by event (wizard)](https://eu.posthog.com/project/227379/insights/QykZUaNP)
- [Explore to Learn More funnel (wizard)](https://eu.posthog.com/project/227379/insights/HkG7rI9f)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
