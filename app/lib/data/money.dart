import 'models.dart';

const usdRates = {
  'USD': 1.0,
  'EUR': 0.92,
  'GBP': 0.79,
  'EGP': 48.5,
  'PLN': 3.95,
  'SAR': 3.75,
  'AED': 3.67,
  'KWD': 0.31,
  'QAR': 3.64,
  'TRY': 34.5,
  'INR': 84.0,
  'CAD': 1.38,
  'AUD': 1.52,
  'JPY': 152.0,
};

double convert(double amount, String from, String to) {
  if (from == to) return amount;
  final fromRate = usdRates[from] ?? 1;
  final toRate = usdRates[to] ?? 1;
  return (amount / fromRate) * toRate;
}

double monthlyCost(Subscription s, String display) {
  final factor = switch (s.cycle) {
    BillingCycle.weekly => 52 / 12,
    BillingCycle.monthly => 1.0,
    BillingCycle.quarterly => 1 / 3,
    BillingCycle.yearly => 1 / 12,
  };
  return convert(s.price * factor, s.currency, display);
}

bool isCounted(Subscription s) => s.status == SubStatus.active || s.status == SubStatus.trial;

double totalMonthly(List<Subscription> list, String display) =>
    list.where(isCounted).fold(0.0, (a, s) => a + monthlyCost(s, display));

String formatMoney(double amount, String currency) {
  final symbols = {
    'USD': '\$',
    'EUR': '€',
    'GBP': '£',
    'EGP': 'E£',
    'PLN': 'zł',
    'SAR': 'SR',
    'AED': 'AED',
    'KWD': 'KD',
    'QAR': 'QR',
    'TRY': '₺',
    'INR': '₹',
    'CAD': 'C\$',
    'AUD': 'A\$',
    'JPY': '¥',
  };
  final sym = symbols[currency] ?? '$currency ';
  // Always show cents for money clarity (avoids "$15" looking rounded/broken).
  return '$sym${amount.toStringAsFixed(2)}';
}
