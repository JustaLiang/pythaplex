const assert = require("assert");
const anchor = require("@project-serum/anchor");
const { test } = require("mocha");
const { expect } = require("chai");
const { SystemProgram, PublicKey } = anchor.web3;

describe('pythaplex', () => {

  const oracleSolUsd = {
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
        remainingAccounts: [oracleSolUsd],
        signers: [tradingAccount],
      }
    );
    console.log("Your transaction signature", tx);

  });
  it('Open long position', async () => {
    const tradingAccount = anchor.web3.Keypair.generate();
    await program.rpc.create(
      provider.wallet.publicKey,
      {
        accounts: {
          tradingAccount: tradingAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        remainingAccounts: [oracleSolUsd],
        signers: [tradingAccount],
      }
    );
    const openTx = await program.rpc.open(
      true,
      {
        accounts: {
          tradingAccount: tradingAccount.publicKey,
          authority: provider.wallet.publicKey,
        },
        remainingAccounts: [oracleSolUsd],
      }
    );
    console.log("Your open transaction signature", openTx);
  });
  it('Open long position but not the same oracle', async () => {
    const tradingAccount = anchor.web3.Keypair.generate();
    const oracleAdaUsd = {
      isSigner: false,
      isWritable: false,
      pubkey: new PublicKey("3pyn4svBbxJ9Wnn3RVeafyLWfzie6yC5eTig2S62v9SC"),
    }
    await program.rpc.create(
      provider.wallet.publicKey,
      {
        accounts: {
          tradingAccount: tradingAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        remainingAccounts: [oracleSolUsd],
        signers: [tradingAccount],
      }
    );
    await program.rpc.open(
      true,
      {
        accounts: {
          tradingAccount: tradingAccount.publicKey,
          authority: provider.wallet.publicKey,
        },
        remainingAccounts: [oracleAdaUsd],
      }
    );

    console.log("Your open transaction signature", openTx);
  });
  it('Open and close a position', async () => {
    const tradingAccount = anchor.web3.Keypair.generate();
    const oracleAdaUsd = {
      isSigner: false,
      isWritable: false,
      pubkey: new PublicKey("3pyn4svBbxJ9Wnn3RVeafyLWfzie6yC5eTig2S62v9SC"),
    }
    await program.rpc.create(
      provider.wallet.publicKey,
      {
        accounts: {
          tradingAccount: tradingAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        remainingAccounts: [oracleSolUsd],
        signers: [tradingAccount],
      }
    );
    await program.rpc.open(
      true,
      {
        accounts: {
          tradingAccount: tradingAccount.publicKey,
          authority: provider.wallet.publicKey,
        },
        remainingAccounts: [oracleSolUsd],
      }
    );
    
    const tx = await program.rpc.close(
      {
        accounts: {
          tradingAccount: tradingAccount.publicKey,
          authority: provider.wallet.publicKey,
        },
        remainingAccounts: [oracleSolUsd],
      }
    );
    
    console.log("successfully closed position", tx);
  });
  it('Close a not open position', async () => {
    const tradingAccount = anchor.web3.Keypair.generate();
    const oracleAdaUsd = {
      isSigner: false,
      isWritable: false,
      pubkey: new PublicKey("3pyn4svBbxJ9Wnn3RVeafyLWfzie6yC5eTig2S62v9SC"),
    }
    await program.rpc.create(
      provider.wallet.publicKey,
      {
        accounts: {
          tradingAccount: tradingAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        remainingAccounts: [oracleSolUsd],
        signers: [tradingAccount],
      }
    );
    
    const tx = await program.rpc.close(
      {
        accounts: {
          tradingAccount: tradingAccount.publicKey,
          authority: provider.wallet.publicKey,
        },
        remainingAccounts: [oracleSolUsd],
      }
    );
    
    console.log("successfully closed position", tx);
  });
});

