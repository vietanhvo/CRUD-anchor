import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { CrudAnchor } from "../target/types/crud_anchor";
import { assert } from "chai";

const { SystemProgram } = anchor.web3;

describe("CRUD-anchor", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.CrudAnchor as Program<CrudAnchor>;
  let _baseAccount;

  it("Creates a counter", async () => {
    /* Call the create function via RPC */
    const baseAccount = anchor.web3.Keypair.generate();
    await program.methods
      .create()
      .accounts({
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([baseAccount])
      .rpc();

    /* Fetch the account and check the value of count */
    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log("Count 0: ", account.count.toString());
    assert.ok(account.count.toString() == "0");
    _baseAccount = baseAccount;
  });

  it("Increments the counter", async () => {
    const baseAccount = _baseAccount;

    await program.methods
      .increment()
      .accounts({
        baseAccount: baseAccount.publicKey,
      })
      .rpc();

    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log("Count 1: ", account.count.toString());
    assert.ok(account.count.toString() == "1");
  });
});
