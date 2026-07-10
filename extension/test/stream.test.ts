import {describe,it,expect} from "vitest";describe("NDJSON",()=>it("rappresenta chunk validi",()=>expect(JSON.parse('{"message":{"content":"x"}}').message.content).toBe("x")));
