import { GeminiService } from '../services/gemini.service';
import { LoanDetail, LoanSearchResult, LoanType } from '../types/loans';
import { ToolResponse } from '../types/tools';
import { makeHttpsRequest } from '../utils/httpRequest';
import { Logger } from '../utils/logger';
import { LoanDataService } from '../../data/loan-data-service';
import { LoanAggregateService } from '../services/loan.aggregate.service';
import { formatCurrency } from '../utils/helpers';

export class LoanAggregateController {
  private static instance: LoanAggregateController | null = null;
  private aiService: GeminiService;
  private loanDataService: LoanDataService;
  private loanAggregateService: LoanAggregateService;

  private constructor() {
    // Gemini API key'i environment'dan al - static method'da kontrol ediliyor
    const geminiApiKey = process.env.GEMINI_API_KEY || 'dummyKey';
    if (!geminiApiKey) {
      Logger.error('❌ GEMINI_API_KEY environment variable gerekli!');
      Logger.error('Kullanım: GEMINI_API_KEY=your_key_here npm start');
      process.exit(1);
    }
    Logger.info('Gemini API key:', geminiApiKey.substring(0, 5) + '...');

    // Context7 Pattern: Use singleton services for resource optimization
    this.aiService = GeminiService.getInstance(geminiApiKey);
    this.loanDataService = LoanDataService.getInstance();
    this.loanAggregateService = new LoanAggregateService(); // Stateless, no singleton needed
  }

  /**
   * Singleton Instance Getter - Context7 Pattern
   * Ensures only one instance exists for resource efficiency
   */
  private static getInstance(): LoanAggregateController {
    if (!LoanAggregateController.instance) {
      LoanAggregateController.instance = new LoanAggregateController();
    }
    return LoanAggregateController.instance;
  }

  /**
   * Static Handler for Search Loans Tool - Context7 Pattern
   * Tool handler layer with singleton instance access
   */
  static async handleSearchLoans({ query }: { query: string }): Promise<ToolResponse> {
    try {
      Logger.query(`Kredi sorgusu alındı`, { query });

      const instance = LoanAggregateController.getInstance();
      const result = await instance.searchLoans(query);
      const formattedResult = instance.formatSearchResult(result);

      Logger.tool('search_loans', { query }, `${result.totalFound} kredi bulundu`);

      return {
        content: [
          {
            type: 'text',
            text: formattedResult,
          },
        ],
      };
    } catch (error) {
      Logger.error('Search loans tool error:', error);
      return {
        content: [
          {
            type: 'text',
            text: "Tool handler'da beklenmeyen hata oluştu",
          },
        ],
      };
    }
  }

  // Ana kredi arama fonksiyonu
  async searchLoans(query: string): Promise<LoanSearchResult> {
    Logger.debug(`Kredi sorgusu işleniyor: "${query}"`);

    // AI ile sorguyu parse et
    const parseResult = await this.aiService.loansParseQuery(query);

    if (!parseResult.success || !parseResult.params) {
      Logger.warn(`Sorgu parse edilemedi: ${parseResult.error}`);
      return {
        query,
        parsedParams: { type: 'ihtiyac' as any, amount: 0, termMonths: 0, inventory: 'ihtiyaç - 100000', cash: 0 },
        loans: [],
        totalFound: 0,
      };
    }

    Logger.debug('Parse edilen parametreler:', parseResult.params);

    try {
      const apiResponse = await this.loanAggregateService.searchLoansService(parseResult);

      Logger.debug(`API yanıtı alındı: ${apiResponse.products?.length || 0} ürün bulundu`);

      // Products array'ini LoanDetail formatına dönüştür
      const loans = this.transformProductsToLoans(apiResponse.products || [], parseResult.params.type);

      Logger.info(`Kredi arama tamamlandı: ${loans.length} kredi bulundu`);

      return {
        query,
        parsedParams: parseResult.params,
        loans,
        totalFound: loans.length,
      };
    } catch (error) {
      Logger.error('API isteği sırasında hata:', error);
      // Hata durumunda boş sonuç döndür
      return {
        query,
        parsedParams: parseResult.params,
        loans: [],
        totalFound: 0,
      };
    }
  }

  // API response'daki products'ı LoanDetail formatına dönüştür
  private transformProductsToLoans(products: any[], loanType: LoanType): LoanDetail[] {
    return products
      .map((product, index) => {
        const loanDetail: LoanDetail = {
          id: product.id?.toString() || `loan-${index}`,
          bankName: product.bank?.name || 'Bilinmeyen Banka',
          type: loanType,
          interestRate: product.interestRate || 0,
          monthlyPayment: product.monthlyInstallment || 0,
          totalPayment: product.totalAmount || 0,
          minAmount: product.amount || 0,
          maxAmount: product.amount || 0,
          maxTermMonths: product.maturity || 0,
          eligibilityNote: product.loanRateText || product.name || 'Detaylı bilgi için bankaya başvurunuz',
        };
        return loanDetail;
      })
      .sort((a, b) => a.interestRate - b.interestRate); // Faiz oranına göre sırala
  }

  // Sonuçları formatla
  formatSearchResult(result: LoanSearchResult): string {
    if (result.totalFound === 0) {
      return `❌ **Sonuç Bulunamadı**

Aradığınız kriterlere uygun kredi bulunamadı.

**Arama Kriterleri:**
- Kredi Türü: ${this.loanDataService.getLoanTypeDisplayName(result.parsedParams.type)}
- Tutar: ${formatCurrency(result.parsedParams.amount)}
- Vade: ${result.parsedParams.termMonths} ay
- Envanter: ${result.parsedParams.inventory}
- Nakit: ${formatCurrency(result.parsedParams.cash)}

Lütfen farklı kriterlerle tekrar deneyin.`;
    }

    let output = `✅ **${result.totalFound} Kredi Bulundu**

**Arama Kriterleri:**
- Kredi Türü: ${this.loanDataService.getLoanTypeDisplayName(result.parsedParams.type)}
- Tutar: ${formatCurrency(result.parsedParams.amount)}
- Vade: ${result.parsedParams.termMonths} ay
- Envanter: ${result.parsedParams.inventory}
- Nakit: ${formatCurrency(result.parsedParams.cash)}
---

**Bulunan Krediler:**

`;

    result.loans.forEach((loan, index) => {
      output += `**${index + 1}. ${loan.bankName}**
🏦 Banka: ${loan.bankName}
📊 Faiz Oranı: %${loan.interestRate}
💰 Aylık Ödeme: ${formatCurrency(loan.monthlyPayment)}
💳 Toplam Ödeme: ${formatCurrency(loan.totalPayment)}
ℹ️ ${loan.eligibilityNote}

`;
    });

    output += `
💡 **Not:** Faiz oranları değişkenlik gösterebilir. Güncel bilgiler için ilgili bankaya başvurunuz.`;

    return output;
  }
}
