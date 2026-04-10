import type {
  Destination,
  DestinationModifier,
  GameEvent,
  NPC,
  StartingModifier,
} from "./types";

export const DESTINATIONS: Destination[] = [
  { id: "tokyo", name: "Tokyo", region: "Asia", emoji: "\u{1F5FC}", baseRisk: 2, baseCost: 30 },
  { id: "bangkok", name: "Bangkok", region: "Asia", emoji: "\u{1F6D5}", baseRisk: 4, baseCost: 15 },
  { id: "mumbai", name: "Mumbai", region: "Asia", emoji: "\u{1F3DB}", baseRisk: 5, baseCost: 12 },
  { id: "paris", name: "Paris", region: "Europe", emoji: "\u{1F5FC}", baseRisk: 2, baseCost: 35 },
  { id: "berlin", name: "Berlin", region: "Europe", emoji: "\u{1F3DB}", baseRisk: 3, baseCost: 25 },
  { id: "istanbul", name: "Istanbul", region: "Europe", emoji: "\u{1F54C}", baseRisk: 4, baseCost: 18 },
  { id: "cairo", name: "Cairo", region: "Africa", emoji: "\u{1F3DC}", baseRisk: 6, baseCost: 10 },
  { id: "nairobi", name: "Nairobi", region: "Africa", emoji: "\u{1F333}", baseRisk: 5, baseCost: 14 },
  { id: "marrakech", name: "Marrakech", region: "Africa", emoji: "\u{1F3EA}", baseRisk: 4, baseCost: 16 },
  { id: "nyc", name: "New York", region: "Americas", emoji: "\u{1F5FD}", baseRisk: 3, baseCost: 40 },
  { id: "mexico_city", name: "Mexico City", region: "Americas", emoji: "\u{1F336}", baseRisk: 5, baseCost: 15 },
  { id: "rio", name: "Rio de Janeiro", region: "Americas", emoji: "\u{1F3D6}", baseRisk: 6, baseCost: 20 },
  { id: "sydney", name: "Sydney", region: "Oceania", emoji: "\u{1F30A}", baseRisk: 2, baseCost: 32 },
  { id: "bali", name: "Bali", region: "Oceania", emoji: "\u{1F334}", baseRisk: 3, baseCost: 18 },
  { id: "reykjavik", name: "Reykjavik", region: "Europe", emoji: "\u{2744}", baseRisk: 3, baseCost: 38 },
  { id: "buenos_aires", name: "Buenos Aires", region: "Americas", emoji: "\u{1F483}", baseRisk: 4, baseCost: 22 },
];

export const DESTINATION_MODIFIERS: DestinationModifier[] = [
  { type: "cheap", label: "Budget Season", emoji: "\u{1F4B0}", costMultiplier: 0.5, riskMultiplier: 1.2, reputationBonus: 0 },
  { type: "expensive", label: "Peak Season", emoji: "\u{1F4B8}", costMultiplier: 1.8, riskMultiplier: 0.7, reputationBonus: 1 },
  { type: "safe", label: "Calm Period", emoji: "\u{1F54A}", costMultiplier: 1.0, riskMultiplier: 0.4, reputationBonus: 0 },
  { type: "chaotic", label: "Unrest", emoji: "\u{26A0}", costMultiplier: 0.7, riskMultiplier: 2.0, reputationBonus: 2 },
  { type: "festival", label: "Festival!", emoji: "\u{1F389}", costMultiplier: 1.3, riskMultiplier: 1.0, reputationBonus: 3 },
  { type: "normal", label: "Normal", emoji: "\u{1F30D}", costMultiplier: 1.0, riskMultiplier: 1.0, reputationBonus: 0 },
];

