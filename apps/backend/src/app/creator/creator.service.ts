import { Injectable } from "@nestjs/common";
import type {
	AavePositionItem,
	AavePositionResponse,
	IncomeDashboardResponse,
} from "../../shared";
import { PrismaService } from "../common/prisma/prisma.service";

@Injectable()
export class CreatorService {
	constructor(private readonly prisma: PrismaService) {}

	async getIncomeDashboard(
		walletAddress: string,
		from?: string,
		to?: string,
	): Promise<IncomeDashboardResponse> {
		void walletAddress;
		void from;
		void to;
		return {
			totalIncome: "0",
			byToken: [],
			byCourse: [],
		};
	}

	async getAavePosition(walletAddress: string): Promise<AavePositionResponse> {
		void walletAddress;
		const positions: AavePositionItem[] = [];
		return {
			walletAddress,
			positions,
		};
	}
}
