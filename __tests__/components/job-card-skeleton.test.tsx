import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { JobCardSkeleton } from "@/components/dashboard/job-card-skeleton";

describe("JobCardSkeleton", () => {
  it("renders 3 skeletons by default", () => {
    const { container } = render(<JobCardSkeleton />);
    const cards = container.querySelectorAll(".rounded-xl");
    expect(cards).toHaveLength(3);
  });

  it("renders specified count of skeletons", () => {
    const { container } = render(<JobCardSkeleton count={5} />);
    const cards = container.querySelectorAll(".rounded-xl");
    expect(cards).toHaveLength(5);
  });

  it("renders 1 skeleton when count is 1", () => {
    const { container } = render(<JobCardSkeleton count={1} />);
    const cards = container.querySelectorAll(".rounded-xl");
    expect(cards).toHaveLength(1);
  });
});
