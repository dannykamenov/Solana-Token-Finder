async function main(tokenId) {
    try {
        const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana/' + tokenId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function displayInfo() {
    const info = await main('4ELBQuq3ivhLamfCT36As5sXLkQDWRJw1pJ9JVFLp6gK');
    const pairs = info.pairs;
    for (const pair of pairs) {
        console.log(pair);
        const baseToken = pair.baseToken;
        console.log(baseToken);
        const liquidity = pair.liquidity.usd;
        console.log(liquidity);
    }
}

displayInfo();
