import React, { useMemo, useState, useEffect } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from "recharts";

const TS = {
  purple: "#34194b",
  gold: "#FFC43F",
  goldDeep: "#ED9D2F",
  orchid: "#7A5FA4",
  sky: "#D9E7FF",
  mint: "#DFF5EA",
  lilac: "#EDE5F4",
  slate800: "#1f2937",
  slate600: "#475569",
  slate500: "#64748b",
  slate400: "#94a3b8",
  slate200: "#e2e8f0",
  white: "#ffffff",
};

const demo = {
  whanauA: {
    name: "Whānau A",
    costNZD: 25000,
    timeSeries: [
      { t: "Start", teHaerenga: 55, whakawhanaungatanga: 48, tikanga: 52, sentiment: -0.2, tino: 38, schoolAttendance: 72, employment: 0.35, housingStability: 46 },
      { t: "Mid", teHaerenga: 62, whakawhanaungatanga: 64, tikanga: 66, sentiment: 0.15, tino: 58, schoolAttendance: 80, employment: 0.42, housingStability: 57 },
      { t: "End", teHaerenga: 68, whakawhanaungatanga: 78, tikanga: 74, sentiment: 0.42, tino: 73, schoolAttendance: 88, employment: 0.53, housingStability: 69 },
    ],
    proxies: { schoolAttendance_percPoint: 350, employment_ratePoint: 12000, housingStability_point: 180 },
    quotes: {
      Start: [
        { id: "A-S-1", theme: "Te Haerenga", sentiment: -0.6, text: "I wasn’t sure where to start or who to call; we kept repeating our story." },
        { id: "A-S-2", theme: "Whakawhānaungatanga", sentiment: -0.3, text: "Staff were polite but too rushed to really listen." },
        { id: "A-S-3", theme: "Tikanga", sentiment: -0.2, text: "The process didn’t feel like it fitted our whānau – times and forms were hard." },
        { id: "A-S-4", theme: "Tino Rangatiratanga", sentiment: -0.5, text: "Felt like decisions were already made – not much say for us." },
      ],
      Mid: [
        { id: "A-M-1", theme: "Te Haerenga", sentiment: 0.1, text: "We finally got a plan and knew what the next steps were." },
        { id: "A-M-2", theme: "Whakawhānaungatanga", sentiment: 0.3, text: "Our kaimahi checked in and remembered our tamariki by name – that mattered." },
        { id: "A-M-3", theme: "Tikanga", sentiment: 0.2, text: "Appointments shifted to suit our kura hours – much easier for us." },
        { id: "A-M-4", theme: "Tino Rangatiratanga", sentiment: 0.2, text: "We’re starting to lead the kōrero and set our own goals." },
      ],
      End: [
        { id: "A-E-1", theme: "Te Haerenga", sentiment: 0.5, text: "Everything connected up – fewer handovers, less repeating ourselves." },
        { id: "A-E-2", theme: "Whakawhānaungatanga", sentiment: 0.6, text: "Felt like a partnership – decisions made with us, not to us." },
        { id: "A-E-3", theme: "Tikanga", sentiment: 0.4, text: "We felt respected as Māori; the space and process worked for our whānau." },
        { id: "A-E-4", theme: "Tino Rangatiratanga", sentiment: 0.6, text: "We’re confident to speak up and navigate services ourselves now." },
      ],
    },
  },
  whanauB: {
    name: "Whānau B",
    costNZD: 22000,
    timeSeries: [
      { t: "Start", teHaerenga: 48, whakawhanaungatanga: 40, tikanga: 50, sentiment: -0.35, tino: 34, schoolAttendance: 65, employment: 0.28, housingStability: 40 },
      { t: "Mid", teHaerenga: 58, whakawhanaungatanga: 60, tikanga: 61, sentiment: 0.05, tino: 52, schoolAttendance: 74, employment: 0.36, housingStability: 52 },
      { t: "End", teHaerenga: 63, whakawhanaungatanga: 73, tikanga: 70, sentiment: 0.31, tino: 67, schoolAttendance: 83, employment: 0.46, housingStability: 63 },
    ],
    proxies: { schoolAttendance_percPoint: 350, employment_ratePoint: 12000, housingStability_point: 180 },
    quotes: {
      Start: [
        { id: "B-S-1", theme: "Te Haerenga", sentiment: -0.5, text: "We were bounced between services and it drained us." },
        { id: "B-S-2", theme: "Whakawhānaungatanga", sentiment: -0.4, text: "Didn’t feel seen – everything was by the book." },
        { id: "B-S-3", theme: "Tino Rangatiratanga", sentiment: -0.5, text: "We didn’t feel in control of the plan." },
      ],
      Mid: [
        { id: "B-M-1", theme: "Tikanga", sentiment: 0.1, text: "Options opened up and staff explained things in plain language." },
        { id: "B-M-2", theme: "Tino Rangatiratanga", sentiment: 0.2, text: "Had a say in what happens next; feeling more confident." },
      ],
      End: [
        { id: "B-E-1", theme: "Whakawhānaungatanga", sentiment: 0.5, text: "We trust our kaimahi now; they know our goals." },
        { id: "B-E-2", theme: "Tino Rangatiratanga", sentiment: 0.5, text: "We’re steering our plan and know who to ask for what." },
      ],
    },
  },
};

