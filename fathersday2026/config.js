/* ============================================================================
   ✏️  EDIT ME — Father's Day puzzle configuration
   ----------------------------------------------------------------------------
   This is the ONLY file you need to touch to change questions & answers.
   (You don't need to know how to code — just edit the text inside the quotes.)

   >>> The answers below are PLACEHOLDERS for testing: ANSWER_1A, ANSWER_2, etc.
   >>> Replace them with the real answers whenever your sister is ready.
   ============================================================================ */

const CONFIG = {
  // Who is this for? (used in the title)
  recipient: "Dad",

  // The picture to reveal. Save your image in THIS folder and put its
  // filename here. (e.g. the kids' family drawing.)
  secretImage: "secret.png",

  // Message shown once the whole picture is uncovered.
  finishedMessage: `Dear Dad, 

You used to give us problems to solve. Now you solve our problems for us.
Happy Father's Day! Love you!

- Vic + Cass (+ Corinna) ❤️`,

  // How finely the picture is covered, in tiles (rows × columns).
  // 4 × 5 = 20 tiles. More tiles = the reveal happens in smaller pieces.
  revealRows: 4,
  revealCols: 5,
};

/* ----------------------------------------------------------------------------
   THE PUZZLES
   Each item below is one puzzle card. Solving it uncovers a piece of the picture.

   A puzzle can ask MORE THAN ONE thing (see Puzzle 1 — it asks "how long?" AND
   "how far?"). Every part must be correct to reveal that puzzle's piece.

   For each part you can set:
     prompt       – the label shown above the answer box
     placeholder  – faint example text inside the box (optional)
     answers      – the list of accepted answers (NOT case-sensitive).
                    Add as many spellings as you want, e.g.
                    ["300", "300 m", "300 meters", "0.3 km"]
     numericValue + tolerance  (OPTIONAL) – if you set these, ANY number the
                    solver types within ± tolerance is accepted. Great for
                    answers like 2.4 where you want to allow 2.4, 2.40, etc.
                    Example:  numericValue: 2.4, tolerance: 0.05
   ---------------------------------------------------------------------------- */

const PROBLEMS = [
  {
    id: "walk",
    emoji: "🚶‍♀️",
    title: "The Forgotten Phone",
    question:
      "Mom and Dad are walking at 5km/hr speed in a straight line away from the house. After leaving the house and walking 100 meters, Mom realizes she forgot her phone and Dad has to go back and get it. Mom continues walking at 5km/hr speed away from the house. Dad walks at 7km/hr speed back to the house, gets the phone, then walks at 7km/hr speed to catch up to mom. When Dad has caught up to Mom, how far away are they from the house, in meters?",
    parts: [
      {
        prompt: "How far away are they from the house, in meters?",
        placeholder: "type the answer…",
        numericValue: 600,
      }
    ],
  },

  {
    id: "tofu",
    emoji: "🍢",
    title: "Tofu Taste Test",
    question:
      'Dad is cooking tofu and is experimenting with strips (2/3" x 2" x 1/2") instead of squares (2" x 2" x 1/2"). Suppose the tastiness is correlated with total surface area and the total volume of tofu he cooks stays the same, which means he cooks three times the number of strips as squares. With this setup, tofu strips are X% tastier than tofu squares. To the nearest integer, what is X?',
    parts: [
      {
        prompt: "Your answer",
        placeholder: "type the answer…",
        numericValue: 33,
      },
    ],
  },

  // {
  //   id: "garden",
  //   emoji: "🪴",
  //   title: "Bo Waters the Garden",
  //   question:
  //     "Good students do chores! Bo waters the garden using water from the " +
  //     "kitchen and bathroom. His bucket holds 5 gallons, and he can carry it " +
  //     "between the house and the garden once per minute. The garden soil holds " +
  //     "60 gallons when fully saturated. If water evaporates at 1% per minute, " +
  //     "how many minutes does it take Bo to raise the soil from 25% saturated " +
  //     "to 75% saturated?",
  //   parts: [
  //     {
  //       prompt: "Number of minutes",
  //       placeholder: "type the answer…",
  //       answers: ["ANSWER_3"],
  //     },
  //   ],
  // },

  {
    id: "cookies",
    emoji: "🍪",
    title: "Bo's Walnut Cookies",
    question:
      "Bo's famous cookies shop specializes in walnut cookies. In order to incentivize customers to purchase more cookies, he sells cookies in 3's and 8's. What is the largest number X such that it is not possible to buy exactly X cookies from Bo?",
    parts: [
      {
        prompt: "The largest impossible number",
        placeholder: "type the answer…",
        numericValue: 13,
      },
    ],
  },

  {
    id: "agents",
    emoji: "🤖",
    title: "Bo's Army of Agents",
    question: "In leveling up his Claude Code skills, Bo has discovered that he can ask an agent to spawn more agents. How powerful! As an experiment, Bo wants to see if there's a limit to the number of agents he can spawn. He starts with a single agent, and asks the agent to spawn two new agents, which then each spawn three new agents, which then each spawn four new agents, which then each spawn five new agents. How many total agents (and subagents) does he now have?",
    parts: [
      {
        prompt: "Total number of agents",
        placeholder: "type the answer…",
        numericValue: 153
      },
    ],
  },
];