export const EVENTS: GameEvent[] = [
  {
    id: "street_food",
    title: "Street Food Stall",
    description: "A vendor waves you over. The food smells incredible but the kitchen looks... questionable.",
    choices: [
      { text: "Eat the mystery dish", outcome: { money: -5, energy: 20, reputation: 1, message: "Delicious! You feel energized and the locals love that you tried it." } },
      { text: "Politely decline", outcome: { money: 0, energy: -5, reputation: -1, message: "You walk away hungry. The vendor looks disappointed." } },
      { text: "Ask for the safe option", outcome: { money: -8, energy: 10, reputation: 0, message: "Plain rice it is. Safe but boring." } },
    ],
  },
  {
    id: "pickpocket",
    title: "Pickpocket!",
    description: "You feel a hand slip into your pocket in the crowded market!",
    choices: [
      { text: "Chase the thief", outcome: { money: 5, energy: -15, reputation: 2, message: "You caught them! The crowd cheers as you recover your wallet plus a bonus." } },
      { text: "Let it go", outcome: { money: -20, energy: 0, reputation: 0, message: "Gone. Along with some of your cash." } },
      { text: "Yell for help", outcome: { money: -10, energy: -5, reputation: 1, message: "A local helps recover half your money. You make a friend." } },
    ],
  },
  {
    id: "lost_tourist",
    title: "Lost Tourist",
    description: "A confused traveler asks for directions. You don't really know the area either...",
    choices: [
      { text: "Help them anyway", outcome: { money: 0, energy: -10, reputation: 3, message: "You both got lost, but they appreciated the effort. They share a travel tip." } },
      { text: "Pretend to be busy", outcome: { money: 0, energy: 0, reputation: -2, message: "They look dejected as you walk past." } },
    ],
  },
  {
    id: "black_market",
    title: "Black Market Deal",
    description: "A shady figure offers you a 'rare artifact' at a suspiciously low price.",
    choices: [
      { text: "Buy it ($25)", outcome: { money: -25, energy: 0, reputation: -1, message: "It's... a cheap knockoff. But the story is worth something." } },
      { text: "Haggle aggressively", outcome: { money: -10, energy: -5, reputation: 2, message: "You talked them down and got a genuine curiosity. Nice hustle!" } },
      { text: "Walk away", outcome: { money: 0, energy: 0, reputation: 0, message: "Probably the smart move." } },
    ],
  },
  {
    id: "temple_visit",
    title: "Ancient Temple",
    description: "A beautiful temple sits at the top of a steep hill. The view must be incredible.",
    choices: [
      { text: "Climb to the top", outcome: { money: 0, energy: -20, reputation: 3, message: "Breathtaking! The monks share tea with you at the summit." } },
      { text: "Admire from below", outcome: { money: 0, energy: -5, reputation: 1, message: "Still beautiful from here. You take a photo." } },
    ],
  },
  {
    id: "gambling_den",
    title: "Underground Card Game",
    description: "You stumble into a back-alley card game. The stakes look high.",
    choices: [
      { text: "Go all in ($30)", outcome: { money: 40, energy: -10, reputation: 2, message: "Lady luck smiles! You clean up at the table." } },
      { text: "Play it safe ($10)", outcome: { money: -10, energy: -5, reputation: 0, message: "You lose your stake. At least it wasn't much." } },
      { text: "Just watch", outcome: { money: 0, energy: -5, reputation: 1, message: "You learn some tricks by watching. Could be useful later." } },
    ],
  },
  {
    id: "storm",
    title: "Sudden Storm",
    description: "Dark clouds roll in fast. You need shelter, but your next transport leaves soon.",
    choices: [
      { text: "Push through the storm", outcome: { money: 0, energy: -25, reputation: 1, message: "Soaked but on time. The locals admire your determination." } },
      { text: "Find shelter and wait", outcome: { money: -15, energy: -5, reputation: 0, message: "You miss your ride and have to buy a new ticket. But at least you're dry." } },
    ],
  },
  {
    id: "local_festival",
    title: "Local Celebration",
    description: "The streets are alive with music, dancing, and free food!",
    choices: [
      { text: "Join the party!", outcome: { money: -5, energy: 15, reputation: 4, message: "What a night! You made friends, danced, and ate like a king." } },
      { text: "Document everything", outcome: { money: 10, energy: -10, reputation: 1, message: "Your photos sell well. But you feel like you missed the real experience." } },
    ],
  },
  {
    id: "sick",
    title: "Feeling Sick",
    description: "Your stomach is not happy. Something you ate? The water? The altitude?",
    choices: [
      { text: "Rest for a day ($15)", outcome: { money: -15, energy: 15, reputation: 0, message: "A day in bed. Boring but necessary." } },
      { text: "Power through", outcome: { money: 0, energy: -20, reputation: 0, message: "You soldier on but feel terrible. Every step is a struggle." } },
      { text: "Visit a local healer", outcome: { money: -10, energy: 10, reputation: 2, message: "Mysterious herbs and chanting. Somehow... it works?" } },
    ],
  },
  {
    id: "photography",
    title: "Perfect Shot",
    description: "You spot an incredible photo opportunity, but it requires climbing to a dangerous ledge.",
    choices: [
      { text: "Risk the climb", outcome: { money: 15, energy: -15, reputation: 3, message: "The photo goes viral! Your travel blog explodes." } },
      { text: "Take a safe shot", outcome: { money: 5, energy: -5, reputation: 1, message: "A decent photo. Gets a few likes." } },
    ],
  },
  {
    id: "hitchhiker",
    title: "Hitchhiker",
    description: "A fellow traveler asks to share your transport to save costs.",
    choices: [
      { text: "Share the ride", outcome: { money: 10, energy: 0, reputation: 2, message: "Split costs and great conversation. They share a secret shortcut." } },
      { text: "Ride alone", outcome: { money: 0, energy: 5, reputation: -1, message: "Peace and quiet. But you feel a little guilty." } },
    ],
  },
  {
    id: "border_trouble",
    title: "Border Checkpoint",
    description: "The border guard looks at your papers suspiciously. Something seems off.",
    choices: [
      { text: "Stay calm and cooperate", outcome: { money: -5, energy: -10, reputation: 1, message: "After a long wait, they let you through. Your patience paid off." } },
      { text: "Offer a small bribe", outcome: { money: -20, energy: 0, reputation: -2, message: "They take the money and wave you through. You feel dirty." } },
      { text: "Argue your case", outcome: { money: 0, energy: -15, reputation: 2, message: "Your passionate defense works! They even apologize." } },
    ],
  },
  {
    id: "street_performer",
    title: "Street Performer",
    description: "A talented musician plays a hauntingly beautiful melody. A small crowd gathers.",
    choices: [
      { text: "Tip generously ($10)", outcome: { money: -10, energy: 5, reputation: 2, message: "They play a song just for you. The crowd applauds." } },
      { text: "Just listen and move on", outcome: { money: 0, energy: 5, reputation: 0, message: "The music lifts your spirits as you continue on your way." } },
    ],
  },
  {
    id: "lost_wallet",
    title: "Found a Wallet",
    description: "You find a wallet on the ground. It has cash and an ID inside.",
    choices: [
      { text: "Return it to the owner", outcome: { money: 0, energy: -10, reputation: 5, message: "The grateful owner insists on buying you dinner. Karma works." } },
      { text: "Keep the cash", outcome: { money: 30, energy: 0, reputation: -3, message: "Easy money. But guilt nags at you." } },
    ],
  },
  {
    id: "nightlife",
    title: "Rooftop Bar",
    description: "A local recommends the hottest rooftop bar in town. Cover charge is steep.",
    choices: [
      { text: "Go big ($20)", outcome: { money: -20, energy: -10, reputation: 3, message: "What a view! You meet fascinating people and get insider travel tips." } },
      { text: "Find a cheaper spot", outcome: { money: -5, energy: -5, reputation: 0, message: "A quiet pub. Good beer, no stories." } },
      { text: "Early night instead", outcome: { money: 0, energy: 15, reputation: 0, message: "Well-rested for tomorrow. Smart but boring." } },
    ],
  },
  {
    id: "scam_tour",
    title: "Tour Offer",
    description: "\"Best tour in the city! Only $15! See everything!\" shouts a man with a clipboard.",
    choices: [
      { text: "Take the tour", outcome: { money: -15, energy: -10, reputation: 1, message: "It was actually... pretty good? A hidden gem of a tour." } },
      { text: "Explore on your own", outcome: { money: -5, energy: -15, reputation: 2, message: "You find things no tour would show. Exhausting but authentic." } },
    ],
  },
  {
    id: "currency_exchange",
    title: "Shady Money Changer",
    description: "\"Best rate in town!\" Their booth doesn't exactly look official...",
    choices: [
      { text: "Exchange money here", outcome: { money: 15, energy: 0, reputation: -1, message: "Great rate! Hopefully these bills are real..." } },
      { text: "Use the bank instead", outcome: { money: -5, energy: -10, reputation: 0, message: "Safe but expensive. The bank fees sting." } },
    ],
  },
  {
    id: "volunteer",
    title: "Volunteer Opportunity",
    description: "A local charity needs help building a school. They could use an extra pair of hands.",
    choices: [
      { text: "Volunteer for the day", outcome: { money: 0, energy: -25, reputation: 6, message: "Exhausting but deeply meaningful. The children's smiles make it worth it." } },
      { text: "Donate money instead ($20)", outcome: { money: -20, energy: 0, reputation: 3, message: "They appreciate the donation. Every bit helps." } },
      { text: "Move on", outcome: { money: 0, energy: 0, reputation: -1, message: "You have your own journey to worry about." } },
    ],
  },
];

