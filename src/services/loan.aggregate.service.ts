import { ParsedQuery } from '../types/service';
import { makeHttpsRequest } from '../utils/httpRequest';
import { Logger } from '../utils/logger';

export class LoanAggregateService {
  constructor() {}

  async searchLoansService(parseResult: ParsedQuery): Promise<any> {
    try {
      // External API'ye GET isteği gönder
      let apiUrl = '';
      switch (parseResult.params?.type) {
        case 'ihtiyac':
          apiUrl = `${process.env.GATEWAY_API_CONSUMERLOAN_LIST}?Amount=${parseResult.params.amount}&Maturity=${parseResult.params.termMonths}`;
          break;
        case 'konut':
          apiUrl = `${process.env.GATEWAY_API_HOUSINGLOAN_LIST}?Amount=${parseResult.params.amount}&Maturity=${parseResult.params.termMonths}`;
          break;
        case 'tasit':
          apiUrl = `${process.env.GATEWAY_API_VEHICLELOAN_LIST}?Amount=${parseResult.params.amount}&Maturity=${parseResult.params.termMonths}`;
          break;
        default:
          throw new Error('Geçersiz kredi türü');
      }

      Logger.debug(`API isteği gönderiliyor: ${apiUrl}`);

      // Use https module instead of fetch to handle self-signed certificates
      const data = await makeHttpsRequest(apiUrl);
      const apiResponse = JSON.parse(data);
      return apiResponse;
    } catch (error) {
      Logger.error('Kredi arama işleminde hata oluştu', error);
      throw error;
    }
  }
}
