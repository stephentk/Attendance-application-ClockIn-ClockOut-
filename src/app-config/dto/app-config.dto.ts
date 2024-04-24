import { PaginationDto } from '@app/my-library/dto/pagination.dto';

export class AppConfigDto {
  id?: string;
  isIdentityPassAvailable: boolean;
  isDojahAvailable: boolean;
  source: string;
  isAirtimeAvailable: boolean;
  isCableAvailable: boolean;
  isDataBundleAvailable: boolean;
  isElectricityAvailable: boolean;
  isLoginAvailable: boolean;
  isMobileMoneyAvailable: boolean;
  qualAmountNgn: number;
  qualAmountGhs: number;
  qualAmountKes: number;
  bonusAmountNgn: number;
  bonusAmountNGhs: number;
  bonusAmountKes: number;
  ngnWithdrawalCharges: number;
  ghsWithdrawalCharges: number;
  cardFundingCharges: number;
  virtualCardCreationChargesInKobo: number;
  virtualCardCreationChargesInGhs: number;
  virtualCardCreationChargesInGbp: number;
  virtualCardCreationChargesInZmw: number;
  platinumMembershipMonthly: number;
  virtualCardCreationChargesInUsd: number;
  platinumMembershipYearly: number;
  businessMembershipMonthly: number;
  businessMembershipYearly: number;
  eb2niwOneOnDemand: number;
  eb2niwOneOnDemandImage: string;
  eb2niwAi: number;
  eb2niwAiImage: string;
  ngnToGbpConversionRate: number;
  ngnToGhsConversionRate: number;
  ngnReferrerAmount: number;
  ghsReferrerAmount: number;
  usdReferrerAmount: number;
  gbpReferrerAmount: number;
  zmwReferrerAmount: number;
}

export class AppConfigSearchDto extends PaginationDto {
  id?: string;
  isIdentityPassAvailable: boolean;
  isDojahAvailable: boolean;
  source: string;
  isAirtimeAvailable: boolean;
  isCableAvailable: boolean;
  isDataBundleAvailable: boolean;
  isElectricityAvailable: boolean;
  isLoginAvailable: boolean;
  isMobileMoneyAvailable: boolean;
  qualAmountNgn: number;
  qualAmountGhs: number;
  qualAmountKes: number;
  bonusAmountNgn: number;
  bonusAmountNGhs: number;
  bonusAmountKes: number;
  ngnWithdrawalCharges: number;
  ghsWithdrawalCharges: number;
  cardFundingCharges: number;
  virtualCardCreationChargesInKobo: number;
  virtualCardCreationChargesInGhs: number;
  virtualCardCreationChargesInGbp: number;
  virtualCardCreationChargesInZmw: number;
  platinumMembershipMonthly: number;
  virtualCardCreationChargesInUsd: number;
  platinumMembershipYearly: number;
  businessMembershipMonthly: number;
  businessMembershipYearly: number;
  eb2niwOneOnDemand: number;
  eb2niwOneOnDemandImage: string;
  eb2niwAi: number;
  eb2niwAiImage: string;
  ngnToGbpConversionRate: number;
  ngnToGhsConversionRate: number;
  ngnReferrerAmount: number;
  ghsReferrerAmount: number;
  usdReferrerAmount: number;
  gbpReferrerAmount: number;
  zmwReferrerAmount: number;
}