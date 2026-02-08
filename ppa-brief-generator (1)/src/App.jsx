import { useState, useRef } from "react";

const DEFAULT_DEAL = {
  // Project Details
  projectName: "North Sea Offshore Wind",
  technology: "Offshore Wind",
  capacityMW: 402,
  annualGenerationGWh: 1400,
  location: "UK North Sea",
  codDate: "Q3 2027",

  // Commercial Terms
  strikePriceMWh: 52,
  contractYears: 10,
  ppaStructure: "Virtual (Financial)",
  volumeTolerancePct: 15,
  indexation: "Fixed (no indexation)",
  settlementFrequency: "Monthly",

  // Counterparties
  generatorName: "Danske Commodities",
  generatorParent: "Equinor",
  generatorCreditRating: "Investment Grade (A-)",
  offtakerName: "Octopus Energy",
  offtakerCreditRating: "Investment Grade",

  // Buyer Context
  buyerName: "Acme Manufacturing Ltd",
  buyerSector: "Manufacturing / Industrial",
  currentGridCostMWh: 60,
  annualConsumptionGWh: 500,
  ppaCoveragePercent: 40,
  hasNetZeroTarget: true,
  netZeroTargetYear: 2035,

  // Market Context
  forwardCurveMWh: 60.5,
  discountToMarketPct: 14,

  // Risk Parameters
  basisRisk: "Medium",
  shapeRisk: "Medium",
  regulatoryRisk: "Medium",
  counterpartyCreditRisk: "Low",
  cannibalisation: "Low",
  changeInLaw: "Standard protection clause",
  terminationTriggers: "Material adverse change, credit default, force majeure >12mo",
  creditSupport: "Parent company guarantee (Equinor)",
  governingLaw: "English Law",

  // Financial Estimates
  annualSavingM: 0.84,
  tenYearNPVSavingM: 8.4,
  maxAnnualDownsideM: 1.2,
  scenarioUpM: "12-18",
  scenarioFlatM: "6-8",
  scenarioDownCostPerYrM: 1.2,
  wacc: 8,
};

