import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../data/i18n.dart';
import '../../data/store.dart';
import '../../theme/brand.dart';
import '../../widgets/glass.dart';

class GuidesScreen extends ConsumerStatefulWidget {
  const GuidesScreen({super.key, this.initialQuery = ''});
  final String initialQuery;
  @override
  ConsumerState<GuidesScreen> createState() => _GuidesScreenState();
}

class _GuidesScreenState extends ConsumerState<GuidesScreen> {
  late String query = widget.initialQuery;
  int difficulty = 0;

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(appStoreProvider);
    final t = context.i18n;
    if (!state.ready) return const Center(child: CircularProgressIndicator());

    var list = [...state.guides];
    if (query.isNotEmpty) {
      final q = query.toLowerCase();
      list = list.where((g) => g.name.toLowerCase().contains(q) || g.domain.toLowerCase().contains(q)).toList();
    }
    if (difficulty != 0) list = list.where((g) => g.difficulty == difficulty).toList();
    list.sort((a, b) {
      final sa = (a.verified ? 1000 : 0) + a.votesWorks - a.votesBroken * 2;
      final sb = (b.verified ? 1000 : 0) + b.votesWorks - b.votesBroken * 2;
      return sb.compareTo(sa);
    });

    final labels = {0: t.t('all'), 1: t.t('easy'), 2: t.t('medium'), 3: t.t('hard'), 4: t.t('veryHard')};

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 120),
        children: [
          Text(t.t('cancelAnything'), style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
          Text(t.t('cancelSubtitle'), style: TextStyle(color: Colors.grey.shade600)),
          const SizedBox(height: 12),
          Glass(
            padding: const EdgeInsets.all(14),
            child: Row(
              children: [
                const Icon(Icons.verified_user_rounded, color: Color(0xFF7EAB00)),
                const SizedBox(width: 10),
                Expanded(child: Text(t.t('cancelIntro'), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13))),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Glass(
            borderRadius: 20,
            padding: const EdgeInsets.symmetric(horizontal: 14),
            child: TextField(
              controller: TextEditingController(text: query)
                ..selection = TextSelection.collapsed(offset: query.length),
              decoration: InputDecoration(hintText: t.t('searchGuides'), border: InputBorder.none, icon: const Icon(Icons.search)),
              onChanged: (v) => setState(() => query = v),
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 36,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [0, 1, 2, 3, 4]
                  .map((d) => Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ChoiceChip(
                          label: Text(labels[d]!),
                          selected: difficulty == d,
                          onSelected: (_) => setState(() => difficulty = d),
                        ),
                      ))
                  .toList(),
            ),
          ),
          const SizedBox(height: 8),
          Text('${list.length} guides', style: TextStyle(color: Colors.grey.shade600, fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          ...list.map((g) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Glass(
                  padding: const EdgeInsets.all(14),
                  onTap: () => context.push('/guides/${g.id}'),
                  child: Row(
                    children: [
                      LogoTile(name: g.name, color: g.color, serviceId: g.id),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(children: [
                              Flexible(child: Text(g.name, style: const TextStyle(fontWeight: FontWeight.w700))),
                              if (g.verified) ...[
                                const SizedBox(width: 6),
                                const Icon(Icons.check_circle, size: 16, color: BubColors.lime),
                              ],
                              if (state.settings.priceHikeFlags[g.id] == true) ...[
                                const SizedBox(width: 6),
                                const Icon(Icons.trending_up_rounded, size: 16, color: BubColors.pink),
                              ],
                            ]),
                            Text('${labels[g.difficulty]} · ~${g.estMinutes} min · 👍 ${g.votesWorks}',
                                style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
                          ],
                        ),
                      ),
                      const Icon(Icons.chevron_right_rounded, color: Colors.grey),
                    ],
                  ),
                ),
              )),
          const SizedBox(height: 8),
          Text(t.t('legalDisclaimer'), textAlign: TextAlign.center, style: TextStyle(fontSize: 11, color: Colors.grey.shade500)),
        ],
      ),
    );
  }
}
