import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable, defineConfig, task } from "hardhat/config";
import hardhatTypechain from "@nomicfoundation/hardhat-typechain";

const exportAbi = task("export-abi", "Export Abi to packages/abis")
	.setAction(() => import("./tasks/export-abi.js"))
	.build();

export default defineConfig({
	plugins: [hardhatToolboxViemPlugin, hardhatTypechain],
	solidity: {
		profiles: {
			default: {
				version: "0.8.28",
			},
			production: {
				version: "0.8.28",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
		},
	},
	networks: {
		hardhatMainnet: {
			type: "edr-simulated",
			chainType: "l1",
		},
		hardhatOp: {
			type: "edr-simulated",
			chainType: "op",
		},
		sepolia: {
			type: "http",
			chainType: "l1",
			url: configVariable("SEPOLIA_RPC_URL"),
			accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
		},
	},
	typechain: {
		outDir: "../../packages/contract-types",
		target: "ethers-v6",
		alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
		externalArtifacts: ["externalArtifacts/*.json"], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
		dontOverrideCompile: false, // defaults to false
	},
	tasks: [exportAbi],
});