export const NPC_POOL: NPC[] = [
  { id: "marco", name: "Marco", archetype: "merchant", mood: "friendly", trust: 50, emoji: "\u{1F9D4}", effect: "Offers deals on travel costs" },
  { id: "yuki", name: "Yuki", archetype: "guide", mood: "neutral", trust: 30, emoji: "\u{1F469}", effect: "Reveals hidden paths" },
  { id: "raj", name: "Raj", archetype: "trickster", mood: "hostile", trust: 10, emoji: "\u{1F60F}", effect: "High risk, high reward offers" },
  { id: "elena", name: "Elena", archetype: "healer", mood: "friendly", trust: 60, emoji: "\u{1F469}\u{200D}\u{2695}", effect: "Restores energy" },
  { id: "kwame", name: "Kwame", archetype: "storyteller", mood: "friendly", trust: 70, emoji: "\u{1F474}", effect: "Boosts reputation with tales" },
  { id: "lina", name: "Lina", archetype: "merchant", mood: "neutral", trust: 40, emoji: "\u{1F469}\u{200D}\u{1F4BC}", effect: "Currency exchange bonuses" },
  { id: "dmitri", name: "Dmitri", archetype: "trickster", mood: "neutral", trust: 20, emoji: "\u{1F575}", effect: "Smuggling opportunities" },
  { id: "amara", name: "Amara", archetype: "guide", mood: "friendly", trust: 55, emoji: "\u{1F9D1}\u{200D}\u{1F3A8}", effect: "Cultural insights" },
  { id: "chen", name: "Chen", archetype: "healer", mood: "neutral", trust: 45, emoji: "\u{1F9D1}\u{200D}\u{1F52C}", effect: "Traditional remedies" },
  { id: "fatima", name: "Fatima", archetype: "storyteller", mood: "friendly", trust: 65, emoji: "\u{1F9D5}", effect: "Connects you with locals" },
];

