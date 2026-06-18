/** Mono, middle-truncated wallet/tx string with copy — the firm's signature data element.
 * @startingPoint section="Data" subtitle="Wallet address chip with copy" viewport="700x120" */
export interface AddressChipProps {
  /** Full wallet address or transaction hash. */
  address: string;
  /** Trace role — colors the leading dot. */
  role?: "tainted" | "hop" | "exchange" | "mixer" | "frozen";
  /** Leading chars to keep before the ellipsis. */
  lead?: number;
  /** Trailing chars to keep. */
  tail?: number;
  copyable?: boolean;
}
/** Mono, middle-truncated wallet/tx string with copy — the firm's signature data element. */
export function AddressChip(props: AddressChipProps): JSX.Element;
