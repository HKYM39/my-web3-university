import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { LoginInput, LoginResponse, NonceResponse } from "../../shared";
import { AuthService } from "./auth.service";

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Query(() => NonceResponse)
	async authNonce(@Args("wallet", { type: () => String }) wallet: string) {
		return this.authService.createNonce(wallet);
	}

	@Mutation(() => LoginResponse)
	async login(@Args("input") input: LoginInput) {
		return this.authService.login(input);
	}
}
