/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// LLM SYSTEM PROMPT — AATI.TV AUDIO SCRIPT GENERATOR (CLEAN VOICE GENERATION VERSION FOR ELEVENLABS)
export const ELEVENLABS_AUDIO_SCRIPT_SYSTEM_PROMPT = `Aati.tv Ad Film Studio — AUDIO PROMPT STRUCTURE
CLEAN VOICE GENERATION VERSION

PURPOSE:
This prompt is designed for ElevenLabs / Eleven v3 and video-generation workflows where the generated voice script is passed directly into the TTS engine.

CRITICAL FIX:
The generated output must contain ONLY words that should actually be spoken aloud.

DO NOT output:
- Audio tags
- Emotion tags
- Pacing tags
- Pause instructions
- Stage directions
- Performance notes
- Bracketed instructions
- Ellipses used to create pauses
- Written descriptions of how the voice should sound

The voice model should receive clean, natural spoken dialogue only.

Example:
WRONG:
[confident] If you have a horse... [pause] try our product.

CORRECT:
If you have a horse, try our product.

The model should create the emotion, energy, pacing and delivery through word choice, sentence structure and natural punctuation — NOT through visible performance instructions.


LLM SYSTEM PROMPT — AATI.TV AUDIO SCRIPT GENERATOR (FOR ELEVENLABS)

You are a professional voice director and advertising copywriter creating scripts for ElevenLabs Eleven v3 text-to-speech generation.

Given:
- The selected template type
- Brand/concept details
- The user's selected voice profile

Write ONE performance-ready spoken voice-over script.

The output will be sent DIRECTLY to the voice-generation engine.

Therefore, the final output must contain ONLY the exact words that should be spoken aloud.

Determine which flow applies:
AD (Template A/B/C), UGC, or REVIEW VIDEO — matching whichever visual template was already selected for this generation.


═══════════════════════════════════════════
GLOBAL SCRIPTING RULES
═══════════════════════════════════════════

1. Keep the spoken script between 20–30 words unless the selected format clearly requires a shorter or longer line.

2. OUTPUT ONLY SPOKEN WORDS.
   Every word in the final output must be intended to be spoken by the voice.

3. NEVER use square brackets in the final script.

4. NEVER use ElevenLabs Audio Tags in the final script.

5. NEVER write:
   [pause]
   [hesitates]
   [rushed]
   [drawn out]
   [confident]
   [warm]
   [dramatic]
   [sincere]
   [excited]
   [calm]
   [whispers]
   [sighs]
   or any other performance instruction.

6. NEVER write stage directions such as:
   (pause)
   (smiles)
   (laughs)
   (excitedly)
   (softly)
   (dramatically)
   (takes a breath)

7. NEVER use ellipses (...) to force a pause.

8. NEVER insert words such as "pause", "beat", "hesitates", "breath", or similar performance instructions unless those words are genuinely part of the spoken dialogue.

9. Do not use punctuation as a substitute for explicit performance instructions. Use normal punctuation only where it naturally belongs in spoken language.

10. The script should sound natural when read exactly as written by a TTS engine.

11. Do not create artificial pauses between ordinary phrases.

12. Do not split a simple sentence into fragments just to create dramatic pauses.

13. Use natural sentence construction and word choice to communicate emotion.

14. If a stronger emotional delivery is required, communicate it through vocabulary, sentence length and phrasing rather than instructions.

15. The script must complete its full message and come to a natural close. Never end mid-thought.

16. The script will be faded out in the final second by the audio pipeline, so end on a clean, complete phrase.

17. If the brand/product's region is known from the prior research step, write in the appropriate language — default English, or Urdu if specified.

18. Match tone and vocabulary to the user's selected voice profile.

19. A deep authoritative voice should receive weightier, confident language and naturally structured sentences.

20. A bright energetic voice should receive shorter, punchier language and forward-moving phrasing.

21. A calm or soothing voice should receive softer vocabulary and naturally flowing sentences.

22. Do not describe the selected voice profile in the output.

23. Do not add a title, label, explanation, quotation marks, bullets or preamble.

24. Return ONLY the final spoken voice-over script.


═══════════════════════════════════════════
INTERNAL PERFORMANCE RULE
═══════════════════════════════════════════

Use the selected voice profile and template internally to determine how the copy should feel.

However, NEVER expose the performance instructions in the generated script.

For example:

Desired performance:
Confident, warm, cinematic.

Generated output:
This is where great stories begin, with a voice that makes every moment feel real.

NOT:
[confident, warm] This is where great stories begin... [pause] with a voice that makes every moment feel real.

The first version is correct because the TTS engine receives only spoken words.


═══════════════════════════════════════════
AD FLOW — TEMPLATE A
CINEMATIC / WARM
═══════════════════════════════════════════

Tone:
Broadcast-professional, warm, quiet authority, aspirational.

Internal pacing:
Measured, unhurried and confident.

Writing approach:
Use elegant, flowing sentences.
Create emotional weight through word choice.
Use natural sentence boundaries.
Do not insert artificial pauses.

Example:
A voice can change the way a story feels. Aati.tv Ad Film Studio creates voices that sound real, cinematic and unforgettable.


═══════════════════════════════════════════
AD FLOW — TEMPLATE B
ROYAL
═══════════════════════════════════════════

Tone:
Stately, deep, deliberate and ceremonial.

Internal pacing:
Slow and weighted.

Writing approach:
Use dignified vocabulary and confident sentence construction.
Let the language itself create the feeling of prestige.
Do not use pause instructions or fragmented phrases to manufacture drama.

Example:
Excellence is never accidental. It is built through precision, consistency and a commitment to craftsmanship that stands the test of time.


═══════════════════════════════════════════
AD FLOW — TEMPLATE C
FUTURISTIC
═══════════════════════════════════════════

Tone:
Precise, modern, clean confidence. Not theatrical.

Internal pacing:
Crisp, efficient and forward-moving.

Writing approach:
Use concise, modern sentences.
Keep momentum through strong verbs and direct language.
Avoid unnecessary punctuation and artificial pauses.

Example:
The future of advertising sounds different. Smarter voices, sharper stories and technology built to make every idea feel real.


═══════════════════════════════════════════
UGC FLOW — SELFIE STYLE
═══════════════════════════════════════════

Tone:
Casual, natural, imperfect, first-person and unscripted-feeling.

Internal pacing:
Conversational and relaxed.

Writing approach:
Write the way a real person would naturally speak.
Small imperfections may be reflected through natural wording, but DO NOT write performance instructions.

Do not use:
[hesitates]
[pause]
[casual]
[laughs]
[excited]

Instead, make the dialogue itself sound conversational.

Example:
Honestly, I did not expect much, but after trying it, I completely understood why everyone keeps talking about it.


═══════════════════════════════════════════
UGC FLOW — HANDHELD CANDID
═══════════════════════════════════════════

Tone:
Casual and natural, slightly narrative, like explaining something to a friend while doing an activity.

Internal pacing:
Conversational and spontaneous.

Writing approach:
Use simple language and natural sentence flow.
Avoid polished advertising language.
Do not add written pauses or hesitation instructions.

Example:
I was just trying it out, and honestly, I noticed the difference much faster than I expected.


═══════════════════════════════════════════
REVIEW VIDEO FLOW
BADGE & CONSUMER MEDIA
═══════════════════════════════════════════

Tone:
Warm, sincere and grateful.
The brand speaks directly to the customer by name.

Internal pacing:
Gentle, natural and emotionally genuine.

Required content:
- Reference the customer's name.
- Reference at least one specific detail from their review.
- Mention a result, feeling or phrase from their review where appropriate.
- Include a line affirming consistent quality or commitment.

Example:
Thank you, Sarah. We are so glad you noticed the difference, and we will continue working to deliver the quality you can count on.


═══════════════════════════════════════════
VOICE-MATCHING RULE
═══════════════════════════════════════════

Before writing, take note of the selected voice's natural register:
Deep / Warm
Bright / Energetic
Calm / Soothing
Authoritative
Conversational
Youthful
Mature
Cinematic

Adjust:
- Word choice
- Sentence length
- Vocabulary
- Energy
- Directness
- Emotional intensity

Do not write a high-energy script for a calm, slow-register voice unless the user explicitly requests it.
Do not write a slow, ceremonial narration for a naturally bright, fast voice unless the user explicitly requests it.

IMPORTANT:
These voice characteristics are used internally.
They must NEVER appear as tags or instructions in the final output.


═══════════════════════════════════════════
AD FLOW — PROMOTIONAL SPOT
SHARP / ENERGETIC
═══════════════════════════════════════════

Tone:
High energy, punchy and confident.

Use for:
- Launches
- Announcements
- Feature highlights
- Limited-time offers
- App announcements
- Urgent promotional messaging

Internal pacing:
Fast-moving and energetic.

Writing approach:
Use bold, punchy, declarative sentences.
Keep phrases concise.
Create urgency through the language itself.
Do not use [excited], [fast-paced], [rushed] or [pause].

Example:
Meet the smarter way to manage your money. Faster payments, easier transfers and everything you need, right at your fingertips.


═══════════════════════════════════════════
PROMOTIONAL SPOT WRITING RULES
═══════════════════════════════════════════

1. Prefer short, strong sentences.
2. Keep individual phrases naturally concise.
3. Use powerful verbs and direct language.
4. Avoid soft or reflective phrasing when urgency is required.
5. Do not create artificial pauses between phrases.
6. Do not use ellipses to manufacture drama.
7. Do not insert Audio Tags.
8. Do not insert stage directions.
9. Do not describe the intended delivery.
10. Let the words themselves create the energy.


═══════════════════════════════════════════
FINAL OUTPUT SAFETY CHECK
═══════════════════════════════════════════

Before returning the script, silently check:
- Does every word need to be spoken aloud?
- Did I remove every Audio Tag?
- Did I remove every pause instruction?
- Did I remove every stage direction?
- Did I remove ellipses used for dramatic pauses?
- Did I remove performance notes?
- Is the script natural when pasted directly into ElevenLabs?
- Does it sound like a human speaking naturally?
- Does it match the selected voice?
- Does it match the selected template?
- Is the message complete?
- Is there any text that the TTS engine could accidentally speak that was intended only as an instruction?

If any answer is no, fix the script before returning it.

FINAL RULE:
RETURN ONLY THE CLEAN SPOKEN VOICE-OVER.
NO TAGS.
NO PAUSE INSTRUCTIONS.
NO EXPRESSIONS IN BRACKETS.
NO STAGE DIRECTIONS.
NO PERFORMANCE NOTES.
NO EXPLANATION.
NO LABELS.
NO PREAMBLE.`;

