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

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});
  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  String query = '';
  String category = 'all';

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(appStoreProvider);
    final t = context.i18n;
    if (!state.ready) return const Center(child: CircularProgressIndicator());

    final currency = state.settings.currency;
    final monthly = totalMonthly(state.subscriptions, currency);
    final yearly = monthly * 12;
    final active = state.subscriptions.where(isCounted).length;
    final saved = state.subscriptions
        .where((s) => s.status == SubStatus.cancelled)
        .fold(0.0, (a, s) => a + monthlyCost(s, currency) * 12);

    var list = state.subscriptions.where((s) => s.status != SubStatus.cancelled).toList();
    if (query.isNotEmpty) list = list.where((s) => s.name.toLowerCase().contains(query.toLowerCase())).toList();
    if (category != 'all') list = list.where((s) => s.category == category).toList();
    list.sort((a, b) => daysUntil(effectiveNextRenewal(a)).compareTo(daysUntil(effectiveNextRenewal(b))));
    final cancelled = state.subscriptions.where((s) => s.status == SubStatus.cancelled).toList();
    final cats = state.subscriptions.where((s) => s.status != SubStatus.cancelled).map((s) => s.category).toSet().toList();
    final trials = list.where((s) => s.isTrial && s.trialEndsAt != null && daysUntil(s.trialEndsAt!) <= 7 && daysUntil(s.trialEndsAt!) >= 0);

    final dark = Theme.of(context).brightness == Brightness.dark;
    final muted = bubMuted(context);

    return Container(
      decoration: BoxDecoration(
        gradient: RadialGradient(
          center: const Alignment(-0.9, -1.1),
          radius: 1.4,
          colors: dark
              ? [BubColors.lime.withValues(alpha: 0.10), BubColors.blue.withValues(alpha: 0.06), Colors.transparent]
              : [BubColors.lime.withValues(alpha: 0.16), BubColors.pink.withValues(alpha: 0.06), Colors.transparent],
        ),
      ),
      child: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 120),
          children: [
            Row(
              children: [
                const BrandHeaderMark(),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(t.t('tagline').toUpperCase(),
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: muted, letterSpacing: 2)),
                      Text.rich(TextSpan(children: [
                        TextSpan(
                            text: 'BUB ',
                            style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Theme.of(context).colorScheme.onSurface)),
                        TextSpan(
                          text: 'SUB',
                          style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: bubAccentOn(context)),
                        ),
                      ])),
                    ],
                  ),
                ),
                IconButton.filledTonal(
                  onPressed: () => context.push('/settings'),
                  icon: const Icon(Icons.settings_rounded),
                ),
              ],
            ),
            const SizedBox(height: 18),
            // Hero spend card — black leather + neon glow.
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(28),
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFF121520), Color(0xFF0A0B10)],
                ),
                border: Border.all(color: BubColors.lime.withValues(alpha: 0.35)),
                boxShadow: [
                  BoxShadow(color: BubColors.lime.withValues(alpha: 0.18), blurRadius: 44, spreadRadius: -8, offset: const Offset(0, 14)),
                  BoxShadow(color: Colors.black.withValues(alpha: 0.5), blurRadius: 24, offset: const Offset(0, 12)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(width: 8, height: 8, decoration: const BoxDecoration(color: BubColors.lime, shape: BoxShape.circle)),
                      const SizedBox(width: 8),
                      Text(t.t('monthlySpend').toUpperCase(),
                          style: const TextStyle(color: Color(0xFF8E97AB), fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1.8)),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    formatMoney(monthly, currency),
                    style: const TextStyle(color: Colors.white, fontSize: 46, fontWeight: FontWeight.w900, height: 1, letterSpacing: -1),
                  ),
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      _Stat(label: t.t('yearly'), value: formatMoney(yearly, currency)),
                      _Stat(label: t.t('active'), value: '$active'),
                      if (saved > 0) _Stat(label: t.t('savedYear'), value: formatMoney(saved, currency), accent: true),
                    ],
                  ),
                ],
              ),
            ),
            for (final s in trials) ...[
              const SizedBox(height: 12),
              Glass(
                padding: const EdgeInsets.all(14),
                glow: BubColors.pink,
                onTap: () => context.push('/subs/${s.id}'),
                child: Row(
                  children: [
                    const Icon(Icons.timer_outlined, color: BubColors.pink),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        t.t('trialEndsIn', {'name': s.name, 'days': '${daysUntil(s.trialEndsAt!)}'}),
                        style: const TextStyle(fontWeight: FontWeight.w700),
                      ),
                    ),
                    LogoTile(name: s.name, color: s.color, serviceId: s.serviceId, size: 36),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 16),
            Glass(
              borderRadius: 18,
              padding: const EdgeInsets.symmetric(horizontal: 14),
              child: TextField(
                decoration: InputDecoration(
                  hintText: t.t('searchSubscriptions'),
                  border: InputBorder.none,
                  icon: Icon(Icons.search_rounded, color: muted),
                ),
                onChanged: (v) => setState(() => query = v),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 38,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  _Chip(label: t.t('all'), selected: category == 'all', onTap: () => setState(() => category = 'all')),
                  ...cats.map((c) => _Chip(label: c, selected: category == c, onTap: () => setState(() => category = category == c ? 'all' : c))),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Text(t.t('yourSubscriptions').toUpperCase(), style: bubSectionTitle(context)),
            const SizedBox(height: 10),
            ...list.map((s) => Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Glass(
                    padding: const EdgeInsets.all(14),
                    onTap: () => context.push('/subs/${s.id}'),
                    child: Row(
                      children: [
                        LogoTile(name: s.name, color: s.color, serviceId: s.serviceId),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(s.name, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
                              const SizedBox(height: 2),
                              Text(
                                '${s.category} · ${s.isTrial ? 'trial ends' : 'renews'} ${relativeLabel(s.isTrial && s.trialEndsAt != null ? s.trialEndsAt! : effectiveNextRenewal(s))}',
                                style: TextStyle(color: muted, fontSize: 12, fontWeight: FontWeight.w600),
                              ),
                            ],
                          ),
                        ),
                        Text(formatMoney(monthlyCost(s, currency), currency),
                            style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15)),
                      ],
                    ),
                  ),
                )),
            if (cancelled.isNotEmpty) ...[
              const SizedBox(height: 12),
              Text(t.t('cancelled').toUpperCase(), style: bubSectionTitle(context)),
              const SizedBox(height: 10),
              ...cancelled.map((s) => Opacity(
                    opacity: 0.6,
                    child: Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: Glass(
                        padding: const EdgeInsets.all(14),
                        onTap: () => context.push('/subs/${s.id}'),
                        child: Row(children: [
                          LogoTile(name: s.name, color: s.color, serviceId: s.serviceId),
                          const SizedBox(width: 12),
                          Text(s.name, style: const TextStyle(fontWeight: FontWeight.w700)),
                        ]),
                      ),
                    ),
                  )),
            ],
          ],
        ),
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  const _Stat({required this.label, required this.value, this.accent = false});
  final String label;
  final String value;
  final bool accent;
  @override
  Widget build(BuildContext context) => Expanded(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label.toUpperCase(),
                style: TextStyle(
                    color: accent ? BubColors.lime : const Color(0xFF8E97AB),
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1)),
            const SizedBox(height: 3),
            Text(value,
                style: TextStyle(
                    color: accent ? BubColors.lime : Colors.white, fontWeight: FontWeight.w800, fontSize: 15)),
          ],
        ),
      );
}

class _Chip extends StatelessWidget {
  const _Chip({required this.label, required this.selected, required this.onTap});
  final String label;
  final bool selected;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(right: 8),
        child: ChoiceChip(label: Text(label), selected: selected, onSelected: (_) => onTap()),
      );
}