const FIELDS_CONFIG = [
  {
    section: "Project Details",
    icon: "⚡",
    fields: [
      { key: "projectName", label: "Project Name", type: "text" },
      { key: "technology", label: "Technology", type: "select", options: ["Offshore Wind", "Onshore Wind", "Solar PV", "Hybrid (Wind + Solar)", "Battery + Solar"] },
      { key: "capacityMW", label: "Capacity (MW)", type: "number" },
      { key: "annualGenerationGWh", label: "Annual Generation (GWh)", type: "number" },
      { key: "location", label: "Project Location", type: "text" },
      { key: "codDate", label: "Commercial Operation Date", type: "text" },
    ],
  },
  {
    section: "Commercial Terms",
    icon: "📋",
    fields: [
      { key: "strikePriceMWh", label: "Strike Price (£/MWh)", type: "number", step: 0.5 },
      { key: "contractYears", label: "Contract Term (Years)", type: "number" },
      { key: "ppaStructure", label: "PPA Structure", type: "select", options: ["Virtual (Financial)", "Physical (Sleeved)", "Physical (Direct Wire)", "Synthetic"] },
      { key: "volumeTolerancePct", label: "Volume Tolerance (±%)", type: "number" },
      { key: "indexation", label: "Indexation", type: "select", options: ["Fixed (no indexation)", "CPI-linked", "RPI-linked", "Partial CPI (50%)"] },
      { key: "settlementFrequency", label: "Settlement Frequency", type: "select", options: ["Monthly", "Quarterly", "Annual"] },
    ],
  },
  {
    section: "Counterparties",
    icon: "🏢",
    fields: [
      { key: "generatorName", label: "Generator / Seller", type: "text" },
      { key: "generatorParent", label: "Parent Company", type: "text" },
      { key: "generatorCreditRating", label: "Generator Credit Rating", type: "text" },
      { key: "offtakerName", label: "Offtaker / Intermediary", type: "text" },
      { key: "offtakerCreditRating", label: "Offtaker Credit Rating", type: "text" },
    ],
  },
  {
    section: "Buyer Context",
    icon: "🏭",
    fields: [
      { key: "buyerName", label: "Buyer (Your Company)", type: "text" },
      { key: "buyerSector", label: "Sector", type: "select", options: ["Manufacturing / Industrial", "Technology / Data Centres", "Retail / Consumer", "Financial Services", "Healthcare / Pharma", "Logistics / Transport"] },
      { key: "currentGridCostMWh", label: "Current Grid Cost (£/MWh)", type: "number", step: 0.5 },
      { key: "annualConsumptionGWh", label: "Annual Consumption (GWh)", type: "number" },
      { key: "ppaCoveragePercent", label: "PPA Coverage of Load (%)", type: "number" },
      { key: "hasNetZeroTarget", label: "Has Net-Zero Target?", type: "toggle" },
      { key: "netZeroTargetYear", label: "Net-Zero Target Year", type: "number" },
    ],
  },
  {
    section: "Market & Financials",
    icon: "📊",
    fields: [
      { key: "forwardCurveMWh", label: "Forward Curve (£/MWh)", type: "number", step: 0.5 },
      { key: "discountToMarketPct", label: "Discount to Market (%)", type: "number" },
      { key: "annualSavingM", label: "Est. Annual Saving (£M)", type: "number", step: 0.01 },
      { key: "tenYearNPVSavingM", label: "NPV Saving Over Term (£M)", type: "number", step: 0.1 },
      { key: "maxAnnualDownsideM", label: "Max Annual Downside (£M)", type: "number", step: 0.1 },
      { key: "wacc", label: "WACC / Discount Rate (%)", type: "number", step: 0.5 },
    ],
  },
  {
    section: "Risk Parameters",
    icon: "🛡️",
    fields: [
      { key: "basisRisk", label: "Basis Risk", type: "select", options: ["Low", "Medium", "High"] },
      { key: "shapeRisk", label: "Shape / Profile Risk", type: "select", options: ["Low", "Medium", "High"] },
      { key: "regulatoryRisk", label: "Regulatory Risk", type: "select", options: ["Low", "Medium", "High"] },
      { key: "counterpartyCreditRisk", label: "Counterparty Credit Risk", type: "select", options: ["Low", "Medium", "High"] },
      { key: "cannibalisation", label: "Cannibalisation Risk", type: "select", options: ["Low", "Medium", "High"] },
      { key: "creditSupport", label: "Credit Support Structure", type: "text" },
      { key: "changeInLaw", label: "Change-in-Law Clause", type: "text" },
      { key: "terminationTriggers", label: "Termination Triggers", type: "text" },
      { key: "governingLaw", label: "Governing Law", type: "text" },
    ],
  },
];

const riskColor = (level) => {
  if (level === "Low") return { bg: "#E8F8F0", dot: "#2ECC71", text: "#1A7A42" };
  if (level === "Medium") return { bg: "#FFF9E6", dot: "#F0AD4E", text: "#8B6914" };
  return { bg: "#FEF0EF", dot: "#E74C3C", text: "#A63D2F" };
};

/* ─────────────────────────────────────────
   BOARD VIEW
   ───────────────────────────────────────── */
