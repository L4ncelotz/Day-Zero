# Internship Countdown — Implementation Specification

> เว็บนับถอยหลังวันฝึกงานแบบหน้าเดียว เน้น Visual ระดับ showcase ตัวเลขอ่านง่าย เปิดเร็ว และมีหน้า Admin ลับสำหรับแก้วันหยุดกับวันเสาร์ทำงาน โดยทุกคนเห็นข้อมูลชุดเดียวกัน

---

## 0. Locked Decisions

ข้อกำหนดต่อไปนี้ถือว่าอนุมัติแล้ว ไม่ต้องถามซ้ำระหว่างพัฒนา

| รายการ | ข้อกำหนด |
|---|---|
| จุดประสงค์ | เว็บนับถอยหลังวันฝึกงานเท่านั้น |
| วันเริ่มนับ Progress | `2026-07-29` |
| วันฝึกงานวันสุดท้าย | `2026-10-30` |
| Timezone | `Asia/Bangkok` |
| วิธีนับ | นับรวมวันเริ่มและวันสุดท้าย |
| วันทำงานปกติ | จันทร์–ศุกร์ |
| วันหยุดปกติ | เสาร์–อาทิตย์ |
| วันยกเว้น | Admin เพิ่มวันเสาร์ทำงาน หรือวันธรรมดาที่หยุดได้ |
| ผู้ชม | ทุกคนเห็นข้อมูลและตัวเลขชุดเดียวกัน |
| Public page | หน้าเดียว `/` |
| Admin page | `/control-room` ไม่แสดงลิงก์บนหน้า Public |
| Admin login | รหัสผ่านเดียว ไม่มีระบบสมาชิก |
| Shared storage | Upstash Redis |
| Deployment | Vercel |
| ภาษา UI | ไทยเป็นหลัก ใช้ English microcopy เฉพาะส่วนตกแต่ง |
| Theme | Cinematic Dark + Minimal Editorial |
| Core motion | Motion + GSAP |
| Animated centerpiece | Rive 1 ชิ้น |
| Light mode | ไม่มี |

### Baseline สำหรับตรวจ Logic

ถ้ายังไม่มีวันยกเว้น ระหว่าง `2026-07-29` ถึง `2026-10-30` แบบนับรวมทั้งสองวัน:

- วันปฏิทินทั้งหมด: **94 วัน**
- วันทำงานจันทร์–ศุกร์ทั้งหมด: **68 วัน**

ตัวเลขนี้ใช้เป็น Unit Test baseline เท่านั้น เมื่อ Admin เพิ่ม override ต้องคำนวณใหม่ตามข้อมูลจริง

---

## 1. Product Goal

เมื่อผู้ใช้เปิดเว็บ ต้องเข้าใจภายใน 2 วินาทีว่า:

1. เหลือวันทำงานอีกกี่วัน
2. วันสุดท้ายคือวันไหน
3. ผ่านช่วงนับถอยหลังไปแล้วกี่เปอร์เซ็นต์
4. ตารางวันทำงานอัปเดตล่าสุดเมื่อใด

เว็บต้องให้ความรู้สึกเหมือน **digital countdown installation** ไม่ใช่ Dashboard, To-do app หรือเว็บบันทึกฝึกงาน

### Success Criteria

- ตัวเลขวันทำงานเป็นสิ่งที่เด่นที่สุดบนหน้าจอ
- Mobile เปิดมาเห็นข้อมูลหลักครบโดยแทบไม่ต้องเลื่อน
- ทุกคนเห็นค่าเดียวกัน
- Admin เพิ่มวันยกเว้นได้ภายในประมาณ 20 วินาที
- เว็บยังใช้งานได้ครบเมื่อปิด Animation
- ไม่มีหน้าตาแบบ Template Dashboard สำเร็จรูป
- Lighthouse performance เป้าหมายอย่างน้อย 90 บน Production build

---

## 2. Non-Goals

ห้ามเพิ่มสิ่งต่อไปนี้ใน MVP:

- Daily journal
- To-do list
- Check-in เข้าออกงาน
- ระบบบันทึกสิ่งที่เรียนรู้
- Milestone และ Project tracker
- Calendar เต็มหน้า
- ระบบสมาชิกหลายคน
- Profile ผู้ใช้
- Comment หรือ Social feed
- Push notification
- Email notification
- Theme switcher
- การแก้วันเริ่มหรือวันสิ้นสุดจาก Admin
- CMS เต็มรูปแบบ
- Three.js scene หนัก ๆ
- Lottie ซ้ำหน้าที่กับ Rive

---

## 3. Recommended Tech Stack

| ส่วน | เทคโนโลยี | หน้าที่ |
|---|---|---|
| Framework | Next.js App Router + TypeScript | Routing, Server Components, Server Actions, deployment |
| Styling | Tailwind CSS | Responsive layout, tokens, utilities |
| UI primitives | shadcn/ui | Dialog, Button, Input, Select, AlertDialog, Table, Sheet |
| Main animation | Motion for React | Component transitions, digit animation, dialogs, micro-interactions |
| Timeline animation | GSAP | Intro choreography และ scroll/pointer sequence ที่ซับซ้อน |
| Animated graphic | Rive | วงแหวนหรือ abstract energy field รอบตัวเลข |
| Icons | Lucide React | Iconography |
| Date calculation | date-fns | Date parsing, comparison และ formatting |
| Validation | Zod | Validate form และ server inputs |
| Shared storage | Upstash Redis | เก็บ schedule overrides ส่วนกลาง |
| Admin session | `jose` + signed HttpOnly cookie | Login แบบรหัสผ่านเดียว |
| Password hashing | `bcryptjs` | เปรียบเทียบ password hash |
| Toast | Sonner | Save/delete/login feedback |
| Font | Geist + Noto Sans Thai | Display และข้อความไทย |
| Testing | Vitest + Playwright | Logic tests และ E2E |
| Deployment | Vercel | Hosting Next.js |

