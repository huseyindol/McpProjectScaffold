import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SearchLoansInputSchema } from '../types/loans';
import { LoanAggregateController } from '../controllers/loan.aggregate.controller';

export function registerLoanAggregationTools(server: McpServer): void {
  server.registerTool(
    'search_loans',
    {
      title: 'Kredi Ara',
      description: 'Konut Kredisi, Taşıt Kredisi veya İhtiyaç Kredisi ara',
      inputSchema: SearchLoansInputSchema,
    },
    (args) => new LoanAggregateController().handleSearchLoans(args),
  );
}
