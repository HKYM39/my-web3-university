import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
	LoginInput,
	LoginResponse,
	NonceResponse,
	UserProfile,
	UserRole,
} from "../../shared";
import { PrismaService } from "../common/prisma/prisma.service";

@Injectable()
export class AuthService {
	constructor(private readonly prisma: PrismaService) {}

	async createNonce(wallet: string): Promise<NonceResponse> {
		const nonce = `login-${randomUUID()}`;
		const expiredAt = new Date(Date.now() + 5 * 60 * 1000);
		const messageToSign = `Web3U Login\nWallet: ${wallet}\nNonce: ${nonce}\nExpire: ${expiredAt.toISOString()}`;
		return {
			wallet,
			nonce,
			expiredAt,
			messageToSign,
		};
	}

	async login(input: LoginInput): Promise<LoginResponse> {
		const user: UserProfile = {
			walletAddress: input.wallet,
			nickname: "New User",
			role: UserRole.USER,
			createdAt: new Date(),
		};
		return {
			token: "mock-jwt-token",
			user,
		};
	}
}
