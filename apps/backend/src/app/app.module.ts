import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HealthResolver } from "./graphQL/health.resolver";
import { AuthModule } from "./auth/auth.module";
import { CoursesModule } from "./courses/courses.module";
import { LearnerModule } from "./learner/learner.module";
import { CreatorModule } from "./creator/creator.module";
import { AdminModule } from "./admin/admin.module";

@Module({
	imports: [
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			playground: true,
			autoSchemaFile: true,
		}),
		AuthModule,
		CoursesModule,
		LearnerModule,
		CreatorModule,
		AdminModule,
	],
	controllers: [AppController],
	providers: [AppService, HealthResolver],
})
export class AppModule {}
