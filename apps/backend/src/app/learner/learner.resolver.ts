import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
	CourseAccessResponse,
	OkResponse,
	PagedPurchasedCoursesResponse,
	PaginationArgs,
	UpdateNicknameInput,
	UserProfileResponse,
} from "../../shared";
import { CoursesService } from "../courses/courses.service";
import { LearnerService } from "./learner.service";

@Resolver()
export class LearnerResolver {
	constructor(
		private readonly learnerService: LearnerService,
		private readonly coursesService: CoursesService,
	) {}

	@Query(() => UserProfileResponse)
	async learnerProfile(
		@Args("wallet", { type: () => String }) wallet: string,
	) {
		return this.learnerService.getProfile(wallet);
	}

	@Mutation(() => OkResponse)
	async updateNickname(
		@Args("wallet", { type: () => String }) wallet: string,
		@Args("input") input: UpdateNicknameInput,
	) {
		return this.learnerService.updateNickname(wallet, input.nickname);
	}

	@Query(() => PagedPurchasedCoursesResponse)
	async learnerCourses(
		@Args("wallet", { type: () => String }) wallet: string,
		@Args() pagination: PaginationArgs,
	) {
		return this.coursesService.listPurchasedCourses(
			wallet,
			pagination.page,
			pagination.pageSize,
		);
	}

	@Query(() => CourseAccessResponse)
	async learnerCourseAccess(
		@Args("wallet", { type: () => String }) wallet: string,
		@Args("courseUid", { type: () => String }) courseUid: string,
		@Args("chainVerify", {
			type: () => Boolean,
			nullable: true,
			defaultValue: false,
		})
		chainVerify?: boolean,
	) {
		return this.coursesService.checkCourseAccess(wallet, courseUid, chainVerify);
	}
}
