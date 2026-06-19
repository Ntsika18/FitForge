/* ==============================================
   WORKOUT GENERATOR
   Maps (currentBody → idealBody) combos to
   exercise lists. Each exercise has a name,
   sets/reps string, image URL, and step-by-
   step instructions shown when user taps
   "How to do this".
============================================== */
(function() {

  /* ---- Exercise library with images + instructions ---- */
  const exerciseLib = {
    'Push-ups 3×12': {
      sets: '3 sets × 12 reps',
      img: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a34?w=200&q=70',
      alt: 'Person doing push-ups',
      steps: '1. Start in high plank, hands shoulder-width apart.\n2. Lower your chest to just above the floor, elbows at 45°.\n3. Press back up, fully extending your arms.\n4. Keep your core braced — no sagging hips.'
    },
    'Bodyweight squats 3×15': {
      sets: '3 sets × 15 reps',
      img: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=200&q=70',
      alt: 'Person doing squats',
      steps: '1. Stand with feet shoulder-width apart, toes slightly out.\n2. Push hips back and bend knees until thighs are parallel.\n3. Keep your chest tall and knees tracking over your toes.\n4. Drive through your heels to stand back up.'
    },
    'Plank 3×45 sec': {
      sets: '3 sets × 45 seconds',
      img: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=200&q=70',
      alt: 'Person holding a plank position',
      steps: '1. Lie face down, then prop up on forearms and toes.\n2. Keep body in a straight line from head to heels.\n3. Brace your abs and glutes — do not let hips sag or rise.\n4. Breathe steadily and hold for the prescribed time.'
    },
    'Light cardio 20 min': {
      sets: '20 minutes',
      img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=200&q=70',
      alt: 'Person jogging on a track',
      steps: '1. Walk briskly or jog at a comfortable conversational pace.\n2. Maintain 60–70% of your maximum heart rate.\n3. Use the time to flush out metabolic waste from strength work.\n4. Finish with 3–5 minutes of easy walking to cool down.'
    },
    'Bench press 4×8': {
      sets: '4 sets × 8 reps',
      img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&q=70',
      alt: 'Person bench pressing',
      steps: '1. Lie on a flat bench, feet planted on the floor.\n2. Grip barbell just outside shoulder-width, unrack with straight arms.\n3. Lower the bar to mid-chest with controlled speed (2 sec).\n4. Press explosively back up, locking out at the top.'
    },
    'Deadlift 4×6': {
      sets: '4 sets × 6 reps',
      img: 'https://images.unsplash.com/photo-1596355775015-f9d28ce6e9c0?w=200&q=70',
      alt: 'Person performing a deadlift',
      steps: '1. Stand with barbell over mid-foot, hip-width stance.\n2. Hinge at hips, grip bar just outside legs, flat back.\n3. Push the floor away — drive legs, then pull hips through.\n4. Lower bar back down in a controlled hinge movement.'
    },
    'Pull-ups 3×8': {
      sets: '3 sets × 8 reps',
      img: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=200&q=70',
      alt: 'Person doing pull-ups on a bar',
      steps: '1. Hang from a bar with palms facing away, shoulder-width grip.\n2. Pull your chin above the bar by driving elbows down.\n3. Pause briefly at the top, then lower slowly (3 sec).\n4. Fully extend arms at the bottom before each rep.'
    },
    'Dumbbell rows 3×10': {
      sets: '3 sets × 10 reps each side',
      img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=70',
      alt: 'Person doing dumbbell rows',
      steps: '1. Plant one knee and hand on a bench for support.\n2. Hold a dumbbell in the free hand, arm fully extended.\n3. Row the dumbbell to your hip, leading with your elbow.\n4. Lower slowly — feel the lat stretch at full extension.'
    },
    'Lunges 3×12 each': {
      sets: '3 sets × 12 reps per leg',
      img: 'https://images.unsplash.com/photo-1520948013839-62020f374478?w=200&q=70',
      alt: 'Person doing lunges in gym',
      steps: '1. Stand tall, step forward with one foot about 70 cm.\n2. Lower your back knee toward the floor — keep front shin vertical.\n3. Push through the front heel to return to standing.\n4. Alternate legs each rep or complete all reps on one side.'
    },
    'Shoulder press 3×10': {
      sets: '3 sets × 10 reps',
      img: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=200&q=70',
      alt: 'Person doing overhead press',
      steps: '1. Sit or stand, hold dumbbells at shoulder height, palms forward.\n2. Press both dumbbells directly overhead until arms are straight.\n3. Avoid arching your lower back — keep core tight.\n4. Lower back to shoulders under control.'
    },
    'Core circuit 15 min': {
      sets: '15-minute circuit',
      img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&q=70',
      alt: 'Person doing core exercise on mat',
      steps: '1. Rotate through: Plank 30s → Bicycle crunches ×20 → Leg raises ×15.\n2. Rest 30 seconds between exercises.\n3. Complete 3 full rounds with minimal rest between rounds.\n4. Focus on quality of movement — no rushing.'
    },
    'Squat 4×8': {
      sets: '4 sets × 8 reps',
      img: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=200&q=70',
      alt: 'Person squatting with barbell',
      steps: '1. Position the barbell across your upper traps, feet shoulder-width.\n2. Brace core, take a big breath, then break at hips and knees.\n3. Descend until thighs are parallel or below — do not cave knees.\n4. Drive up through heels, exhale at the top.'
    },
    'Overhead press 4×8': {
      sets: '4 sets × 8 reps',
      img: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=200&q=70',
      alt: 'Person doing overhead barbell press',
      steps: '1. Hold barbell at collar-bone height, hands just outside shoulders.\n2. Take a breath, brace, press bar directly overhead.\n3. Tuck chin slightly as the bar passes your face.\n4. Lock out overhead, then lower to start under control.'
    },
    'Barbell row 4×8': {
      sets: '4 sets × 8 reps',
      img: 'https://images.unsplash.com/photo-1596355775015-f9d28ce6e9c0?w=200&q=70',
      alt: 'Person doing barbell rows',
      steps: '1. Hinge forward to ~45°, overhand grip just outside hips.\n2. Keep back flat and pull bar to lower ribcage.\n3. Squeeze shoulder blades together at the top.\n4. Lower the bar fully before the next rep — no bouncing.'
    },
    'Burpees 4×20': {
      sets: '4 sets × 20 reps',
      img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=70',
      alt: 'Person doing burpees',
      steps: '1. From standing, drop hands to floor and jump feet back to plank.\n2. Perform a push-up (optional for beginners).\n3. Jump feet forward toward hands, then jump up with arms overhead.\n4. Land softly, absorbing impact through bent knees.'
    },
    'Mountain climbers 3×30': {
      sets: '3 sets × 30 reps (15 per leg)',
      img: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=200&q=70',
      alt: 'Person doing mountain climbers',
      steps: '1. Start in a high plank, hands under shoulders, body straight.\n2. Drive one knee toward your chest, then quickly switch legs.\n3. Keep hips level — avoid letting them rise during the movement.\n4. Move as fast as your form allows.'
    },
    'Jump squats 3×15': {
      sets: '3 sets × 15 reps',
      img: 'https://images.unsplash.com/photo-1520948013839-62020f374478?w=200&q=70',
      alt: 'Person jumping in gym',
      steps: '1. Stand with feet shoulder-width, squat down to parallel.\n2. Explode upward off both feet as powerfully as possible.\n3. Land softly with knees slightly bent to absorb impact.\n4. Immediately lower into the next squat without pausing.'
    },
    'Running 25 min': {
      sets: '25 minutes',
      img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=200&q=70',
      alt: 'Person running outside',
      steps: '1. Warm up with 3 minutes of brisk walking.\n2. Run at a pace where you can speak a short sentence.\n3. Focus on midfoot strike, relaxed shoulders, easy arm swing.\n4. Cool down with 2 minutes of walking, then stretch calves and hip flexors.'
    },
    'Clean & press 4×6': {
      sets: '4 sets × 6 reps',
      img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&q=70',
      alt: 'Person doing clean and press',
      steps: '1. Stand over bar, feet hip-width; grip just outside legs.\n2. Pull bar explosively, shrug, then drop under it to catch at shoulders.\n3. Stabilise the catch, then press bar directly overhead.\n4. Lower bar to shoulders, then hinge back to the floor.'
    },
    'Weighted pull-ups 4×6': {
      sets: '4 sets × 6 reps',
      img: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=200&q=70',
      alt: 'Person doing weighted pull-ups',
      steps: '1. Attach a weight plate via belt; hang from bar with full extension.\n2. Initiate pull by depressing scapula, then drive elbows down.\n3. Pull until chin clears the bar, pause briefly.\n4. Lower under full control — 3–4 seconds on the descent.'
    },
    'Front squat 4×8': {
      sets: '4 sets × 8 reps',
      img: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=200&q=70',
      alt: 'Person doing front squat',
      steps: '1. Rest barbell on front delts, fingertips under bar, elbows high.\n2. Keep torso upright — more vertical than a back squat.\n3. Descend until thighs are parallel, knees out over toes.\n4. Drive up through heels while keeping elbows up throughout.'
    },
    'Deadlift 5×5': {
      sets: '5 sets × 5 reps',
      img: 'https://images.unsplash.com/photo-1596355775015-f9d28ce6e9c0?w=200&q=70',
      alt: 'Person doing heavy deadlift',
      steps: '1. Setup: bar over mid-foot, hip stance, hinge to grip bar.\n2. Take slack out of bar by squeezing glutes; flat back, big breath.\n3. Push floor away — think leg press, not "pull the bar".\n4. Lock hips through at the top; reverse to lower with control.'
    },
    'Bench press 5×5': {
      sets: '5 sets × 5 reps',
      img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&q=70',
      alt: 'Person bench pressing heavy',
      steps: '1. Arch upper back into the bench; plant feet firmly.\n2. Unrack with straight arms; lower bar to nipple-line at 75° elbow angle.\n3. Pause briefly on chest, then drive bar up and slightly back.\n4. Lock out elbows fully at the top before each descent.'
    },
    'Squat 5×5': {
      sets: '5 sets × 5 reps',
      img: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=200&q=70',
      alt: 'Person doing 5x5 squat',
      steps: '1. Bar on upper traps; feet shoulder-width, toes 15–30° out.\n2. Big breath into belly, brace 360°, initiate by breaking hips back.\n3. Descend below parallel; knees track over toes.\n4. Stand explosively — squeeze glutes at lockout.'
    },
    'Farmer walks': {
      sets: '4 sets × 30 metres',
      img: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=200&q=70',
      alt: 'Person doing farmer walks with dumbbells',
      steps: '1. Hold heavy dumbbells or kettlebells at your sides.\n2. Stand tall, shoulders back; take short, controlled steps.\n3. Keep core braced and avoid lateral lean.\n4. Walk the set distance, set down, rest 90 sec, repeat.'
    },
    'Kettlebell swings 4×20': {
      sets: '4 sets × 20 reps',
      img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=70',
      alt: 'Person swinging a kettlebell',
      steps: '1. Hinge at hips; hold kettlebell with both hands between legs.\n2. Snap hips forward explosively — the power comes from hips, not arms.\n3. Let the bell float to shoulder height, arms stay straight.\n4. Hike the bell back on descent, keeping tension in your lats.'
    },
    'Incline walk 30 min': {
      sets: '30 minutes',
      img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=200&q=70',
      alt: 'Person walking on incline treadmill',
      steps: '1. Set treadmill to 10–15% incline at 5–6 km/h.\n2. Do not hold the handrails — swing arms naturally.\n3. Keep an upright posture — do not lean into the incline.\n4. Great low-impact fat-burn; maintain throughout the full 30 min.'
    },
    'Bodyweight circuit': {
      sets: '3 rounds, 45 sec per exercise',
      img: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=200&q=70',
      alt: 'Person doing bodyweight circuit exercises',
      steps: '1. Circuit: Push-ups → Squats → Plank → Glute bridges.\n2. Do each move for 45 seconds with 15 seconds transition.\n3. Rest 90 seconds between rounds.\n4. Focus on form over speed — quality reps only.'
    },
    'Rowing machine intervals': {
      sets: '20 minutes, 8×1 min hard / 1 min easy',
      img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=70',
      alt: 'Person on rowing machine',
      steps: '1. Set damper to 5–6; warm up rowing easy for 3 minutes.\n2. Row at maximum effort for 1 minute (aim for high SPM).\n3. Reduce intensity and row easy for 1 minute — repeat 8×.\n4. Cool down with 3 minutes of easy rowing and thorough stretching.'
    },
    'Cycling 30 min': {
      sets: '30 minutes',
      img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=200&q=70',
      alt: 'Person cycling in gym',
      steps: '1. Set resistance so pedalling feels moderately hard but sustainable.\n2. Maintain 80–100 RPM cadence for cardiovascular efficiency.\n3. Alternate 3-minute moderate segments with 1-minute hard pushes.\n4. Cool down: 5 minutes of light pedalling, then stretch quads and calves.'
    },
    'Jump rope 15 min': {
      sets: '15 minutes total',
      img: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a34?w=200&q=70',
      alt: 'Person skipping jump rope',
      steps: '1. Use a rope that reaches your armpits when folded in half.\n2. Jump on the balls of your feet; keep jumps small (2–3 cm).\n3. Rotate wrists — not your whole arms — for efficient rope spin.\n4. Alternate 30 sec on / 30 sec rest to build endurance progressively.'
    },
    'Light resistance full body': {
      sets: '3 sets × 15 reps per exercise',
      img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=70',
      alt: 'Person doing full body resistance workout',
      steps: '1. Choose weights where the last 2 reps feel challenging but form stays perfect.\n2. Move through: Goblet squat → Band row → Dumbbell press → RDL.\n3. Rest 60 seconds between sets — keep heart rate mildly elevated.\n4. Focus on the mind-muscle connection over heavy loading.'
    },
    'Core stability work': {
      sets: '3 rounds × 10 reps or 30 sec holds',
      img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&q=70',
      alt: 'Person doing core stability exercises',
      steps: '1. Dead bug: extend opposite arm/leg while pressing lower back to floor.\n2. Bird dog: from quadruped, extend opposite arm and leg simultaneously.\n3. Pallof press: resist rotation while pressing a band straight out.\n4. These train anti-rotation and deep stabiliser muscles — crucial foundations.'
    },
    'Trap bar deadlift 4×6': {
      sets: '4 sets × 6 reps',
      img: 'https://images.unsplash.com/photo-1596355775015-f9d28ce6e9c0?w=200&q=70',
      alt: 'Person doing trap bar deadlift',
      steps: '1. Step into trap bar; grip handles, hips higher than in a conventional deadlift.\n2. Push through legs while pulling handles — think leg press + row.\n3. Stand fully tall at the top, hips and knees locked.\n4. Lower under control — hinge hips first, then bend knees.'
    },
    'Leg press 4×10': {
      sets: '4 sets × 10 reps',
      img: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=200&q=70',
      alt: 'Person using leg press machine',
      steps: '1. Sit in machine, feet shoulder-width on the platform.\n2. Release safeties; lower sled until knees reach 90° (no further).\n3. Press back to near lockout — do not fully lock knees.\n4. Control the descent every rep; do not let weight crash down.'
    },
    'Chest supported row': {
      sets: '4 sets × 10 reps',
      img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=70',
      alt: 'Person doing chest supported row',
      steps: '1. Lie chest-down on an incline bench; hold dumbbells at arm\'s length.\n2. Row both dumbbells to your hips, leading with elbows.\n3. Squeeze shoulder blades hard at the top for 1 second.\n4. Lower slowly; fully extend before each rep for full range of motion.'
    },
    'Overhead carry': {
      sets: '4 sets × 20 metres',
      img: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=200&q=70',
      alt: 'Person doing overhead carry',
      steps: '1. Press a dumbbell or plate directly overhead, arm fully locked.\n2. Walk slowly with core braced — do not lean to either side.\n3. Keep shoulder "packed" — push slightly into the weight, don\'t shrug.\n4. Switch arms at the halfway point; rest 90 sec between sets.'
    },
    'Extra cardio burst 20 min': {
      sets: '20 extra minutes',
      img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=200&q=70',
      alt: 'Person doing cardio exercise',
      steps: '1. Added due to your weight-loss target — keep intensity moderate.\n2. Choose low-impact: brisk walk, elliptical, or stationary bike.\n3. Stay at 65–75% max heart rate for sustained fat oxidation.\n4. Can be done immediately after strength work or as a separate session.'
    },
    'Caloric surplus + protein focus': {
      sets: 'Daily nutrition target',
      img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&q=70',
      alt: 'Healthy high protein meal prep',
      steps: '1. Eat 300–500 kcal above your TDEE (total daily energy expenditure).\n2. Aim for 1 g of protein per lb of bodyweight, spread across 5 meals.\n3. Prioritise complex carbs (rice, oats, sweet potato) for training energy.\n4. Track intake for at least 2 weeks — consistency beats perfection.'
    },
    'Long limb focus: Romanian deadlift': {
      sets: '3 sets × 10 reps',
      img: 'https://images.unsplash.com/photo-1596355775015-f9d28ce6e9c0?w=200&q=70',
      alt: 'Person doing Romanian deadlift',
      steps: '1. Especially beneficial for taller athletes with longer limbs.\n2. Stand holding dumbbells; push hips back while lowering weights down shins.\n3. Feel a deep hamstring stretch at the bottom — no rounding of the back.\n4. Drive hips forward to stand; squeeze glutes hard at lockout.'
    },
    'HIIT + strength 3×/week': {
      sets: '3 sessions per week',
      img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=70',
      alt: 'Person doing HIIT workout',
      steps: '1. Each session: 20-min strength block (compound lifts) + 10-min HIIT finisher.\n2. Strength focus: 3 sets per exercise, 10–12 rep range.\n3. HIIT: 20 sec max effort, 40 sec rest — 10 rounds.\n4. Allow at least one full rest day between sessions for recovery.'
    },
    'Full-body strength 3×/week': {
      sets: '3 sessions per week',
      img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=70',
      alt: 'Person doing full body strength workout',
      steps: '1. Perform each session on non-consecutive days (Mon/Wed/Fri).\n2. Always begin with a compound movement (squat, push, pull) while fresh.\n3. Progress weight by 2.5 kg when you can complete all reps with clean form.\n4. Session duration: 45–60 minutes including warm-up.'
    },
    'Progressive overload 4×/week': {
      sets: '4 sessions per week',
      img: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=200&q=70',
      alt: 'Person progressively overloading lifts',
      steps: '1. Each week, increase weight or reps by a small amount on at least one exercise.\n2. Log every session: weight, sets, reps, and perceived effort.\n3. If you fail to progress for 2 weeks, deload by 10% and rebuild.\n4. Sleep and nutrition matter as much as the training itself.'
    },
    'Push/Pull/Legs split': {
      sets: '6 sessions per week (2 cycles)',
      img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&q=70',
      alt: 'Person doing push pull legs workout',
      steps: '1. Push day: chest, shoulders, triceps. Pull day: back, biceps. Legs: quads, hamstrings, glutes.\n2. Run the full 3-day cycle twice per week with one rest day.\n3. This split allows higher frequency and volume per muscle group.\n4. Ensure 48 hours between working the same muscle group.'
    },
    'Advanced strength 5×/week': {
      sets: '5 sessions per week',
      img: 'https://images.unsplash.com/photo-1596355775015-f9d28ce6e9c0?w=200&q=70',
      alt: 'Advanced athlete strength training',
      steps: '1. Structure: Upper A / Lower A / Rest / Upper B / Lower B / Optional / Rest.\n2. Vary rep ranges — heavy days (3–5 reps) and volume days (8–12 reps).\n3. Include at least one deload week every 4–6 weeks.\n4. Prioritise sleep (8h) and protein (1g/lb) — training this frequency demands it.'
    },
    'Powerlifting style': {
      sets: '4 sessions per week',
      img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&q=70',
      alt: 'Person doing powerlifting training',
      steps: '1. Programme revolves around squat, bench, and deadlift as primary lifts.\n2. Main work: 85–95% of 1RM, 3–5 sets × 1–5 reps.\n3. Accessory work follows to address weak points (pause squats, RDLs, close-grip bench).\n4. Compete or test your 1RM every 8–12 weeks to track progress.'
    },
    'Calisthenics & cardio': {
      sets: '4 sessions per week',
      img: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a34?w=200&q=70',
      alt: 'Person doing calisthenics workout',
      steps: '1. Master foundations: push-ups, pull-ups, dips, bodyweight squats.\n2. Progress by adding reps or harder variations (archer push-up, single-leg squat).\n3. Pair each session with 20 min of cardio (run, bike, jump rope).\n4. No equipment needed — perfect for home or travel training.'
    },
    'Accessory isolation': {
      sets: '3 sets × 12–15 reps',
      img: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=200&q=70',
      alt: 'Person doing isolation exercises',
      steps: '1. After main compound lifts, target lagging muscle groups directly.\n2. Examples: bicep curls, tricep pushdowns, lateral raises, calf raises.\n3. Use controlled tempo: 2 sec up, pause, 3 sec down.\n4. These exercises build symmetry and fill in aesthetic weak points.'
    },
    'Custom blend: Full body 3×/week': {
      sets: '3 sessions per week',
      img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=70',
      alt: 'Person doing full body workout',
      steps: '1. Customised blend for your profile: train on alternating days.\n2. Each session: 1 squat pattern, 1 push, 1 pull, 1 hinge, 1 carry or core.\n3. Start light and focus on form — aim to add weight weekly.\n4. Adjust exercise selection based on equipment available to you.'
    },
    'Squat variation 3×10': {
      sets: '3 sets × 10 reps',
      img: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=200&q=70',
      alt: 'Person doing squat variation',
      steps: '1. Choose a variation that suits your current level: goblet, box, or barbell.\n2. Prioritise depth over weight — aim for parallel or below.\n3. Keep an upright torso and knees tracking over toes.\n4. Progress to a harder variation once 3×10 feels very easy.'
    },
    'Push movement 3×10': {
      sets: '3 sets × 10 reps',
      img: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a34?w=200&q=70',
      alt: 'Person doing pushing exercise',
      steps: '1. Choose based on level: push-up → dumbbell press → barbell press.\n2. Full range of motion is critical — don\'t limit depth to lift heavier.\n3. Maintain a neutral wrist and stable shoulder position throughout.\n4. Control the eccentric (lowering) phase — 2–3 seconds.'
    },
    'Pull movement 3×10': {
      sets: '3 sets × 10 reps',
      img: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=200&q=70',
      alt: 'Person doing pulling exercise',
      steps: '1. Choose based on level: band pull-apart → dumbbell row → pull-up.\n2. Initiate every pull from the scapula — retract and depress first.\n3. Pull elbow past your body, not just to it, for full lat activation.\n4. Avoid shrugging your shoulders up during the movement.'
    },
    'Core finisher': {
      sets: '3 rounds × 10 reps or 30 sec holds',
      img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&q=70',
      alt: 'Person doing core finisher exercises',
      steps: '1. End every session with a 5–10 min core circuit.\n2. Alternate between anterior (plank, hollow body) and rotational (Russian twist, Pallof press) work.\n3. Never rush core work — controlled movement always beats speed.\n4. Aim to progress weekly: longer holds, more reps, harder variations.'
    },
  };

  /* ---- Regimen map: (currentBody_to_idealBody) → array of exercise keys ---- */
  const regimenMap = {
    'slim_to_toned':       ['Full-body strength 3×/week', 'Push-ups 3×12', 'Bodyweight squats 3×15', 'Plank 3×45 sec', 'Light cardio 20 min'],
    'slim_to_muscular':    ['Progressive overload 4×/week', 'Bench press 4×8', 'Deadlift 4×6', 'Pull-ups 3×8', 'Caloric surplus + protein focus'],
    'slim_to_lean':        ['Calisthenics & cardio', 'Burpees 4×20', 'Jump rope 15 min', 'Bodyweight circuit', 'Light cardio 20 min'],
    'slim_to_strong':      ['Progressive overload 4×/week', 'Squat 4×8', 'Deadlift 4×6', 'Overhead press 4×8', 'Caloric surplus + protein focus'],
    'average_to_toned':    ['HIIT + strength 3×/week', 'Dumbbell rows 3×10', 'Lunges 3×12 each', 'Shoulder press 3×10', 'Core circuit 15 min'],
    'average_to_muscular': ['Push/Pull/Legs split', 'Squat 4×8', 'Overhead press 4×8', 'Barbell row 4×8', 'Progressive overload 4×/week'],
    'average_to_lean':     ['Calisthenics & cardio', 'Burpees 4×20', 'Mountain climbers 3×30', 'Jump squats 3×15', 'Running 25 min'],
    'average_to_strong':   ['Powerlifting style', 'Deadlift 5×5', 'Bench press 5×5', 'Squat 5×5', 'Farmer walks'],
    'athletic_to_toned':   ['Advanced strength 5×/week', 'Front squat 4×8', 'Weighted pull-ups 4×6', 'Shoulder press 3×10', 'Core circuit 15 min'],
    'athletic_to_muscular':['Advanced strength 5×/week', 'Clean & press 4×6', 'Weighted pull-ups 4×6', 'Front squat 4×8', 'Accessory isolation'],
    'athletic_to_lean':    ['HIIT + strength 3×/week', 'Burpees 4×20', 'Running 25 min', 'Mountain climbers 3×30', 'Core circuit 15 min'],
    'athletic_to_strong':  ['Powerlifting style', 'Deadlift 5×5', 'Bench press 5×5', 'Squat 5×5', 'Farmer walks'],
    'heavy_to_toned':      ['Kettlebell swings 4×20', 'Incline walk 30 min', 'Bodyweight circuit', 'Rowing machine intervals', 'Core stability work'],
    'heavy_to_muscular':   ['Push/Pull/Legs split', 'Trap bar deadlift 4×6', 'Chest supported row', 'Leg press 4×10', 'Overhead carry'],
    'heavy_to_lean':       ['Cycling 30 min', 'Jump rope 15 min', 'Light resistance full body', 'Core stability work', 'Incline walk 30 min'],
    'heavy_to_strong':     ['Powerlifting style', 'Trap bar deadlift 4×6', 'Leg press 4×10', 'Chest supported row', 'Overhead carry'],
  };

  /* ---- Fallback if no matching key ---- */
  const fallback = ['Custom blend: Full body 3×/week', 'Squat variation 3×10', 'Push movement 3×10', 'Pull movement 3×10', 'Core finisher'];

  /* ---- Generate exercise array from inputs ---- */
  function getExercises(weight, height, current, ideal) {
    const key = `${current}_to_${ideal}`;
    let list = (regimenMap[key] || fallback).slice(); // copy

    // Personalisation bonuses based on weight and height
    if (weight > 90 && (ideal === 'toned' || ideal === 'lean')) {
      list.push('Extra cardio burst 20 min');
    } else if (weight < 65 && ideal === 'muscular') {
      list.push('Caloric surplus + protein focus');
    }
    if (height > 185) {
      list.push('Long limb focus: Romanian deadlift');
    }
    return list;
  }

  /* ---- Render exercise list into #workoutDisplay ---- */
  function renderWorkout(exercises, userData) {
    const itemsHtml = exercises.map(name => {
      const ex  = exerciseLib[name] || { sets: '', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=70', alt: name, steps: 'See a trainer for guidance on this exercise.' };
      const id  = 'inst_' + name.replace(/\W+/g, '_');
      return `
        <li class="exercise-item">
          <img class="exercise-thumb" src="${ex.img}" alt="${ex.alt}" loading="lazy">
          <div class="exercise-info">
            <div class="exercise-name"><i class="fas fa-check-circle"></i> ${name}</div>
            <div class="exercise-sets">${ex.sets}</div>
            <div class="exercise-instructions" id="${id}">${ex.steps.replace(/\n/g, '<br>')}</div>
            <button class="toggle-inst" onclick="toggleInst('${id}', this)">
              <i class="fas fa-chevron-down"></i> How to do this
            </button>
          </div>
        </li>`;
    }).join('');

    document.getElementById('workoutDisplay').innerHTML = `
      <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.6rem;">
        <i class="fas fa-person-running" style="color:var(--accent);"></i>
        <span style="font-weight:700;font-family:'Syne',sans-serif;">Your ${userData.ideal} plan</span>
      </div>
      <ul class="regimen-list">${itemsHtml}</ul>
      <div class="plan-meta">
        <span><i class="fas fa-weight-scale"></i> ${userData.weight} kg</span>
        <span><i class="fas fa-ruler-vertical"></i> ${userData.height} cm</span>
        <span>${userData.current} → ${userData.ideal}</span>
      </div>`;
  }

  /* ---- Toggle instruction block visibility ---- */
  window.toggleInst = function(id, btn) {
    const el = document.getElementById(id);
    const open = el.classList.toggle('open');
    btn.innerHTML = open
      ? '<i class="fas fa-chevron-up"></i> Hide instructions'
      : '<i class="fas fa-chevron-down"></i> How to do this';
  };

  /* ---- Wire up the Generate button ---- */
  document.getElementById('generateWorkout').addEventListener('click', () => {
    const weight  = parseFloat(document.getElementById('weight').value)      || 70;
    const height  = parseFloat(document.getElementById('height').value)      || 170;
    const current = document.getElementById('currentBody').value;
    const ideal   = document.getElementById('idealBody').value;
    renderWorkout(getExercises(weight, height, current, ideal), { weight, height, current, ideal });
  });

  /* ---- Auto-generate on page load with default values ---- */
  window.addEventListener('load', () => {
    const w = parseFloat(document.getElementById('weight').value) || 75;
    const h = parseFloat(document.getElementById('height').value) || 178;
    const c = document.getElementById('currentBody').value;
    const i = document.getElementById('idealBody').value;
    renderWorkout(getExercises(w, h, c, i), { weight: w, height: h, current: c, ideal: i });
  });

})();
