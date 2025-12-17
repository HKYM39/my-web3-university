import { Module } from "@nestjs/common";
import { PrismaModule } from "../common/prisma/prisma.module";
import { AdminCoursesResolver } from "./admin-courses.resolver";
import { CreatorCoursesResolver } from "./creator-courses.resolver";
import { CoursesService } from "./courses.service";
import { PublicCoursesResolver } from "./public-courses.resolver";

@Module({
	imports: [PrismaModule],
	providers: [
		CoursesService,
		PublicCoursesResolver,
		CreatorCoursesResolver,
		AdminCoursesResolver,
	],
	exports: [CoursesService],
})
export class CoursesModule {}
