import { Args, Query, Resolver } from "@nestjs/graphql";
import {
	Course,
	CourseDetailResponse,
	CourseListArgs,
	PagedCoursesResponse,
} from "../../shared";
import { CoursesService } from "./courses.service";

@Resolver(() => Course)
export class PublicCoursesResolver {
	constructor(private readonly coursesService: CoursesService) {}

	@Query(() => PagedCoursesResponse)
	async publicCourses(@Args() args: CourseListArgs) {
		return this.coursesService.listPublicCourses(args);
	}

	@Query(() => CourseDetailResponse)
	async publicCourse(
		@Args("courseUid", { type: () => String }) courseUid: string,
	) {
		return this.coursesService.getCourseDetail(courseUid);
	}
}