function BoardView({ d }) {
  const structureExplainer = d.ppaStructure.includes("Virtual")
    ? `This is a virtual PPA — no physical power delivery changes. Your existing supplier continues to deliver electricity normally. This is a purely financial contract: when market prices exceed £${d.strikePriceMWh}, the generator pays you the difference. When prices are below £${d.strikePriceMWh}, you pay the difference. Net effect: your blended electricity cost is fixed and predictable.`
    : `This is a physical PPA — electricity is delivered directly or sleeved through a licensed supplier. You receive actual renewable power from the project, replacing a portion of your grid purchases with clean energy at a guaranteed price.`;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a2e", background: "#fff", maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0B1D3A 0%, #14304D 100%)", padding: "32px 36px 28px", borderRadius: "0 0 0 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 200, height: 200, background: "radial-gradient(circle, rgba(0,168,168,0.15) 0%, transparent 70%)" }} />
        <div style={{ fontSize: 11, color: "#00C9C9", fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>POWER PURCHASE AGREEMENT</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>Board Decision Brief</div>
        <div style={{ fontSize: 13, color: "#8EAEC8", marginTop: 6 }}>Confidential — For board consideration only</div>
        <div style={{ display: "flex", gap: 32, marginTop: 20, flexWrap: "wrap" }}>
          {[
            ["PROJECT", d.projectName],
            ["COUNTERPARTY", `${d.generatorName} / ${d.offtakerName}`],
            ["STRUCTURE", d.ppaStructure],
          ].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize: 9, color: "#5A7A9A", fontWeight: 600, letterSpacing: 1 }}>{l}</div>
              <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #00A8A8, #00C9C9, #00A8A8)" }} />
      </div>

      {/* Recommendation */}
      <div style={{ margin: "20px 28px 0", padding: "14px 20px", background: "#E8F8F0", border: "1px solid #2ECC71", borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 10 }}>
        <span style={{ color: "#2ECC71", fontSize: 18, lineHeight: 1 }}>✓</span>
        <div>
          <span style={{ fontWeight: 700, color: "#1A7A42", fontSize: 13 }}>RECOMMENDATION: </span>
          <span style={{ color: "#2D3748", fontSize: 13 }}>
            Execute this PPA to lock in energy costs {d.discountToMarketPct}% below market for {d.contractYears} years, saving an estimated £{d.tenYearNPVSavingM}M (NPV).
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, margin: "20px 28px 0" }}>
        {[
          ["Strike Price", `£${d.strikePriceMWh}/MWh`, `Fixed for ${d.contractYears} years`, "#0B1D3A"],
          ["Annual Volume", `~${d.annualGenerationGWh.toLocaleString()} GWh`, `${d.capacityMW} MW ${d.technology.toLowerCase()}`, "#0B1D3A"],
          ["Est. NPV Savings", `£${d.tenYearNPVSavingM}M`, `Over contract term`, "#0D6B3D"],
          ["Contract Term", `${d.contractYears} Years`, `Start: ${d.codDate}`, "#0B1D3A"],
        ].map(([label, value, sub, color]) => (
          <div key={label} style={{ background: "#F4F6F8", borderRadius: 8, padding: "14px 14px 12px", borderTop: `3px solid ${color}` }}>
            <div style={{ fontSize: 9, color: "#8A98A8", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color, marginTop: 4 }}>{value}</div>
            <div style={{ fontSize: 10, color: "#8A98A8", marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, margin: "24px 28px 0" }}>
        {/* Left */}
        <div>
          <SectionTitle>What Is This Deal?</SectionTitle>
          <P>
            Think of this as a <b>{d.contractYears}-year fixed-rate mortgage on your electricity</b>.
            Instead of being exposed to volatile wholesale energy prices, {d.buyerName} agrees to buy power
            at a guaranteed £{d.strikePriceMWh}/MWh from {d.projectName} — a {d.capacityMW} MW {d.technology.toLowerCase()} project in {d.location}.
          </P>
          <P>{structureExplainer}</P>

          <SectionTitle style={{ marginTop: 20 }}>Who Are the Counterparties?</SectionTitle>
          <P>
            <b>{d.generatorName}</b> {d.generatorParent ? `(a ${d.generatorParent} subsidiary)` : ""} — rated {d.generatorCreditRating}.{" "}
            <b>{d.offtakerName}</b> — rated {d.offtakerCreditRating}.
            Both provide strong credit foundations, significantly reducing counterparty risk.
          </P>

          {d.hasNetZeroTarget && (
            <>
              <SectionTitle style={{ marginTop: 20 }}>Strategic & ESG Value</SectionTitle>
              <P>
                This PPA provides Renewable Energy Guarantees of Origin (REGOs), supporting {d.buyerName}'s
                net-zero {d.netZeroTargetYear} commitment. For a {d.buyerSector.toLowerCase()} business, this
                directly addresses Scope 2 emissions, strengthens ESG positioning in supply chains, and
                satisfies increasing investor and customer due diligence requirements.
              </P>
            </>
          )}
        </div>

        {/* Right */}
        <div>
          <SectionTitle>What Happens If Prices Change?</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
            {[
              ["▲ Prices Rise", `You save more. The PPA becomes increasingly valuable. Est. saving: £${d.scenarioUpM}M over the term.`, "#E8F8F0", "#1A7A42"],
              ["► Prices Stay Flat", `Modest savings plus full budget certainty. Est. saving: £${d.scenarioFlatM}M over the term.`, "#FFF9E6", "#8B6914"],
              ["▼ Prices Fall", `You pay above market. Premium capped at ~£${d.scenarioDownCostPerYrM}M/yr — the insurance cost for certainty.`, "#FEF0EF", "#A63D2F"],
            ].map(([title, desc, bg, color]) => (
              <div key={title} style={{ background: bg, borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontWeight: 700, fontSize: 12, color }}>{title}</div>
                <div style={{ fontSize: 11, color: "#4A5568", marginTop: 4, lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>

          <SectionTitle style={{ marginTop: 20 }}>Risk At a Glance</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {[
              ["Price vs. Market", `${d.discountToMarketPct}% below forward curve`, d.discountToMarketPct >= 10 ? "Low" : d.discountToMarketPct >= 5 ? "Medium" : "High"],
              ["Counterparty Credit", d.generatorCreditRating, d.counterpartyCreditRisk],
              ["Volume Flexibility", `±${d.volumeTolerancePct}% annual tolerance`, d.volumeTolerancePct >= 15 ? "Low" : "Medium"],
              ["Regulatory", "Embedded benefits & policy", d.regulatoryRisk],
            ].map(([label, detail, level]) => {
              const rc = riskColor(level);
              return (
                <div key={label} style={{ background: "#F4F6F8", borderRadius: 6, padding: "8px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: rc.dot, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#0B1D3A" }}>{label}</span>
                    <span style={{ fontSize: 10, color: "#8A98A8", marginLeft: 8 }}>{detail}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Financial bar */}
      <div style={{ margin: "24px 28px 0", background: "#0B1D3A", borderRadius: 10, padding: "18px 0", display: "grid", gridTemplateColumns: "repeat(5, 1fr)" }}>
        {[
          ["Current Grid Cost", `~£${d.currentGridCostMWh}/MWh`],
          ["PPA Strike", `£${d.strikePriceMWh}/MWh`],
          ["Annual Saving", `~£${d.annualSavingM}M/yr`],
          [`${d.contractYears}-Year NPV`, `~£${d.tenYearNPVSavingM}M`],
          ["Max Downside/Yr", `~£${d.maxAnnualDownsideM}M`],
        ].map(([l, v], i) => (
          <div key={l} style={{ textAlign: "center", borderRight: i < 4 ? "1px solid #1E4060" : "none", padding: "0 8px" }}>
            <div style={{ fontSize: 9, color: "#5A7A9A", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>{l}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginTop: 4 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ margin: "16px 28px 24px", paddingTop: 12, borderTop: "1px solid #E2E8F0" }}>
        <div style={{ fontSize: 9, color: "#8A98A8", lineHeight: 1.6 }}>
          Disclaimer: Illustrative figures based on current forward curves and project assumptions. Actual outcomes may vary.
          This document does not constitute financial advice. All figures subject to final commercial terms, credit assessment, and legal due diligence.
        </div>
        <div style={{ fontSize: 10, color: "#00A8A8", fontWeight: 600, marginTop: 6, textAlign: "right" }}>Prepared by Energy Trade Centre</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   RISK TEAM VIEW
   ───────────────────────────────────────── */
function RiskView({ d }) {
  const riskItems = [
    {
      category: "Market Risk",
      items: [
        { name: "Price / Basis Risk", level: d.basisRisk, detail: `Strike £${d.strikePriceMWh}/MWh vs forward curve £${d.forwardCurveMWh}/MWh. Discount of ${d.discountToMarketPct}%. Basis risk from locational price divergence between project node and buyer's reference price.` },
        { name: "Shape / Profile Risk", level: d.shapeRisk, detail: `${d.technology} generation profile vs. buyer's flat consumption pattern. Volume tolerance band of ±${d.volumeTolerancePct}%. Intermittent generation creates period-level P&L variance even if annual volumes align.` },
        { name: "Cannibalisation Risk", level: d.cannibalisation, detail: `As renewable capacity increases, capture prices during high-wind/solar periods may decline below baseload average. Long-term erosion of effective PPA value relative to baseload reference.` },
      ],
    },
    {
      category: "Credit & Counterparty Risk",
      items: [
        { name: "Generator Credit", level: d.counterpartyCreditRisk, detail: `${d.generatorName} ${d.generatorParent ? `(parent: ${d.generatorParent})` : ""} — rated ${d.generatorCreditRating}. Credit support: ${d.creditSupport}.` },
        { name: "Offtaker Credit", level: d.counterpartyCreditRisk, detail: `${d.offtakerName} — rated ${d.offtakerCreditRating}. Settlement via ${d.settlementFrequency.toLowerCase()} netting arrangement.` },
        { name: "Concentration Risk", level: "Medium", detail: `Single-asset exposure to ${d.capacityMW} MW ${d.technology.toLowerCase()} project. No portfolio diversification of generation source, technology, or geography.` },
      ],
    },
    {
      category: "Regulatory & Legal Risk",
      items: [
        { name: "Regulatory / Policy", level: d.regulatoryRisk, detail: `Exposure to changes in embedded benefit regime, REGO market structure, grid charging, and carbon pricing. Change-in-law clause: ${d.changeInLaw}.` },
        { name: "Legal / Contractual", level: "Low", detail: `Governed under ${d.governingLaw}. Termination triggers: ${d.terminationTriggers}. Standard ISDA-style provisions adapted for PPA.` },
      ],
    },
    {
      category: "Operational & Accounting Risk",
      items: [
        { name: "Accounting Treatment", level: d.ppaStructure.includes("Virtual") ? "Low" : "Medium", detail: d.ppaStructure.includes("Virtual") ? "Virtual PPA structured as contract-for-difference. Expected to qualify for off-balance sheet treatment. Requires IFRS 9 hedge accounting assessment if mark-to-market volatility is material." : "Physical PPA may require on-balance sheet recognition depending on lease vs. supply classification under IFRS 16. Requires detailed accounting review." },
        { name: "Operational Complexity", level: "Low", detail: `${d.settlementFrequency} settlement cycle. Metering data from generator; reconciliation against reference price. No physical delivery changes required (${d.ppaStructure.toLowerCase()}).` },
      ],
    },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a2e", background: "#fff", maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)", padding: "28px 36px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, border: "2px solid rgba(255,255,255,0.05)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, border: "2px solid rgba(255,255,255,0.05)", borderRadius: "50%" }} />
        <div style={{ fontSize: 11, color: "#F0AD4E", fontWeight: 700, letterSpacing: 2 }}>PPA RISK ASSESSMENT</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginTop: 4 }}>{d.projectName} — {d.capacityMW} MW {d.technology}</div>
        <div style={{ fontSize: 12, color: "#A0AEC0", marginTop: 6 }}>
          {d.generatorName} / {d.offtakerName} • {d.ppaStructure} • {d.contractYears}-Year Term • £{d.strikePriceMWh}/MWh
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #F0AD4E, #E74C3C, #F0AD4E)" }} />
      </div>

      {/* Deal Parameters Grid */}
      <div style={{ margin: "20px 28px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#8A98A8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Key Parameters</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
          {[
            ["Strike", `£${d.strikePriceMWh}/MWh`],
            ["Forward", `£${d.forwardCurveMWh}/MWh`],
            ["Discount", `${d.discountToMarketPct}%`],
            ["Vol. Tolerance", `±${d.volumeTolerancePct}%`],
            ["WACC", `${d.wacc}%`],
            ["Max Downside", `£${d.maxAnnualDownsideM}M/yr`],
          ].map(([l, v]) => (
            <div key={l} style={{ background: "#F7F8FA", borderRadius: 6, padding: "10px 10px 8px", borderLeft: "3px solid #1a1a2e" }}>
              <div style={{ fontSize: 8, color: "#8A98A8", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>{l}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", marginTop: 3 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Matrix */}
      <div style={{ margin: "20px 28px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#8A98A8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Risk Matrix</div>
        {riskItems.map((cat) => (
          <div key={cat.category} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", marginBottom: 8, paddingBottom: 4, borderBottom: "2px solid #E2E8F0" }}>
              {cat.category}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {cat.items.map((item) => {
                const rc = riskColor(item.level);
                return (
                  <div key={item.name} style={{ background: rc.bg, borderRadius: 8, padding: "10px 14px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 52, paddingTop: 2 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: rc.dot }} />
                      <div style={{ fontSize: 9, fontWeight: 700, color: rc.text, marginTop: 3 }}>{item.level.toUpperCase()}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>{item.name}</div>
                      <div style={{ fontSize: 10, color: "#4A5568", marginTop: 3, lineHeight: 1.55 }}>{item.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sensitivity / Stress Test Summary */}
      <div style={{ margin: "8px 28px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#8A98A8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Sensitivity Analysis</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            ["Prices +20%", `Gain: ~£${d.scenarioUpM}M`, "#E8F8F0", "#1A7A42", `PPA deeply in-the-money. No credit exposure increase.`],
            ["Prices Flat", `Gain: ~£${d.scenarioFlatM}M`, "#FFF9E6", "#8B6914", `Modest saving maintained. Budget certainty realised.`],
            ["Prices −20%", `Cost: ~£${d.scenarioDownCostPerYrM}M/yr`, "#FEF0EF", "#A63D2F", `Maximum annual exposure capped. Represents opportunity cost, not cash loss beyond settlement.`],
          ].map(([title, value, bg, color, note]) => (
            <div key={title} style={{ background: bg, borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color }}>{title}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color, marginTop: 4 }}>{value}</div>
              <div style={{ fontSize: 9, color: "#4A5568", marginTop: 4, lineHeight: 1.5 }}>{note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Mitigants */}
      <div style={{ margin: "20px 28px 0", padding: "16px 20px", background: "#F7F8FA", borderRadius: 10, border: "1px solid #E2E8F0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>Key Mitigants & Protections</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            ["Credit Support", d.creditSupport],
            ["Volume Band", `±${d.volumeTolerancePct}% annual tolerance`],
            ["Change-in-Law", d.changeInLaw],
            ["Termination", d.terminationTriggers],
            ["Governing Law", d.governingLaw],
            ["Settlement", `${d.settlementFrequency} net settlement`],
          ].map(([l, v]) => (
            <div key={l} style={{ fontSize: 10, lineHeight: 1.5 }}>
              <span style={{ fontWeight: 700, color: "#1a1a2e" }}>{l}: </span>
              <span style={{ color: "#4A5568" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ margin: "16px 28px 24px", paddingTop: 12, borderTop: "1px solid #E2E8F0" }}>
        <div style={{ fontSize: 9, color: "#8A98A8", lineHeight: 1.6 }}>
          For internal risk assessment only. Figures are illustrative and based on current forward curves. Full quantitative risk analysis, VaR modelling,
          and credit assessment to be completed prior to execution. All terms subject to final negotiation.
        </div>
        <div style={{ fontSize: 10, color: "#00A8A8", fontWeight: 600, marginTop: 6, textAlign: "right" }}>Prepared by Energy Trade Centre</div>
      </div>
    </div>
  );
}

/* Helper components */
function SectionTitle({ children, style = {} }) {
  return (
    <div style={{ marginBottom: 8, ...style }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1D3A" }}>{children}</div>
      <div style={{ width: 24, height: 2.5, background: "#00A8A8", borderRadius: 2, marginTop: 3 }} />
    </div>
  );
}

function P({ children }) {
  return <div style={{ fontSize: 11, color: "#4A5568", lineHeight: 1.65, marginBottom: 8 }}>{children}</div>;
}

/* ─────────────────────────────────────────
   INPUT FORM
   ───────────────────────────────────────── */
function InputForm({ deal, setDeal, activeSection, setActiveSection }) {
  const handleChange = (key, value, type) => {
    setDeal((prev) => ({
      ...prev,
      [key]: type === "number" ? (value === "" ? "" : parseFloat(value)) : type === "toggle" ? !prev[key] : value,
    }));
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Section Tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "12px 16px", borderBottom: "1px solid #E2E8F0", background: "#FAFBFC" }}>
        {FIELDS_CONFIG.map((sec, i) => (
          <button
            key={sec.section}
            onClick={() => setActiveSection(i)}
            style={{
              padding: "6px 12px",
              fontSize: 11,
              fontWeight: activeSection === i ? 700 : 500,
              background: activeSection === i ? "#0B1D3A" : "transparent",
              color: activeSection === i ? "#fff" : "#4A5568",
              border: activeSection === i ? "none" : "1px solid #E2E8F0",
              borderRadius: 6,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {sec.icon} {sec.section}
          </button>
        ))}
      </div>

      {/* Fields */}
      <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px" }}>
          {FIELDS_CONFIG[activeSection].fields.map((f) => (
            <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: "#4A5568", letterSpacing: 0.3 }}>{f.label}</label>
              {f.type === "select" ? (
                <select
                  value={deal[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value, "text")}
                  style={{
                    padding: "8px 10px", fontSize: 12, border: "1px solid #D1D5DB", borderRadius: 6,
                    background: "#fff", color: "#1a1a2e", outline: "none",
                  }}
                >
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.type === "toggle" ? (
                <button
                  onClick={() => handleChange(f.key, null, "toggle")}
                  style={{
                    padding: "8px 10px", fontSize: 12, border: "1px solid #D1D5DB", borderRadius: 6,
                    background: deal[f.key] ? "#E8F8F0" : "#FEF0EF", color: deal[f.key] ? "#1A7A42" : "#A63D2F",
                    cursor: "pointer", fontWeight: 600, textAlign: "left",
                  }}
                >
                  {deal[f.key] ? "✓ Yes" : "✗ No"}
                </button>
              ) : (
                <input
                  type={f.type}
                  value={deal[f.key]}
                  step={f.step || (f.type === "number" ? 1 : undefined)}
                  onChange={(e) => handleChange(f.key, e.target.value, f.type)}
                  style={{
                    padding: "8px 10px", fontSize: 12, border: "1px solid #D1D5DB", borderRadius: 6,
                    background: "#fff", color: "#1a1a2e", outline: "none",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN APP
   ───────────────────────────────────────── */
export default function PPABriefGenerator() {
  const [deal, setDeal] = useState(DEFAULT_DEAL);
  const [view, setView] = useState("board");
  const [showInputs, setShowInputs] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#F0F2F5" }}>
      {/* Top Bar */}
      <div style={{
        background: "linear-gradient(135deg, #0B1D3A 0%, #14304D 100%)",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
            <span style={{ color: "#00C9C9" }}>ETC</span> PPA Brief Generator
          </div>
          <div style={{ fontSize: 11, color: "#5A7A9A", background: "rgba(255,255,255,0.08)", padding: "3px 10px", borderRadius: 4 }}>
            Dynamic Template
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Audience Toggle */}
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: 3, display: "flex", gap: 2 }}>
            {[
              ["board", "👔 Board Brief"],
              ["risk", "🛡️ Risk Team"],
            ].map(([v, label]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: "7px 16px",
                  fontSize: 12,
                  fontWeight: 600,
                  background: view === v ? "#00A8A8" : "transparent",
                  color: view === v ? "#fff" : "#8EAEC8",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Toggle inputs */}
          <button
            onClick={() => setShowInputs(!showInputs)}
            style={{
              padding: "7px 16px",
              fontSize: 12,
              fontWeight: 600,
              background: showInputs ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {showInputs ? "⚙️ Hide Inputs" : "⚙️ Show Inputs"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>
        {/* Inputs Panel */}
        {showInputs && (
          <div style={{
            width: 420,
            flexShrink: 0,
            background: "#fff",
            borderRight: "1px solid #E2E8F0",
            display: "flex",
            flexDirection: "column",
            position: "sticky",
            top: 56,
            height: "calc(100vh - 56px)",
            overflow: "auto",
          }}>
            <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0B1D3A" }}>Deal Inputs</div>
              <div style={{ fontSize: 10, color: "#8A98A8", marginTop: 2 }}>Edit parameters to update the brief in real-time</div>
            </div>
            <InputForm deal={deal} setDeal={setDeal} activeSection={activeSection} setActiveSection={setActiveSection} />
          </div>
        )}

        {/* Preview */}
        <div style={{ flex: 1, padding: "24px", display: "flex", justifyContent: "center" }}>
          <div style={{
            width: "100%",
            maxWidth: 820,
            background: "#fff",
            borderRadius: 4,
            boxShadow: "0 1px 8px rgba(0,0,0,0.08), 0 4px 24px rgba(0,0,0,0.04)",
            marginBottom: 24,
          }}>
            {view === "board" ? <BoardView d={deal} /> : <RiskView d={deal} />}
          </div>
        </div>
      </div>
    </div>
  );
}
