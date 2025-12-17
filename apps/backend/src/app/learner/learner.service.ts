import { Injectable } from "@nestjs/common";
import {
	type ClaimRewardInput,
	type ClaimRewardResponse,
	type OkResponse,
	type PagedRewardRecordsResponse,
	type ProgressResponse,
	type ReportProgressInput,
	type RewardListArgs,
	RewardType,
	type UserProfile,
	type UserProfileResponse,
	type UserProfileStats,
	UserRole,
} from "../../shared";

import { PrismaService } from "../common/prisma/prisma.service";

@Injectable()
export class LearnerService {
	constructor(private readonly prisma: PrismaService) {}

	async getProfile(walletAddress: string): Promise<UserProfileResponse> {
		const profile: UserProfile = {
			walletAddress,
			nickname: "Learner",
			role: UserRole.USER,
			createdAt: new Date(),
		};
		const stats: UserProfileStats = {
			purchasedCourses: 0,
			totalRewards: "0",
		};
		return { user: profile, stats };
	}

	async updateNickname(
		walletAddress: string,
		nickname: string,
	): Promise<OkResponse> {
		void walletAddress;
		void nickname;
		return { ok: true };
	}

	async reportProgress(
		walletAddress: string,
		input: ReportProgressInput,
	): Promise<OkResponse> {
		void walletAddress;
		void input;
		return { ok: true };
	}

	async getProgress(
		walletAddress: string,
		courseUid: string,
	): Promise<ProgressResponse> {
		void walletAddress;
		return {
			courseUid,
			progress: 0,
			lastWatchAt: new Date(),
		};
	}

	async claimReward(
		walletAddress: string,
		input: ClaimRewardInput,
	): Promise<ClaimRewardResponse> {
		void walletAddress;
		return {
			eligible: true,
			rewardAmount: input.rewardType === RewardType.COURSE ? "10" : "1",
			txHash: undefined,
			message: "Reward queued",
		};
	}

	async listRewards(
		walletAddress: string,
		args: RewardListArgs,
	): Promise<PagedRewardRecordsResponse> {
		void walletAddress;
		return {
			page: args.page,
			pageSize: args.pageSize,
			total: 0,
			items: [],
		};
	}
}
