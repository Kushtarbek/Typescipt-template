export interface PoshmarkSetting {
  weekday_send_limit: number;
  weekend_send_limit: number;
  inventory_wait_time_trashold_days: number;
  discounts: {
    tier1_percent: number;
    tier2_percent: number;
  };
  repeat_offer_trashold_days: number;
  accounts_to_follow: string;
  follow_limits_per_round: number;
}

export interface MercariSetting {
  weekday_send_limit: number;
  weekend_send_limit: number;
  inventory_wait_time_trashold_days: number;
  discounts: {
    tier1_percent: number;
    tier2_percent: number;
  };
  repeat_offer_trashold_days: number;
  discount_rate_for_smart_pricing: number;
}

export interface TradesySetting {
  accounts_to_follow: string;
  follow_limits_per_round: number;
}
interface purcasing_accounts {
  username: string;
  password: string;
  auth_and_auth_token: string;
}
export interface EbaySetting {
  message: string;
  weekday_send_limit: number;
  weekend_send_limit: number;
  discounts: {
    tier1_percent: number;
    tier2_percent: number;
  };
}
