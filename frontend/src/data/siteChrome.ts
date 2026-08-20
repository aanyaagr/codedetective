export const FINAL_CTA = {
  stamp: "TOP SECRET // ACTIVE FILE",
  headline: "ONE CASE IS STILL OPEN.",
  subheadline: "YOUR FIRST INVESTIGATION AWAITS.",
  supporting: "Open the file. Follow the evidence. Solve the mystery with real code.",
  buttonText: "OPEN CASE →",
  caseReference: "DOSSIER #001 // THE MISSING ALGORITHM",
};

export const FOOTER_DATA = {
  brand: "CODEDETECTIVE",
  subBrand: "ACADEMY",
  precinct: "PRECINCT #404",
  tagline: "Learn to code. Follow the evidence. Solve the mystery.",
  columns: [
    {
      title: "BUREAU",
      links: [
        { label: "Open Case File", href: "/case-board" },
        { label: "Detective Ledger", href: "/leaderboard" },
      ],
    },
    {
      title: "INVESTIGATION",
      links: [
        { label: "Evidence Trail", href: "/evidence" },
        { label: "Case Board", href: "/case-board" },
      ],
    },
    {
      title: "ACADEMY",
      links: [
        { label: "How It Works", href: "/#get-started" },
        { label: "Home", href: "/" },
      ],
    },
  ],
  socials: [
    { name: "Discord Wire", href: "https://discord.com" },
    { name: "Twitter/X Dispatch", href: "https://twitter.com" },
    { name: "GitHub Evidence", href: "https://github.com" },
  ],
  legal: [
    { label: "Privacy Protocol", href: "#" },
    { label: "Terms of Investigation", href: "#" },
  ],
} as const;