### Library Responsibility Rule

เพื่อไม่ให้ Animation ชนกัน:

- **Motion** ดูแล component-level animation
- **GSAP** ดูแล intro timeline และ sequence ที่ต้อง sync หลาย element
- **Rive** ดูแล graphic centerpiece เพียง 1 จุด
- **CSS** ดูแล gradient drift, grain และ hover ง่าย ๆ

ห้ามใช้ Motion และ GSAP ควบคุม property เดียวกันของ element เดียวกันในเวลาเดียวกัน

### Dependency Guideline

```bash
npm install motion gsap @rive-app/react-canvas date-fns zod lucide-react sonner jose bcryptjs @upstash/redis
npm install -D vitest @testing-library/react @testing-library/jest-dom @playwright/test
```

ไม่ต้องติดตั้ง Zustand, Redux, Prisma, Drizzle หรือ ORM ใด ๆ

---

## 4. Information Architecture

```text
/
└── Public countdown experience

/control-room
├── Login state
└── Authenticated schedule management
```

ไม่มี Navbar แบบเว็บทั่วไป ไม่มี sidebar และไม่มีหลายหน้าสำหรับผู้ชม

---

## 5. Public Page UX

## 5.1 Desktop Layout

```text
┌──────────────────────────────────────────────────────────────────────┐
│ INTERNSHIP COUNTDOWN                                   [share icon] │
│                                                                      │
│                           เหลืออีก                                   │
│                                                                      │
│                             68                                       │
│                        วันทำงาน                                      │
│                                                                      │
│              ─────────────  0% COMPLETE  ─────────────               │
│                                                                      │
│                       30 OCTOBER 2026                                │
│                                                                      │
│        94 วันปฏิทิน  ·  13 สัปดาห์  ·  Updated 29 Jul 2026          │
│                                                                      │
│                       [ ดูวิธีนับ ]                                  │
└──────────────────────────────────────────────────────────────────────┘
```

หลักการ:

- Hero ใช้พื้นที่เกือบเต็ม viewport
- ตัวเลขต้องใหญ่และไม่มี Card ครอบ
- Content width ไม่เกินประมาณ `1440px`
- ข้อมูลรองต้องเล็กและไม่แย่งสายตา
- ใช้พื้นที่ว่างเป็นองค์ประกอบหลัก

## 5.2 Mobile Layout

- ใช้ `min-height: 100svh`
- Header สูงไม่เกิน 56px
- ตัวเลขใช้ `clamp(7rem, 35vw, 12rem)`
- Stats รองเรียง 2 แถวได้
- ปุ่ม `ดูวิธีนับ` ต้องกดง่ายอย่างน้อย 44px
- เว้น safe area สำหรับ iPhone
- ห้าม overflow แนวนอน

## 5.3 Main Content Order

1. `INTERNSHIP COUNTDOWN`
2. ข้อความ `เหลืออีก`
3. ตัวเลขวันทำงาน
4. Label `วันทำงาน`
5. Progress line และเปอร์เซ็นต์
6. วันสิ้นสุด
7. วันปฏิทิน / สัปดาห์ / updated date
8. ปุ่ม `ดูวิธีนับ`
9. Upcoming override แบบ subtle ถ้ามี

## 5.4 Secondary Toggle

มี segmented control ขนาดเล็ก:

```text
[ วันทำงาน ] [ วันทั้งหมด ]
```

- Default: `วันทำงาน`
- Toggle เปลี่ยนเฉพาะค่าหลักและ label
- Progress ยังคำนวณตามประเภทที่เลือก
- ค่า toggle เก็บใน `localStorage`
- Toggle เป็น preference ส่วนตัวเท่านั้น ไม่แก้ shared data

## 5.5 Count Method Dialog

กด `ดูวิธีนับ` แล้วเปิด Dialog โดยไม่เปลี่ยนหน้า

แสดง:

- จันทร์–ศุกร์นับเป็นวันทำงานตามปกติ
- เสาร์–อาทิตย์ไม่นับ เว้นแต่ Admin กำหนดเป็นวันทำงานพิเศษ
- วันหยุดบริษัทในวันธรรมดาจะถูกหักออก
- นับรวมวันนี้หากเป็นวันทำงาน
- นับรวมวันที่ 30 ตุลาคม 2026
- วันยกเว้นที่กำลังจะมาถึงไม่เกิน 5 รายการ
- วันที่อัปเดตล่าสุด

ห้ามแสดง Calendar เต็มเดือน

## 5.6 Upcoming Schedule Notice

ถ้ามี override ภายใน 14 วัน ให้แสดงบรรทัดเล็กใต้ stats เช่น:

```text
SAT 08 AUG · ทำงานพิเศษ
```

หรือ

```text
WED 12 AUG · วันหยุดบริษัท
```

ห้ามแสดงเกิน 1 รายการบน Hero ส่วนรายการอื่นอยู่ใน Dialog

---

## 6. Page States

## 6.1 Before Start Date

ก่อน `2026-07-29`:

