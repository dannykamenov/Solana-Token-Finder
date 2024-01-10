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
    const info = await main('EP2ib6dYdEeqD8MfE2ezHCxX3kP3K2eLKkirfPm5eyMx');
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
