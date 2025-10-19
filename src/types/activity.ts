export interface ActivityLog {
  id: string;
  table_name: string;
  operation: string;
  record_id: string;
  changed_data?: Record<string, any>;
  performed_by?: string;
  performed_at: string;
}
