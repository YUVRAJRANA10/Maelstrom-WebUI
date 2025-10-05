import { wagmi_config } from "@/config";
import { ABI, IContractClient } from "@/types/contract";
import { InitPool, InitPoolResult, Pool, Reserve, RowPool } from "@/types/pool";
import { LiquidityPoolToken, Token } from "@/types/token";
import { BuyRequest, BuyResult, BuyTrade, Deposit, DepositRequest, DepositResult, SellRequest, SellResult, SellTrade, SwapRequest, SwapResult, SwapTrade, Withdraw, WithdrawRequest, WithdrawResult } from "@/types/trades";
import { Address, erc20Abi, parseAbiItem } from "viem";
import { Config, UsePublicClientReturnType, useReadContract, useReadContracts } from "wagmi";
import { WriteContractMutateAsync } from "wagmi/query";

export class ContractClient implements IContractClient {
    contractAddress: Address;
    writeContract: WriteContractMutateAsync<Config, unknown>
    publicClient: UsePublicClientReturnType;

    constructor(contractAddress: Address, writeContract: WriteContractMutateAsync<Config, unknown>, publicClient: UsePublicClientReturnType) {
        this.contractAddress = contractAddress;
        this.writeContract = writeContract;
        this.publicClient = publicClient;
    }

    private async approveToken(token: string, amount: bigint): Promise<void> {
        try {
            await this.writeContract({
                address: token as Address,
                abi: erc20Abi,
                functionName: 'approve',
                args: [this.contractAddress, amount]
            })
        } catch (error) {
            throw new Error(`Token approval failed: ${(error as Error).message}`);
        }
    }

    private async balanceOf(token: Address, owner: Address): Promise<string> {
        const { data, error } = await useReadContract({
            address: token,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [owner]
        });
        if (error) throw new Error(`Error fetching balance: ${error.message}`);
        return data!.toString();
    }

    async initializePool(initPool: InitPool): Promise<InitPoolResult> {
        try {
            const result: InitPoolResult = {
                success: true,
                txHash: '',
                timestamp: Date.now(),
                error: ''
            }
            await this.approveToken(initPool.token, BigInt(initPool.tokenAmount));
            const txHash = await this.writeContract({
                address: this.contractAddress,
                abi: ABI,
                functionName: 'initializePool',
                args: [initPool.token as Address, BigInt(initPool.tokenAmount), BigInt(initPool.inititalBuyPrice), BigInt(initPool.initialSellPrice)],
                value: BigInt(initPool.ethAmount)
            });
            result.txHash = txHash;
            return result;
        } catch (error) {
            throw new Error(`Pool initialization failed: ${(error as Error).message}`);
        }
    }

    async deposit(depositReq: DepositRequest): Promise<DepositResult> {
        try {
            const result: DepositResult = {
                success: true,
                depositRequest: depositReq,
                txHash: '',
                timestamp: Date.now(),
                error: ''
            }
            await this.approveToken(depositReq.token.address, BigInt(depositReq.tokenAmount));
            const txHash = await this.writeContract({
                address: this.contractAddress,
                abi: ABI,
                functionName: 'deposit',
                args: [depositReq.token.address as Address],
                value: BigInt(depositReq.ethAmount)
            });
            result.txHash = txHash;
            return result;
        } catch (error) {
            throw new Error(`Deposit failed: ${(error as Error).message}`);
        }
    }

    async withdraw(withdrawReq: WithdrawRequest): Promise<WithdrawResult> {
        try {
            const result: WithdrawResult = {
                success: true,
                txHash: '',
                timestamp: Date.now(),
                error: '',
                withdrawRequest: withdrawReq
            };
            await this.approveToken(withdrawReq.lpToken.address, BigInt(withdrawReq.lpTokenAmount));
            const txHash = await this.writeContract({
                address: this.contractAddress,
                abi: ABI,
                functionName: 'withdraw',
                args: [withdrawReq.token.address, BigInt(withdrawReq.lpTokenAmount)]
            });
            result.txHash = txHash;
            return result;
        } catch (error) {
            throw new Error(`Withdraw failed: ${(error as Error).message}`);
        }
    }

