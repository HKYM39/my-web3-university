import {
	ArgsType,
	Field,
	Float,
	GraphQLISODateTime,
	InputType,
	Int,
	ObjectType,
} from "@nestjs/graphql";
import { PaginationArgs } from "./common.dto";
import { RewardType } from "./enums";

@InputType("ReportProgressInput")
export class ReportProgressInput {
	@Field(() => String)
	courseUid!: string;

	@Field(() => Float)
	progress!: number;

	@Field(() => Int)
	watchedSecondsDelta!: number;
}

@ObjectType("ProgressResponse")
export class ProgressResponse {
	@Field(() => String)
	courseUid!: string;

	@Field(() => Float)
	progress!: number;

	@Field(() => GraphQLISODateTime)
	lastWatchAt!: Date;
}

@InputType("ClaimRewardInput")
export class ClaimRewardInput {
	@Field(() => RewardType)
	rewardType!: RewardType;

	@Field(() => String, { nullable: true })
	courseUid?: string;
}

@ObjectType("ClaimRewardResponse")
export class ClaimRewardResponse {
	@Field(() => Boolean)
	eligible!: boolean;

	@Field(() => String)
	rewardAmount!: string;

	@Field(() => String, { nullable: true })
	txHash?: string;

	@Field(() => String, { nullable: true })
	message?: string;
}

@ObjectType("RewardRecord")
export class RewardRecord {
	@Field(() => Int)
	id!: number;

	@Field(() => RewardType)
	rewardType!: RewardType;

	@Field(() => String, { nullable: true })
	courseUid?: string;

	@Field(() => String)
	rewardAmount!: string;

	@Field(() => String, { nullable: true })
	txHash?: string;

	@Field(() => GraphQLISODateTime)
	createdAt!: Date;
}

@ObjectType("PagedRewardRecordsResponse")
export class PagedRewardRecordsResponse {
	@Field(() => Int)
	page!: number;

	@Field(() => Int)
	pageSize!: number;

	@Field(() => Int)
	total!: number;

	@Field(() => [RewardRecord])
	items!: RewardRecord[];
}

@ArgsType()
export class RewardListArgs extends PaginationArgs {}
