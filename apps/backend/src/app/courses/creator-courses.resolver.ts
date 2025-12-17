import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
	Course,
	CourseListArgs,
	CourseResponse,
	CreateCourseInput,
	OkResponse,
	PagedCoursesResponse,
	UpdateCourseInput,
	UpsertContentsInput,
} from "../../shared";
import { CoursesService } from "./courses.service";

@Resolver(() => Course)
export class CreatorCoursesResolver {
	constructor(private readonly coursesService: CoursesService) {}

	@Query(() => PagedCoursesResponse)
	async creatorCourses(
		@Args("authorWallet", { type: () => String }) authorWallet: string,
		@Args() args: CourseListArgs,
	) {
		return this.coursesService.listCreatorCourses(authorWallet, args);
	}

	@Mutation(() => CourseResponse)
	async createCourse(
		@Args("authorWallet", { type: () => String }) authorWallet: string,
		@Args("input") input: CreateCourseInput,
	) {
		return this.coursesService.createCourse(authorWallet, input);
	}

	@Mutation(() => CourseResponse)
	async updateCourse(
		@Args("id", { type: () => Int }) id: number,
		@Args("input") input: UpdateCourseInput,
	) {
		return this.coursesService.updateCourse(id, input);
	}

	@Mutation(() => OkResponse)
	async upsertCourseContents(
		@Args("id", { type: () => Int }) id: number,
		@Args("input") input: UpsertContentsInput,
	) {
		return this.coursesService.upsertContents(id, input);
	}

	@Mutation(() => OkResponse)
	async submitCourseForReview(@Args("id", { type: () => Int }) id: number) {
		return this.coursesService.submitCourse(id);
	}
}