function currency(n) {
  return n.toLocaleString("en-NZ", { style: "currency", currency: "NZD", maximumFractionDigits: 0 });
}

const InfoTag = ({ label }) => (
  <span className="rounded-full bg-white/80 text-[11px] px-2 py-1 border border-white/60 shadow-sm text-slate-700">
    {label}
  </span>
);

const Stat = ({ label, value, sub, tone = "neutral" }) => (
  <div className={`rounded-2xl p-4 border ${tone === "good" ? "bg-green-50 border-green-100" : tone === "warn" ? "bg-amber-50 border-amber-100" : "bg-white border-slate-200"}`}>
    <div className="text-xs text-slate-500 mb-1">{label}</div>
    <div className="text-2xl font-semibold text-slate-800">{value}</div>
    {sub && <div className="text-[12px] text-slate-500 mt-1">{sub}</div>}
  </div>
);

const Badge = ({ tone = "neutral", children }) => {
  const bg = tone === "pos" ? "bg-green-50 border-green-200 text-green-700"
    : tone === "neg" ? "bg-rose-50 border-rose-200 text-rose-700"
    : "bg-slate-50 border-slate-200 text-slate-700";
  return <span className={`text-[11px] px-2 py-0.5 rounded-full border ${bg}`}>{children}</span>;
};

