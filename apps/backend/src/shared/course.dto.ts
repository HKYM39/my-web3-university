import {
	ArgsType,
	Field,
	GraphQLISODateTime,
	InputType,
	Int,
	ObjectType,
} from "@nestjs/graphql";
import { PaginationArgs } from "./common.dto.js";
import { CourseStatus, PayToken } from "./enums";

@ObjectType("Course")
export class Course {
	@Field(() => Int)
	id!: number;

	@Field(() => String)
	courseUid!: string;

	@Field(() => String)
	title!: string;

	@Field(() => String, { nullable: true })
	description?: string;

	@Field(() => String)
	authorWallet!: string;

	@Field(() => String)
	price!: string;

	@Field(() => PayToken)
	payToken!: PayToken;

	@Field(() => CourseStatus)
	status!: CourseStatus;

	@Field(() => GraphQLISODateTime)
	createdAt!: Date;
}

@ObjectType("CourseContent")
export class CourseContent {
	@Field(() => Int)
	id!: number;

	@Field(() => String)
	title!: string;

	@Field(() => String, { nullable: true })
	videoUrl?: string;

	@Field(() => Int)
	sortOrder!: number;

	@Field(() => Boolean, { nullable: true })
	locked?: boolean;
}

@ObjectType("PurchaseHint")
export class PurchaseHint {
	@Field(() => String, { nullable: true })
	contractAddress?: string;

	@Field(() => String, { nullable: true })
	payTokenAddress?: string;

	@Field(() => String, { nullable: true })
	approveSpender?: string;

	@Field(() => String, { nullable: true })
	buyMethod?: string;
}

@ObjectType("CourseDetailResponse")
export class CourseDetailResponse {
	@Field(() => Course)
	course!: Course;

	@Field(() => [CourseContent])
	contents!: CourseContent[];

	@Field(() => PurchaseHint, { nullable: true })
	purchaseHint?: PurchaseHint;
}

@ObjectType("CourseResponse")
export class CourseResponse {
	@Field(() => Course)
	course!: Course;
}

@ObjectType("PagedCoursesResponse")
export class PagedCoursesResponse {
	@Field(() => Int)
	page!: number;

	@Field(() => Int)
	pageSize!: number;

	@Field(() => Int)
	total!: number;

	@Field(() => [Course])
	items!: Course[];
}

@ObjectType("PurchasedCourse")
export class PurchasedCourse {
	@Field(() => String)
	courseUid!: string;

	@Field(() => String)
	nftTokenId!: string;

	@Field(() => String, { nullable: true })
	txHash?: string;

	@Field(() => GraphQLISODateTime)
	purchasedAt!: Date;

	@Field(() => Course)
	course!: Course;
}

@ObjectType("PagedPurchasedCoursesResponse")
export class PagedPurchasedCoursesResponse {
	@Field(() => Int)
	page!: number;

	@Field(() => Int)
	pageSize!: number;

	@Field(() => Int)
	total!: number;

	@Field(() => [PurchasedCourse])
	items!: PurchasedCourse[];
}

@ObjectType("CourseAccessResponse")
export class CourseAccessResponse {
	@Field(() => String)
	courseUid!: string;

	@Field(() => Boolean)
	hasAccess!: boolean;

	@Field(() => String, { nullable: true })
	nftTokenId?: string;

	@Field(() => String, { nullable: true })
	source?: string;
}

@ArgsType()
export class CourseListArgs extends PaginationArgs {
	@Field(() => CourseStatus, { nullable: true })
	status?: CourseStatus;

	@Field(() => String, { nullable: true })
	authorWallet?: string;

	@Field(() => String, { nullable: true })
	q?: string;
}

@InputType("CreateCourseInput")
export class CreateCourseInput {
	@Field(() => String, { nullable: true })
	courseUid?: string;

	@Field(() => String)
	title!: string;

	@Field(() => String, { nullable: true })
	description?: string;

	@Field(() => String)
	price!: string;

	@Field(() => PayToken)
	payToken!: PayToken;
}

@InputType("UpdateCourseInput")
export class UpdateCourseInput {
	@Field(() => String, { nullable: true })
	title?: string;

	@Field(() => String, { nullable: true })
	description?: string;

	@Field(() => String, { nullable: true })
	price?: string;

	@Field(() => PayToken, { nullable: true })
	payToken?: PayToken;
}

@InputType("UpsertContentItemInput")
export class UpsertContentItemInput {
	@Field(() => Int, { nullable: true })
	id?: number;

	@Field(() => String)
	title!: string;

	@Field(() => String, { nullable: true })
	videoUrl?: string;

	@Field(() => Int)
	sortOrder!: number;
}

@InputType("UpsertContentsInput")
export class UpsertContentsInput {
	@Field(() => [UpsertContentItemInput])
	items!: UpsertContentItemInput[];
}
