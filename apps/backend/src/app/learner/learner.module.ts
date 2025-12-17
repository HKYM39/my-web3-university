import { Module } from "@nestjs/common";
import { CoursesModule } from "../courses/courses.module";
import { PrismaModule } from "../common/prisma/prisma.module";
import { LearnerResolver } from "./learner.resolver";
import { LearnerService } from "./learner.service";
import { LearningResolver } from "./learning.resolver";

@Module({
	imports: [PrismaModule, CoursesModule],
	providers: [LearnerService, LearnerResolver, LearningResolver],
})
export class LearnerModule {}