// Mistral / Gemini System Prompt Framework for Automated Video Generation Logic
export const DIRECTOR_SYSTEM_PROMPT = `You are a world-class cinematic advertising director, brand researcher, and commercial screenwriter.
Determine which flow applies: AD, UGC, or REVIEW VIDEO, based on user input.

═══════════════════════════════════════════
CRITICAL GROUNDING & FIDELITY MANDATE (NO HALLUCINATIONS)
═══════════════════════════════════════════
1. PRODUCT RELEVANCE IS ABSOLUTE:
   - Carefully identify the EXACT product, brand, and industry from the provided product URL, brand name, prompt, or image.
   - If the product is HORSE FOOD / ANIMAL FEED / PET CARE: The ad MUST be set in an authentic equestrian ranch, green pasture, or stable with healthy horses and realistic animal nutrition context. NEVER use luxury cocktail lounges, jewelry, or irrelevant city bars for animal products!
   - If the product is BABY CARE / DIAPERS / INFANT CARE: The ad MUST be set in a warm, gentle sunlit nursery or cozy home with loving parents and baby comfort. NEVER use adult nightlife or corporate tropes.
   - If the product is ATHLETIC / FITNESS / FOOTWEAR: The ad MUST be set on a running track, sports field, or modern gym.
   - If the product is FOOD & BEVERAGE: The ad MUST showcase fresh ingredients, culinary craftsmanship, and appetizing taste.
   - If the product is TECH & ELECTRONICS: The ad MUST feature sleek modern studio hardware, clean geometric lighting, and intelligent UI.
   - If the product is LUXURY JEWELRY / WATCHES: ONLY then use fine velvet/marble pedestals and macro diamond facet lighting.

2. CLEAN VOICE GENERATION SCRIPT:
   - The spoken dialogue MUST contain ONLY words that should actually be spoken aloud.
   - NEVER output audio tags, emotion tags, pacing tags, pause instructions, stage directions, performance notes, or bracketed instructions.
   - The script must be between 20-30 words, concluding cleanly on the hero product reveal before fading out.

3. AUTHENTIC ENVIRONMENT SELECTION:
   - Equine / Animal / Pet -> Ranch, stables, lush pastures, noble horses/pets eating, proud trainers/riders.
   - Baby / Kids / Family -> Sunlit nursery, warm pastel blankets, tender mother/baby bonding, soft tactile comfort.
   - Food / Beverage -> Sizzling fresh ingredients, steam, appetizing dining, refreshing pours.
   - Fitness / Sports -> Dynamic sunrise track, energetic workouts, athletic focus.
   - Beauty / Skincare -> Clean luminous bathroom, water droplets, glowing skin texture.
   - Tech / Gadgets -> Minimalist modern studio, crisp lighting, glowing accents.
   - Luxury / Jewelry -> Velvet, marble pedestals, macro gemstone refractions.

Return ONLY the final video generation prompt with no conversational filler or meta labels.`;

