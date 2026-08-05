import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:share_plus/share_plus.dart';
import '../../data/i18n.dart';
import '../../data/money.dart';
import '../../data/store.dart';
import '../../theme/brand.dart';
import '../../widgets/glass.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appStoreProvider);
    final store = ref.read(appStoreProvider.notifier);
    final t = context.i18n;
    final accent = bubAccentOn(context);

    return Scaffold(
      appBar: AppBar(title: Text(t.t('settings'))),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 40),
        children: [
          Text(t.t('language').toUpperCase(), style: bubSectionTitle(context)),
          const SizedBox(height: 8),
          Glass(
            padding: const EdgeInsets.all(8),
            child: RadioGroup<String>(
              groupValue: state.settings.locale,
              onChanged: (v) {
                if (v != null) store.setSettings(state.settings.copyWith(locale: v));
              },
              child: Column(children: [
                for (final loc in [('en', t.t('english')), ('ar', t.t('arabic')), ('pl', t.t('polish'))])
                  RadioListTile<String>(
                    value: loc.$1,
                    title: Text(loc.$2, style: const TextStyle(fontWeight: FontWeight.w600)),
                    activeColor: BubColors.limeDeep,
                  ),
              ]),
            ),
          ),
          const SizedBox(height: 16),
          Text(t.t('appearance').toUpperCase(), style: bubSectionTitle(context)),
          const SizedBox(height: 8),
          Glass(
            padding: const EdgeInsets.all(8),
            child: RadioGroup<String>(
              groupValue: state.settings.themeMode,
              onChanged: (v) {
                if (v != null) store.setSettings(state.settings.copyWith(themeMode: v));
              },
              child: Column(children: [
                for (final mode in ['system', 'light', 'dark'])
                  RadioListTile<String>(
                    value: mode,
                    title: Text(mode[0].toUpperCase() + mode.substring(1), style: const TextStyle(fontWeight: FontWeight.w600)),
                    activeColor: BubColors.limeDeep,
                  ),
              ]),
            ),
          ),
          const SizedBox(height: 16),
          Text(t.t('displayCurrency').toUpperCase(), style: bubSectionTitle(context)),
          const SizedBox(height: 8),
          Glass(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: DropdownButtonFormField<String>(
              initialValue: state.settings.currency,
              decoration: const InputDecoration(border: InputBorder.none),
              items: usdRates.keys.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
              onChanged: (v) {
                if (v != null) store.setSettings(state.settings.copyWith(currency: v));
              },
            ),
          ),
          const SizedBox(height: 16),
          Text(t.t('yourData').toUpperCase(), style: bubSectionTitle(context)),
          const SizedBox(height: 8),
          Glass(
            padding: const EdgeInsets.all(4),
            child: Column(children: [
              ListTile(
                leading: Icon(Icons.document_scanner_rounded, color: accent),
                title: Text(t.t('scanReceipt'), style: const TextStyle(fontWeight: FontWeight.w700)),
                subtitle: Text(t.t('scanReceiptSubtitle')),
                onTap: () => context.push('/ocr'),
              ),
              ListTile(
                leading: const Icon(Icons.mail_outline_rounded),
                title: Row(children: [
                  Text(t.t('gmailImport'), style: const TextStyle(fontWeight: FontWeight.w700)),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(color: BubColors.pink.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(99)),
                    child: Text(t.t('beta'), style: const TextStyle(color: BubColors.pink, fontSize: 11, fontWeight: FontWeight.w800)),
                  ),
                ]),
                subtitle: Text(t.t('gmailImportBody')),
                onTap: () => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(t.t('gmailImportBody')))),
              ),
              ListTile(
                leading: Icon(Icons.ios_share_rounded, color: accent),
                title: Text(t.t('exportJson'), style: const TextStyle(fontWeight: FontWeight.w700)),
                subtitle: Text(t.t('exportSubtitle')),
                onTap: () async {
                  final payload = store.exportBackupJson();
                  await SharePlus.instance.share(ShareParams(text: payload, subject: 'BUB SUB backup'));
                },
              ),
              ListTile(
                leading: const Icon(Icons.upload_file_rounded),
                title: Text(t.t('importData'), style: const TextStyle(fontWeight: FontWeight.w700)),
                subtitle: Text(t.t('importSubtitle')),
                onTap: () => _importDialog(context, store, t),
              ),
              ListTile(
                leading: const Icon(Icons.copy_all_rounded),
                title: Text(t.t('copyBackup'), style: const TextStyle(fontWeight: FontWeight.w700)),
                onTap: () async {
                  await Clipboard.setData(ClipboardData(text: store.exportBackupJson()));
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(t.t('backupCopied'))));
                  }
                },
              ),
            ]),
          ),
          const SizedBox(height: 16),
          Text(t.t('reputation').toUpperCase(), style: bubSectionTitle(context)),
          const SizedBox(height: 8),
          Glass(
            padding: const EdgeInsets.all(16),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('${state.settings.reputationPoints} pts', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800)),
              Text(t.t('topVerifiers'), style: TextStyle(color: bubMuted(context), fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              const Text('1. You  ·  verified votes & price alerts', style: TextStyle(fontWeight: FontWeight.w600)),
              const Text('2. Community seed team', style: TextStyle(fontWeight: FontWeight.w600)),
            ]),
          ),
          const SizedBox(height: 16),
          Glass(
            padding: const EdgeInsets.all(16),
            child: Row(children: [
              Icon(Icons.shield_rounded, color: accent),
              const SizedBox(width: 10),
              Expanded(child: Text(t.t('privacyBody'), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13))),
            ]),
          ),
          const SizedBox(height: 16),
          TextButton(
            onPressed: () async {
              final ok = await showDialog<bool>(
                context: context,
                builder: (_) => AlertDialog(
                  title: Text(t.t('eraseAll')),
                  actions: [
                    TextButton(onPressed: () => Navigator.pop(context, false), child: Text(t.t('cancel'))),
                    FilledButton(onPressed: () => Navigator.pop(context, true), child: Text(t.t('delete'))),
                  ],
                ),
              );
              if (ok == true) await store.resetAll();
            },
            child: Text(t.t('eraseAll'), style: const TextStyle(color: Colors.red, fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }

  Future<void> _importDialog(BuildContext context, AppStore store, dynamic t) async {
    final ctrl = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(t.t('importData')),
        content: SizedBox(
          width: 420,
          child: TextField(
            controller: ctrl,
            maxLines: 8,
            decoration: InputDecoration(
              hintText: t.t('pasteBackupHint'),
              border: const OutlineInputBorder(),
            ),
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: Text(t.t('cancel'))),
          FilledButton(onPressed: () => Navigator.pop(ctx, true), child: Text(t.t('importData'))),
        ],
      ),
    );
    if (ok != true || !context.mounted) {
      ctrl.dispose();
      return;
    }
    try {
      final count = await store.importBackupJson(ctrl.text.trim());
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(t.t('importDone', {'count': '$count'}))));
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(t.t('importFailed'))));
      }
    } finally {
      ctrl.dispose();
    }
  }
}
