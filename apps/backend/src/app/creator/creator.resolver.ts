import { Args, Query, Resolver } from "@nestjs/graphql";
import {
	AavePositionResponse,
	DateRangeArgs,
	IncomeDashboardResponse,
} from "../../shared";
import { CreatorService } from "./creator.service";

@Resolver()
export class CreatorResolver {
	constructor(private readonly creatorService: CreatorService) {}

	@Query(() => IncomeDashboardResponse)
	async creatorIncomeDashboard(
		@Args("wallet", { type: () => String }) wallet: string,
		@Args() range: DateRangeArgs,
	) {
		return this.creatorService.getIncomeDashboard(wallet, range.from, range.to);
	}

	@Query(() => AavePositionResponse)
	async creatorAavePosition(
		@Args("wallet", { type: () => String }) wallet: string,
	) {
		return this.creatorService.getAavePosition(wallet);
	}
}