```text
COUNTDOWN STARTS SOON
29 JULY 2026
```

- Progress = 0%
- แสดงวันถึงวันเริ่ม

## 6.2 Active Countdown

ระหว่าง `2026-07-29` ถึง `2026-10-30`:

- แสดงจำนวนวันที่เหลือ
- ตัวเลขเปลี่ยนเมื่อเข้าสู่วันใหม่ตาม Asia/Bangkok
- Revalidate schedule ทุกครั้งที่โหลดหน้า

## 6.3 Final Day

วันที่ `2026-10-30`:

```text
THE FINAL DAY
TODAY
วันสุดท้ายของการฝึกงาน
```

- ใช้ accent โทน amber/gold
- Progress ยังไม่เกิน 100% จนกว่าจะพ้นวัน
- Animation พิเศษต้องสุภาพ ไม่ใช่ confetti เต็มหน้าจอ

## 6.4 Completed

หลังพ้น `2026-10-30`:

```text
INTERNSHIP
COMPLETED
30 OCTOBER 2026
```

- Progress = 100%
- เล่น completion effect ครั้งเดียวต่อ browser session
- ปิด toggle วันทำงาน/วันทั้งหมด
- ยังคงแสดงวันที่อัปเดต schedule ล่าสุด

## 6.5 Data Failure

ถ้า Upstash อ่านไม่ได้:

- ใช้ fallback จาก schedule ว่าง
- แสดง badge เล็ก `Using base schedule`
- ไม่ทำให้หน้าเว็บ crash
- Log error ฝั่ง server
- ไม่เปิดเผย token หรือรายละเอียดระบบแก่ผู้ใช้

---

## 7. Visual Direction

## 7.1 Style

แนวหลัก: **Cinematic Dark + Minimal Editorial**

องค์ประกอบ:

- พื้นหลังดำอมกรม ไม่ใช่ดำสนิท
- ตัวเลขสี off-white
- Ambient glow สีน้ำเงิน/ม่วงเคลื่อนช้ามาก
- Grain บางระดับ 2–4% opacity
- เส้น progress บางและคม
- Dialog และ Admin ใช้ solid dark surface มากกว่า glass หนา
- Border ใช้เส้นขาวโปร่ง ไม่ใช้เงาหนัก
- ไม่มี Neon หลายสีพร้อมกัน

## 7.2 Color Tokens

```css
:root {
  --background: #06070a;
  --background-soft: #0a0d13;
  --surface: #10141c;
  --surface-elevated: #151a24;
  --text-primary: #f3f6fb;
  --text-secondary: #9ca7b6;
  --text-tertiary: #687384;
  --line: rgba(255, 255, 255, 0.10);
  --line-strong: rgba(255, 255, 255, 0.18);
  --accent: #7ea6ff;
  --accent-secondary: #9a7cff;
  --success: #7ed6a4;
  --warning: #f0bf68;
  --danger: #ff8888;
}
```

## 7.3 Stage-Based Accent

| วันทำงานที่เหลือ | Accent |
|---|---|
| มากกว่า 60 | Blue/Cyan |
| 31–60 | Indigo/Violet |
| 8–30 | Violet + soft pink |
| 1–7 | Amber + warm red |
| Completed | Gold + soft green |

เปลี่ยนเฉพาะ glow, progress และ Rive state ไม่เปลี่ยน layout

## 7.4 Typography

- English display และตัวเลข: Geist
- ข้อความไทย: Noto Sans Thai
- ใช้ได้ไม่เกิน 2 font families
- ตัวเลขต้องใช้ `font-variant-numeric: tabular-nums`

```css
.countdown-number {
  font-size: clamp(8rem, 24vw, 20rem);
  line-height: 0.78;
  font-weight: 560;
  letter-spacing: -0.075em;
  font-variant-numeric: tabular-nums;
}
```

Eyebrow:

```css
font-size: 0.72rem;
letter-spacing: 0.24em;
font-weight: 600;
text-transform: uppercase;
```

## 7.5 Background Layers

```text
Layer 1: solid background
Layer 2: radial gradients
Layer 3: slow animated mesh/blob
Layer 4: subtle grain SVG
Layer 5: Rive centerpiece behind number
Layer 6: foreground content
```

ห้ามใช้ภาพ stock หรือ background image ขนาดใหญ่

---

## 8. Motion System

## 8.1 Intro Timeline — GSAP

เล่นครั้งแรกของ session ความยาวรวมไม่เกินประมาณ 1.6 วินาที

Sequence:

1. Background glow fade in
2. Eyebrow slide/fade
3. Rive centerpiece opacity up
4. Countdown number rise from `y: 36` และ blur-to-sharp
5. Label fade in
6. Progress line draw
7. Supporting stats stagger
8. Info button fade in

ตัวอย่างแนวทาง:

```ts
const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

timeline
  .from("[data-intro='eyebrow']", { y: 12, opacity: 0, duration: 0.45 })
  .from("[data-intro='number']", { y: 36, opacity: 0, filter: "blur(14px)", duration: 0.75 }, "-=0.2")
  .from("[data-intro='progress']", { scaleX: 0, transformOrigin: "left", duration: 0.65 }, "-=0.35")
  .from("[data-intro='stat']", { y: 8, opacity: 0, stagger: 0.06, duration: 0.35 }, "-=0.25");
```

หาก `prefers-reduced-motion` เป็น true ให้ข้าม timeline และ render final state ทันที

## 8.2 Rolling Number — Motion

