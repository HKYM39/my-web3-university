import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HealthResolver } from "./graphQL/health.resolver";

@Module({
	imports: [
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			graphiql: true,
			autoSchemaFile: true,
		}),
	],
	controllers: [AppController],
	providers: [AppService, HealthResolver],
})
export class AppModule {}