    async swap(swapReq: SwapRequest): Promise<SwapResult> {
        try {
            const result: SwapResult = {
                success: true,
                txHash: '',
                timestamp: Date.now(),
                error: '',
                swapRequest: swapReq
            };
            await this.approveToken(swapReq.tokenIn.address as Address, BigInt(swapReq.amountIn));
            const txHash = await this.writeContract({
                address: this.contractAddress,
                abi: ABI,
                functionName: 'swap',
                args: [swapReq.tokenIn.address, swapReq.tokenOut.address, BigInt(swapReq.amountIn), BigInt(swapReq.minimumTokenOut)]
            });
            result.txHash = txHash;
            return result;
        } catch (error) {
            throw new Error(`Swap failed: ${(error as Error).message}`);
        }
    }

    async buy(buyReq: BuyRequest): Promise<BuyResult> {
        try {
            const result: BuyResult = {
                success: true,
                txHash: '',
                buyRequest: buyReq,
                amountOut: '',
                timestamp: Date.now(),
            }
            const txHash = await this.writeContract({
                address: this.contractAddress,
                abi: ABI,
                functionName: 'buy',
                args: [buyReq.token.address],
                value: BigInt(buyReq.amountIn)
            });
            result.txHash = txHash;
            return result;
        } catch (error) {
            throw new Error(`Buy failed: ${(error as Error).message}`);
        }
    }

    async sell(sellReq: SellRequest): Promise<SellResult> {
        try {
            const result: SellResult = {
                success: true,
                txHash: '',
                sellRequest: sellReq,
                amountOut: '',
                timestamp: Date.now(),
            }
            await this.approveToken(sellReq.token.address, BigInt(sellReq.amountIn));
            const txHash = await this.writeContract({
                address: this.contractAddress,
                abi: ABI,
                functionName: 'sell',
                args: [sellReq.token.address, BigInt(sellReq.amountIn)]
            })
            result.txHash = txHash;
            return result;
        } catch (error) {
            throw new Error(`Sell failed: ${(error as Error).message}`);
        }
    }

    async getToken(token: Address): Promise<Token> {
        const { data, error } = await useReadContracts({
            contracts: [
                {
                    address: token as Address,
                    abi: erc20Abi,
                    functionName: 'decimals',
                    args: []
                },
                {
                    address: token as Address,
                    abi: erc20Abi,
                    functionName: 'symbol',
                    args: []
                },
                {
                    address: token as Address,
                    abi: erc20Abi,
                    functionName: 'name',
                    args: []
                }
            ],
            allowFailure: false,
        });

        if (error) throw new Error(`Error fetching LP token data: ${error.message}`);
        return {
            address: token,
            symbol: data![1],
            name: data![2],
            decimals: data![0],
        }
    }

    async getLPToken(token: Token, user: Address): Promise<LiquidityPoolToken> {
        const { data, error } = await useReadContracts({
            contracts: [
                {
                    address: token.address as Address,
                    abi: erc20Abi,
                    functionName: 'totalSupply',
                    args: []
                },
                {
                    address: token.address as Address,
                    abi: erc20Abi,
                    functionName: 'balanceOf',
                    args: [user]
                },
            ],
            allowFailure: false,
        });

        if (error) throw new Error(`Error fetching LP token data: ${error.message}`);
        return {
            address: token.address,
            symbol: token.symbol,
            name: token.name,
            decimals: token.decimals,
            totalSupply: data![0].toString(),
            balance: data![1].toString()
        }
    }

    async getReserves(token: Token): Promise<Reserve> {
        const { data, error } = await useReadContract({
            address: this.contractAddress,
            abi: ABI,
            functionName: 'reserves',
            args: [token.address]
        })

        if (error) throw new Error(`Error fetching reserves: ${error.message}`);
        return {
            tokenReserve: data![0].toString(),
            ethReserve: data![1].toString()
        }
    }