export const STARTING_MODIFIERS: StartingModifier[] = [
  {
    id: "balanced",
    name: "Balanced Traveler",
    description: "Start with even resources. No bonus, no penalty.",
    emoji: "\u{2696}",
    resourceMod: { money: 100, energy: 100, reputation: 5 },
    effect: "none",
    unlocked: true,
  },
  {
    id: "rich_start",
    name: "Trust Fund Kid",
    description: "Extra cash but zero street cred.",
    emoji: "\u{1F4B5}",
    resourceMod: { money: 150, energy: 80, reputation: 0 },
    effect: "none",
    unlocked: true,
  },
  {
    id: "backpacker",
    name: "Broke Backpacker",
    description: "Low funds but boundless energy and local respect.",
    emoji: "\u{1F392}",
    resourceMod: { money: 50, energy: 130, reputation: 8 },
    effect: "none",
    unlocked: true,
  },
  {
    id: "influencer",
    name: "Travel Influencer",
    description: "High rep opens doors, but maintaining the brand is exhausting.",
    emoji: "\u{1F4F1}",
    resourceMod: { money: 80, energy: 70, reputation: 15 },
    effect: "reputation_drain",
    unlocked: false,
  },
  {
    id: "gambler",
    name: "Lucky Gambler",
    description: "All outcomes are amplified. Big wins and big losses.",
    emoji: "\u{1F3B2}",
    resourceMod: { money: 90, energy: 90, reputation: 5 },
    effect: "amplified",
    unlocked: false,
  },
  {
    id: "survivor",
    name: "Seasoned Survivor",
    description: "Low resources but events cost less energy.",
    emoji: "\u{1F3D5}",
    resourceMod: { money: 60, energy: 80, reputation: 3 },
    effect: "energy_saver",
    unlocked: false,
  },
];

export const NPC_GREETINGS: Record<NPC["archetype"], string[]> = {
  merchant: [
    "\"Friend! I have exactly what you need...\"",
    "\"Looking for a deal? You've come to the right person.\"",
    "\"Everything has a price. Let's negotiate yours.\"",
  ],
  guide: [
    "\"I know a shortcut. Interested?\"",
    "\"You look lost. I can help... for a small fee.\"",
    "\"This path is dangerous. Let me show you another way.\"",
  ],
  trickster: [
    "\"Psst... want to make some real money?\"",
    "\"I have a proposition. Not exactly legal, but very profitable.\"",
    "\"You look like someone who takes risks.\"",
  ],
  healer: [
    "\"You look tired, traveler. Let me help.\"",
    "\"I have remedies for whatever ails you.\"",
    "\"Rest here a moment. You need it.\"",
  ],
  storyteller: [
    "\"Sit, sit! Let me tell you about this place.\"",
    "\"Every corner here has a story. Want to hear one?\"",
    "\"The old ways remember much. Listen carefully.\"",
  ],
};
