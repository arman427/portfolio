export type ProjectFeature = {
  title: string;
  description: string;
};

export type ProjectResult = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export type Project = {
  slug: string;
  title: string;
  /** One-liner shown on cards. */
  tagline: string;
  /** Intro paragraph on the case page. */
  description: string;
  category: string;
  kind: string;
  year: number;
  role: string;
  stack: string[];
  links: {
    live?: string;
    source?: string;
  };
  /** Address shown in the browser window, e.g. `cloth-shop-lac.vercel.app`. */
  domain: string;
  /** The project's own brand color — its "favicon" in the hero tabs. */
  color: string;

  overview: string;
  challenge: string;
  solution: string;
  features: ProjectFeature[];
  results: ProjectResult[];
  learnings: string;

  /** First screen of the site (desktop, 16:10) from /public. Without it the window shows an empty screen. */
  cover?: string;
  /** Desktop screenshots (16:10) for the case page gallery. */
  gallery?: string[];
  /** Mobile screenshot (390×844). */
  mobile?: string;
};

/** Fields of a project that are written per language. */
export type ProjectText = Pick<
  Project,
  | 'tagline'
  | 'description'
  | 'category'
  | 'kind'
  | 'role'
  | 'overview'
  | 'challenge'
  | 'solution'
  | 'features'
  | 'results'
  | 'learnings'
>;
