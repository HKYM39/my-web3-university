import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
	ClaimRewardInput,
	ClaimRewardResponse,
	OkResponse,
	PagedRewardRecordsResponse,
	ProgressResponse,
	 ReportProgressInput,
	RewardListArgs,
} from "../../shared";
import { LearnerService } from "./learner.service";

@Resolver()
export class LearningResolver {
	constructor(private readonly learnerService: LearnerService) {}

	@Mutation(() => OkResponse)
	async reportLearningProgress(
		@Args("wallet", { type: () => String }) wallet: string,
		@Args("input") input: ReportProgressInput,
	) {
		return this.learnerService.reportProgress(wallet, input);
	}

	@Query(() => ProgressResponse)
	async learnerProgress(
		@Args("wallet", { type: () => String }) wallet: string,
		@Args("courseUid", { type: () => String }) courseUid: string,
	) {
		return this.learnerService.getProgress(wallet, courseUid);
	}

	@Mutation(() => ClaimRewardResponse)
	async claimReward(
		@Args("wallet", { type: () => String }) wallet: string,
		@Args("input") input: ClaimRewardInput,
	) {
		return this.learnerService.claimReward(wallet, input);
	}

	@Query(() => PagedRewardRecordsResponse)
	async learnerRewards(
		@Args("wallet", { type: () => String }) wallet: string,
		@Args() args: RewardListArgs,
	) {
		return this.learnerService.listRewards(wallet, args);
	}
}
