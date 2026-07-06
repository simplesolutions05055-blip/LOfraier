# אפיון מערכת - LOfraier
## מערכת ניתוח עסקאות נדל"ן חכמה ליזמים בארה"ב

**גרסה:** 2.0 (מעודכן לאחר סקירת מסמכי הלקוח)
**תאריך:** יולי 2026
**סטטוס:** אפיון מפורט לאישור

---

## 1. סקירה כללית (Executive Summary)

### 1.1 מטרת המערכת
LOfraier היא פלטפורמת SaaS ליזמי נדל"ן ישראלים הפועלים בארה"ב, המבצעת ניתוח אוטומטי של עסקאות. המערכת מבוססת על **שיטת העבודה של מאור עטייה** (מסמכי ליווי אישי): קליטת עסקאות ממייל של Wholesalers, ניתוח לפי Buy Box מוגדר, חישוב MAO/ROI/Cash-Flow, הצגה בקוד צבע חד-משמעי (ירוק/כתום/אדום).

### 1.2 הבעיה
- יזם מקבל 20-50 עסקאות ביום ממאות Wholesalers.
- ניתוח ידני של עסקה = 30-60 דקות (Comps, שכ"ד, פשיעה, שכונה, שיפוץ).
- 95% מהעסקאות נופלות מיד ב-Buy Box אבל דורשות בדיקה כדי לדעת.
- הערכת שיפוץ תלויה בניסיון ומחירונים מקומיים משתנים.

### 1.3 קהל היעד
- **משתמש עיקרי:** יזם ישראלי פרטי המשקיע בארה"ב (Rental / Flip / BRRRR / Wholesale).
- **שווקים מרכזיים:** Indianapolis IN, Cincinnati OH, Cleveland OH, Memphis TN, Jacksonville FL, Louisville KY, Dayton OH, Birmingham AL.

---

## 2. עקרונות עיצוב מנחים

1. **קוד צבע מיידי** — 🟢 ירוק / 🟠 כתום / 🔴 אדום.
2. **תמצית לפני פירוט** — מסך ראשי חד-משמעי; drill-down לחישובים.
3. **התאמה אישית** — כל משתמש: Buy Box משלו, מחירון שיפוץ משלו, יעדי ROI משלו.
4. **מהירות** — פחות מ-30 שניות מקבלת מייל עד verdict.
5. **Mobile-First** — יזמים בודקים בדרך.

---

## 3. שיטת החישוב (על בסיס Excel של הלקוח)

### 3.1 Buy Box (ברירת מחדל, ניתן לשינוי לכל משתמש)

| פרמטר | ערך ברירת מחדל |
|-------|----------------|
| Max ALL-IN | $130,000 |
| Min ARV | $120,000 |
| Property Types | SFH / Duplex / Triplex / Fourplex |
| Min Beds | 2 (עדיף 3-4, אופטימלי 3/1) |
| Min SqFt | 900 |
| Neighborhood Grade | C+ ומעלה (לא C / C- / D) |
| Year Built | 1950 ומעלה |
| Max Renovation | $45,000 |

### 3.2 שלושת מסלולי החישוב

המערכת מזהה מהמייל של ה-Wholesaler את **סוג העסקה המוצע** (Flip / Rental / BRRRR / Wholesale) ומריצה את המחשבון המתאים. כל עסקה מקבלת תגית סוג מעל השורה התחתונה.

#### 3.2.1 מחשבון Rental (Buy & Hold)

**Purchase Costs:**
```
Purchase Price + Renovation + Title Closing ($2,200) + Inspection ($600)
= Buy & Rehab Cost
```

**Financing (אופציונלי):**
```
Purchase Loan = 80% × Purchase Price
Renovation Loan = 100% × Renovation
Origination/Broker Fees = 3% × Total Loan
Title Financing = $1,500
Appraisal = $800
Cash Needed In Deal = (Buy & Rehab Cost + Loan Cost) - Total Loan
```

**Holding Costs (X months):**
```
Annual Interest = Loan × Interest Rate
Monthly Mortgage = Annual Interest / 12  (Interest Only during rehab)
Total Holding = (Interest × months/12) + Insurance + Property Tax
              + Utilities + Traveling + Overseeing + Draws for lender
```

**ALL IN = Buy & Rehab + Loan Cost + Holding Costs**

**Yearly Expenses:**
```
Property Tax
Insurance
Repairs & Maintenance = $120/month × doors
Water/Sewerage/Garbage (Duplex+)
Electric/Gas (usually tenant pays)
Lawn/Snow (Duplex+)
HOA Fees
Property Management = 6-10% of Rent
New Tenants Fees = 50-100% of 1 month rent
Vacancy Loss = 6-10% of Rent
```

**Income:**
```
Yearly Rent = Monthly Rent × 12
NOI (Net Operating Income) = Yearly Rent - Yearly Expenses
```

**מדדי מפתח:**
```
Rent Rule           = Monthly Rent / All In × 100%     Target ≥ 1.1% (Excellent ≥ 1.3%)
ROI                 = NOI / All In × 100%              Target ≥ 9%
Cash-on-Cash (COC)  = (NOI - Annual Debt) / Cash In    Target ≥ 8%
ROE                 = (NOI - Interest) / Cash In       Target > ROI (efficient leverage)
DSCR                = (Rent - Tax - Insurance) / Debt  Must be ≥ 1.0 (Lender minimum ~1.25)
```

#### 3.2.2 מחשבון Flip

```
#1 Deal & Closing:
  Purchase Price + Closing Cost ($2,500) + Renovation + Inspection ($650)
  = All In (Pre-Financing)

#2 Financing (Fix & Flip Loan):
  LTC (Loan to Cost)     = 75% × Purchase Price
  Renovation Financed    = 100% × Renovation
  Total Loan             = LTC + Renovation Financed
  Loan Closing Fees      = 5% × Total Loan
  Total Loan Cost        = Loan Closing + Appraisal

#3 Holding Cost (6 months typical):
  Traveling ($0-3,000/trip × trips)
  Overseeing ($50-100/visit)
  Inspections for lender ($150/draw × ~3-5)
  Insurance ($1,000)
  Property Tax ($1,800)
  Utilities ($1,500)
  Interest = 10-12% × Loan × 6/12
  = Total Holding Cost

#4 Sale & Profits:
  Full All In = Pre-Financing + Loan Cost + Holding
  Sale Price = ARV
  Realtor Fee = 6% × Sale Price
  Closing Costs = $2,500
  PROFIT = Sale - Realtor - Closing - Full All In
  ROI = Profit / All In × 100%           Target ≥ 18%
  ROE = Profit / Cash In Deal × 100%     (Leverage indicator)
```

#### 3.2.3 מחשבון BRRRR

**המשמעות:** Buy → Rehab → Rent → Refinance → Repeat.

```
שלב 1-3: זהה ל-Rental (רכישה, שיפוץ, השכרה)

שלב 4: Refinance
  Estimated ARV
  Refinance Loan = 65-75% × ARV
  Loan & Title Closing = 5% × Loan
  All In After Refi = All In - (Refi Loan - Original Loan Payoff)
  Cash Left In Deal = All In - Refi Loan Amount
  % Of Money Left In = Cash Left / All In

שלב 5: הרצה של Cash Flow חדש
  Annual Interest (Refi Loan × 7.5%)
  Monthly Mortgage PI
  Monthly Cash Flow = (Rent - Yearly Expenses - Annual Debt) / 12
  New COC = (NOI - Loan) / Cash Left In Deal

מדד BRRRR Efficiency:
  יעילות = כמה מההשקעה חזרה + Cash Flow חיובי
  Target: לפחות 70% מההון חזר, ROE > ROI, Cash Flow חיובי
```

### 3.3 לוגיקת סיווג צבעים (Verdict Logic)

**מנוע ההחלטה מדרג כל עסקה 0-100 ומצבע:**

#### 🟢 GREEN — "Super Deal" / "Good Deal"
עומדת בכל התנאים:
- Rental: Rent Rule ≥ 1.1% AND ROI ≥ 9% AND DSCR ≥ 1.25
- Flip: ROI ≥ 18% AND Profit ≥ $18,000 AND ARV מבוסס Comps
- BRRRR: כל תנאי Rental + Cash Left In ≤ 30% של All In
- וגם עומדת ב-Buy Box של המשתמש

#### 🟠 ORANGE — "Marginal / Needs Review"
עומדת בחלק:
- Rental: Rent Rule 0.9-1.09% OR ROI 6-8.9% OR DSCR 1.0-1.24
- Flip: ROI 12-17.9% OR Profit $10k-$17,999
- אחד מפרמטרי Buy Box חורג (SqFt, Beds, Year Built)
- חסרים נתונים לחלק מהחישוב (למשל Comps מוגבלים)

#### 🔴 RED — "Bad Deal / Not Relevant"
נופלת בפרמטר קריטי:
- Rental: Rent Rule < 0.9% OR DSCR < 1.0 OR Cash Flow שלילי
- Flip: ROI < 12% OR Profit < $10,000
- Neighborhood Grade = D
- חורגת מ-Buy Box בעלות: All In > Max

#### דירוג ציון (Score 0-100)
```
Score = 40 × dealFinancials  (Rent Rule / ROI / Profit vs target)
      + 20 × buyBoxFit       (כמה מהקריטריונים מתקיימים)
      + 15 × neighborhoodGrade (A=100, B=80, C+=65, C=40, D=15)
      - 15 × riskFlags        (Year Built <1950, Knob-and-Tube, Major roof/HVAC issues)
      + 10 × wholesalerQuality (Track record ב-DB פנימי)

Score ≥ 75 → 🟢 GREEN
Score 50-74 → 🟠 ORANGE
Score < 50  → 🔴 RED
```

### 3.4 סוגי עסקאות שמזוהים מהמייל

המערכת מזהה את הסוג מהמייל (Claude parsing) ומסמנת אותו על הכרטיסייה:

| Tag | מה מחפשים במייל | מחשבון שרץ |
|-----|-----------------|-------------|
| 🏷️ **FLIP** | "Fix and Flip", "ARV $XXX after rehab", "profit potential" | Flip Calculator |
| 🏷️ **RENTAL** | "Rent-ready", "cashflow", "tenant occupied", "$XXX/month rent" | Rental Calculator |
| 🏷️ **BRRRR** | "BRRRR opportunity", "refinance out", "value-add rental" | BRRRR Calculator (Rental + Refi) |
| 🏷️ **WHOLESALE** | "Assignment fee", "double close", "novation" | Wholesale Analysis (מיזעור נתונים) |
| 🏷️ **CREATIVE** | "Seller finance", "Sub-to", "wrap" | תצוגה מיוחדת עם תנאי מימון |

**סיווג מרובה:** עסקה שמתאימה למספר סוגים - מוצגת עם כל התגיות, והמערכת מריצה את כל המחשבונים ומציגה את זה שנתן את הציון הכי גבוה.

---

## 4. ארכיטקטורה טכנית

### 4.1 סטאק

| שכבה | טכנולוגיה |
|------|-----------|
| Frontend | Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui |
| Backend | Next.js API Routes + Node workers |
| Database | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| Queue | Inngest |
| AI | Claude API (opus-4-8 לפרסינג/תמונות, haiku-4-5 לסיווג) |
| Email | Gmail API OAuth 2.0 + Pub/Sub Push |
| Scraping / Data | Playwright + Proxies, החלפה ל-APIs מסחריים ב-Production |
| Hosting | Vercel + Supabase + Fly.io Workers |

### 4.2 High-Level Data Flow

```
Email → Gmail Push → Ingest Worker
   → Claude Parse (structured JSON: address, price, ARV, rehab estimate, type)
   → Deal Type Classifier (Flip/Rental/BRRRR/Wholesale/Creative)
   → Enrichment Jobs (parallel):
       ├─ Zillow/Redfin Scraper → Property details + sold comps
       ├─ Rentometer → Rent estimate
       ├─ SpotCrime → Crime score
       ├─ Niche → Neighborhood grade
       └─ TruePeopleSearch (on-demand only) → Owner info
   → Calculation Engine (runs the right calculator by type)
   → Verdict Engine (🟢/🟠/🔴 + score 0-100)
   → Supabase Realtime → User Dashboard updates
```

---

## 5. מודל נתונים (Database Schema)

### 5.1 טבלאות ליבה

```sql
-- משתמשים (משתמשים ב-Supabase Auth)
users (id, email, name, phone, role, subscription_tier, created_at)

-- Buy Box + פרמטרי חישוב לכל משתמש
user_preferences (
  user_id UUID PK
  max_all_in NUMERIC             DEFAULT 130000
  min_arv NUMERIC                DEFAULT 120000
  min_beds INT                   DEFAULT 2
  min_sqft INT                   DEFAULT 900
  min_year_built INT             DEFAULT 1950
  max_rehab NUMERIC              DEFAULT 45000
  min_neighborhood_grade TEXT    DEFAULT 'C+'
  allowed_property_types TEXT[]  DEFAULT ARRAY['sfh','duplex','triplex','fourplex']
  target_markets JSONB           -- [{"city":"Indianapolis","state":"IN"}, ...]

  -- Rental targets
  target_rent_rule_pct NUMERIC   DEFAULT 1.10
  target_roi_pct NUMERIC         DEFAULT 9.00
  target_dscr NUMERIC            DEFAULT 1.25

  -- Flip targets
  target_flip_roi_pct NUMERIC    DEFAULT 18.00
  target_flip_profit NUMERIC     DEFAULT 18000

  -- Financing assumptions
  rental_ltv_pct NUMERIC         DEFAULT 70.00
  rental_interest_rate NUMERIC   DEFAULT 8.50
  flip_ltc_pct NUMERIC           DEFAULT 75.00
  flip_reno_pct NUMERIC          DEFAULT 100.00
  flip_interest_rate NUMERIC     DEFAULT 11.00
  refi_ltv_pct NUMERIC           DEFAULT 70.00

  -- Buffers
  extra_expense_buffer_pct NUMERIC DEFAULT 12.00  -- from Excel "12% Expenses"
  unexpected_reno_pct NUMERIC     DEFAULT 7.00
  extra_outdoor_pct NUMERIC       DEFAULT 10.00
)

-- חשבונות מייל
email_accounts (id, user_id, provider, email_address, oauth_tokens (encrypted),
                watch_labels[], last_synced_at, active)

-- עסקאות
deals (
  id UUID PK
  user_id UUID FK
  status ENUM('pending','analyzing','ready','under_contract','offer_sent','archived','rejected','won','lost')
  verdict ENUM('green','orange','red','uncertain')
  score NUMERIC(5,2)

  detected_type ENUM('flip','rental','brrrr','wholesale','creative','unknown')
  detected_type_confidence NUMERIC(4,3)

  -- מקור המייל
  source_email_id TEXT
  source_wholesaler TEXT
  received_at TIMESTAMPTZ
  analyzed_at TIMESTAMPTZ

  -- נתוני נכס
  address_line1 TEXT
  city TEXT
  state TEXT
  zip TEXT
  lat NUMERIC(9,6)
  lng NUMERIC(9,6)
  property_type ENUM('sfh','duplex','triplex','fourplex','multi','townhouse','condo')
  units INT
  bedrooms INT
  bathrooms NUMERIC(3,1)
  sqft INT
  lot_sqft INT
  year_built INT
  general_condition ENUM('fully_renovated','need_cosmetics','light_rehab','medium_rehab','heavy_rehab','tear_down')
  rented_status ENUM('vacant','rented','partial')
  current_rent NUMERIC

  -- הצעת ה-Wholesaler
  asking_price NUMERIC
  wholesaler_arv NUMERIC
  wholesaler_rehab NUMERIC
  wholesaler_rent NUMERIC

  -- החישוב שלנו (snapshot)
  our_arv NUMERIC
  our_rehab NUMERIC
  our_rent NUMERIC
  mao NUMERIC                     -- Maximum Allowable Offer
  first_offer NUMERIC             -- הצעה ראשונה מומלצת
  all_in NUMERIC                  -- כולל 12% buffer
  cash_in_deal NUMERIC

  -- Rental metrics
  rent_rule_pct NUMERIC
  yearly_expenses NUMERIC
  noi NUMERIC
  roi_pct NUMERIC
  coc_pct NUMERIC
  roe_pct NUMERIC
  dscr NUMERIC
  monthly_cash_flow NUMERIC

  -- Flip metrics
  flip_profit NUMERIC
  flip_roi_pct NUMERIC
  flip_roe_pct NUMERIC

  -- BRRRR metrics
  refi_loan NUMERIC
  cash_left_in_deal NUMERIC
  brrrr_efficiency_pct NUMERIC

  raw_email JSONB
  metadata JSONB
)

-- Property questions (12-item checklist מהמסמכים)
deal_property_qa (
  deal_id UUID FK
  cosmetic_repairs TEXT             -- "Fresh paint, minor drywall"
  heating_unit_age INT
  cooling_unit_age INT
  water_heater_age INT
  roof_age INT
  electric_amps INT                 -- 100/150/200
  wiring_type ENUM('modern','knob_and_tube','mixed','unknown')
  plumbing_type ENUM('pex','pvc','copper','galvanized','mixed','unknown')
  windows_status ENUM('original','renewed','mixed')
  sewer_line_condition TEXT
  hoa_dues NUMERIC
  hoa_restrictions TEXT
)

-- Comps
deal_comps (
  id UUID PK
  deal_id UUID FK
  address TEXT
  home_type TEXT
  sold_at DATE
  sold_price NUMERIC
  beds INT, baths NUMERIC(3,1)
  sqft INT, lot_sqft INT
  year_built INT
  days_on_market INT
  distance_miles NUMERIC(4,2)
  cash_or_finance TEXT
  finishes_grade INT               -- 1-10
  source TEXT                       -- redfin/zillow/manual
)

-- שוק
deal_market_data (
  deal_id UUID PK FK
  price_per_sqft_avg NUMERIC
  rent_estimate NUMERIC
  rent_estimate_low NUMERIC
  rent_estimate_high NUMERIC
  rentometer_data JSONB
  crime_score INT                   -- 1-100
  crime_data JSONB
  niche_data JSONB
  neighborhood_grade TEXT           -- A/B/C+/C/C-/D
  neighborhood_notes TEXT
  fetched_at TIMESTAMPTZ
)

-- הערכות שיפוץ
rehab_estimates (
  id UUID PK
  deal_id UUID FK
  user_id UUID FK
  method ENUM('ai_photo','manual','quick_calc','template_small','template_medium','template_large')
  home_size_sqft INT
  bathroom_count INT
  subtotal NUMERIC
  extra_outdoor NUMERIC             -- 10%
  unexpected NUMERIC                -- 7%
  total_cost NUMERIC
  is_active BOOLEAN                 -- ההערכה הנוכחית שנשתמש בה
  notes TEXT
  created_at TIMESTAMPTZ
)

rehab_line_items (
  id UUID PK
  rehab_estimate_id UUID FK
  material_id UUID FK
  quantity NUMERIC(10,2)            -- multiplier: 0.5=partial, 1=one unit, 2=two units
  unit_price NUMERIC                -- final price after user override
  computed_total NUMERIC
  is_user_override BOOLEAN
)

-- ניתוחי AI
ai_photo_analyses (
  id UUID PK
  deal_id UUID FK
  photo_urls TEXT[]
  detected_issues JSONB             -- [{room, issue, severity, suggested_fix, cost_range}]
  raw_ai_response TEXT
  model TEXT
  tokens_used INT
  created_at TIMESTAMPTZ
)

-- מחירון גלובלי (Seeded מ-Excel של הלקוח)
materials (
  id UUID PK
  category TEXT                     -- Demo / Paint / Floor / Kitchen / Bath / Electrical / Plumbing / HVAC / Roof / Exterior
  key TEXT UNIQUE                   -- 'paint_drywall_per_sqft'
  name TEXT                         -- 'Paint & Drywall'
  unit TEXT                         -- 'sqft', 'unit', 'per_bath', 'per_home'
  default_price NUMERIC
  price_low NUMERIC
  price_high NUMERIC
  scale_by ENUM('sqft','bath_count','flat')
  is_active BOOLEAN
  updated_at TIMESTAMPTZ
)

-- מחירים אישיים של משתמש
user_material_prices (
  user_id UUID FK
  material_id UUID FK
  custom_price NUMERIC
  updated_at TIMESTAMPTZ
  PRIMARY KEY (user_id, material_id)
)

-- שכונות / שווקים (Neighborhood table מדריך העבודה)
neighborhoods (
  id UUID PK
  city TEXT
  state TEXT
  county TEXT
  zip TEXT
  grade TEXT                        -- A / B / C+ / C / C- / D
  is_tenant_friendly BOOLEAN
  appreciation_5y_pct NUMERIC
  crime_rating INT
  median_home_price NUMERIC
  avg_rent_3br NUMERIC
  rent_to_price_pct NUMERIC
  hot_rate INT                      -- Redfin
  median_dom INT
  notes TEXT
)

-- Wholesalers tracked
wholesalers (
  id UUID PK
  name TEXT
  email TEXT
  phone TEXT
  markets_active TEXT[]
  quality_score NUMERIC             -- 0-100 based on past deals sent
  deal_count INT
  won_deal_count INT
  first_seen_at TIMESTAMPTZ
)

-- Events / audit
deal_events (id, deal_id, event_type, payload JSONB, created_at)
```

### 5.2 RLS
כל טבלה שקשורה למשתמש - Row Level Security על user_id.

---

## 6. מחירון שיפוץ (Seeded from Excel של הלקוח)

**קטלוג בסיסי — 28 פריטים** (יבוצע seed בהתקנה):

| קטגוריה | פריט (Key) | ברירת מחדל | יחידה | סקייל |
|---------|-----------|-----------|--------|-------|
| Demo | `demo_trash_prep` | $1,500 | לבית | flat (0.5-1) |
| Paint | `paint_drywall_per_sqft` | $2.50 | sqft | ×sqft |
| Floor | `flooring_per_sqft` | $4.50 | sqft | ×sqft |
| Electrical | `light_fixtures` | $800 | לבית | flat |
| Electrical | `plugs_switches` | $500 | לבית | flat |
| Doors | `door_handles` | $500 | לבית | flat |
| Kitchen | `new_kitchen_cabinets` | $4,000 | לבית | flat |
| Kitchen | `fix_kitchen_cabinets` | $600 | לבית | flat |
| Kitchen | `countertop_quartz` | $2,000 | לבית | flat |
| Kitchen | `countertop_formica_butcher` | $500 | לבית | flat |
| Kitchen | `backsplash` | $900 | לבית | flat |
| Kitchen | `appliances` | $2,000 | לבית | flat |
| Bath | `bath_cosmetics` | $1,500 | לאמבטיה | × bath_count |
| Bath | `bath_full_remodel` | $3,000 | לאמבטיה | × bath_count |
| Doors | `interior_doors` | $1,100 | לבית | flat (0.5=fix, 1=replace) |
| Garage | `garage_work` | $5,000 | לבית | flat |
| Basement | `basement_paint` | $1,150 | לבית | flat |
| Basement | `basement_foundation` | $1,000 | per estimated severity | flat |
| Electrical | `rewire_home` | $6,500 | לבית | flat |
| Electrical | `replace_panel_service` | $4,000 | לבית | flat |
| Plumbing | `re_plumb_home` | $6,000 | לבית | flat |
| HVAC | `new_furnace` | $3,000 | לבית | flat |
| HVAC | `new_ac` | $3,500 | לבית | flat |
| Plumbing | `new_water_heater` | $1,000 | לבית | flat |
| HVAC | `fix_ductwork` | $600 | לבית | flat |
| Roof | `new_roof` | $6,000 | לבית | flat |
| Exterior | `new_sidings` | $6,000 | לבית | flat |
| Exterior | `new_windows` | $6,000 | לבית | flat |
| Plumbing | `sewer_line_underground` | $12,000 | לבית | flat |

**תוספות אוטומטיות:**
- Extra (Outdoor, landscaping) — **+10%** על ה-subtotal.
- Unexpected — **+7%** על ה-subtotal.

**תבניות מהירות (Templates):**
- **Small Rehab** — $10k-$15k (Paint + Floor + basic fixes).
- **Medium Rehab** — $25k-$45k (Kitchen + Bath + Paint + Floor + basic mechanicals).
- **Large Rehab** — $55k-$70k (הכל, כולל HVAC + Roof + electrical).

---

## 7. תכונות מרכזיות (Features)

### F1 — חיבור תיבת מייל
- Gmail OAuth 2.0, Push via Pub/Sub, Watch על תוויות ספציפיות.
- MVP: Gmail בלבד. שלב 2: Outlook + IMAP.

### F2 — Email Parsing (Claude)
- חילוץ כתובת, מחיר, ARV, Rehab, סוג נכס, גודל, חדרים.
- **זיהוי סוג העסקה** (Flip/Rental/BRRRR/Wholesale/Creative).
- זיהוי שם ה-Wholesaler (בונה מהמייל שלו טבלת wholesalers).

### F3 — Data Enrichment
- **Zillow/Redfin:** פרטי נכס, היסטוריית מכירות, Comps (5-10 ברדיוס 1 מייל, 6 חודשים אחרונים, ±20% גודל, ±10 שנות בנייה).
- **Rentometer:** הערכת שכ"ד ל-3 מייל רדיוס.
- **SpotCrime:** ציון פשיעה.
- **Niche:** ציון שכונה A-D, בתי ספר, אוכלוסייה.
- **TruePeopleSearch:** רק לפי דרישה של המשתמש (פרטי בעלים).

### F4 — Calculation Engine
- הרצה של המחשבון הנכון לפי `detected_type`.
- אם המערכת לא בטוחה בסוג - מריצה את **שלושת המחשבונים** ומציגה את הכי טוב.
- שקיפות מלאה - כל נוסחה עם breakdown מלא.

### F5 — Verdict Engine
- Score 0-100 לפי הנוסחה בסעיף 3.3.
- 🟢/🟠/🔴 כמו סעיף 3.3.
- הצגת "Why?" — למה קיבל את הצבע הזה (רשימת פרמטרים שכשלו/עברו).

### F6 — מסך עסקה (תמצית + פירוט)

**מצב תמצית (ברירת מחדל):**
```
┌───────────────────────────────────────────────────────────┐
│  🟢 GREAT DEAL      🏷️ RENTAL      Score: 82/100          │
│                                                           │
│  123 Main St, Indianapolis, IN 46201                     │
│  3 BR / 1 BA / 1,150 sqft / Built 1965 · Neighborhood: B+ │
│                                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Asking   │  │ Our MAO  │  │ All In   │  │ Cash Flow│  │
│  │ $85,000  │  │ $102,000 │  │ $128,500 │  │ $211/mo  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                           │
│  ARV: $165,000 · Rehab: $28,000 · Rent: $1,350/mo        │
│  Rent Rule: 1.05% · ROI: 9.3% · COC: 8.1% · DSCR: 1.32   │
│                                                           │
│  Wholesaler: John (Elite Deals LLC) · Received: 2h ago    │
│                                                           │
│  [ Show Full Analysis ▼ ]   [Save] [Reject] [Send Offer] │
└───────────────────────────────────────────────────────────┘
```

**מצב מפורט (6 טאבים):**
1. **Overview** — נתונים מלאים + מפה + תמונות + Property Q&A (12 שאלות).
2. **Comps** — טבלת 5-10 נכסים + מפה + חציון.
3. **Market** — Rentometer, SpotCrime, Niche, מגמות.
4. **Rehab** — פירוט השיפוץ (28 פריטים).
5. **Calculations** — כל הנוסחאות עם breakdown (Rental / Flip / BRRRR).
6. **Source** — המייל המקורי + לינקים לכל מקור נתונים.

### F7 — מחשבון שיפוץ ידני
- 28 פריטים ב-checkboxes + מוסיפי כמות.
- שינוי מחיר של פריט = נשמר כמחיר אישי לעתיד.
- תבניות Quick: Small / Medium / Large.
- סה"כ מתעדכן בזמן אמת עם 10% Extra + 7% Unexpected.

### F8 — הערכת שיפוץ מבוססת AI (P1)
- אוסף תמונות מהמייל + Zillow, שולח ל-Claude Multimodal.
- מחזיר רשימת פריטים ממופים למחירון + חומרה + הצעת כמות.
- המשתמש מאשר/עורך/מוסיף/מסיר.

### F9 — ניהול מחירון
- טבלה של 28 פריטים + הוספת פריטים מותאמים.
- "Reset to default" מחזיר למחיר הגלובלי.
- ייצוא/ייבוא Excel.

### F10 — Dashboard
- KPIs: עסקאות היום / השבוע / החודש, ציון ממוצע, ירוקות הפתוחות.
- **Feed** של עסקאות אחרונות עם קוד צבע וסוג עסקה (Tag).
- פילטרים:
  - Verdict (🟢/🟠/🔴)
  - Type (Flip/Rental/BRRRR/Wholesale)
  - State/City
  - טווח מחיר
  - Wholesaler
  - טווח תאריכים
- Bulk actions: reject / save / send to inbox.

### F11 — התראות (P1)
- Push/Email על עסקה 🟢 חדשה עם ציון > 80.
- Daily digest.
- Telegram/WhatsApp bot (P2).

### F12 — הגדרות משתמש
- Profile.
- **Buy Box** — לפי section 3.1.
- **Financing Assumptions** — LTV, ריביות, buffers.
- **Targets** — Rent Rule, ROI, DSCR, Flip ROI.
- חשבונות מייל.
- שווקים במעקב.
- מחירון אישי.
- Billing.

### F13 — CRM Sheet Integration (P1)
זמן שני-שלישי של MVP: **תצוגת CRM טבלאית** בסגנון Excel של הלקוח, עם כל השדות המקוריים:
- Deal Status (Under Contract / Offer Sent / Not Relevant / Won / Lost)
- Deal Category (🟢 Super Deal / 🟢 Good Deal / 🟠 Marginal / 🔴 Bad Deal)
- Exit Strategy (Rental / Flip / BRRRR / Wholesale)
- Contact Person Info
- Next Follow Up Date
- Contract End Date
- Notes
- ייצוא ל-Google Sheets לשמירת רציפות למשתמשים שהיו רגילים ל-Excel.

### F14 — Wholesaler Tracker
- טבלה של כל ה-Wholesalers שראינו.
- לכל אחד: כמה עסקאות שלח, אחוז 🟢, אחוז שנסגרו.
- דירוג איכות (Quality Score) - Wholesaler עם היסטוריה טובה מקבל bonus בציון.

### F15 — Neighborhoods Tracker (P2)
- לפי הטמפלייט בגיליון של הלקוח.
- לכל עיר: growing/flat/declining, appreciation, crime, tenant-friendly, rent/price ratio.

### F16 — Team Mode (P2)
- הזמנת חברי צוות (Analysts / Viewers).
- הקצאת עסקאות.

### F17 — Document Generation (P2)
תבניות שכבר סופקו במסמכי הלקוח:
- **Purchase Agreement** (חוזה רכישה) — מלא מהעסקה + Owner info + APN.
- **Assignment Contract** (Wholesale).
- **Renovation Agreement** (חוזה קבלן) — כולל 6-phase payment schedule.
- **Lien Waiver** (Ohio) — הפקה לפני כל תשלום.

---

## 8. זרימות משתמש

### 8.1 Onboarding
1. Signup (Email/Google).
2. שאלון: אסטרטגיה עיקרית, שווקים מועדפים, Max All In, יעדי ROI.
3. הגדרת Buy Box (עם defaults מהאפיון).
4. חיבור Gmail + בחירת תוויות.
5. סנכרון ראשוני של 30 יום.
6. Dashboard עם עסקאות מנותחות.

### 8.2 Deal Analysis (Automated)
1. Wholesaler שולח מייל.
2. Gmail Push → Ingest Worker.
3. Claude Parse → Type Classifier.
4. Enrichment jobs במקביל.
5. Calculation Engine → Verdict.
6. Realtime notification למשתמש.

### 8.3 Manual Rehab Estimate
1. פתיחת עסקה → Rehab Calculator.
2. בחירה: Quick Template / Build Manually / AI Analysis.
3. Manual: 28 פריטים, שינוי quantity/price.
4. שמירה → מעודכן ב-`our_rehab` → חישוב מחדש.

### 8.4 AI Rehab
1. "Analyze with AI" → אוסף תמונות.
2. Claude Multimodal → רשימת פריטים.
3. משתמש עורך.
4. שמירה.

### 8.5 Send Offer
1. עסקה 🟢 → "Send Offer".
2. אוטומטית: יצירת Purchase Agreement מלא מהטמפלייט.
3. מייל ל-Wholesaler עם ההצעה + PDF החוזה.
4. עדכון סטטוס → "Offer Sent".
5. Follow-up reminders אוטומטיים כל 3 ימים.

---

## 9. אינטגרציות

| שירות | שימוש | עלות משוערת |
|-------|-------|-------------|
| Anthropic Claude API | Email parsing + Photo analysis | $0.10-$0.20 לעסקה |
| Gmail API | Email ingestion | Free tier |
| Rentometer API | Rent comps | $30/mo + per-call |
| ATTOM / RentCast | Property details, sold comps (Prod) | $100-300/mo |
| SpotCrime | Free | - |
| Niche | Scraping / Free tier | - |
| Playwright + Proxies (MVP) | Zillow/Redfin | $50/mo |
| Stripe | Billing | 2.9% + $0.30 |
| Twilio / SendGrid | Notifications | $10-20/mo |
| Supabase | DB + Auth + Storage | $25/mo Pro |
| Vercel | Hosting | $20/mo |

**סה"כ תפעולי משוער:** ~$300-500 חודשי ב-MVP (עד 50 משתמשים), ~$1,500-3,000 ב-Scale.

---

## 10. UI / UX

### 10.1 Design System
- shadcn/ui + Tailwind.
- Inter (UI), JetBrains Mono (מספרים גדולים).
- Dark Mode מלא.
- צבעי verdict: Emerald 500 (🟢), Amber 500 (🟠), Rose 500 (🔴).

### 10.2 מסכים עיקריים
1. Login / Signup / Onboarding
2. Dashboard
3. Deals List (Card + Table view)
4. Deal Detail (תמצית + 6 טאבים)
5. Rehab Calculator (Full page)
6. AI Photo Analysis (Modal)
7. Materials Price List
8. CRM Sheet View (F13)
9. Wholesalers Tracker
10. Neighborhoods Tracker
11. Settings (Profile / Buy Box / Financing / Materials / Email / Billing)
12. Admin Panel

### 10.3 קיצורי מקלדת
- `J` / `K` — עסקה קודמת / הבאה.
- `S` — Save.
- `R` — Reject.
- `E` — Send Offer.
- `A` — Analyze Rehab.

---

## 11. אבטחה ופרטיות

- HTTPS/TLS 1.3.
- OAuth tokens מוצפנים ב-Supabase Vault.
- Row Level Security על כל טבלה עם user_id.
- Rate limiting: 10 req/sec / user, 3 req/sec לחישובי AI.
- Audit log לפעולות רגישות.
- Data Processing Agreement עם Anthropic.
- שמירת מיילים מלאים רק ל-30 יום.
- Right to Deletion (GDPR/CCPA).

---

## 12. מדדי הצלחה

### מוצר
- **זמן ניתוח:** P50 < 15s, P95 < 60s מקבלת מייל עד verdict.
- **Accuracy:** 90% הסכמה בין verdict של המערכת לבין החלטת המשתמש.
- **Type detection accuracy:** 95%.
- **AI Rehab Accuracy:** 80% פריטים מאושרים.

### עסקי
- Trial → Paid: 25%.
- MRR growth: 20% חודש-חודש.
- Churn: < 5% חודשי.

### תפעולי
- Cost per deal analysis: < $0.15.
- Scraping success rate: > 95%.
- Uptime: 99.5%.

---

## 13. שלבי פיתוח (Roadmap מעודכן)

### שלב 0 — הכנות (שבועות 1-2)
- Supabase + Next.js scaffold.
- DB schema.
- Seed materials מ-Excel.
- CI/CD (Vercel + Supabase Preview).

### שלב 1 — MVP חלקי (שבועות 3-6)
- F1 Gmail integration.
- F2 Email Parsing + Type Classification.
- F4 Calculation Engine (Rental + Flip + BRRRR).
- F5 Verdict Engine (🟢/🟠/🔴).
- F6 Deal Detail (Overview + Calculations tabs).
- F7 Manual Rehab Calculator.
- F10 Dashboard.
- F12 Settings.
- **בלי סקרייפינג עדיין** — המשתמש מזין ARV/Rent ידנית או מקבלים מהמייל.

### שלב 2 — MVP מלא (שבועות 7-10)
- F3 Data Enrichment (Zillow/Redfin/Rentometer/SpotCrime/Niche).
- F6 טאבים נוספים (Comps + Market + Source).
- F9 Materials custom prices.
- F14 Wholesalers tracker.
- F13 CRM Sheet view.

### שלב 3 — AI + Automation (שבועות 11-13)
- F8 AI Rehab Analysis.
- F11 Notifications.
- F17 Document Generation.

### שלב 4 — Scale (שבועות 14+)
- F15 Neighborhoods tracker.
- F16 Team mode.
- Outlook + IMAP.
- Public API.

---

## 14. הבהרות סופיות / שאלות פתוחות

לפני מעבר למוקאפ, בבקשה תאשר / עדכן:

1. **סוגי עסקאות מוצגים:** אישרת שסוג העסקה יגיע מהמייל וייצג טאג + מחשבון מתאים (Flip/Rental/BRRRR/Wholesale/Creative). ✅
2. **קוד צבע:** 🟢 ירוק / 🟠 כתום / 🔴 אדום לפי הפרמטרים בטבלאות. ✅
3. **מחשבון BRRRR** - הכלול/לא? (הוזכר במסמכים כדוגמה) — **כלול**.
4. **תמחור סופי** — SaaS חודשי? מה תוכניות התמחור? (Trial $0, Basic $49/mo, Pro $99/mo, Team $199/mo — הצעה).
5. **CRM view הגליון של Excel** — האם רוצה שכל שדות ה-CRM המקורי יהיו במערכת (F13)? נראה לי כן על סמך המסמכים.
6. **תבניות חוזים (F17)** — האם רוצה גם את זה במערכת (Purchase Agreement, Assignment, Renovation)? זה P2, אבל יש כבר את הטמפלייטים מוכנים במסמכים.
7. **Boots on the ground** — האם נבנה marketplace/רשימה בתוך המערכת? (יש רמז לזה במסמכים).

---

## 15. הצעדים הבאים

**Deliverables לאחר אישור אפיון זה:**

1. **Wireframes** ב-Figma (Dashboard, Deal Detail תמצית+מפורט, Rehab Calculator).
2. **HTML Prototype אינטראקטיבי** של המסך המרכזי (Deal Detail) כדי לחוש את החוויה.
3. **סכמת DB מדויקת** ב-Supabase migrations.
4. **פרומפט Claude** לחילוץ מייל ולסיווג סוג עסקה.

---

**המסמך הבא במסלול:** Wireframes + HTML Prototype
