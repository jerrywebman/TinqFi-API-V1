var functions = {
    getAvailableTokens: function (req, res) {
        try {
            const availableTokenList = [];
            const tokens = [
                {
                    name: "Bitcoin",
                    symbol: "BTC",
                    image: "https://cryptologos.cc/logos/thumbs/bitcoin.png?v=025"
                },
                {
                    name: "Ethereum",
                    symbol: "ETH",
                    image: "https://cryptologos.cc/logos/thumbs/ethereum.png?v=025"
                },
                {
                    name: "Dogecoin",
                    symbol: "DOGE",
                    image: "https://cryptologos.cc/logos/thumbs/dogecoin.png?v=025"
                },
                {
                    name: "Binance Smart Chain",
                    symbol: "BSC",
                    image: "https://cryptologos.cc/logos/thumbs/bnb.png?v=025"
                },
                // {
                //     name: "Ripple",
                //     symbol: "XRP",
                //     image: "https://cryptologos.cc/logos/thumbs/xrp.png?v=025"
                // },
                // {
                //     name: "Tether USDt",
                //     symbol: "USDT",
                //     image: "https://cryptologos.cc/logos/thumbs/tether.png?v=025"
                // },
                // {
                //     name: "Solana",
                //     symbol: "SOL",
                //     image: "https://cryptologos.cc/logos/thumbs/solana.png?v=025"
                // },
                {
                    name: "TRON",
                    symbol: "TRON",
                    image: "https://cryptologos.cc/logos/thumbs/tron.png?v=025"
                },
                {
                    name: "Polygon",
                    symbol: "MATIC",
                    image: "https://cryptologos.cc/logos/thumbs/polygon.png?v=025"
                },
                // {
                //     name: "Polkadot",
                //     symbol: "DOT",
                //     image: "https://cryptologos.cc/logos/thumbs/polkadot-new.png?v=025"
                // },
                {
                    name: "Litecoin",
                    symbol: "LTC",
                    image: "https://cryptologos.cc/logos/thumbs/litecoin.png?v=025"
                },
            ]
            //get the customer token accounts
            //check if he has that token account and add is available
            // const customerTokenAccounts = req.user.onRegistrationLedgerAccnts;
            // for (const token of tokens) {
            //     let tok = customerTokenAccounts.find((toks) => toks.tokenAccountcurrency === token.symbol);
            //     if (tok) {
            //         availableTokenList.push({
            //             name: token.name,
            //             symbol: token.symbol,
            //             image: token.image,
            //             isAvailable: true,
            //         })
            //     } else {
            //         availableTokenList.push({
            //             name: token.name,
            //             symbol: token.symbol,
            //             image: token.image,
            //             isAvailable: false,
            //         })
            //     }
            // }
            res.status(200).send({
                success: true,
                data: tokens,
            });
        } catch (e) {
            return res.status(503).send({
                success: false,
                error: e.message,
                message: "Server unavailable",
            });
        }
    },
};

module.exports = functions;