- Animate เฉพาะ digit ที่เปลี่ยน
- Digit เก่าเลื่อนขึ้นและ fade out
- Digit ใหม่เลื่อนจากด้านล่าง
- ใช้ spring ที่ damping สูง ไม่เด้งแบบ playful
- ความยาวประมาณ 450–650ms
- ใช้ `AnimatePresence`

ห้าม animate จาก 0 ถึง 68 แบบนับทีละตัว เพราะช้าและดูเป็น gimmick

## 8.3 Rive Centerpiece

ใช้ Rive เพียง 1 ชิ้น เป็น abstract circular field หรือ energy ring อยู่ด้านหลังตัวเลข

State machine inputs ที่ต้องมี:

```text
progress: number 0–100
urgency: number 0–3
pointerX: number -1 ถึง 1
pointerY: number -1 ถึง 1
completed: boolean
reducedMotion: boolean
```

Visual behavior:

- วงแหวนหายใจช้า ๆ
- ความสว่างเพิ่มเมื่อใกล้วันสุดท้าย
- Pointer movement เบามากบน Desktop
- Completed state เปลี่ยนเป็นวงแหวนปิดสมบูรณ์

ถ้าไฟล์ `.riv` ยังไม่มีในช่วงเริ่มพัฒนา:

- ใช้ CSS radial ring placeholder ก่อน
- แยก component API ไว้เหมือนเดิม
- ห้ามให้การไม่มี Rive asset บล็อกการสร้างหน้าและ logic

ไฟล์เป้าหมาย:

```text
/public/rive/countdown-orbit.riv
```

## 8.4 Pointer Parallax

Desktop เท่านั้น:

- Rive และ glow เคลื่อนตามเมาส์ไม่เกิน 18px
- Update ผ่าน `requestAnimationFrame`
- ปิดบน touch device
- ปิดเมื่อ reduced motion
- ไม่ใช้ scroll listener แบบหนัก

## 8.5 Progress Line

- Base line สีขาวโปร่ง
- Fill เป็น gradient ตาม stage
- Motion animate จากค่าก่อนหน้าไปค่าปัจจุบัน
- มี dot ขนาดเล็กตรงปลาย fill
- ไม่มีวง progress dashboard แบบหนา

## 8.6 Completion Effect

- ใช้ Rive completed state + Motion halo
- Halo ขยายออก 1–2 ชั้น
- Particle สูงสุด 24 จุด
- เล่นไม่เกิน 2 วินาที
- บันทึก `sessionStorage` เพื่อไม่เล่นซ้ำทุก refresh

---

## 9. Shared Data Architecture

```text
Browser
   │
   ├── GET /
   │      └── Next.js Server Component
   │             ├── Read schedule JSON from Upstash
   │             ├── Normalize and validate with Zod
   │             ├── Calculate initial countdown
   │             └── Pass safe data to client animation island
   │
   └── /control-room
          ├── Password login Server Action
          ├── Signed HttpOnly admin cookie
          ├── Read current schedule from Upstash
          └── Add/update/delete overrides through Server Actions
```

### Architecture Rules

- Upstash token อยู่ server only
- Browser ห้ามเขียน Redis โดยตรง
- Public page อ่านข้อมูลผ่าน Server Component
- Server Actions ตรวจ session ก่อน mutation ทุกครั้ง
- Date calculation อยู่ใน pure functions
- Client รับเฉพาะ normalized schedule และ calculated values
- ห้ามเก็บ shared schedule ใน `localStorage`
- `localStorage` ใช้ได้เฉพาะ UI preference

---

## 10. Upstash Redis Data Model

ใช้ key เดียว:

```text
internship:countdown:schedule
```

JSON structure:

```json
{
  "version": 1,
  "lastUpdatedAt": "2026-07-29T15:30:00+07:00",
  "overrides": [
    {
      "id": "ovr_01",
      "date": "2026-08-01",
      "status": "working",
      "label": "ทำงานวันเสาร์"
    },
    {
      "id": "ovr_02",
      "date": "2026-08-12",
      "status": "holiday",
      "label": "วันหยุดบริษัท"
    }
  ]
}
```

TypeScript model:

```ts
export type ScheduleStatus = "working" | "holiday";

export type ScheduleOverride = {
  id: string;
  date: string;
  status: ScheduleStatus;
  label: string;
};

export type ScheduleData = {
  version: 1;
  lastUpdatedAt: string;
  overrides: ScheduleOverride[];
};
```

### Validation Rules

- วันที่ต้องเป็น `YYYY-MM-DD`
- วันที่ต้องอยู่ในช่วง `2026-07-29` ถึง `2026-10-30`
- 1 วันมี override ได้เพียง 1 รายการ
- `label` ยาวไม่เกิน 80 ตัวอักษร
- เสาร์–อาทิตย์ + `working` เป็น override ที่ถูกต้อง
- จันทร์–ศุกร์ + `holiday` เป็น override ที่ถูกต้อง
- จันทร์–ศุกร์ + `working` เป็น no-op และไม่ควรบันทึก
- เสาร์–อาทิตย์ + `holiday` เป็น no-op และไม่ควรบันทึก
- Delete หมายถึงกลับไปใช้กฎพื้นฐานของวันนั้น
- Override ต้อง sort ตามวันที่ก่อนบันทึก

### Upstash Fallback

ถ้า key ยังไม่มี ให้สร้างค่าเริ่มต้นใน memory:

