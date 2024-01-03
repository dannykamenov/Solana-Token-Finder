const solanaWeb3 = require("@solana/web3.js");

async function main() {
  // Connect to the Solana mainnet
  const connection = new solanaWeb3.Connection(
    "https://solana-mainnet.core.chainstack.com/0683a9bd3e0f806fd79f87bbc1a595fb",
    {
      wsEndpoint:
        "wss://solana-mainnet.core.chainstack.com/ws/0683a9bd3e0f806fd79f87bbc1a595fb",
    }
  );

  // SPL Token program ID
  const splTokenProgramId = new solanaWeb3.PublicKey(
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
  );

  // Function to scan for new tokens
  async function scanForNewTokens() {
    // Fetch the recent transaction signatures involving the SPL Token program
    const signatures = await connection.getSignaturesForAddress(
      splTokenProgramId,
      { limit: 10 }
    );

    for (const signatureInfo of signatures) {
      // Fetch the detailed transaction
      const transaction = await connection.getParsedTransaction(
        signatureInfo.signature,
        { maxSupportedTransactionVersion: 0 }
      );
      if (transaction && transaction.transaction) {
        // Existing logic for processing the transaction
        transaction.transaction.message.instructions.forEach((instruction) => {
            if (instruction.programId.equals(splTokenProgramId)) {
              // Further logic to verify if this instruction is a token creation
              // This may involve checking specific instruction data
              if (instruction.parsed.type == "initializeAccount") {
                console.log(
                  "Possible token creation detected:",
                  instruction.parsed.info
                );
              }
            }
          });
      } else {
        console.log(
          `No transaction found for signature: ${signatureInfo.signature}`
        );
      }

    }
  }

  // Run the scan periodically
  setInterval(async () => {
    try {
      await scanForNewTokens();
      console.log("Scan completed!");
    } catch (error) {
      console.error("Error scanning for tokens:", error);
    }
  }, 10000); 
}

main().catch(console.error);