function runDevChecks() {
  try {
    const stagesA = new Set(demo.whanauA.timeSeries.map(d => d.t));
    console.assert(stagesA.has("Start") && stagesA.has("Mid") && stagesA.has("End"), "Stages Start/Mid/End must exist for whanauA");
    [...demo.whanauA.timeSeries, ...demo.whanauB.timeSeries].forEach(d => {
      console.assert(d.sentiment >= -1 && d.sentiment <= 1, "Sentiment must be in [-1, 1]");
    });
    const sA = demo.whanauA.timeSeries[0];
    const eA = demo.whanauA.timeSeries[demo.whanauA.timeSeries.length - 1];
    const dAttendanceA = eA.schoolAttendance - sA.schoolAttendance;
    const dEmploymentA = eA.employment - sA.employment;
    const dHousingA = eA.housingStability - sA.housingStability;
    const benefitsA = dAttendanceA * demo.whanauA.proxies.schoolAttendance_percPoint + (dEmploymentA / 0.10) * demo.whanauA.proxies.employment_ratePoint + dHousingA * demo.whanauA.proxies.housingStability_point;
    console.assert(benefitsA > 0, "Benefits should be > 0 for improving outcomes (whanauA)");
    [demo.whanauA, demo.whanauB].forEach(cfg => {
      const p = cfg.proxies;
      ["schoolAttendance_percPoint", "employment_ratePoint", "housingStability_point"].forEach(k => {
        console.assert(typeof p[k] === "number" && !Number.isNaN(p[k]), `Proxy ${k} must be a number`);
      });
    });
    ["Start", "Mid", "End"].forEach(stage => {
      const list = demo.whanauA.quotes[stage];
      console.assert(Array.isArray(list) && list.length > 0, `Quotes must exist for stage ${stage} (whanauA)`);
      console.assert(list.some(q => q.theme === "Tino Rangatiratanga"), `Stage ${stage} should include a Tino Rangatiratanga quote (whanauA)`);
    });
    [demo.whanauA, demo.whanauB].forEach(cfg => {
      console.assert(cfg.timeSeries.length >= 3, "Each cohort must have at least 3 timepoints");
    });
    [demo.whanauA, demo.whanauB].forEach(cfg => {
      const arr = cfg.timeSeries.map(d => d.tino);
      for (let i = 1; i < arr.length; i++) {
        console.assert(arr[i] >= arr[i-1], "Tino Rangatiratanga should not decrease over time");
      }
    });
    console.assert(demo.whanauA.timeSeries[0].t === "Start" && demo.whanauA.timeSeries.slice(-1)[0].t === "End", "Outcome deltas must be from Start to End");
    [demo.whanauA, demo.whanauB].forEach(cfg => {
      cfg.timeSeries.forEach(d => {
        [d.teHaerenga, d.whakawhanaungatanga, d.tikanga, d.tino].forEach(v => {
          console.assert(v >= 0 && v <= 100, "Theme index must be in [0,100]");
        });
      });
    });
    {
      const sB = demo.whanauB.timeSeries[0];
      const eB = demo.whanauB.timeSeries[demo.whanauB.timeSeries.length - 1];
      const dAttendanceB = eB.schoolAttendance - sB.schoolAttendance;
      const dEmploymentB = eB.employment - sB.employment;
      const dHousingB = eB.housingStability - sB.housingStability;
      const benefitsB = dAttendanceB * demo.whanauB.proxies.schoolAttendance_percPoint + (dEmploymentB / 0.10) * demo.whanauB.proxies.employment_ratePoint + dHousingB * demo.whanauB.proxies.housingStability_point;
      console.assert(benefitsB > 0, "Benefits should be > 0 for improving outcomes (whanauB)");
    }
    const allowed = new Set(["Te Haerenga", "Whakawhānaungatanga", "Tikanga", "Tino Rangatiratanga"]);
    [demo.whanauA, demo.whanauB].forEach(cfg => {
      Object.values(cfg.quotes).forEach(list => {
        list.forEach(q => {
          console.assert(allowed.has(q.theme), `Unexpected theme in quotes: ${q.theme}`);
        });
      });
    });
  } catch (e) {
    console.warn("Dev checks failed:", e);
  }
}

