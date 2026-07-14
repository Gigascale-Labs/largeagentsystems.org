"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const trajectoryData = [
  { year: "2022", moltbook: 2, evomap: 1, largestModel: 3 },
  { year: "2023", moltbook: 6, evomap: 4, largestModel: 8 },
  { year: "2024", moltbook: 14, evomap: 10, largestModel: 19 },
  { year: "2025", moltbook: 29, evomap: 21, largestModel: 37 },
  { year: "2026", moltbook: 46, evomap: 34, largestModel: 55 },
];

const spreadData = [
  { system: "Forums", value: 38 },
  { system: "Human Rep.", value: 22 },
  { system: "Skill Sharing", value: 17 },
  { system: "Culture", value: 29 },
  { system: "Economy", value: 24 },
  { system: "Simulation", value: 15 },
];

export function GrowthChart() {
  return (
    <section
      id="growth"
      className="scroll-mt-20 border-b border-rule px-6 py-24 md:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Trajectory
        </p>
        <h2 className="mt-4 max-w-2xl font-serif text-3xl font-semibold leading-tight md:text-4xl">
          Agentic systems are growing fast.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/80 md:text-lg">
          Founded largely in the past year, early examples of purely-AI
          large agent systems have hundreds of thousands of participants.
        </p>

        <div className="mt-12 h-[360px] w-full border border-rule bg-background p-4 md:p-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trajectoryData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="var(--rule)" vertical={false} />
              <XAxis
                dataKey="year"
                stroke="var(--muted)"
                tickLine={false}
                axisLine={{ stroke: "var(--rule)" }}
                fontSize={12}
              />
              <YAxis
                stroke="var(--muted)"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--background)",
                  border: "1px solid var(--rule)",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
              <Line
                type="monotone"
                dataKey="moltbook"
                name="MoltBook"
                stroke="#7a2118"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="evomap"
                name="EvoMap"
                stroke="#4f6357"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="largestModel"
                name="Largest LLM agent-based model"
                stroke="#8a7d54"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 text-xs italic text-muted">
          Illustrative, placeholder data shown for layout purposes only — not
          sourced.
        </p>

        <h3 className="mt-16 max-w-2xl font-serif text-xl font-semibold leading-tight md:text-2xl">
          More and more agents are entering human systems.
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/80 md:text-lg">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat duis aute irure dolor.
        </p>

        <div className="mt-12 h-[360px] w-full border border-rule bg-background p-4 md:p-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={spreadData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="var(--rule)" vertical={false} />
              <XAxis
                dataKey="system"
                stroke="var(--muted)"
                tickLine={false}
                axisLine={{ stroke: "var(--rule)" }}
                fontSize={12}
              />
              <YAxis
                stroke="var(--muted)"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--background)",
                  border: "1px solid var(--rule)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" name="Illustrative agent presence" fill="#7a2118" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 text-xs italic text-muted">
          Illustrative, placeholder data shown for layout purposes only — not
          sourced.
        </p>
      </div>
    </section>
  );
}
