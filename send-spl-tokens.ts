import "dotenv/config";
import {
    getExplorerLink,
    getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import{
    getOrCreateAssociatedTokenAccount,
    TOKEN_2022_PROGRAM_ID,
    transfer,
} from "@solana/spl-token";
const connection = new Connection(clusterApiUrl("devnet"));

const sender = getKeypairFromEnvironment("SECRET_KEY");

console.log(
    `🔑 Loaded our keypair securely, using an env file! Our public key is: 
    ${sender.publicKey.toBase58()}`
);

const recipient = new PublicKey("AvtLubkx7SfqDxgM5s5unFMa453dSy33kYUECLxxhy6g");

const tokenMintAccount = new PublicKey("68a6zp1q4ArP5EjaEadhwHNUFTjMTJ9dri5juEw3Kadc");

const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10,2);

console.log(`💸 Attempting to send 1 token to ${recipient.toBase58()}...`);

const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    tokenMintAccount,
    sender.publicKey,
    false,
    "confirmed",
    {},
    TOKEN_2022_PROGRAM_ID
);

const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    tokenMintAccount,
    recipient,
    false,
    "confirmed",
    {},
    TOKEN_2022_PROGRAM_ID
);

const signature = await transfer(
    connection,
    sender,
    sourceTokenAccount.address,
    destinationTokenAccount.address,
    sender,
    1 * MINOR_UNITS_PER_MAJOR_UNITS,
    [],
    {},
    TOKEN_2022_PROGRAM_ID
);

const exploreLink = getExplorerLink("transaction", signature, "devnet");

console.log(` ✅ Transaction confirmed, explorer link is: ${exploreLink}!`); 