export default function TalkscapeWhanauOraIllustration() {
  const [cohort, setCohort] = useState("whanauA");
  const [stage, setStage] = useState("Start");
  const [themeFilter, setThemeFilter] = useState("All");
  const cfg = demo[cohort];

  useEffect(() => {
    if (typeof window !== "undefined") runDevChecks();
  }, []);

  const deltas = useMemo(() => {
    const s = cfg.timeSeries[0];
    const e = cfg.timeSeries[cfg.timeSeries.length - 1];
    const dAttendance = e.schoolAttendance - s.schoolAttendance;
    const dEmployment = e.employment - s.employment;
    const dHousing = e.housingStability - s.housingStability;
    const benefits =
      dAttendance * cfg.proxies.schoolAttendance_percPoint +
      (dEmployment / 0.10) * cfg.proxies.employment_ratePoint +
      dHousing * cfg.proxies.housingStability_point;
    const sroi = benefits / cfg.costNZD;
    return { dAttendance, dEmployment, dHousing, benefits, sroi };
  }, [cohort]);

  const themeSeries = cfg.timeSeries.map((d) => ({
    t: d.t,
    "Te Haerenga (Needs/Journey)": d.teHaerenga,
    "Whakawhānaungatanga (Relationships)": d.whakawhanaungatanga,
    "Tikanga (Service Quality Lens)": d.tikanga,
    "Tino Rangatiratanga (Empowerment)": d.tino,
    "Sentiment (−1 to +1)": d.sentiment,
  }));

  const outcomesSeries = cfg.timeSeries.map((d) => ({
    t: d.t,
    "School attendance (%)": d.schoolAttendance,
    "Employment rate (%)": d.employment * 100,
    "Housing stability": d.housingStability,
  }));

  useEffect(() => {
    const keys = Object.keys(outcomesSeries[0] || {});
    console.assert(keys.every(k => k === "t" || !k.toLowerCase().includes("tino")), "Outcomes series must not include Tino Rangatiratanga");
  }, [cohort]); // eslint-disable-line

  const allStageQuotes = cfg.quotes[stage] || [];
  const themes = ["All", "Te Haerenga", "Whakawhānaungatanga", "Tikanga", "Tino Rangatiratanga"];
  const filteredQuotes = allStageQuotes.filter(q => themeFilter === "All" || q.theme === themeFilter);

  const buildCells = (themeName) => (
    themeSeries.map((entry, idx) => (
      <Cell key={`${themeName}-${idx}`} onClick={() => { setStage(entry.t); setThemeFilter(themeName); }} />
    ))
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#faf7ff] text-slate-800">
      <header className="max-w-6xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: TS.purple }}>
              Talkscape × Whānau Ora: Lived Experience → Outcomes → SROI
            </h1>
            <p className="text-slate-600 mt-2 max-w-2xl">
              Voice-first insight on <span className="font-medium">Te Haerenga</span> & <span className="font-medium">Whakawhānaungatanga</span>,
              viewed through <span className="font-medium">Tikanga</span>, tracking <span className="font-medium">Tino Rangatiratanga</span>, outcomes, and SROI.
            </p>
            <p className="text-[12px] text-slate-500 mt-1">Outcome change measured from <span className="font-medium">Start (enrolment)</span> to <span className="font-medium">End (discharge)</span>. Click a bar to select Stage + Theme for quotes.</p>
          </div>
          <div className="flex items-center gap-3">
            <InfoTag label="Voice-first" />
            <InfoTag label="Same whānau over time" />
            <InfoTag label="Qual ↔ Quant" />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="text-sm text-slate-600">Cohort:</label>
          <select className="px-3 py-2 rounded-xl border border-slate-200 bg-white shadow-sm text-sm" value={cohort} onChange={(e) => setCohort(e.target.value)}>
            <option value="whanauA">Whānau A (demo)</option>
            <option value="whanauB">Whānau B (demo)</option>
          </select>
          <label className="text-sm text-slate-600 ml-2">Theme (optional):</label>
          <select className="px-3 py-2 rounded-xl border border-slate-200 bg-white shadow-sm text-sm" value={themeFilter} onChange={(e) => setThemeFilter(e.target.value)}>
            {themes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 border" style={{ background: `linear-gradient(135deg, ${TS.lilac}, ${TS.mint})`, borderColor: TS.slate200 }}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 items-center">
            <FlowNode title="Te Haerenga" subtitle="Patient journey & experience (needs)" />
            <FlowArrow />
            <FlowNode title="Whakawhānaungatanga" subtitle="Quality of relationships (whānau ↔ kaimahi)" />
            <FlowArrow />
            <FlowNode title="Tino Rangatiratanga" subtitle="Empowerment & confidence (should rise)" tone="gold" />
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="font-medium" style={{ color: TS.purple }}>Tikanga</span>
            <span className="text-slate-600">is the quality lens across all interactions and services.</span>
          </div>
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 300" preserveAspectRatio="none">
            <path d="M0,220 C300,260 900,120 1200,180" fill="none" stroke={TS.gold} strokeOpacity="0.15" strokeWidth="30" />
            <path d="M0,140 C300,80 900,200 1200,120" fill="none" stroke={TS.purple} strokeOpacity="0.15" strokeWidth="30" />
          </svg>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-3xl border bg-white p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-2" style={{ color: TS.purple }}>Themes & Sentiment (same whānau over time)</h2>
          <p className="text-sm text-slate-600 mb-4">Bars = theme indexes (0–100) including <span className="font-medium">Tino Rangatiratanga</span>. Line = sentiment (−1 to +1). Click a bar to set Stage + Theme for quotes.</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={themeSeries} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#eef2ff" />
                <XAxis dataKey="t" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} domain={[-1, 1]} />
                <Tooltip wrapperStyle={{ borderRadius: 12, border: `1px solid ${TS.slate200}` }} />
                <Legend />
                <Bar yAxisId="left" dataKey="Te Haerenga (Needs/Journey)" fill={TS.purple} radius={[6, 6, 0, 0]}>
                  {buildCells("Te Haerenga")}
                </Bar>
                <Bar yAxisId="left" dataKey="Whakawhānaungatanga (Relationships)" fill={TS.gold} radius={[6, 6, 0, 0]}>
                  {buildCells("Whakawhānaungatanga")}
                </Bar>
                <Bar yAxisId="left" dataKey="Tikanga (Service Quality Lens)" fill={TS.goldDeep} radius={[6, 6, 0, 0]}>
                  {buildCells("Tikanga")}
                </Bar>
                <Bar yAxisId="left" dataKey="Tino Rangatiratanga (Empowerment)" fill={TS.orchid} radius={[6, 6, 0, 0]}>
                  {buildCells("Tino Rangatiratanga")}
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="Sentiment (−1 to +1)" stroke={TS.slate600} strokeWidth={3} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-4 md:p-6 flex flex-col">
          <h3 className="text-base font-semibold mb-1" style={{ color: TS.purple }}>Illustrative quotes</h3>
          <div className="text-[12px] text-slate-500">Stage: <span className="font-medium">{stage}</span> · Theme: <span className="font-medium">{themeFilter}</span> · {filteredQuotes.length} quote{filteredQuotes.length === 1 ? "" : "s"}</div>

          <div className="mt-3 space-y-3 overflow-auto max-h-64 pr-1">
            {filteredQuotes.length === 0 && (
              <div className="text-sm text-slate-500 border rounded-xl p-3">No quotes for this combination. Click a bar to choose Stage & Theme, or change the Theme above.</div>
            )}
            {filteredQuotes.map((q) => (
              <QuoteCard key={q.id} q={q} />
            ))}
          </div>

          <div className="mt-3 text-[12px] text-slate-500">
            Quotes are examples for storytelling; connect your real Talkscape dataset to populate this panel automatically.
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl border bg-white p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-2" style={{ color: TS.purple }}>Outcomes over Time</h2>
          <p className="text-sm text-slate-600 mb-4">Lines show changes in school attendance, employment, and housing stability (Tino Rangatiratanga is visualised in the themes chart).</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={outcomesSeries} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#eef2ff" />
                <XAxis dataKey="t" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip wrapperStyle={{ borderRadius: 12, border: `1px solid ${TS.slate200}` }} />
                <Legend />
                <Line type="monotone" dataKey="School attendance (%)" stroke={TS.gold} strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Employment rate (%)" stroke={TS.goldDeep} strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Housing stability" stroke={TS.slate600} strokeWidth={3} dot={{ r: 4 }} />
                <ReferenceLine x="Start" stroke="#cbd5e1" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-4 md:p-6 space-y-3">
          <h3 className="text-base font-semibold" style={{ color: TS.purple }}>Observed change (Start → End)</h3>
          <Stat label="School attendance" value={`+${deltas.dAttendance.toFixed(0)} pts`} sub="percentage-point change" tone="good" />
          <Stat label="Employment rate" value={`+${(deltas.dEmployment * 100).toFixed(0)} pts`} sub="percentage-point change" tone="good" />
          <Stat label="Housing stability" value={`+${deltas.dHousing.toFixed(0)} pts`} sub="index points" tone="good" />
          <div className="text-[12px] text-slate-500 pt-1">Talkscape can link to admin data for verified measures.</div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="rounded-3xl border bg-white p-4 md:p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-2" style={{ color: TS.purple }}>From Outcomes to SROI</h2>
          <p className="text-sm text-slate-600 mb-4">Illustrative monetisation using proxy values; configure per funder/client. Benefits derive from improvements in outcomes linked to the qualitative story.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Stat label="Monetised benefits" value={currency(deltas.benefits)} sub="per cohort" tone="good" />
            <Stat label="Programme cost" value={currency(demo[cohort].costNZD)} sub="allocated to this cohort" tone="warn" />
            <Stat label="SROI ratio" value={`${deltas.sroi.toFixed(2)} : 1`} sub="benefit per $1 invested" tone="good" />
          </div>

          <div className="mt-6 rounded-2xl border border-dashed p-4 bg-[#fffdf5]">
            <div className="text-sm text-slate-700 font-medium mb-2">Computation (illustrative)</div>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>Benefits = (ΔAttendance pts × {currency(demo[cohort].proxies.schoolAttendance_percPoint)} /pt)
                + (ΔEmployment pts ÷ 0.10 × {currency(demo[cohort].proxies.employment_ratePoint)} per 0.10)
                + (ΔHousing pts × {currency(demo[cohort].proxies.housingStability_point)} /pt)</li>
              <li>SROI = Benefits ÷ Cost.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-4 md:p-6 flex flex-col">
          <h3 className="text-base font-semibold mb-2" style={{ color: TS.purple }}>How to talk to this</h3>
          <ol className="text-sm text-slate-700 space-y-2 list-decimal pl-5">
            <li>We capture authentic voice on <span className="font-medium">Te Haerenga</span>, <span className="font-medium">Whakawhānaungatanga</span>, <span className="font-medium">Tino Rangatiratanga</span> with <span className="font-medium">Tikanga</span> as a lens.</li>
            <li>We analyse themes, prevalence, and <span className="font-medium">sentiment</span> at each stage for the same whānau — quotes make it tangible.</li>
            <li>We observe shifts in outcomes between enrolment and discharge.</li>
            <li>We monetise outcome shifts using agreed proxies → compute <span className="font-medium">SROI</span>.</li>
          </ol>
          <div className="mt-3 text-[12px] text-slate-500">Swap demo quotes with real Talkscape excerpts programmatically.</div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-10">
        <div className="rounded-3xl border p-4 md:p-6 bg-white flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex h-3 w-3 rounded-full" style={{ background: TS.purple }} />
            <span className="text-sm">Te Haerenga</span>
            <span className="inline-flex h-3 w-3 rounded-full ml-4" style={{ background: TS.gold }} />
            <span className="text-sm">Whakawhānaungatanga</span>
            <span className="inline-flex h-3 w-3 rounded-full ml-4" style={{ background: TS.goldDeep }} />
            <span className="text-sm">Tikanga</span>
            <span className="inline-flex h-3 w-3 rounded-full ml-4" style={{ background: TS.orchid }} />
            <span className="text-sm">Tino Rangatiratanga</span>
            <span className="inline-flex h-3 w-3 rounded-full ml-4" style={{ background: TS.slate600 }} />
            <span className="text-sm">Sentiment</span>
          </div>
          <div className="text-sm text-slate-500">Click a bar to set Stage + Theme for quotes. Use the Theme selector to refine.</div>
        </div>
      </footer>
    </div>
  );
}

