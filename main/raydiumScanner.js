const solanaWeb3 = require('@solana/web3.js');

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
    const liquidityPoolProgramId = new solanaWeb3.PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');


  
    // Function to scan for new pools created on Raydium
    async function scanForNewPools() {
        const signatures = await connection.getSignaturesForAddress(liquidityPoolProgramId, { limit: 10 });
      
        for (const signatureInfo of signatures) {
          const transaction = await connection.getParsedTransaction(signatureInfo.signature, { maxSupportedTransactionVersion: 0 });
      
          if (transaction) {
            for (const instruction of transaction.transaction.message.instructions) {
                console.log(instruction.parsed)
            }
          }
        }
      }
      
  
    // Run the scan periodically
    setInterval(async () => {
      try {
        await scanForNewPools();
        console.log("Scan completed!");
      } catch (error) {
        console.error("Error scanning for tokens:", error);
      }
    }, 10000); // runs every 10 seconds
  }
  
  main().catch(console.error);

