# אפיון מערכת - LOfraier
## מערכת ניתוח עסקאות נדל"ן חכמה ליזמים בארה"ב

**גרסה:** 1.0
**תאריך:** יולי 2026
**סטטוס:** אפיון ראשוני לאישור

---

## 1. סקירה כללית (Executive Summary)

### 1.1 מטרת המערכת
LOfraier היא פלטפורמת SaaS ליזמי נדל"ן הפועלים בארה"ב, המבצעת ניתוח אוטומטי של עסקאות נדל"ן. המערכת אוספת עסקאות המגיעות למייל של המשתמש מ-Wholesalers שונים, מנתחת אותן על פי שיטת עבודה ייחודית, מבצעת השוואות שוק (Comps) ומציגה את השורה התחתונה - האם העסקה שווה או לא.

### 1.2 בעיה שהמערכת פותרת
- יזם נדל"ן מקבל עשרות עסקאות ביום במייל מ-Wholesalers.
- כל ניתוח ידני דורש 30-60 דקות (בדיקת Comps, שכ"ד, פשיעה, שכונה, שיפוץ).
- 95% מהעסקאות אינן רלוונטיות - זהו בזבוז זמן עצום.
- ההערכה של עלויות שיפוץ דורשת ניסיון ותלויה במחירונים מתעדכנים.

### 1.3 הפתרון
מערכת אוטומטית שמבצעת את כל הניתוח תוך שניות: מזהה עסקה במייל, שולפת נתונים מ-Zillow/Redfin/Rentometer/SpotCrime/Niche, מריצה חישוב על פי הנוסחה של הלקוח, ומציגה את התוצאה בצורה חד-משמעית: "עסקה טובה" / "לא רלוונטית".

### 1.4 קהל היעד
- **משתמש עיקרי:** יזם נדל"ן פרטי / משקיע Fix & Flip / משקיע Buy & Hold הפועל בשוק האמריקאי.
- **משתמש משני:** צוותי אנליסטים בחברות נדל"ן קטנות-בינוניות.
- **שוק גיאוגרפי:** נכסים בארה"ב (בעיקר Midwest - Indianapolis, Cincinnati, Cleveland, Columbus וכו').

---

## 2. עקרונות עיצוב מנחים

1. **מהירות היא הכל** - יזם צריך לקבל תשובה תוך פחות מ-30 שניות מרגע כניסת מייל.
2. **שורה תחתונה קודמת לפרטים** - מסך ראשי חד-משמעי: ✅ ירוק / ❌ אדום / ⚠️ צהוב.
3. **שקיפות מלאה בחישוב** - כל מספר במסך הראשי ניתן ל-drill-down כדי לראות את המקור והחישוב.
4. **התאמה אישית** - כל משתמש מגדיר לעצמו מחירי שיפוץ, שיעורי רווח מינימליים, אזורי פעילות.
5. **Mobile First** - יזמים בודקים עסקאות בסלולרי בין פגישות.

---

## 3. ארכיטקטורה טכנית

### 3.1 סטאק טכנולוגי (המלצה)

| שכבה | טכנולוגיה | נימוק |
|------|-----------|--------|
| Frontend | Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui | SSR, ביצועים, קהילה גדולה, UI מוכן ואיכותי |
| Backend | Next.js API Routes + Node.js workers | פשטות פיתוח, אותה שפה בכל הסטאק |
| Database | Supabase (PostgreSQL + Auth + Storage + Realtime) | Auth מובנה, Realtime לעדכוני עסקאות חדשות, RLS מובנה |
| Queue / Background Jobs | Inngest / BullMQ | ניתוח עסקאות רץ ברקע, סקרייפינג של אתרים חיצוניים |
| AI Services | Anthropic Claude API (claude-opus-4-8 / claude-sonnet-5) | ניתוח מייל, ניתוח תמונות שיפוץ, חילוץ נתונים |
| Email Ingestion | Gmail API OAuth / IMAP / Postmark Inbound | קליטת מיילים מהתיבה של המשתמש |
| Scraping | Playwright + Proxy Rotation (Bright Data / Oxylabs) | Zillow/Redfin/Rentometer סוגרים סקרייפינג בקלות |
| Hosting | Vercel (Frontend/API) + Supabase (DB) + Fly.io (Workers) | פשוט, סקיילבילי, זול בשלב MVP |
| Analytics | PostHog | Product analytics + Feature flags |

### 3.2 ארכיטקטורת מערכת (High-Level)

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                   │
│  Dashboard | Deal Detail | Rehab Calculator | Settings      │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST + Realtime
┌──────────────────────▼──────────────────────────────────────┐
│                    Backend API Layer                        │
│   Auth │ Deals │ Rehab │ Comps │ Users │ Materials         │
└──────────┬────────────────┬──────────────┬─────────────────┘
           │                │              │
    ┌──────▼──────┐  ┌──────▼──────┐  ┌───▼───────┐
    │  Supabase   │  │ Job Queue   │  │  Claude   │
    │ PostgreSQL  │  │ (Inngest)   │  │    API    │
    └─────────────┘  └──────┬──────┘  └───────────┘
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
┌──────▼──────┐    ┌────────▼────────┐   ┌──────▼──────┐
│ Email Watch │    │ Scraping Worker │   │ AI Analysis │
│ (Gmail API) │    │  (Playwright)   │   │   Worker    │
└─────────────┘    └────────┬────────┘   └─────────────┘
                            │
              ┌─────────────┼─────────────┬──────────────┐
              ▼             ▼             ▼              ▼
          Zillow.com    Redfin.com   Rentometer   SpotCrime/Niche
```

### 3.3 זרימת נתונים ראשית (Deal Ingestion Flow)

1. **קליטת מייל** - Webhook מ-Gmail מודיע על מייל חדש בתיבה של המשתמש.
2. **חילוץ נתונים** - Claude מזהה: כתובת, מחיר מבוקש, ARV מוצע, גודל, מספר חדרים, קישור לתמונות.
3. **סקרייפינג במקביל** - שליחת 5 jobs במקביל: Zillow, Redfin, Rentometer, SpotCrime, Niche.
4. **חישוב Comps** - סינון 5-10 עסקאות דומות ב-1 מייל רדיוס, חצי שנה אחרונה, ±20% גודל.
5. **הרצת נוסחת ניתוח** - חישוב MAO, ROI, Cash Flow לפי הפרמטרים של המשתמש.
6. **הצגה בדשבורד** - עדכון בזמן אמת (Realtime) של המשתמש עם המסקנה.

---

## 4. מודל נתונים (Database Schema)

### 4.1 טבלאות ראשיות

```sql
-- משתמשים והרשאות (משתמש ב-Supabase Auth)
users
  id UUID PK
  email TEXT
  name TEXT
  phone TEXT
  role ENUM('user','admin')
  subscription_tier ENUM('trial','basic','pro','team')
  created_at TIMESTAMPTZ

-- הגדרות משתמש (פרמטרי ניתוח אישיים)
user_preferences
  user_id UUID FK
  min_roi_percent NUMERIC(5,2)          -- לדוגמה 20%
  min_cash_flow_monthly NUMERIC(10,2)   -- לדוגמה $200
  max_purchase_price NUMERIC(12,2)
  target_markets JSONB                  -- ["Indianapolis, IN", "Cincinnati, OH"]
  strategy ENUM('flip','rental','wholesale','brrrr')
  arv_multiplier NUMERIC(4,3) DEFAULT 0.70   -- 70% Rule
  buyers_fee_percent NUMERIC(5,2) DEFAULT 3
  closing_costs_percent NUMERIC(5,2) DEFAULT 2
  holding_costs_monthly NUMERIC(10,2) DEFAULT 300

-- חשבונות מייל מחוברים
email_accounts
  id UUID PK
  user_id UUID FK
  provider ENUM('gmail','outlook','imap')
  email_address TEXT
  oauth_tokens JSONB (encrypted)
  watch_labels TEXT[]                   -- אילו תוויות לסרוק
  active BOOLEAN
  last_synced_at TIMESTAMPTZ

-- עסקאות שנקלטו
deals
  id UUID PK
  user_id UUID FK
  status ENUM('pending','analyzing','ready','archived','rejected','saved')
  verdict ENUM('great','ok','bad','uncertain')  -- ✅/⚠️/❌
  score NUMERIC(5,2)                    -- 0-100
  source_email_id TEXT                  -- מזהה המייל המקורי
  source_wholesaler TEXT                -- שם השולח
  received_at TIMESTAMPTZ
  analyzed_at TIMESTAMPTZ

  -- נתוני נכס בסיסיים (מחולצים מהמייל)
  address_line1 TEXT
  city TEXT
  state TEXT
  zip TEXT
  latitude NUMERIC(9,6)
  longitude NUMERIC(9,6)
  property_type ENUM('sfh','duplex','triplex','fourplex','multi','townhouse','condo')
  bedrooms INT
  bathrooms NUMERIC(3,1)
  square_feet INT
  year_built INT
  lot_size_sqft INT

  -- הצעת ה-Wholesaler
  asking_price NUMERIC(12,2)
  wholesaler_arv NUMERIC(12,2)
  wholesaler_rehab_estimate NUMERIC(12,2)

  -- נתוני החישוב שלנו
  our_arv NUMERIC(12,2)
  our_rehab_estimate NUMERIC(12,2)
  mao NUMERIC(12,2)                     -- Maximum Allowable Offer
  estimated_roi_percent NUMERIC(6,2)
  estimated_monthly_rent NUMERIC(10,2)
  estimated_cash_flow NUMERIC(10,2)

  raw_email JSONB                       -- המייל המקורי לתיעוד
  metadata JSONB

-- נתוני שוק (COMPs, אזור)
deal_market_data
  deal_id UUID FK
  comps JSONB                           -- [{address, sold_price, sold_date, sqft, distance_miles}]
  average_sold_price_per_sqft NUMERIC(10,2)
  average_rent_estimate NUMERIC(10,2)
  rentometer_data JSONB
  crime_score INT                       -- 1-100
  crime_data JSONB
  niche_data JSONB                      -- ציון שכונה, בתי ספר, גילאים
  neighborhood_grade TEXT               -- A/B/C/D
  fetched_at TIMESTAMPTZ

-- הערכת שיפוץ מפורטת
rehab_estimates
  id UUID PK
  deal_id UUID FK
  user_id UUID FK
  method ENUM('ai_photo','manual','template')
  total_cost NUMERIC(12,2)
  ai_analysis_id UUID FK REFERENCES ai_photo_analyses(id)
  notes TEXT
  is_final BOOLEAN                      -- האם זו ההערכה שנשתמש בה
  created_at TIMESTAMPTZ

-- פריטי השיפוץ (מה כלול בהערכה)
rehab_line_items
  id UUID PK
  rehab_estimate_id UUID FK
  material_id UUID FK REFERENCES materials(id)
  category TEXT                         -- Kitchen, Bathroom, Flooring, Roof...
  description TEXT
  quantity NUMERIC(10,2)
  unit TEXT                             -- sqft, unit, item, hour
  unit_price NUMERIC(10,2)              -- מחיר סופי (יכול להיות מותאם למשתמש)
  total NUMERIC(12,2)
  is_user_override BOOLEAN              -- האם המשתמש שינה את המחיר מהברירת מחדל

-- ניתוחי AI על תמונות
ai_photo_analyses
  id UUID PK
  deal_id UUID FK
  user_id UUID FK
  photo_urls TEXT[]
  detected_issues JSONB                 -- [{room, issue, severity, suggested_fix, cost_range}]
  raw_ai_response TEXT
  model_used TEXT
  tokens_used INT
  created_at TIMESTAMPTZ

-- מחירון חומרים גלובלי
materials
  id UUID PK
  category TEXT                         -- Kitchen, Bathroom, Flooring, Electrical, Plumbing...
  subcategory TEXT
  name TEXT                             -- "Vinyl Plank Flooring", "Interior Paint"
  default_unit TEXT                     -- sqft, gallon, item
  default_price NUMERIC(10,2)           -- מחיר ברירת מחדל בממוצע USA
  market_range JSONB                    -- {"low": 2.5, "high": 4.5, "average": 3.5}
  labor_included BOOLEAN
  is_active BOOLEAN
  updated_at TIMESTAMPTZ

-- מחירונים מותאמים אישית
user_material_prices
  user_id UUID FK
  material_id UUID FK
  custom_price NUMERIC(10,2)
  notes TEXT
  updated_at TIMESTAMPTZ
  PRIMARY KEY (user_id, material_id)

-- לוגים / audit
deal_events
  id UUID PK
  deal_id UUID FK
  event_type TEXT                       -- 'email_received','analysis_started','comps_fetched'...
  payload JSONB
  created_at TIMESTAMPTZ
```

### 4.2 מדיניות RLS (Row Level Security)
כל טבלה שקשורה למשתמש (deals, rehab_estimates, user_preferences...) מוגנת ב-RLS כך שמשתמש רואה רק את הנתונים שלו. Admin רואה הכל דרך service role.

---

## 5. תכונות מרכזיות (Features)

### 5.1 F1 - חיבור תיבת מייל (Email Integration)
**Priority:** P0 (חובה ל-MVP)

**תיאור:**
- המשתמש מחבר את תיבת ה-Gmail שלו ב-OAuth 2.0.
- בוחר תוויות (Labels) לסרוק, למשל "Deals", "Wholesalers".
- המערכת מריצה סנכרון ראשוני של 30 הימים האחרונים.
- Webhook מ-Gmail (Push Notifications via Pub/Sub) מפעיל ניתוח בזמן אמת כשמגיע מייל חדש.

**קריטריוני קבלה:**
- חיבור פועל תוך פחות מ-60 שניות.
- לפחות 90% מהמיילים של Wholesalers מזוהים כעסקאות.
- ניתן לחבר עד 3 תיבות מייל למשתמש.

### 5.2 F2 - חילוץ נתונים אוטומטי (Email Parsing)
**Priority:** P0

**תיאור:**
- Claude מקבל את גוף המייל + כותרת.
- מחלץ בסכמה מובנית: כתובת מלאה, מחיר מבוקש, ARV, גודל, מספר חדרים/מקלחות, קישור לתמונות, שם ה-Wholesaler.
- אם חסרים נתונים - מסמן את העסקה כ"חסרים נתונים" ומבקש מהמשתמש להשלים ידנית.

**סכמת חילוץ (Structured Output):**
```typescript
{
  address: { line1, city, state, zip },
  price: { asking, arv_proposed, rehab_proposed },
  property: { type, beds, baths, sqft, year_built },
  images: string[],
  contact: { wholesaler_name, phone, email },
  urls: string[]
}
```

### 5.3 F3 - סקרייפינג נתוני שוק
**Priority:** P0

**תיאור:**
עבור כל עסקה - שליחת workers מקבילים לאתרים הבאים:

| מקור | נתונים | תדירות רענון |
|------|--------|--------------|
| Zillow | Zestimate, בעלים, היסטוריית מכירות, תמונות | לפי דרישה + 24h cache |
| Redfin | מכירות אחרונות ברדיוס, סטטוס שוק | לפי דרישה + 24h cache |
| Rentometer | שכ"ד ממוצע ל-3 מייל רדיוס | לפי דרישה + 7d cache |
| SpotCrime | ציון פשיעה, סוגי פשעים אחרונים | לפי דרישה + 7d cache |
| Niche | ציון שכונה, בתי ספר, גילאי אוכלוסייה | לפי דרישה + 30d cache |
| TruePeopleSearch | פרטי בעלים למי שרוצה לפנות ישירות | על-פי-דרישה בלבד |

**הערה משפטית:** יש לבדוק ToS של כל אתר. במקום סקרייפינג ישיר ניתן לשקול APIs חלופיים: RentCast, ATTOM Data, Rentometer API (בתשלום). המלצה: MVP עם סקרייפינג, Production עם APIs.

### 5.4 F4 - חישוב Comps
**Priority:** P0

**אלגוריתם:**
1. שליפת נכסים שנמכרו ב-6 חודשים אחרונים ברדיוס 1 מייל.
2. סינון: אותו סוג נכס, ±20% גודל, ±10 שנות בנייה.
3. אם פחות מ-3 comps - הרחבת רדיוס ל-2 מייל.
4. חישוב חציון של Sold Price per SqFt.
5. **ARV שלנו** = חציון × גודל הנכס × מקדם תיקון (מצב, תוספות).

### 5.5 F5 - נוסחת חישוב עסקה
**Priority:** P0

**נוסחאות (על בסיס שיטת עבודה מקובלת - יש לעדכן לפי מסמכי הלקוח):**

```
MAO = (ARV × 70%) - Rehab - Wholesaler Fee - Closing Costs

Deal Score:
  = weight1 × (MAO - Asking Price) / Asking Price      // כמה הצעה טובה
  + weight2 × Neighborhood Grade (A=100, D=25)         // איכות שכונה
  + weight3 × (Estimated Rent × 12) / Total Investment  // Rental yield
  - weight4 × Crime Score                              // עונש פשיעה
  - weight5 × Days on Market Anomaly

Verdict Rules:
  score >= 75 → ✅ GREAT
  score 50-75 → ⚠️ OK / Needs Review
  score < 50  → ❌ BAD

For Rental (Buy & Hold):
  Monthly Cash Flow = Rent - (Mortgage + Taxes + Insurance + PM Fee + Maintenance Reserve + Vacancy Reserve)
  Cash-on-Cash ROI = (Annual Cash Flow / Total Cash Invested) × 100

For Flip:
  Net Profit = ARV - Total Investment - Selling Costs (6%) - Holding Costs (6 months)
  ROI = Net Profit / Total Investment × 100
```

**חשוב:** הנוסחה המדויקת תלויה במסמכי הלקוח (Excel + Notion). באפיון המפורט לאחר סקירת המסמכים - נחלץ את הנוסחה המדויקת שלו.

### 5.6 F6 - מסך עסקה - תצוגה מתומצתת + מפורטת
**Priority:** P0

**Layout שני-מצבי:**

**מצב תמצית (ברירת מחדל):**
```
┌──────────────────────────────────────────────┐
│  [✅ GREAT DEAL]           Score: 82/100     │
│                                              │
│  123 Main St, Indianapolis, IN 46201        │
│  3 BR / 2 BA / 1,450 sqft / Built 1965      │
│                                              │
│  ┌────────────┐  ┌────────────┐  ┌─────────┐│
│  │ Asking     │  │ Our MAO    │  │ Margin  ││
│  │ $85,000    │  │ $102,000   │  │ +20%    ││
│  └────────────┘  └────────────┘  └─────────┘│
│                                              │
│  ARV: $165,000 · Rehab: $28,000 · Rent:$1,350│
│                                              │
│  [ Show Full Analysis ▼ ]   [Save] [Reject]  │
└──────────────────────────────────────────────┘
```

**מצב מפורט (Drill-down):**
- טאב 1: **סקירה** - כל השדות למעלה + מפה + תמונות.
- טאב 2: **Comps** - טבלה של 5-10 נכסים שנמכרו + מפה.
- טאב 3: **שוק** - Rentometer, SpotCrime, Niche, מגמות מחירים.
- טאב 4: **שיפוץ** - פירוט מלא של הערכת השיפוץ.
- טאב 5: **חישובים** - כל הנוסחאות + הצגת המשתנים שהמשתמש הגדיר.
- טאב 6: **מקור** - המייל המקורי + לינק לכל מקור נתונים חיצוני.

### 5.7 F7 - מחשבון שיפוץ ידני
**Priority:** P0

**תהליך:**
1. המשתמש נכנס למסך "Rehab Calculator" של עסקה.
2. בוחר מקטגוריות (Kitchen, Bathroom, Flooring, Roof, HVAC, Electrical, Plumbing, Paint, Exterior, Landscaping).
3. עבור כל קטגוריה - רואה רשימת פריטים מהמחירון עם כמות ומחיר.
4. יכול להוסיף/להסיר/לשנות כמויות.
5. יכול לשנות מחיר של פריט (יישמר כמחיר אישי שלו לפריט לעתיד).
6. המערכת מציגה סה"כ בזמן אמת.
7. שמירת ההערכה - מעדכן את `our_rehab_estimate` של העסקה ומריץ מחדש את החישוב.

### 5.8 F8 - הערכת שיפוץ מבוססת AI
**Priority:** P1 (חשוב, אבל אחרי MVP)

**תהליך:**
1. המשתמש לוחץ "Analyze with AI".
2. המערכת אוספת את כל התמונות של הנכס (מהמייל / מקישור Wholesaler).
3. שולחת ל-Claude (multimodal) עם הנחייה מובנית:
   - זהה חדרים בתמונות.
   - עבור כל חדר - זהה בעיות שיפוץ (רצפה, קירות, אינסטלציה, ריהוט, מטבח, אמבטיה).
   - עבור כל בעיה - קבע חומרה (Cosmetic / Moderate / Major).
   - החזר רשימה מובנית של פריטים שדורשים תיקון.
4. המערכת ממפה כל פריט שזוהה למחירון (materials table).
5. מציגה למשתמש את הרשימה עם checkboxes:
   - ☑ אישור פריט
   - ➕ הוספת פריט ידני
   - ✏️ עריכת כמות/מחיר
   - ❌ הסרת פריט
6. סה"כ מתעדכן בזמן אמת.

**דוגמת פרומפט ל-Claude:**
```
You are a real estate rehab expert. Analyze these photos of a property in [ZIP].
For each photo, identify:
1. Room type
2. Issues visible (categorized: Cosmetic / Moderate / Major)
3. Suggested repairs
Return structured JSON matching this schema: {...}
```

### 5.9 F9 - ניהול מחירון חומרים
**Priority:** P0

**מבנה:**
- **מחירון גלובלי** - מנוהל ע"י Admin, כולל 200-300 פריטים סטנדרטיים.
- **מחירון אישי** - המשתמש יכול לדרוס מחיר של כל פריט.

**UI:**
- טבלה עם קטגוריות בצד + חיפוש.
- לכל פריט: שם, יחידה (sqft/item), מחיר ברירת מחדל, מחיר שלך.
- כפתור "Reset to default" מחזיר למחיר הגלובלי.
- אפשרות ייבוא/ייצוא Excel לגיבוי.

### 5.10 F10 - Dashboard ראשי
**Priority:** P0

**מסך הבית:**
- KPIs עליונים: עסקאות היום, עסקאות פתוחות, גדולות טובות השבוע.
- Feed של עסקאות אחרונות עם verdict color-coded.
- פילטרים: verdict, מדינה, טווח מחיר, סוג נכס, wholesaler, תאריך.
- אפשרות "Bulk Reject" - סימון מספר עסקאות ודחייה.

### 5.11 F11 - התראות
**Priority:** P1

- מייל / Push notification כשמופיעה עסקה עם ציון > 80.
- Daily digest של כל העסקאות היום.
- אינטגרציה עם WhatsApp / Telegram Bot (P2).

### 5.12 F12 - הגדרות משתמש
**Priority:** P0

- פרופיל אישי.
- פרמטרי ניתוח (min ROI, min cash flow, strategy...).
- חשבונות מייל מחוברים.
- שווקים במעקב.
- מחירון אישי (F9).
- ניהול מנוי / תשלום.

### 5.13 F13 - ניהול צוות (Multi-user)
**Priority:** P2

- הזמנת חברי צוות (Analysts, Viewers).
- הרשאות שונות (Owner, Editor, Viewer).
- הקצאת עסקאות לחברי צוות.

---

## 6. זרימות משתמש (User Flows)

### 6.1 Onboarding משתמש חדש
1. הרשמה (Email + Password או Google OAuth).
2. שאלון קצר: אסטרטגיה (Flip/Rental/Wholesale/BRRRR), שווקים מועדפים, ROI מינימלי.
3. חיבור תיבת מייל ראשונה.
4. הנחיית תוויות לסרוק / יצירת פילטר Gmail אוטומטית.
5. סנכרון ראשוני של 30 יום אחרונים - מוצג progress bar.
6. הצגת Dashboard עם עסקאות מנותחות.

### 6.2 ניתוח עסקה חדשה (Automated Flow)
1. Wholesaler שולח מייל למשתמש.
2. Gmail Push מודיע למערכת שלנו.
3. Worker קולט את המייל, מזהה אם זו עסקה.
4. חילוץ נתונים ע"י Claude.
5. יצירת רשומה חדשה ב-`deals` עם status='analyzing'.
6. שליחת 5 sub-jobs במקביל (Zillow, Redfin, Rentometer, SpotCrime, Niche).
7. עם סיום כל sub-job - עדכון `deal_market_data`.
8. עם השלמת כל הנתונים - הרצת חישוב Comps ונוסחת ניתוח.
9. עדכון status='ready', verdict, score.
10. Realtime notification למשתמש: "New deal analyzed".
11. עדכון Dashboard אוטומטי.

### 6.3 בדיקה ידנית של שיפוץ ב-AI
1. משתמש פותח עסקה, לוחץ "Analyze Rehab".
2. בחירה: "Use AI" / "Build Manually" / "Use Template".
3. במקרה AI: המערכת אוספת תמונות מהמייל + Zillow, מציגה למשתמש לאישור.
4. שליחה ל-Claude, spinner "Analyzing photos...".
5. הצגת רשימת פריטים שזוהו + עלות משוערת.
6. משתמש עורך, מוסיף, מסיר.
7. שמירה - חוזר למסך העסקה עם הערכת השיפוץ העדכנית + חישוב מעודכן.

---

## 7. אינטגרציות (Integrations)

### 7.1 Gmail API
- OAuth 2.0 scopes: `gmail.readonly`, `gmail.labels`.
- Watch/Push via Google Pub/Sub.
- Refresh Token מוצפן ונשמר ב-Supabase Vault.

### 7.2 Claude API (Anthropic)
- Model: `claude-opus-4-8` לחילוץ מייל ולניתוח תמונות (משימות קריטיות).
- Model: `claude-haiku-4-5-20251001` למשימות פשוטות (סיווג, סיכום).
- Prompt Caching לחיסכון בעלויות (system prompt ומחירון חוזרים על עצמם).
- Rate limit per user לשליטה בעלויות.

### 7.3 Real Estate Data APIs (חלופה לסקרייפינג)
- **RentCast API** - לשכ"ד ו-comps (~$30/month + per call).
- **ATTOM Data** - לנתוני בעלות, היסטוריה (יקר, אבל מקצועי).
- **Rentometer API** (בתשלום ישיר).

### 7.4 Stripe
- ניהול מנויים (Trial, Basic, Pro, Team).
- Metered billing על ניתוחי AI מעל quota.

### 7.5 Twilio / SendGrid
- שליחת התראות SMS / מייל.

---

## 8. UI / UX

### 8.1 Design System
- **Framework:** shadcn/ui + Tailwind CSS.
- **גופנים:** Inter (UI) + JetBrains Mono (מספרים).
- **צבעים:**
  - Primary: Slate/Indigo (מקצועי, נדל"ן).
  - Success (GREAT DEAL): Emerald 500.
  - Warning (OK): Amber 500.
  - Danger (BAD): Rose 500.
- **Dark Mode:** תמיכה מלאה - יזמים עובדים גם בלילה.

### 8.2 עקרונות UX
- **Numbers First:** דגש חזק על מספרים גדולים, ברורים, מעוצבים.
- **Progressive Disclosure:** תמצית לפני פירוט.
- **Keyboard Shortcuts:** J/K לניווט בין עסקאות, S=Save, R=Reject.
- **Bulk Actions:** ניהול המוני של עסקאות דחויות.

### 8.3 מסכים עיקריים (Screens)
1. Login / Signup / Onboarding
2. Dashboard
3. Deals List (Table View + Card View)
4. Deal Detail (תמצית + טאבים)
5. Rehab Calculator (Modal / Full page)
6. AI Photo Analysis
7. Materials Price List
8. Settings (Profile, Preferences, Email Accounts, Billing)
9. Admin Panel (ניהול users, materials, מעקב usage)

---

## 9. אבטחה, פרטיות ותאימות

### 9.1 אבטחה
- כל התקשורת ב-HTTPS/TLS 1.3.
- Encryption at rest של OAuth tokens (Supabase Vault / KMS).
- Row Level Security על כל טבלה עם user_id.
- Rate limiting ב-API (10 req/sec לכל user, 3 req/sec לחישובי AI).
- CSRF, XSS protection.
- Audit log של פעולות רגישות (חיבור מייל, שינוי מנוי, ייצוא נתונים).

### 9.2 פרטיות (GDPR/CCPA Best Practices)
- Data Processing Agreement עם Anthropic.
- אין שמירת מיילים מלאים אחרי חילוץ נתונים (רק 30 יום לצורך debug).
- Right to Deletion - מחיקת חשבון מוחקת את כל הנתונים תוך 30 יום.
- Data Export - ייצוא כל העסקאות ל-CSV/JSON.

### 9.3 תאימות משפטית (Scraping)
- לפני Production - מעבר ל-APIs מסחריים במקום סקרייפינג.
- הצגת מקורות בכל עסקה (Attribution).
- לא לחשוף נתונים בבעלות זכויות יוצרים ישירות מ-Zillow (רק סיכומים).

---

## 10. מדדי הצלחה (KPIs)

### 10.1 מדדי מוצר
- **Deal Analysis Time:** זמן ממוצע מקבלת מייל עד verdict < 30 שניות (P95 < 60s).
- **Accuracy:** 90% הסכמה בין verdict של המערכת לבין החלטת המשתמש (Save vs Reject).
- **Photo Analysis Accuracy:** 80% מהפריטים שזוהו על ידי ה-AI מאושרים על ידי המשתמש.

### 10.2 מדדי עסקיים
- **Trial to Paid:** 25%.
- **MRR growth:** יעד 20% חודש-חודש.
- **Churn:** מתחת ל-5% חודשי.
- **NPS:** מעל 40.

### 10.3 מדדים תפעוליים
- **API Cost per Deal:** מתחת ל-$0.15 בממוצע (עם Prompt Caching).
- **Scraping Success Rate:** מעל 95%.
- **Uptime:** 99.5%.

---

## 11. שלבי פיתוח (Roadmap)

### שלב 0 - הכנות (שבוע 1-2)
- הקמת Supabase project.
- הקמת Next.js + shadcn + auth.
- יצירת schema DB לפי section 4.
- ייבוא ראשוני של מחירון חומרים מה-Excel של הלקוח.
- הקמת CI/CD (Vercel + Supabase Preview).

### שלב 1 - MVP חלקי (שבוע 3-6)
- F1 Email Integration (Gmail בלבד).
- F2 Email Parsing.
- F5 נוסחת חישוב בסיסית (על בסיס Excel הלקוח).
- F6 מסך עסקה תמצית + מפורט.
- F10 Dashboard.
- F12 Settings בסיסיים.
- **ללא סקרייפינג עדיין** - חישוב Comps מתבצע ידנית ע"י המשתמש (הוא מזין ARV והשכ"ד).

### שלב 2 - MVP מלא (שבוע 7-10)
- F3 סקרייפינג / API integrations (Zillow, Rentometer, SpotCrime).
- F4 חישוב Comps אוטומטי.
- F7 מחשבון שיפוץ ידני מלא.
- F9 ניהול מחירון אישי.

### שלב 3 - AI Enhancement (שבוע 11-13)
- F8 הערכת שיפוץ מבוססת AI.
- שיפור דיוק חילוץ מיילים.
- F11 התראות.

### שלב 4 - Growth (שבוע 14+)
- F13 Multi-user teams.
- אינטגרציות Outlook, IMAP.
- WhatsApp/Telegram bot.
- API ציבורי לפיתוח אפליקציות של Wholesalers.

---

## 12. הנחות ותלויות

### 12.1 הנחות
- הלקוח יספק את קבצי ה-Excel והמסמכים לחילוץ נוסחת החישוב המדויקת.
- הלקוח יאשר תקציב חודשי לעלויות: Claude API, DB, hosting, proxies (סה"כ ~$300-500 חודשי ב-MVP).
- מספר משתמשים ראשוני: 10-50 (ב-MVP).

### 12.2 תלויות חיצוניות
- Anthropic API SLA.
- Google Gmail API pricing/limits.
- זמינות של Real Estate data providers.

### 12.3 סיכונים
- **סקרייפינג של Zillow/Redfin עלול להיחסם** - מיטיגציה: מעבר ל-APIs.
- **דיוק חילוץ מיילים תלוי בפורמט Wholesalers** - מיטיגציה: fine-tuning והוספת templates ל-Wholesalers פופולריים.
- **עלויות AI עלולות לגדול** - מיטיגציה: Prompt Caching, בחירת מודל מותאם למשימה, quota למשתמש.

---

## 13. שאלות פתוחות ללקוח (Open Questions)

לפני מעבר למוקאפ ופיתוח - חשוב לקבל תשובות ל:

1. **נוסחת חישוב מדויקת** - מה בדיוק המשקלות של MAO, ROI, Cash Flow בשיטת העבודה שלך? נבקש את ה-Excel שהזכרת.
2. **קטגוריות שיפוץ** - כמה קטגוריות? האם מספיק 10 שהצענו או שיש קטגוריות ייחודיות לך?
3. **סוגי נכסים** - האם מתמקדים ב-SFH בלבד? Multi-family כלול?
4. **מספר משתמשים ראשוני** - כמה יזמים משתמשים במערכת בשלב ראשון?
5. **תקציב חודשי** - מה תקציב תפעולי חודשי מוסכם?
6. **תמחור סופי** - האם המערכת תיהיה SaaS בעל תשלום חודשי או פרויקט חד-פעמי ללקוח בלבד?
7. **שווקים גיאוגרפיים** - האם ארה"ב כולה או ריכוז ב-Midwest? זה משפיע על choice של data providers.
8. **אינטגרציות עתידיות** - האם רוצה לחבר CRM (HubSpot/Pipedrive) לניהול עסקאות אחרי אישור?

---

## 14. סיכום

מערכת LOfraier מוקמת כפלטפורמת SaaS מודרנית לניתוח עסקאות נדל"ן בארה"ב. השילוב של קליטה אוטומטית ממייל, סקרייפינג של אתרי שוק, חישובים מבוססי שיטת עבודה ייחודית, ומחשבון שיפוץ חכם (ידני + AI) - יוצר יתרון תחרותי משמעותי ליזם.

בשלב הבא (לאחר אישור אפיון זה) - ניצור:
1. **Mockups** של המסכים המרכזיים (Dashboard, Deal Detail, Rehab Calculator).
2. **דוגמת flow אינטראקטיבי** ב-Figma / HTML prototype.
3. **פירוט טכני נוסף** של נוסחת החישוב אחרי סקירת ה-Excel של הלקוח.

---

**המסמך הבא במסלול:** מוקאפ + Prototype אינטראקטיבי