function FlowNode({ title, subtitle, tone = "purple" }) {
  return (
    <div className={`rounded-2xl p-4 shadow-sm border`} style={{ background: TS.white, borderColor: TS.slate200 }}>
      <div className="text-sm font-semibold" style={{ color: tone === "gold" ? TS.goldDeep : TS.purple }}>{title}</div>
      <div className="text-[12px] text-slate-600 mt-1">{subtitle}</div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="hidden md:flex items-center justify-center">
      <svg width="80" height="20" viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 10 H68" stroke={TS.slate400} strokeWidth="2" strokeLinecap="round" />
        <path d="M68 4 L78 10 L68 16 Z" fill={TS.slate400} />
      </svg>
    </div>
  );
}

function QuoteCard({ q }) {
  const tone = q.sentiment > 0.25 ? "pos" : q.sentiment < -0.25 ? "neg" : "neutral";
  return (
    <div className="border rounded-xl p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[12px] font-medium text-slate-700">{q.theme}</div>
        <Badge tone={tone}>{q.sentiment.toFixed(2)}</Badge>
      </div>
      <div className="text-sm text-slate-700 mt-1">“{q.text}”</div>
      <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
        <span className="inline-flex h-2 w-2 rounded-full bg-slate-300" />
        <span>Illustrative Talkscape excerpt</span>
      </div>
    </div>
  );
}