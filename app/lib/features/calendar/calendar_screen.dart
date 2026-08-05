import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../data/dates.dart';
import '../../data/i18n.dart';
import '../../data/money.dart';
import '../../data/store.dart';
import '../../widgets/glass.dart';

class CalendarScreen extends ConsumerStatefulWidget {
  const CalendarScreen({super.key});
  @override
  ConsumerState<CalendarScreen> createState() => _CalendarScreenState();
}

class _CalendarScreenState extends ConsumerState<CalendarScreen> {
  late DateTime cursor = DateTime(DateTime.now().year, DateTime.now().month);

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(appStoreProvider);
    final t = context.i18n;
    if (!state.ready) return const Center(child: CircularProgressIndicator());

    final daysInMonth = DateTime(cursor.year, cursor.month + 1, 0).day;
    final firstDow = DateTime(cursor.year, cursor.month, 1).weekday % 7; // Sunday=0
    final events = <String, List<({String id, String name, String color, String? serviceId})>>{};
    for (final s in state.subscriptions.where(isCounted)) {
      final date = effectiveNextRenewal(s);
      final d = parseIso(date);
      if (d.year == cursor.year && d.month == cursor.month) {
        events.putIfAbsent(date, () => []).add((id: s.id, name: s.name, color: s.color, serviceId: s.serviceId));
      }
      if (s.isTrial && s.trialEndsAt != null) {
        final td = parseIso(s.trialEndsAt!);
        if (td.year == cursor.year && td.month == cursor.month) {
          events.putIfAbsent(s.trialEndsAt!, () => []).add((id: s.id, name: s.name, color: s.color, serviceId: s.serviceId));
        }
      }
    }

    final monthEvents = events.entries.toList()..sort((a, b) => a.key.compareTo(b.key));

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 120),
        children: [
          Text(t.t('calendarTitle'), style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
          Text(t.t('calendarSubtitle'), style: TextStyle(color: Colors.grey.shade600)),
          const SizedBox(height: 14),
          Glass(
            padding: const EdgeInsets.all(14),
            child: Column(
              children: [
                Row(
                  children: [
                    IconButton(onPressed: () => setState(() => cursor = DateTime(cursor.year, cursor.month - 1)), icon: const Icon(Icons.chevron_left)),
                    Expanded(child: Text('${_monthName(cursor.month)} ${cursor.year}', textAlign: TextAlign.center, style: const TextStyle(fontWeight: FontWeight.w800))),
                    IconButton(onPressed: () => setState(() => cursor = DateTime(cursor.year, cursor.month + 1)), icon: const Icon(Icons.chevron_right)),
                  ],
                ),
                Row(
                  children: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                      .map((d) => Expanded(child: Center(child: Text(d, style: TextStyle(fontWeight: FontWeight.w700, color: Colors.grey.shade500, fontSize: 11)))))
                      .toList(),
                ),
                const SizedBox(height: 6),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: firstDow + daysInMonth,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 7, mainAxisExtent: 44),
                  itemBuilder: (_, i) {
                    if (i < firstDow) return const SizedBox.shrink();
                    final day = i - firstDow + 1;
                    final iso = toIso(DateTime(cursor.year, cursor.month, day));
                    final has = events.containsKey(iso);
                    final isToday = iso == todayIso();
                    return Container(
                      margin: const EdgeInsets.all(2),
                      decoration: BoxDecoration(
                        color: isToday ? const Color(0xFFC8FF00).withValues(alpha: 0.25) : null,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                        Text('$day', style: TextStyle(fontWeight: FontWeight.w700, color: isToday ? const Color(0xFF5F8000) : null)),
                        if (has) Container(width: 5, height: 5, decoration: const BoxDecoration(color: Color(0xFF7EAB00), shape: BoxShape.circle)),
                      ]),
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Text(t.t('thisMonth').toUpperCase(), style: TextStyle(fontWeight: FontWeight.w700, color: Colors.grey.shade600)),
          const SizedBox(height: 8),
          if (monthEvents.isEmpty) Text(t.t('nothingHere')),
          ...monthEvents.expand((e) => e.value.map((item) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Glass(
                  padding: const EdgeInsets.all(12),
                  onTap: () => context.push('/subs/${item.id}'),
                  child: Row(children: [
                    SizedBox(width: 40, child: Text(e.key.substring(8), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18))),
                    LogoTile(name: item.name, color: item.color, serviceId: item.serviceId, size: 36),
                    const SizedBox(width: 10),
                    Expanded(child: Text(item.name, style: const TextStyle(fontWeight: FontWeight.w700))),
                  ]),
                ),
              ))),
        ],
      ),
    );
  }

  String _monthName(int m) => const [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ][m - 1];
}
