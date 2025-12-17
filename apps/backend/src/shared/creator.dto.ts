import { Field, Float, ObjectType } from "@nestjs/graphql";

@ObjectType("IncomeByToken")
export class IncomeByToken {
	@Field(() => String)
	token!: string;

	@Field(() => String)
	amount!: string;
}

@ObjectType("IncomeByCourse")
export class IncomeByCourse {
	@Field(() => String)
	courseUid!: string;

	@Field(() => String)
	amount!: string;
}

@ObjectType("IncomeDashboardResponse")
export class IncomeDashboardResponse {
	@Field(() => String)
	totalIncome!: string;

	@Field(() => [IncomeByToken])
	byToken!: IncomeByToken[];

	@Field(() => [IncomeByCourse])
	byCourse!: IncomeByCourse[];
}

@ObjectType("AavePositionItem")
export class AavePositionItem {
	@Field(() => String)
	asset!: string;

	@Field(() => String)
	amount!: string;

	@Field(() => String)
	aTokenBalance!: string;

	@Field(() => Float)
	apy!: number;
}

@ObjectType("AavePositionResponse")
export class AavePositionResponse {
	@Field(() => String)
	walletAddress!: string;

	@Field(() => [AavePositionItem])
	positions!: AavePositionItem[];
}
