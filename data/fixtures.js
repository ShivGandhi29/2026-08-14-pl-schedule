// Static sample data for the prototype: PL teams + a generated full-season
// fixture list (round-robin, home & away). Kickoff dates/times are
// illustrative placeholders, not real broadcast fixtures.

const TEAMS = [
  { id: "ars", name: "Arsenal", short: "ARS", color: "#EF0107" },
  { id: "avl", name: "Aston Villa", short: "AVL", color: "#95BFE5" },
  { id: "bou", name: "Bournemouth", short: "BOU", color: "#DA291C" },
  { id: "bre", name: "Brentford", short: "BRE", color: "#E30613" },
  { id: "bha", name: "Brighton & Hove Albion", short: "BHA", color: "#0057B8" },
  { id: "bur", name: "Burnley", short: "BUR", color: "#6C1D45" },
  { id: "che", name: "Chelsea", short: "CHE", color: "#034694" },
  { id: "cry", name: "Crystal Palace", short: "CRY", color: "#1B458F" },
  { id: "eve", name: "Everton", short: "EVE", color: "#003399" },
  { id: "ful", name: "Fulham", short: "FUL", color: "#000000" },
  { id: "lee", name: "Leeds United", short: "LEE", color: "#FFCD00" },
  { id: "liv", name: "Liverpool", short: "LIV", color: "#C8102E" },
  { id: "mci", name: "Manchester City", short: "MCI", color: "#6CABDD" },
  { id: "mun", name: "Manchester United", short: "MUN", color: "#DA291C" },
  { id: "new", name: "Newcastle United", short: "NEW", color: "#241F20" },
  { id: "nfo", name: "Nottingham Forest", short: "NFO", color: "#DD0000" },
  { id: "sun", name: "Sunderland", short: "SUN", color: "#EB172B" },
  { id: "tot", name: "Tottenham Hotspur", short: "TOT", color: "#132257" },
  { id: "whu", name: "West Ham United", short: "WHU", color: "#7A263A" },
  { id: "wol", name: "Wolverhampton Wanderers", short: "WOL", color: "#FDB913" },
];

// Generate a full home-and-away round-robin schedule using the circle method.
function generateFixtures(teams, seasonStart) {
  const ids = teams.map((t) => t.id);
  const n = ids.length;
  const rounds = n - 1;
  const half = n / 2;
  const kickoffTimes = ["12:30", "15:00", "17:30", "20:00"];

  const arr = ids.slice(1); // fixed[0] stays put, rest rotate
  const fixed = ids[0];
  const firstLeg = [];

  for (let round = 0; round < rounds; round++) {
    const roundTeams = [fixed, ...arr];
    const pairs = [];
    for (let i = 0; i < half; i++) {
      const home = roundTeams[i];
      const away = roundTeams[n - 1 - i];
      // Alternate home advantage each round so one team isn't always home.
      pairs.push(round % 2 === 0 ? [home, away] : [away, home]);
    }
    firstLeg.push(pairs);
    arr.push(arr.shift());
  }

  // Second leg: same pairings, reversed venue.
  const secondLeg = firstLeg.map((pairs) => pairs.map(([h, a]) => [a, h]));
  const allRounds = [...firstLeg, ...secondLeg];

  const fixtures = [];
  let id = 1;
  const start = new Date(seasonStart);

  allRounds.forEach((pairs, roundIndex) => {
    const roundDate = new Date(start);
    roundDate.setDate(start.getDate() + roundIndex * 7);
    const dateStr = roundDate.toISOString().slice(0, 10);

    pairs.forEach(([home, away], i) => {
      fixtures.push({
        id: id++,
        matchweek: roundIndex + 1,
        date: dateStr,
        time: kickoffTimes[i % kickoffTimes.length],
        home,
        away,
      });
    });
  });

  return fixtures;
}

const FIXTURES = generateFixtures(TEAMS, "2025-08-16");