    async getBuyPrice(token: Token): Promise<string> {
        const { data, error } = await useReadContract({
            address: this.contractAddress,
            abi: ABI,
            functionName: 'priceBuy',
            args: [token.address],
        });
        if (error) throw new Error(`Error fetching buy price: ${error.message}`);
        return data!.toString();
    }

    async getSellPrice(token: Token): Promise<string> {
        const { data, error } = await useReadContract({
            address: this.contractAddress,
            abi: ABI,
            functionName: 'priceSell',
            args: [token.address],
        });
        if (error) throw new Error(`Error fetching sell price: ${error.message}`);
        return data!.toString();
    }

    async getUserBalance(token: Token, user: Address): Promise<Reserve> {
        const { data, error } = await useReadContract({
            address: this.contractAddress,
            abi: ABI,
            functionName: 'poolUserBalances',
            args: [token.address, user]
        })
        if (error) throw new Error(`Error fetching user reserves: ${error.message}`);
        return {
            tokenReserve: data![0].toString(),
            ethReserve: data![1].toString()
        }
    }

    async getTokenRatio(token: Token): Promise<string> { //1 token = ? ETH
        const { data, error } = await useReadContract({
            address: this.contractAddress,
            abi: ABI,
            functionName: 'tokenPerETHRatio',
            args: [token.address]
        });
        if (error) throw new Error(`Error fetching token ratio: ${error.message}`);
        return data!.toString();
    }

    private getTotalLiquidity(avgPrice: string, tokenReserve: string): string {
        return (BigInt(avgPrice) * BigInt(tokenReserve)).toString();
    }

    private getAvgPrice(buyPrice: string, sellPrice: string): string {
        return ((BigInt(buyPrice) + BigInt(sellPrice)) / BigInt(2)).toString();
    }

    private getAPR(volume24h: string, totalLiquidity: string): string {
        return ((BigInt(volume24h) * BigInt(0.03) * BigInt(365)) / BigInt(totalLiquidity)).toString();//Custom 3% trade fee
    }

    private async getBlockTimestamp(blockNumber: bigint): Promise<number> {
        try {
            const block = await this.publicClient?.getBlock({ blockNumber: blockNumber });
            return Number(block!.timestamp) * 1000; //maybe multiply by 1000?
        } catch (error) {
            throw new Error(`Error fetching block timestamp: ${(error as Error).message}`);
        }
    }

    async getBuyTradeEventLogs(fromBlock: number, toBlock: number, token?: Token, user?: Address): Promise<BuyTrade[]> {
        try {
            const logs = await this.publicClient?.getLogs({
                address: this.contractAddress,
                fromBlock: BigInt(fromBlock),
                toBlock: BigInt(toBlock),
                event: parseAbiItem('event BuyTrade(address indexed token, address indexed trader, uint256 ethAmount, uint256 tokenAmount, uint256 buyPrice)'),
                args: {
                    token: (token?.address as Address),
                    trader: user as Address | undefined
                },
                strict: true
            });
            let result: BuyTrade[] = [];
            const timestamps = await Promise.all(
                (logs || []).map(async (log) => await this.getBlockTimestamp(log.blockNumber))
            );
            if (!token) {
                const tokens = await Promise.all(
                    (logs || []).map(async (log) => await this.getToken(log.args.token as Address))
                )
                result = (logs || []).map((log, index) => ({
                    token: tokens[index],
                    buyPrice: log.args.buyPrice.toString(),
                    ethAmount: log.args.ethAmount.toString(),
                    timestamp: timestamps[index],
                }));
                return result;
            }
            result = (logs || []).map((log, index) => ({
                token: token,
                buyPrice: log.args.buyPrice.toString(),
                ethAmount: log.args.ethAmount.toString(),
                timestamp: timestamps[index],
            }));
            return result;
        } catch (error) {
            throw new Error(`Error fetching 24h volume: ${(error as Error).message}`);
        }
    }

