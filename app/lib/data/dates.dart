import 'models.dart';

String todayIso() {
  final n = DateTime.now();
  return '${n.year.toString().padLeft(4, '0')}-${n.month.toString().padLeft(2, '0')}-${n.day.toString().padLeft(2, '0')}';
}

DateTime parseIso(String iso) {
  final p = iso.split('-').map(int.parse).toList();
  return DateTime(p[0], p[1], p[2]);
}

String toIso(DateTime d) =>
    '${d.year.toString().padLeft(4, '0')}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

String addDays(String iso, int days) => toIso(parseIso(iso).add(Duration(days: days)));

String addCycle(String iso, BillingCycle cycle) {
  final d = parseIso(iso);
  return toIso(switch (cycle) {
    BillingCycle.weekly => d.add(const Duration(days: 7)),
    BillingCycle.monthly => DateTime(d.year, d.month + 1, d.day),
    BillingCycle.quarterly => DateTime(d.year, d.month + 3, d.day),
    BillingCycle.yearly => DateTime(d.year + 1, d.month, d.day),
  });
}

int daysUntil(String iso) {
  final target = parseIso(iso);
  final now = parseIso(todayIso());
  return target.difference(now).inDays;
}

String effectiveNextRenewal(Subscription s) {
  if (s.status == SubStatus.cancelled) return s.nextRenewal;
  var date = s.nextRenewal;
  var guard = 0;
  while (daysUntil(date) < 0 && guard < 600) {
    date = addCycle(date, s.cycle);
    guard++;
  }
  return date;
}

String relativeLabel(String iso) {
  final d = daysUntil(iso);
  if (d < 0) return '${d.abs()}d ago';
  if (d == 0) return 'today';
  if (d == 1) return 'tomorrow';
  if (d < 30) return 'in $d days';
  final m = (d / 30).round();
  return m <= 1 ? 'in 1 month' : 'in $m months';
}
