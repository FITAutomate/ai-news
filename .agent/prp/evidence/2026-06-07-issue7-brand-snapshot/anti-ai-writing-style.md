# ANTI-AI WRITING STYLE

Based on [conorbronsdon/avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing) v3.3.1. Adapted for FIT Automate voice.

Claude must audit all written output against these rules before delivering. This is not optional.

---

## Process

1. Write the content.
2. Audit it against every section below.
3. Fix violations.
4. Do a second pass — patterns survive the first edit.
5. Deliver.

---

## Banned words — always replace (Tier 1)

| Kill | Use instead |
|------|-------------|
| delve / delve into | explore, dig into, look at |
| landscape (metaphor) | field, space, industry |
| tapestry | (describe the actual complexity) |
| realm | area, field, domain |
| paradigm | model, approach, framework |
| embark | start, begin |
| beacon | (rewrite entirely) |
| testament to | shows, proves |
| robust | strong, reliable, solid |
| comprehensive | thorough, complete, full |
| cutting-edge | latest, newest, advanced |
| leverage (verb) | use |
| pivotal | important, key |
| underscores | highlights, shows |
| meticulous | careful, detailed, precise |
| seamless / seamlessly | smooth, easy, without friction |
| game-changer | (describe what changed and why) |
| utilize | use |
| watershed moment | turning point, shift |
| nestled | is located, sits |
| vibrant | (describe what makes it active) |
| thriving | growing, active (or cite a number) |
| showcasing | showing (or cut the clause) |
| deep dive | look at, examine |
| unpack | explain, break down |
| bustling | busy, active |
| intricate | complex, detailed |
| ever-evolving | changing, growing |
| holistic | complete, full, whole |
| actionable | practical, useful, concrete |
| impactful | effective, significant |
| learnings | lessons, findings |
| thought leader | expert, authority |
| best practices | what works, proven methods |
| at its core | (cut — just state the thing) |
| synergy | (describe the combined effect) |
| interplay | relationship, connection |
| in order to | to |
| due to the fact that | because |
| serves as | is |
| features (verb) | has, includes |
| boasts | has |
| commence | start, begin |
| ascertain | find out, determine |
| endeavor | effort, attempt, try |
| embrace (metaphor) | adopt, accept, use |
| symphony (metaphor) | (describe the coordination) |

## Flag in clusters — Tier 2 (2+ in same paragraph = rewrite)

harness, navigate, foster, elevate, unleash, streamline, empower, bolster, spearhead, resonate, revolutionize, facilitate, underpin, nuanced, crucial, multifaceted, ecosystem (metaphor), myriad, plethora, encompass, catalyze, reimagine, cultivate, illuminate, transformative, cornerstone, paramount, poised, burgeoning, nascent, overarching.

## Flag by density — Tier 3 (only when saturated)

significant, innovative, effective, dynamic, scalable, compelling, unprecedented, exceptional, remarkable, sophisticated, instrumental, world-class, state-of-the-art.

---

## Formatting rules

- **Em dashes:** Target zero. Hard max: one per 1,000 words. Use commas or periods instead.
- **Bold:** One bolded phrase per major section at most, or none. If it's important, restructure the sentence to lead with it.
- **Emoji in headers:** Never. No exceptions for business content.
- **Bullet lists:** Only for genuinely list-like content. Default to prose paragraphs.

## Sentence structure rules

- Kill "It's not X, it's Y" reframes. Max one per piece.
- Cut hollow intensifiers: genuine, truly, quite frankly, to be honest, let's be clear, it's worth noting.
- Cut hedging: perhaps, could potentially, it's important to note that.
- Cut "worth [verb]ing" endorsements. Say why something matters instead.
- Vary sentence length. Mix short (3-8 words) with long (20+). Fragments work.
- No compulsive rule of three. Vary groupings.

## Structural rules

- Vary paragraph length. Some 1-2 sentence paragraphs, some longer. Never uniform.
- No formulaic openings ("In the rapidly evolving world of..."). Lead with the point.
- Keep natural voice. Deliberate fragments, sentences starting with "And" or "But" are fine.
- No excessive headers. Max 3 headings in 300 words.
- No "Overview," "Key Points," "Summary," "Introduction" headers. Use specific headers.

## Transitions to kill

- Moreover, Furthermore, Additionally → use "and," "also," or restructure
- In today's [X] / In an era where → cut or state specific context
- It's worth noting that / Notably → just state the fact
- In conclusion / In summary → your conclusion should be obvious
- When it comes to → talk about the thing directly
- At the end of the day → cut
- Here's what's interesting → let the content signal importance

## Patterns to eliminate

- **Chatbot artifacts:** "I hope this helps!", "Certainly!", "Great question!", "Feel free to reach out" → remove entirely
- **"Let's" openers:** "Let's explore," "Let's break this down" → just start with the point
- **Significance inflation:** "marking a pivotal moment in the evolution of..." → state what happened
- **Copula avoidance:** "serves as," "features," "boasts" → use "is" or "has"
- **Synonym cycling:** rotating synonyms to avoid repetition → repeat the clear word
- **Vague attributions:** "Experts believe," "Studies show" → cite a specific source or drop it
- **Generic conclusions:** "The future looks bright," "Only time will tell" → specific closing thought or cut
- **Numbered list inflation:** "Here are 7 reasons" → cut to the 2-3 that matter
- **Reasoning chain artifacts:** "Let me think step by step" → state the conclusion, then evidence
- **Sycophantic tone:** "Great question!", "Excellent point!" → remove entirely
- **Acknowledgment loops:** "You're asking about," "To answer your question" → just answer
- **Confidence calibration:** "Interestingly," "Surprisingly," "It's worth noting" → let the fact speak
- **Emotional flatline:** "What surprised me most," "I was fascinated to discover" → earn the emotion or cut it
- **False concession:** "While X is impressive, Y remains a challenge" → make both halves specific
- **Rhetorical question openers:** "But what does this mean?" → just say it
- **Parenthetical hedging:** "(and, increasingly, Z)" → give it its own sentence or cut it

## Rhythm check

- If most sentences are 15-25 words, it sounds robotic. Mix short punchy (3-8) with longer flowing (20+).
- If every paragraph is the same size, vary deliberately.
- If it could be read by text-to-speech without sounding weird, it's too uniform.
- Human writing has opinions. If the piece should have a voice, the absence of "I think" or a stated preference is itself an AI tell.

## The test

Read it out loud. If it sounds like a press release, a tourism brochure, or a chatbot, rewrite it. The goal is writing that sounds like John wrote it: direct, specific, practical, no fluff.
