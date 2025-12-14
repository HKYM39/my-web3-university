import type { HardhatRuntimeEnvironment } from "hardhat/types/hre";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type MyAccountTaskArguments = {};

export default async function (
	_: MyAccountTaskArguments,
	hre: HardhatRuntimeEnvironment,
) {
	const abiDir = "../../packages/abi";

	if (!existsSync(abiDir)) mkdirSync(abiDir, { recursive: true });

	for (const artifactName of await hre.artifacts.getAllFullyQualifiedNames()) {
		const artifact = await hre.artifacts.readArtifact(artifactName);
		const fileName = `${artifact.contractName}.json`;
		writeFileSync(join(abiDir, fileName), JSON.stringify(artifact, null, 2));
	}

	console.log("ABI exported successfully!");
}