    async getSellTradeEventLogs(fromBlock: number, toBlock: number, token?: Token, user?: Address): Promise<SellTrade[]> {
        try {
            const logs = await this.publicClient?.getLogs({
                address: this.contractAddress,
                fromBlock: BigInt(fromBlock),
                toBlock: BigInt(toBlock),
                event: parseAbiItem('event SellTrade(address indexed token, address indexed trader, uint256 ethAmount, uint256 tokenAmount, uint256 sellPrice)'),
                args: {
                    token: (token?.address as Address),
                    trader: user as Address | undefined
                },
                strict: true
            });
            let result: SellTrade[] = [];
            const timestamps = await Promise.all(
                (logs || []).map(log => this.getBlockTimestamp(log.blockNumber))
            );
            if (!token) {
                const tokens = await Promise.all(
                    (logs || []).map(async (log) => await this.getToken(log.args.token as Address))
                )
                result = (logs || []).map((log, index) => ({
                    token: tokens[index],
                    sellPrice: log.args.sellPrice.toString(),
                    ethAmount: log.args.ethAmount.toString(),
                    timestamp: timestamps[index],
                }));
                return result;
            }
            result = (logs || []).map((log, index) => ({
                token: token,
                sellPrice: log.args.sellPrice.toString(),
                ethAmount: log.args.ethAmount.toString(),
                timestamp: timestamps[index],
            }));
            return result;
        } catch (error) {
            throw new Error(`Error fetching 24h volume: ${(error as Error).message}`);
        }
    }

    private async swapInEventLogs(fromBlock: number, toBlock: number, tokenIn: Token): Promise<SwapTrade[]> {
        try {
            const logs = await this.publicClient?.getLogs({
                address: this.contractAddress,
                fromBlock: BigInt(fromBlock),
                toBlock: BigInt(toBlock),
                event: parseAbiItem('event SwapTrade(address indexed tokenIn, address indexed tokenOut, address indexed trader, uint256 amountIn, uint256 amountOut, uint256 sellPrice, uint256 buyPrice)'),
                args: {
                    tokenIn: tokenIn.address as Address,
                },
                strict: true
            });
            let result: SwapTrade[] = [];
            const timestamps = await Promise.all(
                (logs || []).map(log => this.getBlockTimestamp(log.blockNumber))
            );
            const tokensOut = await Promise.all(
                (logs || []).map(async (log) => await this.getToken(log.args.tokenOut as Address))
            )
            result = (logs || []).map((log, index) => ({
                tokenIn: tokenIn,
                tokenOut: tokensOut[index],
                amountIn: log.args.amountIn.toString(),
                amountOut: log.args.amountOut.toString(),
                sellPrice: log.args.sellPrice.toString(),
                buyPrice: log.args.buyPrice.toString(),
                timestamp: timestamps[index],
            }));
            return result;
        } catch (error) {
            throw new Error(`Error fetching 24h volume: ${(error as Error).message}`);
        }
    }

    private async swapOutEventLogs(fromBlock: number, toBlock: number, tokenOut: Token): Promise<SwapTrade[]> {
        try {
            const logs = await this.publicClient?.getLogs({
                address: this.contractAddress,
                fromBlock: BigInt(fromBlock),
                toBlock: BigInt(toBlock),
                event: parseAbiItem('event SwapTrade(address indexed tokenIn, address indexed tokenOut, address indexed trader, uint256 amountIn, uint256 amountOut, uint256 sellPrice, uint256 buyPrice)'),
                args: {
                    tokenOut: tokenOut.address as Address,
                },
                strict: true
            });
            let result: SwapTrade[] = [];
            const timestamps = await Promise.all(
                (logs || []).map(log => this.getBlockTimestamp(log.blockNumber))
            );
            const tokensIn = await Promise.all(
                (logs || []).map(async (log) => await this.getToken(log.args.tokenIn as Address))
            )
            result = (logs || []).map((log, index) => ({
                tokenOut: tokenOut,
                tokenIn: tokensIn[index],
                amountIn: log.args.amountIn.toString(),
                amountOut: log.args.amountOut.toString(),
                sellPrice: log.args.sellPrice.toString(),
                buyPrice: log.args.buyPrice.toString(),
                timestamp: timestamps[index],
            }));
            return result;
        } catch (error) {
            throw new Error(`Error fetching 24h volume: ${(error as Error).message}`);
        }
    }

