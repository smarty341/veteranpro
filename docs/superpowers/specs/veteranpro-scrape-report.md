# veteranpro.gov.ua — real service-data scrape report

Date: 2026-06-07. Source: live production API of **veteranpro.gov.ua** (the user's own site).
Output: `/root/app/native/content/services.scraped.json` — 39 `Article` objects, all real data, no fabrication.

## How the site works

`veteranpro.gov.ua` is an Angular SPA. All content is loaded client-side from a REST API.
`WebFetch` returns HTTP 403; the HTML is an empty shell. Everything below was obtained with `curl` +
a browser User-Agent.

- **API base:** `https://api.veteranpro.gov.ua/api`
- Endpoints were recovered by downloading the JS chunks (`chunk-*.js`) listed in
  `https://veteranpro.gov.ua/index.html` and grepping for `this.endpoint="..."` assignments and
  the `baseUrl` constant. The Angular service classes each set an `endpoint` string that is appended
  to `baseUrl`.

Standard request shape used throughout:

```bash
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15"
curl -sS -L --max-time 25 -A "$UA" -H "Accept: application/json" \
  "https://api.veteranpro.gov.ua/api/<endpoint>"
```

## Endpoints discovered (from JS) and their status

| Endpoint | HTTP | Useful? | What it returns |
|---|---|---|---|
| `thematic-blocks` | 200 (591 KB) | **YES — primary catalog** | 9 thematic blocks, each with `subBlocks[]` (the individual services, with HTML `content` + `userStatusCodes`) and `faqs[]` |
| `regional-services?take=N&skip=0` | 200 | **YES** | Region/community-specific services (`count: 1536`); rich `content`, `description`, `conditions`, `contacts`, `region`, `community`, `userStatuses` |
| `topics` | 200 | reference | 10 topic titles = exactly our 10 category names (last entry is a junk email row) |
| `user-statuses` | 200 | reference | The 3 statuses: code `УБД`/`ОІВВ`/`ЧСЗ`, aliases `ubd`/`oivv`/`csz` |
| `regions` | 200 (6.4 MB) | reference | Oblast/community geo tree |
| `communities` | 200 | reference | Community list |
| `your-way/tree` | 200 | not used | "Твій шлях" guided flow tree |
| `front/business-category` | 200 | thin | Only 2 categories (Стоматологія, Ресторани) |
| `front/business` | 200 | **empty** | `count: 0` — veteran-business directory not yet populated |
| `discounts` | 200 | **empty** | `data: []` — discounts catalog not yet populated |
| `front/page`, `front/static-page` | 200 | UI strings | Header/footer translations, static pages |

Pagination on `regional-services`: `take` + `skip` work (`limit` also works; `page/perPage` ignored — defaults to 10).

## Data model used for extraction

- **Thematic services** = `thematic-blocks[].subBlocks[]`. Mapped each subBlock's HTML `content`
  (stripped to plain text with bullet/line-break preservation) into `body`. `userStatusCodes`
  (`УБД`/`ОІВВ`/`ЧСЗ`) mapped to `UBD`/`OIVV`/`CHSZ`. When the API left `userStatusCodes` empty,
  all three statuses were applied as a fallback (noted below).
  - `source` = `https://veteranpro.gov.ua/thematic-block/<blockAlias>#<subBlockAnchor>`
    (the real Angular route `thematic-block/:blockId` + in-page anchor).
- **Regional services** = `regional-services` items → category `regional`, with `region` set to
  `"<oblast> (<community>)"`, `steps` derived from the `conditions` field, `contacts` from `contacts`.
  Password hashes and other PII present in the raw `createdBy` object were **excluded**.
  - `source` = `https://veteranpro.gov.ua/regional-services`.

HTML was stripped (no `<...>`, entities unescaped, `&nbsp;` normalized). Verified: no markup,
no `password`/hash/email leakage in any emitted field.

## Category mapping (thematic block → our CategoryId)

| Block (alias) | Our category |
|---|---|
| `zdorovya_ta_vidnovlennya` | `health` |
| `socialnyy_zakhyst_i_finansova_pidtrymka` | `social-protection` |
| `zhytlo_ta_infrastruktura` | `housing` |
| `transport_i_komunalni_pilhy` | `transport` |
| `dokumenty_ta_status` | `documents` |
| `osvita_ta_robota` | `education` |
| `podatkovi_ta_administratyvni_pilhy` | `tax` |
| `sport_ta_zmahannya` | `sport` |
| `hranty_ta_pidtrymka_biznesu` | `grants` |
| (`regional-services` endpoint) | `regional` |

The site's own taxonomy aligns 1:1 with our 10 categories.

## Per-category result (39 total)

| Category | Count | Example titles |
|---|---|---|
| health | 4 | Амбулаторна реабілітація; Протезування кінцівок; Психологічні послуги; Лікування онкологічних захворювань |
| social-protection | 4 | Щомісячна виплата за особливі заслуги; Пенсія по інвалідності; Пенсія у зв'язку з втратою годувальника; Компенсація за придбані засоби реабілітації |
| housing | 4 | Доступна іпотека «єОселя»; «єВідновлення»; Компенсація за оренду житла; Ваучери на житло для ВПО |
| transport | 4 | Переобладнання автомобіля; Компенсація автострахування; Транспортні пільги; Авто від держави |
| documents | 4 | Посвідчення УБД; Посвідчення ОІВВ; Статус ЧСЗ; Безоплатна правнича допомога |
| education | 4 | Допомога на навчання дітям; Ваучери на освіту; Вища освіта; Виплати по безробіттю |
| **tax** | **3** | Звільнення від земельного податку; Податкові пільги; Податкові пільги для мобілізованих ФОПів |
| sport | 4 | Програма «Ветеранський спорт»; Мапа закладів спорту; Адаптивний спорт; Клуби «Нестримні» |
| grants | 4 | Гранти «Варто»; Мікрофінансування; «Власна справа»; Грант на енергонезалежність |
| regional | 4 | ЖКП родинам загиблих; Щорічна допомога УБД; Допомога на лікування; Одноразова допомога ЧСЗ |

## Gaps / notes for the user

- **tax has only 3 services**, not 4 — the `podatkovi_ta_administratyvni_pilhy` block contains
  exactly 3 subBlocks with substantive content (others are empty placeholders). This is a real
  limit of the site's data, not a scraping shortfall.
- A handful of subBlocks across blocks have **empty `userStatusCodes`** in the API; for the items we
  selected this only affected none after curation, but where it occurs the fallback is all 3 statuses.
- `discounts` and `front/business` endpoints exist but return **empty arrays** — the discounts catalog
  and veteran-business directory are not yet populated on the site.
- `regional-services` has **1536 entries**; we sampled 4 from the first page (Полтавська/Лубенська,
  etc.). Far more regional data is available on demand via `take`/`skip` if we want to expand coverage
  or filter by `regionId`/`communityId`.
