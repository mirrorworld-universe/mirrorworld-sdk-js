export interface ISolanaTransactionsPayload {
  transactions: ISolanaTransaction[];
  count: number;
  nextBefore?: null;
}
export interface ISolanaTransaction {
  blockTime: number;
  meta: Meta;
  slot: number;
  transaction: Transaction;
}

export interface Meta {
  err?: Err | null;
  fee: number;
  innerInstructions?: (InnerInstructionsEntity | null)[] | null;
  loadedAddresses: LoadedAddresses;
  logMessages?: string[] | null;
  postBalances?: number[] | null;
  postTokenBalances?: (PostTokenBalancesEntity | null)[] | null;
  preBalances?: number[] | null;
  preTokenBalances?:
    | (PreTokenBalancesEntityOrPostTokenBalancesEntity | null)[]
    | null;
  rewards?: null[] | null;
  status: Status;
}
export interface Err {
  InstructionError?: (number | string)[] | null;
}
export interface InnerInstructionsEntity {
  index: number;
  instructions?: InstructionsEntity[] | null;
}
export interface InstructionsEntity {
  parsed?: Parsed | null;
  program?: string | null;
  programId: string;
  accounts?: string[] | null;
  data?: string | null;
}
export interface Parsed {
  info: Info;
  type: string;
}

export interface Info {
  destination?: string | null;
  lamports?: number | null;
  source?: string | null;
  account?: string | null;
  mint?: string | null;
  rentSysvar?: string | null;
  systemProgram?: string | null;
  tokenProgram?: string | null;
  wallet?: string | null;
  newAccount?: string | null;
  owner?: string | null;
  space?: number | null;
  amount?: string | null;
  mintAuthority?: string | null;
  authorityType?: string | null;
  multisigAuthority?: string | null;
  newAuthority?: string | null;
  signers?: string[] | null;
  decimals?: number | null;
  authority?: string | null;
  delegate?: string | null;
}
export interface LoadedAddresses {
  readonly?: null[] | null;
  writable?: null[] | null;
}
export interface PostTokenBalancesEntity {
  accountIndex: number;
  mint: string;
  owner: string;
  programId: string;
  uiTokenAmount: UiTokenAmount;
}
export interface UiTokenAmount {
  amount: string;
  decimals: number;
  uiAmount?: number | null;
  uiAmountString: string;
}

export interface PreTokenBalancesEntityOrPostTokenBalancesEntity {
  accountIndex: number;
  mint: string;
  owner: string;
  programId: string;
  uiTokenAmount: UiTokenAmountOrTokenAmount;
}

export interface UiTokenAmountOrTokenAmount {
  amount: string;
  decimals: number;
  uiAmount: number;
  uiAmountString: string;
}

export interface Status {
  Ok?: null;
  Err?: {
    InstructionError?: (number | string)[] | null;
  } | null;
}

export interface Transaction {
  message: Message;
  signatures?: string[] | null;
}
export interface Message {
  accountKeys?: AccountKeysEntity[] | null;
  addressTableLookups?: null;
  instructions?: ParsedInstructionEntity[] | null;
  recentBlockhash: string;
}
export interface AccountKeysEntity {
  pubkey: string;
  signer: boolean;
  writable: boolean;
}
export interface ParsedInstructionEntity {
  accounts?: string[] | null;
  data?: string | null;
  programId: string;
  parsed?: ParsedInstruction | null;
  program?: string | null;
}
export interface ParsedInstruction {
  info: {
    account?: string | null;
    mint?: string | null;
    rentSysvar?: string | null;
    source: string;
    systemProgram?: string | null;
    tokenProgram?: string | null;
    wallet?: string | null;
    amount?: string | null;
    authority?: string | null;
    destination?: string | null;
    lamports?: number | null;
    tokenAmount?: {
      amount: string;
      decimals: number;
      uiAmount: number;
      uiAmountString: string;
    };
  };
  type: string;
}

export interface ITransferSPLTokenResponse {
  status: string;
  txSignature: string;
}