    async getSwapTradeEventLogs(fromBlock: number, toBlock: number, token?: Token, user?: Address): Promise<SwapTrade[]> {
        try {
            if (user) {
                const logs = await this.publicClient?.getLogs({
                    address: this.contractAddress,
                    fromBlock: BigInt(fromBlock),
                    toBlock: BigInt(toBlock),
                    event: parseAbiItem('event SwapTrade(address indexed tokenIn, address indexed tokenOut, address indexed trader, uint256 amountIn, uint256 amountOut, uint256 sellPrice, uint256 buyPrice)'),
                    args: {
                        trader: user as Address,
                    },
                    strict: true
                });
                let result: SwapTrade[] = [];
                const timestamps = await Promise.all(
                    (logs || []).map(log => this.getBlockTimestamp(log.blockNumber))
                );
                const tokensIn = await Promise.all(
                    (logs || []).map(async (log) => await this.getToken(log.args.tokenIn as Address))
                )
                const tokensOut = await Promise.all(
                    (logs || []).map(async (log) => await this.getToken(log.args.tokenOut as Address))
                )
                result = (logs || []).map((log, index) => ({
                    token: token,
                    tokenIn: tokensIn[index],
                    tokenOut: tokensOut[index],
                    amountIn: log.args.amountIn.toString(),
                    amountOut: log.args.amountOut.toString(),
                    sellPrice: log.args.sellPrice.toString(),
                    buyPrice: log.args.buyPrice.toString(),
                    timestamp: timestamps[index],
                }));
                return result;
            }
            const swapInTrades = await this.swapInEventLogs(fromBlock, toBlock, token! as Token);
            const swapOutTrades = await this.swapOutEventLogs(fromBlock, toBlock, token! as Token);
            return swapInTrades.concat(swapOutTrades);
        } catch (error) {
            throw new Error(`Error fetching swap trade logs: ${(error as Error).message}`);
        }
    }

    private async get24hBeforeBlock(): Promise<bigint> {
        try {
            let lowBlock = BigInt(0);
            let highBlock = BigInt(0);
            while (lowBlock <= highBlock) {
                const midBlock = (lowBlock + highBlock) / BigInt(2);
                const midTimestamp = await this.getBlockTimestamp(midBlock);
                if (Date.now() - midTimestamp < 24 * 60 * 60 * 1000) {
                    lowBlock = midBlock + BigInt(1);
                } else {
                    highBlock = midBlock - BigInt(1);
                }
            }
            return lowBlock;
        } catch (error) {
            throw new Error(`Error fetching 24h behind block: ${(error as Error).message}`);
        }
    }

    private async get24hVolume(token: Token): Promise<string> {
        try {
            const toBlock = await this.publicClient?.getBlockNumber();
            const fromBlock = await this.get24hBeforeBlock();
            const buyLogs = await this.getBuyTradeEventLogs(Number(fromBlock), Number(toBlock), token);
            const sellLogs = await this.getSellTradeEventLogs(Number(fromBlock), Number(toBlock), token);
            const swapLogs = await this.getSwapTradeEventLogs(Number(fromBlock), Number(toBlock), token);
            let volume = BigInt(0);
            buyLogs.forEach(log => {
                volume += BigInt(log.ethAmount);
            });
            sellLogs.forEach(log => {
                volume += BigInt(log.ethAmount);
            });
            swapLogs.forEach(log => {
                if (log.tokenIn.address === token.address) {
                    volume += BigInt(log.amountIn) * BigInt(log.sellPrice);
                } else if (log.tokenOut.address === token.address) {
                    volume += BigInt(log.amountOut) * BigInt(log.buyPrice);
                }
            });
            return volume.toString();
        } catch (error) {
            throw new Error(`Error fetching 24h volume: ${(error as Error).message}`);
        }
    }

