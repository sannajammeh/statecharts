import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["**/*.spec.{ts,tsx}"],
		coverage: {
			provider: "v8",
			reporter: ["text", "html", "lcov"],
			thresholds: {
				statements: 70,
				branches: 60,
			},
		},
	},
});
