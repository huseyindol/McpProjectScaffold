// MCP Tool Response Types (Context7 Pattern - MCP SDK Compatible)
export interface ToolResponse {
  [x: string]: unknown;
  content: Array<{
    type: "text";
    text: string;
  }>;
}