```ts
const EMPTY_SCHEDULE: ScheduleData = {
  version: 1,
  lastUpdatedAt: "2026-07-29T00:00:00+07:00",
  overrides: [],
};
```

ไม่ต้อง write ค่าเริ่มต้นลง Redis ตอน public page load

---

## 11. Date and Countdown Logic

## 11.1 Date-Only Rule

อย่าใช้ Date object แบบ UTC ตรง ๆ กับ string `YYYY-MM-DD` เพราะอาจเลื่อนวันตาม timezone

สร้าง utility สำหรับ date-only:

```ts
export function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}
```

ใช้เวลาเที่ยงเพื่อลด DST edge case แม้ Bangkok ไม่มี DST

## 11.2 Bangkok Today

สร้าง server utility แปลงเวลาปัจจุบันเป็นวันที่ Bangkok:

```ts
export function getBangkokDateKey(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
```

ต้องเขียน test ยืนยัน format จริงใน runtime

## 11.3 Working Day Function

```ts
export function isWorkingDay(
  dateKey: string,
  overrides: ScheduleOverride[]
): boolean {
  const override = overrides.find((item) => item.date === dateKey);

  if (override) {
    return override.status === "working";
  }

  const date = parseDateOnly(dateKey);
  const day = date.getDay();
  return day >= 1 && day <= 5;
}
```

## 11.4 Remaining Working Days

นับ inclusive:

```text
max(today, startDate) → endDate
```

- ถ้าวันนี้เป็น working day ให้นับวันนี้
- ถ้าพ้น end date ให้เป็น 0
- ห้ามคืนค่าติดลบ

## 11.5 Calendar Days

- ใช้ difference แบบ date-only
- นับรวมวันปัจจุบันและวันสุดท้าย
- หลังวันสุดท้าย = 0

## 11.6 Progress

Working-day progress:

```text
completedWorkingDays / totalWorkingDays * 100
```

Calendar progress:

```text
completedCalendarDays / totalCalendarDays * 100
```

Clamp ที่ `0..100`

### Boundary Definition

ณ วันที่ทำงานหนึ่งวัน:

- ก่อนเริ่มวันนั้น ถือว่ายังไม่ completed
- Progress แสดงตามจำนวนวันที่ผ่านมาแล้วก่อนวันนี้
- Remaining days ยังรวมวันนี้

เพื่อให้เลขและ progress ไม่ขัดกัน:

```text
completed + remaining = total
```

เมื่อวันนี้เป็นวันทำงานและยังไม่จบวัน ให้จัดวันนี้อยู่ใน remaining

## 11.7 Week Display

แสดงสัปดาห์จากวันปฏิทิน:

```text
Math.ceil(remainingCalendarDays / 7)
```

ใช้คำว่า `ประมาณ X สัปดาห์` ไม่แสดงทศนิยม

---

## 12. Admin Authentication

## 12.1 Route

```text
/control-room
```

ไม่มี link จาก public page แต่ URL ลับไม่ถือเป็น security ต้องมี password

## 12.2 Environment Variables

