const solanaWeb3 = require('@solana/web3.js')

async function main() {
    // Connect to the Solana mainnet
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0
    });
    

    // SPL Token program ID
    const splTokenProgramId = new solanaWeb3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

    // Function to scan for new tokens
    async function scanForNewTokens() {
        // Fetch the recent transaction signatures involving the SPL Token program
        const signatures = await connection.getSignaturesForAddress(splTokenProgramId, { limit: 10 });

        for (const signatureInfo of signatures) {
            // Fetch the detailed transaction
            const transaction = await connection.getParsedTransaction(signatureInfo.signature);

            // Check each transaction instruction
            transaction.transaction.message.instructions.forEach(instruction => {
                if (instruction.programId.equals(splTokenProgramId)) {
                    // Further logic to verify if this instruction is a token creation
                    // This may involve checking specific instruction data
                    console.log('Possible token creation detected:', instruction);
                }
            });
        }
    }

    // Run the scan periodically
    setInterval(async () => {
        try {
            await scanForNewTokens();
        } catch (error) {
            console.error('Error scanning for tokens:', error);
        }
    }, 10000); // Runs every 60 seconds, adjust as needed
}
main().catch(console.error);

