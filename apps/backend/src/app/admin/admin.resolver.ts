import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
	AdminLogListArgs,
	ArticleListArgs,
	ArticleResponse,
	HomepageRecommendationsResponse,
	OkResponse,
	PagedAdminLogsResponse,
	PagedArticlesResponse,
	UpdateHomepageRecommendationsInput,
	UpsertArticleInput,
} from "../../shared";
import { AdminService } from "./admin.service";

@Resolver()
export class AdminResolver {
	constructor(private readonly adminService: AdminService) {}

	@Query(() => PagedArticlesResponse)
	async adminArticles(@Args() args: ArticleListArgs) {
		return this.adminService.listArticles(args);
	}

	@Mutation(() => ArticleResponse)
	async upsertArticle(@Args("input") input: UpsertArticleInput) {
		return this.adminService.upsertArticle(input);
	}

	@Query(() => HomepageRecommendationsResponse)
	async homepageRecommendations() {
		return this.adminService.getHomepageRecommendations();
	}

	@Mutation(() => OkResponse)
	async updateHomepageRecommendations(
		@Args("input") input: UpdateHomepageRecommendationsInput,
	) {
		return this.adminService.updateHomepageRecommendations(input);
	}

	@Query(() => PagedAdminLogsResponse)
	async adminLogs(@Args() args: AdminLogListArgs) {
		return this.adminService.listAdminLogs(args);
	}
}
