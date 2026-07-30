พฤติกรรมที่ถูกต้อง
Effect ผู้ใช้ปกติ Reduced Motion
GSAP intro sequence เปิดเต็ม ข้าม intro หรือ fade สั้น
Pointer parallax เปิด ปิด
Rive / SVG orbit หมุนและตอบสนอง หยุดหรือเคลื่อนช้ามาก
Countdown digits Rolling transition เปลี่ยนตัวเลขทันที
Completion particles เปิดเต็ม ใช้ glow/fade แทน
Ambient gradients เคลื่อนไหวช้า คงที่
Progress animation Draw animation แสดงค่าทันที

ดังนั้นเว็บปกติควรยังมีครบ:

GSAP cinematic intro
ตัวเลข rolling แบบ custom
Cursor-following light
Pointer depth/parallax
Rive centerpiece
Animated progress line
Ambient gradient movement
Grain และ light bloom
Completion burst
Stage transition ตามวันที่เหลือ
Magnetic button interaction
Smooth modal transitions
จุดที่ต้องแก้ในโปรเจกต์จริง

ตอนนี้ปัญหาไม่ใช่ว่ามีโมชั่นเยอะเกินไป แต่คือ โมชั่นบางตัวทำไม่ครบหรือยังเป็น placeholder

1. GSAP ต้องใช้จริงแบบเป็น Sequence
   Background glow appears
   ↓
   Logo/title mask reveal
   ↓
   Orbit expands
   ↓
   Digits roll upward
   ↓
   Progress line draws
   ↓
   Secondary information fades in

ควรใช้ easing เช่น:

ease: "power4.out"

และเล่นครั้งแรกของ session เพื่อไม่ให้รำคาญตอน refresh ทุกครั้ง

2. Pointer Parallax ควรเปิด

แต่ให้ขยับน้อยและมี inertia:

Background glow 10–18px
Orbit graphic 4–8px
Countdown number 1–3px
Foreground grain 0px

ไม่ควรให้ทุก Layer ขยับแรงเท่ากัน เพราะจะดูเหมือนเว็บทดลองเอฟเฟกต์

3. Digit Animation ต้องเป็นพระเอก

เวลาจำนวนวันเปลี่ยน:

เลขเก่าเลื่อนขึ้น
เลขใหม่เลื่อนเข้าจากด้านล่าง
มี blur ช่วงเปลี่ยนเล็กน้อย
Scale จาก 0.96 → 1
ใช้ spring เบา ๆ
ไม่ควรเป็น counter ที่วิ่งจาก 0 ถึง 67 ทุกครั้ง 4. Rive ควรทำจริง

ตอนนี้มีแค่ fallback SVG จึงยังไม่ถึงระดับตามแผน

Rive ควรรับ Input อย่างน้อย:

progress 0–100
urgency 0–3
completed true/false
pointerX -1 ถึง 1
pointerY -1 ถึง 1

พฤติกรรม:

Progress มากขึ้น → วงแหวนสมบูรณ์ขึ้น
เหลือน้อยกว่า 30 วัน → glow ชัดขึ้น
เหลือน้อยกว่า 7 วัน → pulse เร็วขึ้นเล็กน้อย
วันที่จบ → orbit แตกตัวและรวมกลับเป็น completed mark 5. Completion particles ควรมี

วันที่ครบไม่ควรเป็น Confetti สำเร็จรูปทั่วไป

ควรเป็น:

Particle สีขาวและม่วง
แผ่ออกจากตัวเลขกลางจอ
มี bloom สั้น ๆ
Text เปลี่ยนเป็น DAY ZERO
Background เปลี่ยนจาก dark navy เป็นโทน dawn เล็กน้อย
สไตล์ Awwwards ที่ควรหมายถึง

ไม่ใช่การใส่ Animation เยอะทุกส่วน แต่คือ:

Strong concept

- Typography ขนาดใหญ่
- Layered depth
- Smooth choreography
- Custom interaction
- Consistent visual language

เว็บที่สวยจริงควรมี Hero moment หนึ่งจุดที่หนักมาก แล้วจุดอื่นคุมให้นิ่ง

สำหรับเว็บนี้ Hero moment คือ:

ตัวเลข Countdown

- Rive orbit
- Ambient background
- Pointer depth

ส่วนปุ่ม Share, Toggle และ Dialog ใช้โมชั่นเบา ๆ พอ

ข้อสรุป

ให้แก้ Requirement เป็น:

Full cinematic animation is enabled by default.
Reduced-motion behavior applies only when the operating system reports prefers-reduced-motion: reduce.
Do not remove or simplify the primary visual effects for standard users.
