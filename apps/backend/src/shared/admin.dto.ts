import {
	ArgsType,
	Field,
	GraphQLISODateTime,
	InputType,
	Int,
	ObjectType,
} from "@nestjs/graphql";
import { PaginationArgs } from "./common.dto";
import { ArticleStatus, CourseStatus } from "./enums";

@InputType("ReviewCourseInput")
export class ReviewCourseInput {
	@Field(() => CourseStatus)
	status!: CourseStatus;

	@Field(() => String, { nullable: true })
	reason?: string;
}

@ObjectType("Article")
export class Article {
	@Field(() => Int)
	id!: number;

	@Field(() => String)
	title!: string;

	@Field(() => ArticleStatus)
	status!: ArticleStatus;

	@Field(() => GraphQLISODateTime)
	createdAt!: Date;
}

@InputType("UpsertArticleInput")
export class UpsertArticleInput {
	@Field(() => String)
	title!: string;

	@Field(() => String)
	content!: string;

	@Field(() => ArticleStatus)
	status!: ArticleStatus;
}

@ObjectType("ArticleResponse")
export class ArticleResponse {
	@Field(() => Article)
	article!: Article;
}

@ObjectType("PagedArticlesResponse")
export class PagedArticlesResponse {
	@Field(() => Int)
	page!: number;

	@Field(() => Int)
	pageSize!: number;

	@Field(() => Int)
	total!: number;

	@Field(() => [Article])
	items!: Article[];
}

@ArgsType()
export class ArticleListArgs extends PaginationArgs {
	@Field(() => String, { nullable: true })
	q?: string;
}

@ObjectType("HomepageRecommendationsResponse")
export class HomepageRecommendationsResponse {
	@Field(() => [String])
	courseUids!: string[];
}

@InputType("UpdateHomepageRecommendationsInput")
export class UpdateHomepageRecommendationsInput {
	@Field(() => [String])
	courseUids!: string[];
}

@ObjectType("AdminLog")
export class AdminLog {
	@Field(() => Int)
	id!: number;

	@Field(() => String)
	adminWallet!: string;

	@Field(() => String)
	action!: string;

	@Field(() => String, { nullable: true })
	targetId?: string;

	@Field(() => GraphQLISODateTime)
	createdAt!: Date;
}

@ObjectType("PagedAdminLogsResponse")
export class PagedAdminLogsResponse {
	@Field(() => Int)
	page!: number;

	@Field(() => Int)
	pageSize!: number;

	@Field(() => Int)
	total!: number;

	@Field(() => [AdminLog])
	items!: AdminLog[];
}

@ArgsType()
export class AdminLogListArgs extends PaginationArgs {}