    async getLastExchangeTimestamp(token: Token): Promise<number> {
        const { data, error } = await useReadContract({
            address: this.contractAddress,
            abi: ABI,
            functionName: 'pools',
            args: [token.address]
        });
        if (error) throw new Error(`Error fetching last exchange timestamp: ${error.message}`);
        return Number(data![2]) * 1000;
    }

    async getDepositEventLogs(fromBlock: number, toBlock: number, token?: Token, user?: Address): Promise<Deposit[]> {
        try {
            const logs = await this.publicClient?.getLogs({
                address: this.contractAddress,
                fromBlock: BigInt(fromBlock),
                toBlock: BigInt(toBlock),
                event: parseAbiItem('event Deposit(address indexed token, address indexed user, uint256 ethAmount, uint256 tokenAmount, uint256 lpTokensMinted)'),
                args: {
                    token: (token?.address as Address),
                    user: user as Address | undefined
                },
                strict: true
            });
            let result: Deposit[] = [];
            const timestamps = await Promise.all(
                (logs || []).map(log => this.getBlockTimestamp(log.blockNumber))
            );
            if (!token) {
                const tokens = await Promise.all(
                    (logs || []).map(async (log) => await this.getToken(log.args.token as Address))
                )
                result = (logs || []).map((log, index) => ({
                    token: tokens[index],
                    ethAmount: log.args.ethAmount.toString(),
                    tokenAmount: log.args.tokenAmount.toString(),
                    lpTokensMinted: log.args.lpTokensMinted.toString(),
                    timestamp: timestamps[index],
                }));
                return result;
            }
            result = (logs || []).map((log, index) => ({
                token: token,
                ethAmount: log.args.ethAmount.toString(),
                tokenAmount: log.args.tokenAmount.toString(),
                lpTokensMinted: log.args.lpTokensMinted.toString(),
                timestamp: timestamps[index],
            }));
            return result;
        } catch (error) {
            throw new Error(`Error fetching deposit logs: ${(error as Error).message}`);
        }
    }

    async getWithdrawEventLogs(fromBlock: number, toBlock: number, token?: Token, user?: Address): Promise<Withdraw[]> {
        try {
            const logs = await this.publicClient?.getLogs({
                address: this.contractAddress,
                fromBlock: BigInt(fromBlock),
                toBlock: BigInt(toBlock),
                event: parseAbiItem('event withdraw(address indexed token, address indexed user, uint256 ethAmount, uint256 tokenAmount, uint256 lpTokensBurned)'),
                args: {
                    token: (token?.address as Address),
                    user: user as Address | undefined
                },
                strict: true
            });
            let result: Withdraw[] = [];
            const timestamps = await Promise.all(
                (logs || []).map(log => this.getBlockTimestamp(log.blockNumber))
            );
            if (!token) {
                const tokens = await Promise.all(
                    (logs || []).map(async (log) => await this.getToken(log.args.token as Address))
                )
                result = (logs || []).map((log, index) => ({
                    token: tokens[index],
                    ethAmount: log.args.ethAmount.toString(),
                    tokenAmount: log.args.tokenAmount.toString(),
                    lpTokensBurnt: log.args.lpTokensBurned.toString(),
                    timestamp: timestamps[index],
                }));
                return result;
            }
            result = (logs || []).map((log, index) => ({
                token: token,
                ethAmount: log.args.ethAmount.toString(),
                tokenAmount: log.args.tokenAmount.toString(),
                lpTokensBurnt: log.args.lpTokensBurned.toString(),
                timestamp: timestamps[index],
            }));
            return result;
        } catch (error) {
            throw new Error(`Error fetching withdraw logs: ${(error as Error).message}`);
        }
    }

