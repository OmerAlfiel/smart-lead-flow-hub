// server/src/modules/analytics/dto/lead-summary.dto.ts
export class LeadStatusSummaryDto {
  status: string;
  count: number;
}

export class LeadSummaryDto {
  totalLeads: number;
  leadsByStatus: LeadStatusSummaryDto[];
}