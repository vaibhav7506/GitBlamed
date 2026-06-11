interface GitHubDay {
  contributionCount: number;
  date: string;
  weekday: number;
}

export interface RawCalendar {
  totalContributions: number;
  weeks: Array<{
    contributionDays: GitHubDay[];
  }>;
}

interface GitHubCalendarResponse {
  data?: {
    user?: {
      contributionsCollection: {
        contributionCalendar: RawCalendar;
      };
    };
  };
  errors?: Array<{ message: string }>;
}

const QUERY = `
  query Contributions($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              weekday
            }
          }
        }
      }
    }
  }
`;

export async function fetchContributionCalendar(
  username: string,
  token?: string,
): Promise<RawCalendar> {
  if (!token) {
    return buildDemoCalendar(username);
  }

  const to = new Date();
  const from = new Date(to);
  from.setUTCFullYear(to.getUTCFullYear() - 1);

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "gitblamed-worker",
    },
    body: JSON.stringify({
      query: QUERY,
      variables: {
        login: username,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL failed with ${response.status}.`);
  }

  const json = (await response.json()) as GitHubCalendarResponse;

  if (json.errors?.length) {
    throw new Error(json.errors.map((error) => error.message).join("; "));
  }

  const calendar = json.data?.user?.contributionsCollection.contributionCalendar;
  if (!calendar) {
    throw new Error(`GitHub user "${username}" was not found.`);
  }

  return calendar;
}

function buildDemoCalendar(username: string): RawCalendar {
  let seed = username.split("").reduce((sum, char) => sum + char.charCodeAt(0), 17);
  const days: GitHubDay[] = [];
  const today = new Date();
  const start = new Date(today);
  start.setUTCDate(today.getUTCDate() - 363);

  for (let i = 0; i < 364; i++) {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + i);
    const weekday = date.getUTCDay();
    const busyBias = weekday === 0 || weekday === 6 ? 0.42 : 0.68;
    const active = seed / 4294967296 < busyBias;
    const count = active ? 1 + (seed % 11) : 0;

    days.push({
      contributionCount: count,
      date: date.toISOString().slice(0, 10),
      weekday,
    });
  }

  return {
    totalContributions: days.reduce((sum, day) => sum + day.contributionCount, 0),
    weeks: Array.from({ length: Math.ceil(days.length / 7) }, (_, index) => ({
      contributionDays: days.slice(index * 7, index * 7 + 7),
    })),
  };
}
