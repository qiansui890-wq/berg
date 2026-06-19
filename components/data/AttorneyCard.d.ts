export interface AttorneyCardProps {
  /** Full name, e.g. "Geoffrey Berg". */
  name?: string;
  /** Title / role, e.g. "Trial Lawyer, Managing Partner". */
  role?: string;
  /** Short bio paragraph. */
  bio?: string;
  /** Headshot URL; falls back to branded serif initials on navy. */
  photo?: string;
  /** Optional credential / focus tags, e.g. ["Crypto Recovery", "Trials"]. */
  credentials?: string[];
  /** Optional link — renders the card as an anchor. */
  href?: string;
  /** "portrait" (photo on top) or "row" (circular photo beside text). */
  orientation?: "portrait" | "row";
}
/** Attorney / team-member profile card with headshot, role, bio, and credential tags. */
export function AttorneyCard(props: AttorneyCardProps): JSX.Element;