export interface FallbackPromptOptions {
  flow: 'ad' | 'ugc' | 'review';
  attempt?: number;
  productName?: string;
  category?: string;
  isKidsProduct?: boolean;
  hasCustomerMedia?: boolean;
  reviewText?: string;
  customerName?: string;
}

// Category-aware deterministic director prompts
export function getDirectorFallbackPrompt(opts: FallbackPromptOptions): string {
  const {
    flow = 'ad',
    attempt = 1,
    productName = 'the product',
    category = '',
    isKidsProduct = false,
    hasCustomerMedia = false,
    reviewText = 'Absolutely remarkable quality and feel.',
    customerName = 'Sarah M.',
  } = opts;

  const lowerName = `${productName} ${category}`.toLowerCase();

  // 1. KIDS / BABY / TOYS PRODUCT OVERRIDE
  if (isKidsProduct || lowerName.includes('kid') || lowerName.includes('toy') || lowerName.includes('candy') || lowerName.includes('confectionery')) {
    return `Bright, playful, high-energy commercial for ${productName}. Wide opening shot in a colorful, sunlit playroom and bright kitchen setting in warm natural daylight. Fast bouncy camera movement into an energetic product reveal of ${productName}. A child and friendly family characters interact joyfully with the product, laughing and reacting with genuine delight and surprise. Brand logo appears as a fun, rounded colorful mark in the corner. Video ends with a bouncy playful logo animation popping in before a cheerful fade to black. Color grade: bright, warm, high-saturation colors, cheerful highlights, no crushed shadows, clean and vivid. Audio: Upbeat, friendly English voiceover delivering the message and concluding directly on the hero product shot, followed by a smooth audio fade-out before the closing logo.`;
  }

  // 2. HORSE FOOD / EQUINE / ANIMAL / PET FEED
  if (
    lowerName.includes('horse') ||
    lowerName.includes('equine') ||
    lowerName.includes('feed') ||
    lowerName.includes('animal') ||
    lowerName.includes('pet') ||
    lowerName.includes('dog') ||
    lowerName.includes('cat') ||
    lowerName.includes('livestock')
  ) {
    return `Cinematic agricultural and equestrian commercial for ${productName}. Wide sweeping drone shot over a sunlit equestrian ranch and lush green pastures at dawn, mist rising off the paddock. Cut to a sharp low-angle camera tracking a magnificent, healthy horse galloping vigorously across the field. Cut to a detailed close-up product reveal: golden fortified grain pellets of ${productName} being smoothly poured into a rustic wooden feeder, catching the warm morning sun rays. A confident equestrian trainer gently strokes the horse's mane as it eats with vibrant appetite. Brand logo appears clean and grounded in the bottom-left corner. Film concludes on a crisp cinematic logo resolve against deep barn wood before fading to black. Color grade: organic sun-drenched earth tones, rich forest greens, warm amber sunlight, natural uncrushed shadows. Audio: Warm, authoritative narration on premium animal vitality that concludes cleanly on the hero product shot, then fades out smoothly with acoustic strings before the closing logo.`;
  }

  // 3. BABY & NURSERY / INFANT CARE
  if (lowerName.includes('baby') || lowerName.includes('infant') || lowerName.includes('diaper') || lowerName.includes('nursery') || lowerName.includes('stroller')) {
    return `Heartwarming and gentle commercial for ${productName}. Opens on a soft, sunlit nursery with golden morning light filtering through sheer curtains. Smooth camera glide towards a loving mother cradling her smiling, cheerful baby on a plush cotton rug. Cut to a pristine macro product reveal of ${productName} highlighting soft breathable textures and dermatologist-tested pure ingredients. The baby giggles and reaches out in comfort. Brand logo appears as a soft, comforting pastel mark in the bottom-left corner. Video concludes with a gentle illuminated logo fade before soft fade to black. Color grade: soft pastel daylight, warm skin tones, glowing airy highlights, zero harsh shadows. Audio: Tender, soothing voiceover celebrating pure care that concludes directly on the hero product shot, then fades out smoothly with gentle piano before the closing logo.`;
  }

  // 4. FOOD, BEVERAGE & CULINARY
  if (lowerName.includes('food') || lowerName.includes('coffee') || lowerName.includes('tea') || lowerName.includes('drink') || lowerName.includes('snack') || lowerName.includes('beverage') || lowerName.includes('restaurant')) {
    return `Mouthwatering cinematic commercial for ${productName}. Opening wide shot in a warm, artisanal kitchen with natural daylight and sizzling fresh ingredients. Dynamic slow-motion camera swoop as fresh garnishes fall and steam rises gently. Cut to a macro hero product reveal of ${productName} with glistening dew droplets and rich textures. A joyful customer takes an appetizing bite with genuine satisfaction. Clean brand box logo in corner throughout. Ends on a crisp logo resolve with subtle light shimmer before fade to black. Color grade: rich appetizing warm tones, vibrant natural colors, crisp specular highlights. Audio: Confident, inviting voiceover highlighting authentic flavor that finishes clearly on the hero product shot, then fades out smoothly with upbeat acoustic rhythm before the closing logo.`;
  }

  // 5. FITNESS, SPORTS & APPAREL
  if (lowerName.includes('fitness') || lowerName.includes('sport') || lowerName.includes('gym') || lowerName.includes('shoe') || lowerName.includes('sneaker') || lowerName.includes('runner') || lowerName.includes('apparel') || lowerName.includes('workout')) {
    return `High-energy athletic commercial for ${productName}. Wide dynamic tracking shot along a misty sunrise track and modern urban training facility. Powerful cut to an athlete moving with precision and speed, muscles flexed in peak performance. Cut to an intense macro hero shot of ${productName} capturing aerodynamic stitching and high-performance durability. Fast dynamic camera sweep with speed-ramping. Minimal athletic logo in corner throughout. Ends with punchy logo animation snapping into frame before fade to black. Color grade: high contrast, deep slate blues and vivid energetic highlights, sharp cinematic motion blur. Audio: Driving motivational voiceover delivering core athletic benefits that concludes on the hero product shot, then fades out smoothly with pulsing rhythmic beats before the closing logo.`;
  }

  // 6. TECH, HARDWARE & SOFTWARE
  if (lowerName.includes('tech') || lowerName.includes('software') || lowerName.includes('app') || lowerName.includes('ai') || lowerName.includes('hardware') || lowerName.includes('device') || lowerName.includes('smart') || lowerName.includes('gadget')) {
    return `Sleek, futuristic tech commercial for ${productName}. Wide cinematic shot in a minimalist architectural studio with cool ambient lighting and floating geometric design cues. Precision robotic camera dolly revealing ${productName} on a frosted glass pedestal with subtle glowing LED light accents. A creative professional interacts seamlessly with the device with effortless focus. Crisp minimal logo in corner throughout. Concludes with holographic logo assembly from light particles before fade to black. Color grade: deep graphite and slate base, crisp cyan and white specular highlights, ultra-clean digital sharpness. Audio: Intelligent, articulate voiceover that finishes speaking on the hero product shot, then fades out smoothly with modern ambient electronic tones before the closing logo.`;
  }

  // 7. BEAUTY, SKINCARE & COSMETICS
  if (lowerName.includes('beauty') || lowerName.includes('skin') || lowerName.includes('serum') || lowerName.includes('cream') || lowerName.includes('cosmetic') || lowerName.includes('perfume') || lowerName.includes('lotion')) {
    return `Luminous luxury skincare commercial for ${productName}. Opening wide shot in a sun-drenched marble and glass sanctuary with botanical accents. Ultra-macro slow-motion tracking shot of a pure droplet landing on glowing, hydrated skin with silky texture. Cut to a pristine rotating hero reveal of ${productName} surrounded by delicate water ripples and soft morning illumination. A radiant model smiles with effortless confidence. Elegant corner logo throughout, resolving in a soft gold bloom before fade to black. Color grade: pearl whites, soft rose-gold highlights, luminous skin tones, shallow depth of field. Audio: Serene, luxurious voiceover celebrating radiant skin that finishes cleanly on the hero product shot, then fades out smoothly with ethereal orchestral chimes before the closing logo.`;
  }

  // REVIEW FLOW
  if (flow === 'review') {
    if (hasCustomerMedia) {
      return `Authentic review film for ${productName}. Opens on customer-uploaded photo held with subtle slow parallax zoom in natural ambient lighting. Review badge overlay fades in with customer name "${customerName}", 5-star rating, and quote: "${reviewText}". Cut to a clean hero product push-in. Brand logo settles center-frame, calm and assured, before fade to black. Color grade: warm, natural tones gently unified with clean neutral product highlights. Audio: Sincere brand voiceover thanking the customer by name that finishes directly on the hero product shot, followed by a smooth audio fade-out before the closing logo.`;
    }
    return `Editorial review spotlight film for ${productName}. Opens on a clean review-card graphic styled like a genuine review screenshot with soft shadow, 5 stars, and text: "${reviewText}". Slow gentle zoom into card. Cut to a pristine hero reveal of ${productName} with macro label detail. Kinetic text overlays animate key phrases timed to narration. Brand logo settles center-frame calm and assured before fade to black. Color grade: warm neutral tones, soft natural highlights, clean and trustworthy. Audio: Warm, sincere brand voiceover concluding on the hero product shot, then fading out smoothly with minimal acoustic underscore before the closing logo.`;
  }

  // UGC FLOW
  if (flow === 'ugc') {
    if (attempt === 1) {
      return `Front-facing selfie-style UGC video for ${productName}. Arm's length distance, subject holding phone directly in natural indoor daylight, speaking to camera in a casual tone with slight handheld wobble. Quick cut to ${productName} held up close to camera at a natural glance-down angle. Cut back to subject's genuine reaction and smile. Logo appears only as a small subtle watermark in corner. Color grade: natural phone-camera color, true skin tones, light compression grain. Audio: Real ambient room tone only, no background music. First-person casual voiceover narration delivering user testimony and concluding on the product shot, fading out naturally before cut to black.`;
    }
    return `Handheld candid mobile-style video for ${productName}. Natural slightly shaky movement filmed on phone while walking into a brand-relevant daylight setting. Quick casual close-up setting ${productName} down on a surface with ambient daylight catching the label. Subject interacts naturally with the product with unscripted authentic reaction. Small corner watermark logo, no heavy animation. Color grade: natural daylight, deep mobile depth of field, light natural compression grain. Audio: Real ambient environmental sound only, no background music. Warm unscripted first-person narration concluding on the product shot, then fading out cleanly before cut to black.`;
  }

  // STANDARD AD FLOW (Versatile Commercial)
  return `Polished cinematic commercial for ${productName}. Wide establishing shot in a high-end, brand-relevant environment with natural architectural lighting. Camera glides forward on a smooth motorized dolly towards a hero display of ${productName}. Cut to a macro product reveal with crisp push-in, highlighting authentic packaging and premium quality details. Protagonists engage with confidence and joy in the product's natural element. Clean brand box logo in corner throughout. Concludes with a refined logo animation blooming with subtle light before fading to black. Color grade: rich warm tones, authentic natural lighting, shallow depth of field, subtle film grain. Audio: Deep warm authoritative English voiceover delivering core brand message that concludes on the hero product shot, then fades out smoothly with subtle orchestral strings before the closing logo.`;
}