```env
ADMIN_PASSWORD_HASH=
ADMIN_SESSION_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

ห้ามใช้ plain password ใน repository

## 12.3 Login Flow

1. User เปิด `/control-room`
2. Server ตรวจ cookie
3. ถ้าไม่มี session แสดง password form
4. Server Action ตรวจ password กับ bcrypt hash
5. ถ้าถูก สร้าง signed JWT ด้วย `jose`
6. เก็บใน HttpOnly cookie
7. Redirect กลับ `/control-room`

Cookie settings:

```ts
{
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7
}
```

Session payload:

```ts
{
  role: "admin",
  version: 1
}
```

## 12.4 Security Rules

- Server Action ทุกตัวต้องเรียก `requireAdminSession()`
- ใช้ timing-safe password comparison ผ่าน bcrypt
- จำกัด login request เบื้องต้นด้วย Redis rate limit หรือ in-memory fallback
- หลังผิด 5 ครั้งใน 10 นาที ให้หน่วงหรือ block ชั่วคราว
- Error message ใช้ข้อความเดียว `รหัสผ่านไม่ถูกต้อง`
- ห้ามบอกว่าระบบมี user หรือไม่
- Log out ต้องลบ cookie
- Upstash token ห้ามมี prefix `NEXT_PUBLIC_`

---

## 13. Admin Page UX

## 13.1 Visual Direction

หน้า Admin ไม่ต้อง cinematic เท่าหน้าหลัก แต่ต้องดูเป็นระบบเดียวกัน

- Dark solid surface
- Content width ประมาณ 920px
- Header: `Schedule Control Room`
- Badge แสดง last updated
- ปุ่ม logout มุมขวา
- ไม่มี sidebar

## 13.2 Main Sections

### Summary

```text
68 วันทำงานทั้งหมด
0 วันหยุดพิเศษ
0 วันเสาร์ทำงาน
Updated 29 Jul 2026, 15:30
```

### Add Override Form

Fields:

- Date picker
- Type select:
  - `วันหยุด`
  - `วันทำงานพิเศษ`
- Label optional
- Save button

Validation message ต้องอยู่ใต้ field

### Override List

Columns:

| Date | Day | Type | Label | Action |
|---|---|---|---|---|

- Sort ascending by date
- ใช้ badge แยก holiday/working
- Edit เปิด Dialog
- Delete ต้องมี confirmation
- Empty state ต้องสวยและชัด

## 13.3 Admin Interaction

- Save สำเร็จ: toast + revalidate public page
- Duplicate date: แจ้งให้แก้รายการเดิมแทน
- No-op override: block และอธิบายเหตุผล
- Delete: optimistic UI ได้เฉพาะเมื่อ rollback ได้
- Submit button มี loading state
- Double submit ต้องถูกป้องกัน

## 13.4 Date Input Constraints

```text
min = 2026-07-29
max = 2026-10-30
```

เมื่อเลือกวัน:

- แสดงชื่อวันทันที
- ระบบเสนอประเภทที่สมเหตุสมผล
  - เสาร์–อาทิตย์ → default `working`
  - จันทร์–ศุกร์ → default `holiday`

---

## 14. Component Specification

## 14.1 Public Components

```text
CountdownExperience
├── AmbientBackground
├── RiveOrbit
├── TopBar
├── CountdownHero
│   ├── CountdownDigits
│   ├── CountdownLabel
│   └── CountdownModeToggle
├── ProgressTrack
├── EndDateDisplay
├── SecondaryStats
├── UpcomingOverride
├── CountMethodDialog
└── CompletionEffect
```

### `CountdownExperience`

Responsibilities:

- Orchestrate page state
- Manage working/calendar toggle
- Start GSAP intro
- Pass progress to Rive
- Respect reduced motion

### `CountdownDigits`

Props:

```ts
type CountdownDigitsProps = {
  value: number;
  reducedMotion: boolean;
};
```

- Split number into digits
- Use Motion for changed digits only
- `aria-label` อ่านเต็ม เช่น `เหลือ 68 วันทำงาน`
- Visual digits ใช้ `aria-hidden`

### `RiveOrbit`

Props:

```ts
type RiveOrbitProps = {
  progress: number;
  urgency: 0 | 1 | 2 | 3;
  completed: boolean;
  reducedMotion: boolean;
};
```

- Lazy-load Rive client-side
- Render CSS fallback ระหว่างโหลด
- `aria-hidden="true"`

### `ProgressTrack`

- แสดง percentage
- Animate fill ด้วย Motion
- อัปเดต color stage
- Screen reader อ่าน `ดำเนินไปแล้ว X เปอร์เซ็นต์`

## 14.2 Admin Components

```text
ControlRoomPage
├── AdminHeader
├── ScheduleSummary
├── OverrideForm
├── OverrideTable
├── EditOverrideDialog
├── DeleteOverrideDialog
└── LogoutButton
```

---

## 15. Suggested File Structure

```text
app/
├── globals.css
├── layout.tsx
├── page.tsx
├── error.tsx
├── loading.tsx
└── control-room/
    ├── page.tsx
    ├── loading.tsx
    └── actions.ts

components/
├── countdown/
│   ├── countdown-experience.tsx
│   ├── countdown-digits.tsx
│   ├── countdown-mode-toggle.tsx
│   ├── progress-track.tsx
│   ├── secondary-stats.tsx
│   ├── upcoming-override.tsx
│   ├── count-method-dialog.tsx
│   ├── ambient-background.tsx
│   ├── rive-orbit.tsx
│   └── completion-effect.tsx
├── admin/
│   ├── admin-login-form.tsx
│   ├── admin-header.tsx
│   ├── schedule-summary.tsx
│   ├── override-form.tsx
│   ├── override-table.tsx
│   ├── edit-override-dialog.tsx
│   └── delete-override-dialog.tsx
└── ui/
    └── shadcn components only as needed

lib/
├── config.ts
├── countdown/
│   ├── calculate.ts
│   ├── dates.ts
│   ├── types.ts
│   ├── validation.ts
│   └── calculate.test.ts
├── schedule/
│   ├── repository.ts
│   ├── upstash.ts
│   └── fallback.ts
├── auth/
│   ├── password.ts
│   ├── session.ts
│   └── rate-limit.ts
└── utils.ts

public/
├── rive/
│   └── countdown-orbit.riv
└── favicon.svg

scripts/
└── hash-admin-password.mjs

