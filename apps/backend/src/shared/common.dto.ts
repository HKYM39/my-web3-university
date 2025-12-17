import { ArgsType, Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType("OkResponse")
export class OkResponse {
	@Field(() => Boolean)
	ok = true;
}

@ArgsType()
export class PaginationArgs {
	@Field(() => Int, { defaultValue: 1 })
	page = 1;

	@Field(() => Int, { defaultValue: 20 })
	pageSize = 20;
}

@ArgsType()
export class DateRangeArgs {
	@Field(() => String, { nullable: true })
	from?: string;

	@Field(() => String, { nullable: true })
	to?: string;
}
