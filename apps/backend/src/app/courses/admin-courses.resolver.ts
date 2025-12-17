import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
	Course,
	CourseListArgs,
	OkResponse,
	PagedCoursesResponse,
	ReviewCourseInput,
} from "../../shared";
import { CoursesService } from "./courses.service";

@Resolver(() => Course)
export class AdminCoursesResolver {
	constructor(private readonly coursesService: CoursesService) {}

	@Query(() => PagedCoursesResponse)
	async adminPendingCourses(@Args() args: CourseListArgs) {
		return this.coursesService.listPendingCourses(args);
	}

	@Mutation(() => OkResponse)
	async reviewCourse(
		@Args("id", { type: () => Int }) id: number,
		@Args("input") input: ReviewCourseInput,
	) {
		return this.coursesService.reviewCourse(id, input);
	}
}