middleware.ts
```

### `lib/config.ts`

```ts
export const COUNTDOWN_CONFIG = {
  startDate: "2026-07-29",
  endDate: "2026-10-30",
  timeZone: "Asia/Bangkok",
  defaultWorkingDays: [1, 2, 3, 4, 5],
  title: "Internship Countdown",
} as const;
```

ห้ามกระจายค่าคงที่นี้หลายไฟล์

---

## 16. Server Rendering and Caching

Public page ต้องอ่าน schedule ล่าสุดโดยไม่ cache นานเกินไป

แนะนำ:

- `repository.getSchedule()` ฝั่ง server
- ใช้ `unstable_cache` พร้อม tag `internship-schedule`
- Revalidate ประมาณ 60 วินาที
- เมื่อ Admin บันทึก ให้เรียก `revalidateTag("internship-schedule")`
- เรียก `revalidatePath("/")` เพิ่มเพื่อความชัดเจน

ห้าม fetch Upstash จาก client ทุกครั้งที่เปิดหน้า

ตัว Countdown เวลาไม่ต้อง hit server ทุกวินาที:

- Server ส่ง Bangkok date key เริ่มต้น
- Client ตั้ง timer ไปยัง midnight Bangkok
- เมื่อเปลี่ยนวัน ให้ `router.refresh()` หนึ่งครั้ง

---

## 17. Accessibility

ต้องรองรับ:

- `prefers-reduced-motion`
- Keyboard navigation
- Visible focus ring
- Dialog focus trap
- Contrast อย่างน้อย WCAG AA
- Touch targets อย่างน้อย 44px
- Semantic heading structure
- Live region เฉพาะเมื่อเลขเปลี่ยนจริง ไม่ประกาศทุก animation frame

### Reduced Motion Behavior

เมื่อเปิด reduced motion:

- ข้าม GSAP intro
- Digit เปลี่ยนทันทีหรือ crossfade สั้น ๆ
- Rive หยุด animation หรือใช้ state นิ่ง
- Pointer parallax ปิด
- Background gradient ไม่ drift
- Completion particles ปิด

---

## 18. Performance Budget

เป้าหมาย:

| Metric | Target |
|---|---|
| Initial JS | ต่ำกว่า 220 KB gzip โดยประมาณ |
| LCP | ต่ำกว่า 2.5s บน 4G |
| CLS | ต่ำกว่า 0.05 |
| INP | ต่ำกว่า 200ms |
| Rive asset | ควรต่ำกว่า 300 KB |

แนวทาง:

- Lazy-load Rive
- Import GSAP เฉพาะ client component ที่ใช้
- ไม่ใช้ background video
- ไม่ใช้ image asset ใหญ่
- จำกัด blur radius และ layer count
- ใช้ CSS transform/opacity สำหรับ animation
- หลีกเลี่ยง animate `filter` ต่อเนื่องเป็นเวลานาน
- Pause Rive หรือ ambient motion เมื่อ tab hidden หาก API รองรับ

---

## 19. Responsive Breakpoints

### Mobile `< 640px`

- Content center
- Countdown number ไม่เกิน viewport width
- Stats wrap เป็น 2 แถว
- Dialog ใช้ bottom sheet ได้
- Rive graphic ลด opacity และ scale

### Tablet `640–1024px`

- Number ขนาดกลาง
- Stats อยู่แถวเดียวถ้าพอ
- Dialog width ประมาณ 560px

### Desktop `> 1024px`

- Number ขนาดเต็ม
- Pointer parallax เปิด
- Rive detail เต็ม
- Admin table แสดงครบทุก column

### Large Desktop `> 1600px`

- จำกัด content width
- ไม่ขยาย typography จนอ่านยาก
- รักษาสมดุล whitespace

---

## 20. Error and Empty States

## 20.1 Public Error

```text
กำลังใช้ตารางพื้นฐาน
ข้อมูลวันยกเว้นอาจยังไม่อัปเดต
```

เป็นข้อความเล็ก ไม่ใช้ full-page error

## 20.2 Admin Empty State

```text
ยังไม่มีวันยกเว้น
ระบบกำลังนับจันทร์–ศุกร์เป็นวันทำงานตามปกติ
```

มีปุ่ม `เพิ่มวันแรก`

## 20.3 Admin Storage Error

- Toast: `บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง`
- Form data ต้องไม่หาย
- Log server error พร้อม request context ที่ไม่เปิดเผย secret

---

## 21. Share Feature

MVP ใช้ Web Share API ถ้ารองรับ:

```text
เหลืออีก 68 วันทำงาน
ถึงวันฝึกงานวันสุดท้าย 30 ตุลาคม 2026
```

Fallback:

- Copy text to clipboard
- Toast `คัดลอกแล้ว`

ไม่ต้องสร้าง image card ใน MVP เพราะเพิ่ม complexity และไม่ช่วย core experience มากพอ

---

## 22. SEO and Metadata

```ts
export const metadata = {
  title: "Internship Countdown",
  description: "นับถอยหลังสู่วันสุดท้ายของการฝึกงาน 30 ตุลาคม 2026",
  robots: {
    index: true,
    follow: true,
  },
};
```

สำหรับ `/control-room`:

```ts
robots: {
  index: false,
  follow: false,
}
```

เพิ่ม:

- favicon แบบ abstract countdown ring
- Open Graph image แบบ static
- Theme color `#06070a`

---

## 23. Testing Plan

## 23.1 Unit Tests

ต้องมีอย่างน้อย:

1. Baseline `2026-07-29` ถึง `2026-10-30` = 68 working days
2. Baseline calendar days = 94
3. วันเสาร์ default ไม่นับ
4. วันเสาร์ override working ต้องนับ
5. วันจันทร์ override holiday ต้องไม่นับ
6. วันนี้เป็น working day ต้องรวมวันนี้
7. End date ต้องรวมใน remaining
8. หลัง end date remaining = 0
9. Progress ไม่ต่ำกว่า 0 และไม่เกิน 100
10. Duplicate override ถูก reject
11. No-op override ถูก reject
12. Schedule sort ตามวันที่

## 23.2 Component Tests

- Countdown mode toggle เปลี่ยนค่าถูกต้อง
- Dialog เปิดและปิดด้วย keyboard
- Reduced motion render final state
- Error badge แสดงเมื่อใช้ fallback

## 23.3 E2E Tests

Public:

- หน้าโหลดและแสดง countdown
- Toggle working/calendar
- เปิด count method dialog
- Share fallback copy ได้

Admin:

- Wrong password แสดง error
- Correct password login ได้
- เพิ่ม holiday ได้
- เพิ่ม Saturday working day ได้
- Edit ได้
- Delete ได้
- Public page เปลี่ยนค่าหลัง revalidate
- Logout ได้

---

## 24. Implementation Phases

## Phase 1 — Foundation

- Create Next.js App Router project
- Enable strict TypeScript
- Configure Tailwind and shadcn/ui
- Add fonts
- Create design tokens
- Create static public layout

