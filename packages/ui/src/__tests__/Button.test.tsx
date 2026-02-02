import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "../button";

describe("Button", () => {
	it("renders children", () => {
		render(<Button appName="test">Click me</Button>);
		expect(screen.getByRole("button")).toHaveTextContent("Click me");
	});

	it("applies custom className", () => {
		render(
			<Button appName="test" className="custom-class">
				Test
			</Button>,
		);
		expect(screen.getByRole("button")).toHaveClass("custom-class");
	});
});
