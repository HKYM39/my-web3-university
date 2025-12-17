import { Injectable } from "@nestjs/common";
import {
	AdminLog,
	AdminLogListArgs,
	Article,
	ArticleListArgs,
	ArticleResponse,
	HomepageRecommendationsResponse,
	OkResponse,
	PagedAdminLogsResponse,
	PagedArticlesResponse,
	UpdateHomepageRecommendationsInput,
	UpsertArticleInput,
} from "../../shared";
import { PrismaService } from "../common/prisma/prisma.service";

@Injectable()
export class AdminService {
	constructor(private readonly prisma: PrismaService) {}

	async listArticles(args: ArticleListArgs): Promise<PagedArticlesResponse> {
		return {
			page: args.page,
			pageSize: args.pageSize,
			total: 0,
			items: [],
		};
	}

	async upsertArticle(input: UpsertArticleInput): Promise<ArticleResponse> {
		const article: Article = {
			id: 0,
			title: input.title,
			status: input.status,
			createdAt: new Date(),
		};
		return { article };
	}

	async getHomepageRecommendations(): Promise<HomepageRecommendationsResponse> {
		return { courseUids: [] };
	}

	async updateHomepageRecommendations(
		input: UpdateHomepageRecommendationsInput,
	): Promise<OkResponse> {
		void input;
		return { ok: true };
	}

	async listAdminLogs(
		args: AdminLogListArgs,
	): Promise<PagedAdminLogsResponse> {
		const log: AdminLog = {
			id: 0,
			adminWallet: "0xAdmin",
			action: "INIT",
			targetId: undefined,
			createdAt: new Date(),
		};
		return {
			page: args.page,
			pageSize: args.pageSize,
			total: 0,
			items: [log],
		};
	}
}