**Exit criteria:** หน้า static สวยและ responsive ก่อนใส่ logic

## Phase 2 — Date Logic

- Create config
- Implement date-only helpers
- Implement working day calculation
- Implement progress calculation
- Add unit tests

**Exit criteria:** baseline tests 68/94 ผ่าน

## Phase 3 — Public Experience

- Build countdown hero
- Add mode toggle
- Add progress track
- Add count method dialog
- Add upcoming override
- Add responsive states

**Exit criteria:** หน้า public ใช้งานครบโดยไม่มี animation

## Phase 4 — Motion and Rive

- Add GSAP intro timeline
- Add Motion digit transitions
- Add pointer glow
- Integrate Rive centerpiece
- Add reduced-motion path
- Add completion state

**Exit criteria:** motion ลื่น ไม่มี layout shift และไม่กระทบ accessibility

## Phase 5 — Shared Schedule

- Configure Upstash Redis
- Create repository and Zod validation
- Read schedule on server
- Add fallback behavior
- Add cache tags and revalidation

**Exit criteria:** ทุก browser เห็น schedule เดียวกัน

## Phase 6 — Admin

- Implement password hash script
- Implement signed session cookie
- Build login page
- Build CRUD Server Actions
- Build admin form/table/dialogs
- Add rate limit and logout

**Exit criteria:** Admin แก้ schedule ได้โดยไม่สัมผัสโค้ด

## Phase 7 — QA and Deployment

- Add Playwright tests
- Test mobile and desktop
- Test reduced motion
- Test Bangkok midnight rollover
- Add metadata and OG image
- Deploy Vercel
- Configure production env vars

**Exit criteria:** Production ใช้งานได้และไม่มี secret ใน client bundle

---

## 25. Deployment Checklist

### Upstash

- Create Redis database
- Copy REST URL
- Copy REST token
- Do not expose token publicly

### Password Hash

สร้าง script:

```js
import bcrypt from "bcryptjs";
import process from "node:process";

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-admin-password.mjs <password>");
  process.exit(1);
}

console.log(await bcrypt.hash(password, 12));
```

รัน:

```bash
node scripts/hash-admin-password.mjs "your-password"
```

### Vercel Environment Variables

```text
ADMIN_PASSWORD_HASH
ADMIN_SESSION_SECRET
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

### Final Verification

- Production page แสดงค่าถูกต้อง
- Admin login ได้
- เพิ่ม override แล้ว public page เปลี่ยน
- Refresh browser คนละเครื่องเห็นค่าเดียวกัน
- No secret appears in page source or network client bundle
- Mobile layout ไม่ล้น
- Reduced motion ทำงาน

---

## 26. Acceptance Criteria

งานถือว่าเสร็จเมื่อครบทุกข้อ:

### Public

- [ ] เปิด `/` แล้วเห็นจำนวนวันทำงานทันที
- [ ] ตัวเลขใช้ตารางวันกลางจาก Upstash
- [ ] Toggle วันทำงาน/วันทั้งหมดทำงาน
- [ ] Progress ถูกต้อง
- [ ] แสดงวันสิ้นสุด 30 ตุลาคม 2026
- [ ] แสดง updated timestamp
- [ ] Count method dialog ทำงาน
- [ ] รองรับ mobile และ desktop
- [ ] Reduced motion ทำงาน
- [ ] Completed state ทำงาน

### Visual

- [ ] ไม่มี card grid แบบ dashboard
- [ ] Countdown number เป็นจุดเด่นที่สุด
- [ ] GSAP intro ลื่นและเล่นเพียงครั้งต่อ session
- [ ] Motion digit transition ไม่ทำให้ layout กระโดด
- [ ] Rive graphic ไม่แย่งความสนใจจากตัวเลข
- [ ] ไม่มี animation ที่รบกวนการอ่าน
- [ ] สีและ typography สอดคล้องทั้ง Public/Admin

### Admin

- [ ] `/control-room` ต้องใส่รหัสผ่าน
- [ ] Password ตรวจฝั่ง server
- [ ] Session เป็น HttpOnly cookie
- [ ] เพิ่มวันหยุดได้
- [ ] เพิ่มวันเสาร์ทำงานได้
- [ ] Edit และ Delete ได้
- [ ] Duplicate/no-op ถูก block
- [ ] Save แล้ว public page revalidate
- [ ] Logout ได้

### Engineering

- [ ] TypeScript strict ไม่มี error
- [ ] Unit tests ผ่าน
- [ ] E2E core flows ผ่าน
- [ ] ไม่มี secret ใน client bundle
- [ ] Public page มี fallback เมื่อ Redis ล่ม
- [ ] Baseline 68 working days และ 94 calendar days ผ่าน test

---

## 27. Final Design Rule

เมื่อมีข้อสงสัยระหว่างพัฒนา ให้ใช้ลำดับความสำคัญนี้:

1. อ่านจำนวนวันที่เหลือได้ทันที
2. ดูสวยและมีเอกลักษณ์
3. Animation ลื่นแต่ไม่รบกวน
4. Mobile ใช้งานดี
5. Admin แก้ข้อมูลได้ง่าย
6. Bundle และโค้ดไม่ซับซ้อนเกินเหตุ

ห้ามเพิ่ม Feature ใหม่เพียงเพราะทำได้ เว็บนี้ต้องยังคงเป็น **หน้า Countdown ที่สวยมากและมีจุดประสงค์เดียวชัดเจน**
