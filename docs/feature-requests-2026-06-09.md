# Feature requests — user-testing feedback (2026-06-09)

Source: friend's hands-on testing of the native app (Expo Go). Analysed against the
codebase the same day; bucketed by effort/blocking decisions. Original comments in
Ukrainian, paraphrased.

## A. Quick correctness fixes

| # | Request | Code anchor | Notes |
|---|---------|-------------|-------|
| 3 | Hide ЧСЗ status for veteran stages (serving/leaving/out); keep only УБД + ОІВВ. ЧСЗ belongs to the family path only. | `native/app/onboarding/profile.tsx:69` renders all of `content/statuses.ts` unconditionally | Add `statusesForStage()` filter |
| 10 | "Я з родини ветерана" hint is wrong — path is *for* family members, not for a veteran helping family | `native/content/stages.ts:6` — hint "Допомога близькій людині" | Copy fix now; deeper fix is #11 |
| 6 | The "calendar" on Home is unexplained | It's the `StreakStrip` (daily streak), reads as a calendar | Caption it ("Серія — заходь щодня") or cut it |

## B. IA changes (small product decision, then build)

| # | Request | Notes |
|---|---------|-------|
| 5 | Restructure «Мої послуги»: «Всі послуги за категоріями» + «Збережені» (bookmarks). Шлях = base track; saved = self-curated extras (e.g. перекваліфікація for later) | Needs `savedServiceIds` in store + bookmark on the service info-card screen + segment split in `applications/index.tsx` |
| 13 | «Можливості»: region filter (e.g. Kyiv vet travelling to Vinnytsia) or geolocation | `content/regions.ts` exists; chips in `opportunities/index.tsx` are decorative-only; offers need a `region` field |
| 7 | Path steps should open explanation cards | `app/path.tsx` rows aren't tappable; route into the existing service info-card screen |
| 9 | «Активні місії» unclear; should open explanation card *before* completing | Home `MissionCard` currently completes + awards XP on tap (`(tabs)/index.tsx` handleComplete) |
| 8 | «Мій шлях»: page stage-by-stage (horizontal swipe / collapsible), not one long canvas | `app/path.tsx` renders all etapy stacked in one ScrollView |

## C. Bigger / content- or decision-dependent

| # | Request | Notes |
|---|---------|-------|
| 1 | Onboarding intro screen: why we ask, what happens next, whether answers are editable later | No intro before `onboarding/stage.tsx`; answers are currently write-once — implies an editable Profile/Settings screen |
| 11 | Family path needs its own onboarding criteria — health/injury questions are about the veteran, wrong to ask the family member | `family` stage currently flows through the same `health.tsx` etc.; needs own question set (relationship, fallen→ЧСЗ, children) + `buildPath` branch |
| 2 | «Ще служу» vs «Звільняюсь найближчим часом» overlap. Proposal: «Ще служу» = purely informational/preparatory; demobilisation = its own path; or merge them | **Decision needed** before touching path logic |
| 12 | «Що вас цікавить» (interests) leads nowhere — e.g. sport should lead to a sport-events calendar | Interests collected in `onboarding/interests.tsx` but drive no destination; needs content per interest |
| 4 | Feminitives: all-or-nothing consistency | Mixed today ("звільнився / звільнилась" vs masculine-default greeting). **Decision needed** on convention |
| 14 | Accessibility: contrast + text-size audit; consider a «Маю порушення зору» mode unlocking TTS/voice-over flows | (a) token audit vs WCAG is cheap, do first; (b) TTS mode is a real feature |

## Status

- 2026-06-09: logged. None implemented yet — parked in favour of tab-swipe navigation work.
