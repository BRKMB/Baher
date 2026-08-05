import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/dates.dart';
import '../../data/i18n.dart';
import '../../data/money.dart';
import '../../data/store.dart';
import '../../theme/brand.dart';
import '../../widgets/glass.dart';

class AnalyticsScreen extends ConsumerWidget {
  const AnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appStoreProvider);
    final t = context.i18n;
    if (!state.ready) return const Center(child: CircularProgressIndicator());
    final currency = state.settings.currency;
    final active = state.subscriptions.where(isCounted).toList();
    final monthly = totalMonthly(state.subscriptions, currency);
    final byCat = <String, double>{};
    for (final s in active) {
      byCat[s.category] = (byCat[s.category] ?? 0) + monthlyCost(s, currency);
    }
    final cats = byCat.entries.toList()..sort((a, b) => b.value.compareTo(a.value));
    final top = [...active]..sort((a, b) => monthlyCost(b, currency).compareTo(monthlyCost(a, currency)));
    final upcoming = active
        .map((s) => (s: s, d: daysUntil(effectiveNextRenewal(s))))
        .where((e) => e.d >= 0 && e.d <= 30)
        .toList()
      ..sort((a, b) => a.d.compareTo(b.d));
    final entertainment = byCat['entertainment'] ?? byCat['video'] ?? byCat['music'] ?? 0;
    final pct = monthly <= 0 ? 0 : ((entertainment / monthly) * 100).clamp(40, 85).round();

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 120),
        children: [
          Text(t.t('spending'), style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
          Text(t.t('spendingSubtitle'), style: TextStyle(color: Colors.grey.shade600)),
          const SizedBox(height: 14),
          Row(children: [
            Expanded(child: Glass(padding: const EdgeInsets.all(16), child: _Mini(label: t.t('monthlySpend'), value: formatMoney(monthly, currency)))),
            const SizedBox(width: 10),
            Expanded(child: Glass(padding: const EdgeInsets.all(16), child: _Mini(label: t.t('yearly'), value: formatMoney(monthly * 12, currency)))),
          ]),
          const SizedBox(height: 16),
          Text(t.t('insights').toUpperCase(), style: TextStyle(fontWeight: FontWeight.w700, color: Colors.grey.shade600)),
          const SizedBox(height: 8),
          Glass(
            padding: const EdgeInsets.all(14),
            child: Text(
              t.t('benchmarkInsight', {'pct': '$pct', 'category': cats.isEmpty ? 'subscriptions' : cats.first.key}),
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
          ),
          if (active.any((s) => s.isTrial)) ...[
            const SizedBox(height: 8),
            Glass(
              padding: const EdgeInsets.all(14),
              child: Text(t.t('cancelBeforeCharge'), style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.orange)),
            ),
          ],
          const SizedBox(height: 16),
          Text(t.t('byCategory').toUpperCase(), style: TextStyle(fontWeight: FontWeight.w700, color: Colors.grey.shade600)),
          const SizedBox(height: 8),
          Glass(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                for (final e in cats)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Row(children: [
                        Text(e.key, style: const TextStyle(fontWeight: FontWeight.w700)),
                        const Spacer(),
                        Text(formatMoney(e.value, currency), style: const TextStyle(fontWeight: FontWeight.w800)),
                      ]),
                      const SizedBox(height: 6),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(99),
                        child: LinearProgressIndicator(
                          value: cats.first.value == 0 ? 0 : e.value / cats.first.value,
                          minHeight: 8,
                          color: BubColors.lime,
                          backgroundColor: Colors.black12,
                        ),
                      ),
                    ]),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Text(t.t('mostExpensive').toUpperCase(), style: TextStyle(fontWeight: FontWeight.w700, color: Colors.grey.shade600)),
          const SizedBox(height: 8),
          ...top.take(5).map((s) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Glass(
                  padding: const EdgeInsets.all(12),
                  child: Row(children: [
                    LogoTile(name: s.name, color: s.color, serviceId: s.serviceId, size: 36),
                    const SizedBox(width: 10),
                    Expanded(child: Text(s.name, style: const TextStyle(fontWeight: FontWeight.w700))),
                    Text(formatMoney(monthlyCost(s, currency), currency), style: const TextStyle(fontWeight: FontWeight.w800)),
                  ]),
                ),
              )),
          const SizedBox(height: 16),
          Text(t.t('upcomingCharges').toUpperCase(), style: TextStyle(fontWeight: FontWeight.w700, color: Colors.grey.shade600)),
          const SizedBox(height: 8),
          ...upcoming.map((e) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Glass(
                  padding: const EdgeInsets.all(12),
                  child: Row(children: [
                    SizedBox(width: 42, child: Text('${e.d}d', style: const TextStyle(fontWeight: FontWeight.w800))),
                    Expanded(child: Text(e.s.name, style: const TextStyle(fontWeight: FontWeight.w700))),
                    Text(formatMoney(monthlyCost(e.s, currency), currency), style: const TextStyle(fontWeight: FontWeight.w800)),
                  ]),
                ),
              )),
        ],
      ),
    );
  }
}

class _Mini extends StatelessWidget {
  const _Mini({required this.label, required this.value});
  final String label;
  final String value;
  @override
  Widget build(BuildContext context) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(label.toUpperCase(), style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.grey.shade600)),
        Text(value, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
      ]);
}
