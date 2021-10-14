const assert = require("assert");
const anchor = require("@project-serum/anchor");
const { test } = require("mocha");
const { SystemProgram, PublicKey } = anchor.web3;

describe('pythaplex', () => {
  
  const pythOracle = {
    isSigner: false,
    isWritable: false,
    pubkey: new PublicKey("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG"),
  };

  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Pythaplex;

  it('Create a trading account', async () => {
    const tradingAccount = anchor.web3.Keypair.generate();
    const tx = await program.rpc.create(
      provider.wallet.publicKey,
      {
        accounts: {
          tradingAccount: tradingAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        remainingAccounts: [pythOracle],
        signers: [tradingAccount],
      }
    );
    console.log("Your transaction signature", tx);
  });
});
