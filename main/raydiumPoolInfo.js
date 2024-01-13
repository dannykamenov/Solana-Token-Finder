"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePoolInfo = void 0;
var solanaWeb3 = require('@solana/web3.js');
var web3_js_1 = require("@solana/web3.js");
var spl_token_1 = require("@solana/spl-token");
var raydium_sdk_1 = require("@raydium-io/raydium-sdk");
var serum_1 = require("@project-serum/serum");
var bn_js_1 = require("bn.js");
function getTokenAccounts(connection, owner) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenResp, accounts, _i, _a, _b, pubkey, account;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, connection.getTokenAccountsByOwner(owner, {
                        programId: spl_token_1.TOKEN_PROGRAM_ID,
                    })];
                case 1:
                    tokenResp = _c.sent();
                    accounts = [];
                    for (_i = 0, _a = tokenResp.value; _i < _a.length; _i++) {
                        _b = _a[_i], pubkey = _b.pubkey, account = _b.account;
                        accounts.push({
                            pubkey: pubkey,
                            accountInfo: raydium_sdk_1.SPL_ACCOUNT_LAYOUT.decode(account.data),
                            programId: spl_token_1.TOKEN_PROGRAM_ID,
                        });
                    }
                    return [2 /*return*/, accounts];
            }
        });
    });
}
// raydium pool id can get from api: https://api.raydium.io/v2/sdk/liquidity/mainnet.json
var SOL_USDC_POOL_ID = "EP2ib6dYdEeqD8MfE2ezHCxX3kP3K2eLKkirfPm5eyMx";
var OPENBOOK_PROGRAM_ID = new web3_js_1.PublicKey("srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX");
function parsePoolInfo() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var connection, owner, tokenAccounts, info, poolState, openOrders, baseDecimal, quoteDecimal, baseTokenAmount, quoteTokenAmount, basePnl, quotePnl, openOrdersBaseTokenTotal, openOrdersQuoteTokenTotal, base, quote, denominator, addedLpAccount;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    connection = new web3_js_1.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), "confirmed");
                    owner = new web3_js_1.PublicKey("VnxDzsZ7chE88e9rB6UKztCt2HUwrkgCTx8WieWf5mM");
                    return [4 /*yield*/, getTokenAccounts(connection, owner)];
                case 1:
                    tokenAccounts = _c.sent();
                    return [4 /*yield*/, connection.getAccountInfo(new web3_js_1.PublicKey(SOL_USDC_POOL_ID))];
                case 2:
                    info = _c.sent();
                    if (!info)
                        return [2 /*return*/];
                    poolState = raydium_sdk_1.LIQUIDITY_STATE_LAYOUT_V4.decode(info.data);
                    return [4 /*yield*/, serum_1.OpenOrders.load(connection, poolState.openOrders, OPENBOOK_PROGRAM_ID // OPENBOOK_PROGRAM_ID(marketProgramId) of each pool can get from api: https://api.raydium.io/v2/sdk/liquidity/mainnet.json
                        )];
                case 3:
                    openOrders = _c.sent();
                    baseDecimal = Math.pow(10, poolState.baseDecimal.toNumber());
                    quoteDecimal = Math.pow(10, poolState.quoteDecimal.toNumber());
                    return [4 /*yield*/, connection.getTokenAccountBalance(poolState.baseVault)];
                case 4:
                    baseTokenAmount = _c.sent();
                    return [4 /*yield*/, connection.getTokenAccountBalance(poolState.quoteVault)];
                case 5:
                    quoteTokenAmount = _c.sent();
                    basePnl = poolState.baseNeedTakePnl.toNumber() / baseDecimal;
                    quotePnl = poolState.quoteNeedTakePnl.toNumber() / quoteDecimal;
                    openOrdersBaseTokenTotal = openOrders.baseTokenTotal.toNumber() / baseDecimal;
                    openOrdersQuoteTokenTotal = openOrders.quoteTokenTotal.toNumber() / quoteDecimal;
                    base = (((_a = baseTokenAmount.value) === null || _a === void 0 ? void 0 : _a.uiAmount) || 0) + openOrdersBaseTokenTotal - basePnl;
                    quote = (((_b = quoteTokenAmount.value) === null || _b === void 0 ? void 0 : _b.uiAmount) || 0) +
                        openOrdersQuoteTokenTotal -
                        quotePnl;
                    denominator = new bn_js_1.BN(10).pow(poolState.baseDecimal);
                    addedLpAccount = tokenAccounts.find(function (a) {
                        return a.accountInfo.mint.equals(poolState.lpMint);
                    });
                    console.log("SOL_USDC pool info:", '\n' , "pool total base " + base, '\n' , "pool total quote " + quote, '\n' , "base vault balance " + baseTokenAmount.value.uiAmount, '\n' , "quote vault balance " + quoteTokenAmount.value.uiAmount, '\n' , "base tokens in openorders " + openOrdersBaseTokenTotal, '\n' , "quote tokens in openorders  " + openOrdersQuoteTokenTotal, '\n' , "base token decimals " + poolState.baseDecimal.toNumber(), '\n' , "quote token decimals " + poolState.quoteDecimal.toNumber(), '\n' , "total lp " + poolState.lpReserve.div(denominator).toString(), '\n' , "addedLpAmount " +
                        ((addedLpAccount === null || addedLpAccount === void 0 ? void 0 : addedLpAccount.accountInfo.amount.toNumber()) || 0) / baseDecimal);
                    return [2 /*return*/];
            }
        });
    });
}
exports.parsePoolInfo = parsePoolInfo;
parsePoolInfo();
