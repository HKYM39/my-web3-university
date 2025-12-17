import { Injectable } from "@nestjs/common";
import {
	type Course,
	type CourseAccessResponse,
	CourseContent,
	type CourseDetailResponse,
	type CourseListArgs,
	type CourseResponse,
	CourseStatus,
	type CreateCourseInput,
	type OkResponse,
	type ReviewCourseInput,
	type PagedCoursesResponse,
	type PagedPurchasedCoursesResponse,
	PayToken,
	type PurchaseHint,
	type UpdateCourseInput,
	type UpsertContentsInput,
} from "../../shared";
import { PrismaService } from "../common/prisma/prisma.service";

@Injectable()
export class CoursesService {
	constructor(private readonly prisma: PrismaService) {}

	async listPublicCourses(args: CourseListArgs): Promise<PagedCoursesResponse> {
		return {
			page: args.page,
			pageSize: args.pageSize,
			total: 0,
			items: [],
		};
	}

	async getCourseDetail(courseUid: string): Promise<CourseDetailResponse> {
		const course = this.buildCourseStub({
			courseUid,
			status: CourseStatus.PUBLISHED,
		});
		return {
			course,
			contents: [],
			purchaseHint: this.buildPurchaseHintStub(),
		};
	}

	async listPurchasedCourses(
		walletAddress: string,
		page: number,
		pageSize: number,
	): Promise<PagedPurchasedCoursesResponse> {
		const course = this.buildCourseStub({
			authorWallet: walletAddress,
			status: CourseStatus.PUBLISHED,
		});
		return {
			page,
			pageSize,
			total: 1,
			items: [
				{
					courseUid: course.courseUid,
					nftTokenId: "0",
					txHash: undefined,
					purchasedAt: new Date(),
					course,
				},
			],
		};
	}

	async checkCourseAccess(
		walletAddress: string,
		courseUid: string,
		chainVerify = false,
	): Promise<CourseAccessResponse> {
		return {
			courseUid,
			hasAccess: false,
			nftTokenId: undefined,
			source: chainVerify ? "CHAIN" : "INDEX",
		};
	}

	async createCourse(
		authorWallet: string,
		input: CreateCourseInput,
	): Promise<CourseResponse> {
		const course = this.buildCourseStub({
			authorWallet,
			courseUid: input.courseUid ?? "course-tbd",
			title: input.title,
			description: input.description,
			price: input.price,
			payToken: input.payToken,
		});
		return { course };
	}

	async updateCourse(
		id: number,
		input: UpdateCourseInput,
	): Promise<CourseResponse> {
		const course = this.buildCourseStub({
			id,
			title: input.title,
			description: input.description,
			price: input.price,
			payToken: input.payToken ?? PayToken.YIDENG,
		});
		return { course };
	}

	async upsertContents(
		id: number,
		input: UpsertContentsInput,
	): Promise<OkResponse> {
		void id;
		void input;
		return { ok: true };
	}

	async submitCourse(id: number): Promise<OkResponse> {
		void id;
		return { ok: true };
	}

	async listCreatorCourses(
		authorWallet: string,
		args: CourseListArgs,
	): Promise<PagedCoursesResponse> {
		const item = this.buildCourseStub({
			authorWallet,
			status: args.status ?? CourseStatus.DRAFT,
		});
		return {
			page: args.page,
			pageSize: args.pageSize,
			total: 0,
			items: [item],
		};
	}

	async listPendingCourses(
		args: CourseListArgs,
	): Promise<PagedCoursesResponse> {
		return {
			page: args.page,
			pageSize: args.pageSize,
			total: 0,
			items: [],
		};
	}

	async reviewCourse(
		id: number,
		input: ReviewCourseInput,
	): Promise<OkResponse> {
		void id;
		void input;
		return { ok: true };
	}

	private buildCourseStub(overrides: Partial<Course> = {}): Course {
		return {
			id: overrides.id ?? 0,
			courseUid: overrides.courseUid ?? "course-stub",
			title: overrides.title ?? "TBD",
			description: overrides.description,
			authorWallet: overrides.authorWallet ?? "0xAuthor",
			price: overrides.price ?? "0",
			payToken: overrides.payToken ?? PayToken.YIDENG,
			status: overrides.status ?? CourseStatus.DRAFT,
			createdAt: overrides.createdAt ?? new Date(),
		};
	}

	private buildPurchaseHintStub(): PurchaseHint {
		return {
			contractAddress: "",
			payTokenAddress: "",
			approveSpender: "",
			buyMethod: "buyCourse(uint256 courseId)",
		};
	}
}
