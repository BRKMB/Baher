import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../data/dates.dart';
import '../../data/i18n.dart';
import '../../data/models.dart';
import '../../data/money.dart';
import '../../data/store.dart';
import '../../theme/brand.dart';
import '../../widgets/glass.dart';

class DetailScreen extends ConsumerWidget {
  const DetailScreen({super.key, required this.id});
  final String id;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appStoreProvider);
    final store = ref.read(appStoreProvider.notifier);
    final t = context.i18n;
    final matches = state.subscriptions.where((s) => s.id == id);
    if (matches.isEmpty) {
      return Scaffold(appBar: AppBar(), body: Center(child: Text(t.t('nothingHere'))));
    }
    final sub = matches.first;

    final currency = state.settings.currency;
    final renewal = effectiveNextRenewal(sub);
    final accent = bubAccentOn(context);
    const reminderOptions = [7, 3, 1, 0];

    return Scaffold(
      appBar: AppBar(
        title: Text(sub.name),
        actions: [IconButton(onPressed: () => context.push('/edit/${sub.id}'), icon: const Icon(Icons.edit_rounded))],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 40),
        children: [
          Glass(
            padding: const EdgeInsets.all(22),
            child: Column(children: [
              LogoTile(name: sub.name, color: sub.color, serviceId: sub.serviceId, size: 72),
              const SizedBox(height: 12),
              Text(sub.name, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
              Text(formatMoney(sub.price, sub.currency), style: const TextStyle(fontSize: 34, fontWeight: FontWeight.w800)),
              Text('${formatMoney(monthlyCost(sub, currency), currency)} / mo', style: TextStyle(color: Colors.grey.shade700)),
            ]),
          ),
          const SizedBox(height: 12),
          Glass(
            padding: const EdgeInsets.all(16),
            child: Column(children: [
              _row(t.t('nextRenewal'), '$renewal (${relativeLabel(renewal)})'),
              _row(t.t('billingCycle'), sub.cycle.name),
              _row(t.t('category'), sub.category),
              _row(t.t('autoRenew'), sub.autoRenew ? 'On' : 'Off'),
            ]),
          ),
          const SizedBox(height: 12),
          Text(t.t('reminders').toUpperCase(), style: TextStyle(fontWeight: FontWeight.w700, color: Colors.grey.shade700, letterSpacing: 0.8)),
          const SizedBox(height: 8),
          Glass(
            padding: const EdgeInsets.all(14),
            child: Wrap(
              spacing: 8,
              runSpacing: 8,
              children: reminderOptions.map((d) {
                final selected = sub.remindDaysBefore.contains(d);
                final label = d == 0 ? t.t('remindDayOf') : t.t('remindDaysBefore', {'days': '$d'});
                return FilterChip(
                  selected: selected,
                  label: Text(label),
                  selectedColor: BubColors.lime,
                  checkmarkColor: BubColors.ink,
                  onSelected: (on) {
                    final next = [...sub.remindDaysBefore];
                    if (on) {
                      if (!next.contains(d)) next.add(d);
                    } else {
                      next.remove(d);
                    }
                    next.sort((a, b) => b.compareTo(a));
                    store.updateSubscription(sub.id, (s) => s.copyWith(remindDaysBefore: next));
                  },
                );
              }).toList(),
            ),
          ),
          if (sub.serviceId != null) ...[
            const SizedBox(height: 12),
            FilledButton.tonal(
              onPressed: () => context.push('/guides/${sub.serviceId}'),
              child: Text(t.t('howToCancel', {'name': sub.name})),
            ),
          ],
          const SizedBox(height: 8),
          if (sub.status != SubStatus.cancelled)
            FilledButton(
              style: FilledButton.styleFrom(backgroundColor: Colors.red),
              onPressed: () => store.updateSubscription(
                sub.id,
                (s) => s.copyWith(status: SubStatus.cancelled, autoRenew: false, cancelledAt: todayIso()),
              ),
              child: Text(t.t('markCancelled')),
            ),
          if (sub.status == SubStatus.cancelled)
            FilledButton(
              style: FilledButton.styleFrom(backgroundColor: accent, foregroundColor: Colors.white),
              onPressed: () => store.updateSubscription(
                sub.id,
                (s) => s.copyWith(status: SubStatus.active, autoRenew: true, cancelledAt: null),
              ),
              child: Text(t.t('restoreTracking')),
            ),
          TextButton(
            onPressed: () async {
              await store.deleteSubscription(sub.id);
              if (context.mounted) context.pop();
            },
            child: Text(t.t('delete'), style: const TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  Widget _row(String k, String v) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(children: [
          Expanded(child: Text(k, style: TextStyle(color: Colors.grey.shade700))),
          Text(v, style: const TextStyle(fontWeight: FontWeight.w700)),
        ]),
      );
}
