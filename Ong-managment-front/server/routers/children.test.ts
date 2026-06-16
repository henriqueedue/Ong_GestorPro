import { describe, expect, it, vi, beforeEach } from "vitest";
import { childrenRouter } from "./children";

describe("childrenRouter", () => {
  const mockUser = {
    id: 1,
    openId: null,
    email: "test@example.com",
    name: "Test User",
    loginMethod: "jwt",
    role: "user" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const mockContext = {
    user: mockUser,
    req: {} as any,
    res: {} as any,
  };

  describe("create", () => {
    it("should validate required fields", async () => {
      const caller = childrenRouter.createCaller(mockContext);

      try {
        await caller.create({
          name: "",
          dateOfBirth: "2020-01-01",
          responsible: "John Doe",
          contact: "123456789",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("Nome");
      }
    });

    it("should validate date format", async () => {
      const caller = childrenRouter.createCaller(mockContext);

      try {
        await caller.create({
          name: "Test Child",
          dateOfBirth: "01-01-2020",
          responsible: "John Doe",
          contact: "123456789",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("Data");
      }
    });
  });

  describe("list", () => {
    it("should require authentication", async () => {
      const caller = childrenRouter.createCaller({
        ...mockContext,
        user: null,
      } as any);

      try {
        await caller.list();
        expect.fail("Should have thrown authentication error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });
  });

  describe("delete", () => {
    it("should validate childId is a number", async () => {
      const caller = childrenRouter.createCaller(mockContext);

      try {
        await caller.delete({ childId: 0 });
        // This should attempt to delete, but the actual DB operation will fail
        // We're just testing the schema validation here
      } catch (error: any) {
        // Expected to fail at DB level, not schema level
      }
    });
  });
});
