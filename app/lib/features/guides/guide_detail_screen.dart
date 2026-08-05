import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../data/i18n.dart';
import '../../data/store.dart';
import '../../theme/brand.dart';
import '../../widgets/glass.dart';

class GuideDetailScreen extends ConsumerWidget {
  const GuideDetailScreen({super.key, required this.id});
  final String id;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final store = ref.watch(appStoreProvider.notifier);
    final state = ref.watch(appStoreProvider);
    final t = context.i18n;
    final g = store.guideById(id);
    if (g == null) return Scaffold(appBar: AppBar(), body: Center(child: Text(t.t('nothingHere'))));

    final vote = state.settings.guideVotes[g.id];
    final works = g.votesWorks + (vote == 'works' ? 1 : 0);
    final broken = g.votesBroken + (vote == 'broken' ? 1 : 0);
    final trust = ((works / (works + broken == 0 ? 1 : works + broken)) * 100).round();
    final labels = {1: t.t('easy'), 2: t.t('medium'), 3: t.t('hard'), 4: t.t('veryHard')};

    return Scaffold(
      appBar: AppBar(
        title: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(g.name),
          Text(g.domain, style: TextStyle(fontSize: 12, color: Colors.grey.shade600, fontWeight: FontWeight.w500)),
        ]),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 40),
        children: [
          Glass(
            padding: const EdgeInsets.all(18),
            child: Column(
              children: [
                Row(children: [
                  LogoTile(name: g.name, color: g.color, serviceId: g.id, size: 64),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text('${labels[g.difficulty]} · ~${g.estMinutes} min', style: const TextStyle(fontWeight: FontWeight.w700)),
                      if (g.verified) Text('${t.t('verified')} · ${g.lastVerified}', style: TextStyle(color: bubAccentOn(context), fontWeight: FontWeight.w600)),
                    ]),
                  ),
                ]),
                const SizedBox(height: 14),
                Row(children: [
                  Text(t.t('communityTrust'), style: TextStyle(color: Colors.grey.shade700, fontWeight: FontWeight.w600)),
                  const Spacer(),
                  Text('$trust% ${t.t('works').toLowerCase()}', style: TextStyle(fontWeight: FontWeight.w800, color: bubAccentOn(context))),
                ]),
                const SizedBox(height: 6),
                ClipRRect(
                  borderRadius: BorderRadius.circular(99),
                  child: LinearProgressIndicator(value: trust / 100, minHeight: 7, color: BubColors.lime, backgroundColor: Colors.black12),
                ),
                const SizedBox(height: 14),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton.icon(
                    style: FilledButton.styleFrom(backgroundColor: BubColors.ink, foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(vertical: 14)),
                    onPressed: () => launchUrl(Uri.parse(g.cancelUrl), mode: LaunchMode.externalApplication),
                    icon: const Icon(Icons.open_in_new_rounded),
                    label: Text(t.t('openCancelPage')),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Text(t.t('stepByStep').toUpperCase(), style: TextStyle(fontWeight: FontWeight.w700, color: Colors.grey.shade600, letterSpacing: 0.8)),
          const SizedBox(height: 8),
          Glass(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                for (var i = 0; i < g.steps.length; i++)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      CircleAvatar(radius: 13, backgroundColor: BubColors.lime, child: Text('${i + 1}', style: const TextStyle(color: BubColors.ink, fontWeight: FontWeight.w800, fontSize: 12))),
                      const SizedBox(width: 10),
                      Expanded(child: Text(g.steps[i], style: const TextStyle(fontWeight: FontWeight.w600))),
                    ]),
                  ),
              ],
            ),
          ),
          if (g.issues.isNotEmpty) ...[
            const SizedBox(height: 16),
            Text(t.t('darkPatterns').toUpperCase(), style: TextStyle(fontWeight: FontWeight.w700, color: Colors.grey.shade600)),
            const SizedBox(height: 8),
            ...g.issues.map((issue) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Glass(
                    padding: const EdgeInsets.all(14),
                    child: Row(children: [
                      const Icon(Icons.warning_amber_rounded, color: Colors.orange),
                      const SizedBox(width: 10),
                      Expanded(child: Text(issue, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13))),
                    ]),
                  ),
                )),
          ],
          if (g.altMethods.isNotEmpty) ...[
            const SizedBox(height: 16),
            Text(t.t('altMethods').toUpperCase(), style: TextStyle(fontWeight: FontWeight.w700, color: Colors.grey.shade700)),
            const SizedBox(height: 8),
            ...g.altMethods.map((m) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Glass(
                    padding: const EdgeInsets.all(14),
                    child: Row(children: [
                      const Icon(Icons.alt_route_rounded, color: BubColors.blue),
                      const SizedBox(width: 10),
                      Expanded(child: Text(m, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13))),
                    ]),
                  ),
                )),
          ],
          if (g.alternatives.isNotEmpty) ...[
            const SizedBox(height: 16),
            Text(t.t('cheaperAlternatives').toUpperCase(), style: TextStyle(fontWeight: FontWeight.w700, color: Colors.grey.shade700)),
            const SizedBox(height: 8),
            Glass(
              padding: const EdgeInsets.all(14),
              child: Wrap(
                spacing: 8,
                runSpacing: 8,
                children: g.alternatives.map((a) => Chip(label: Text(a, style: const TextStyle(fontWeight: FontWeight.w600)))).toList(),
              ),
            ),
          ],
          if (g.countryNotes.isNotEmpty) ...[
            const SizedBox(height: 16),
            Text(t.t('countryNotes').toUpperCase(), style: TextStyle(fontWeight: FontWeight.w700, color: Colors.grey.shade700)),
            const SizedBox(height: 8),
            ...g.countryNotes.map((n) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Glass(
                    padding: const EdgeInsets.all(14),
                    child: Row(children: [
                      const Icon(Icons.public_rounded, color: BubColors.pink),
                      const SizedBox(width: 10),
                      Expanded(child: Text(n, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13))),
                    ]),
                  ),
                )),
          ],
          if (g.cancellationScripts.isNotEmpty) ...[
            const SizedBox(height: 16),
            Text(t.t('copyScript').toUpperCase(), style: TextStyle(fontWeight: FontWeight.w700, color: Colors.grey.shade700)),
            const SizedBox(height: 8),
            ...g.cancellationScripts.map((script) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Glass(
                    padding: const EdgeInsets.all(14),
                    onTap: () async {
                      await Clipboard.setData(ClipboardData(text: script));
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(t.t('scriptCopied'))));
                        await store.voteGuide(g.id, 'works');
                      }
                    },
                    child: Text(script, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                  ),
                )),
          ],
          const SizedBox(height: 12),
          OutlinedButton.icon(
            onPressed: () async {
              await store.flagPriceHike(g.id);
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(t.t('priceHikeDone'))));
              }
            },
            icon: const Icon(Icons.trending_up_rounded, color: BubColors.pink),
            label: Text(t.t('priceHike')),
          ),
          const SizedBox(height: 12),
          Text(t.t('didThisWork'), style: const TextStyle(fontWeight: FontWeight.w700)),
          const SizedBox(height: 8),
          Row(children: [
            Expanded(
              child: FilledButton.tonal(
                style: FilledButton.styleFrom(backgroundColor: vote == 'works' ? BubColors.lime : null),
                onPressed: () => store.voteGuide(g.id, 'works'),
                child: Text('${t.t('works')} · $works'),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: FilledButton.tonal(
                style: FilledButton.styleFrom(backgroundColor: vote == 'broken' ? BubColors.pink : null, foregroundColor: vote == 'broken' ? Colors.white : null),
                onPressed: () => store.voteGuide(g.id, 'broken'),
                child: Text('${t.t('broken')} · $broken'),
              ),
            ),
          ]),
          const SizedBox(height: 16),
          Text(t.t('legalDisclaimer'), textAlign: TextAlign.center, style: TextStyle(fontSize: 11, color: Colors.grey.shade500)),
        ],
      ),
    );
  }
}