    async getPool(token: Token, user: Address): Promise<Pool> {
        try {
            const lpToken = await this.getLPToken(token, user);
            const reserve = await this.getReserves(token);
            const buyPrice = await this.getBuyPrice(token);
            const sellPrice = await this.getSellPrice(token);
            const tokenRatio = await this.getTokenRatio(token);
            const volume24h = await this.get24hVolume(token);
            const avgPrice = this.getAvgPrice(buyPrice, sellPrice);
            const totalLiquidity = this.getTotalLiquidity(avgPrice, reserve.tokenReserve);
            const apr = this.getAPR(volume24h, totalLiquidity);
            const lastExchangeTs = await this.getLastExchangeTimestamp(token);
            return {
                token: token,
                reserve: reserve,
                lpToken: lpToken,
                buyPrice: buyPrice,
                sellPrice: sellPrice,
                avgPrice: avgPrice,
                tokenRatio: tokenRatio,
                volume24h: volume24h,
                totalLiquidty: totalLiquidity,
                apr: Number(apr),
                lastExchangeTs: lastExchangeTs,
                lastUpdated: Date.now()
            }
        } catch (error) {
            throw new Error(`Error fetching pool data: ${(error as Error).message}`);
        }
    }

    async getPools(startIndex: number, offset: number): Promise<RowPool[]> {
        try {
            const { data, error } = await useReadContract({
                address: this.contractAddress,
                abi: ABI,
                functionName: 'getPoolList',
                args: [BigInt(startIndex), BigInt(offset)]
            })
            if (error) throw new Error(`Error fetching pools: ${error.message}`);
            const tokens = await Promise.all(
                (data as Address[]).map(async (addr) => await this.getToken(addr as Address))
            );
            const buyPrices = await Promise.all(
                tokens.map(async (token) => await this.getBuyPrice(token))
            );
            const sellPrices = await Promise.all(
                tokens.map(async (token) => await this.getSellPrice(token))
            );
            const reserves = await Promise.all(
                tokens.map(async (token) => await this.getReserves(token))
            );
            const liquidity = await Promise.all(
                tokens.map(async (token, index) => await this.getTotalLiquidity(this.getAvgPrice(buyPrices[index], sellPrices[index]), reserves[index].tokenReserve))
            );
            const result = (tokens || []).map((token, index) => ({
                token: token,
                buyPrice: buyPrices[index],
                sellPrice: sellPrices[index],
                totalLiquidity: liquidity[index],
            }));
            return result;
        } catch (error) {
            throw new Error(`Error fetching pools: ${(error as Error).message}`);
        }
    }

    async getUserPools(user: Address, startIndex: number, offset: number): Promise<RowPool[]> {
        try {
            const { data, error } = await useReadContract({
                address: this.contractAddress,
                abi: ABI,
                functionName: 'getUserPools',
                args: [user, BigInt(startIndex), BigInt(offset)]
            })
            if (error) throw new Error(`Error fetching pools: ${error.message}`);
            const tokens = await Promise.all(
                (data as Address[]).map(async (addr) => await this.getToken(addr as Address))
            );
            const buyPrices = await Promise.all(
                tokens.map(async (token) => await this.getBuyPrice(token))
            );
            const sellPrices = await Promise.all(
                tokens.map(async (token) => await this.getSellPrice(token))
            );
            const reserves = await Promise.all(
                tokens.map(async (token) => await this.getReserves(token))
            );
            const liquidity = await Promise.all(
                tokens.map(async (token, index) => await this.getTotalLiquidity(this.getAvgPrice(buyPrices[index], sellPrices[index]), reserves[index].tokenReserve))
            );
            const result = (tokens || []).map((token, index) => ({
                token: token,
                buyPrice: buyPrices[index],
                sellPrice: sellPrices[index],
                totalLiquidity: liquidity[index],
            }));
            return result;
        } catch (error) {
            throw new Error(`Error fetching pools: ${(error as Error).message}`);
        }
    }


}