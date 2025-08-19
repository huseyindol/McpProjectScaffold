import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SearchLoansInputSchema } from '../types/loans';
import { LoanAggregateController } from '../controllers/loan.aggregate.controller';

/**
 * Register Loan Aggregation Tools - Context7 Pattern
 * Clean separation: registration here, handlers in controller
 * Using static method approach for memory efficiency
 */
export function registerLoanAggregationTools(server: McpServer): void {
  server.registerTool(
    'search_loans',
    {
      title: 'Kredi Ara',
      description: 'Konut Kredisi, Taşıt Kredisi veya İhtiyaç Kredisi ara',
      inputSchema: SearchLoansInputSchema,
    },
    LoanAggregateController.handleSearchLoans,
  );

  console.error('✅ Loan aggregation tools registered successfully');
}
