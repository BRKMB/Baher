import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
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

    return Scaffold(
      appBar: AppBar(title: Text(t.t('settings'))),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 40),
        children: [
          Text(t.t('language').toUpperCase(), style: TextStyle(fontWeight: FontWeight.w700, color: Colors.grey.shade600)),
          const SizedBox(height: 8),
          Glass(
            padding: const EdgeInsets.all(8),
            child: Column(children: [
              for (final loc in [('en', t.t('english')), ('ar', t.t('arabic')), ('pl', t.t('polish'))])
                RadioListTile<String>(
                  value: loc.$1,
                  groupValue: state.settings.locale,
                  title: Text(loc.$2, style: const TextStyle(fontWeight: FontWeight.w600)),
                  activeColor: BubColors.lime,
                  onChanged: (v) => store.setSettings(state.settings.copyWith(locale: v)),
                ),
            ]),
          ),
          const SizedBox(height: 16),
          Text(t.t('appearance').toUpperCase(), style: TextStyle(fontWeight: FontWeight.w700, color: Colors.grey.shade600)),
          const SizedBox(height: 8),
          Glass(
            padding: const EdgeInsets.all(8),
            child: Column(children: [
              for (final mode in ['system', 'light', 'dark'])
                RadioListTile<String>(
                  value: mode,
                  groupValue: state.settings.themeMode,
                  title: Text(mode[0].toUpperCase() + mode.substring(1), style: const TextStyle(fontWeight: FontWeight.w600)),
                  onChanged: (v) => store.setSettings(state.settings.copyWith(themeMode: v)),
                ),
            ]),
          ),
          const SizedBox(height: 16),
          Text(t.t('displayCurrency').toUpperCase(), style: TextStyle(fontWeight: FontWeight.w700, color: Colors.grey.shade600)),
          const SizedBox(height: 8),
          Glass(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: DropdownButtonFormField<String>(
              value: state.settings.currency,
              decoration: const InputDecoration(border: InputBorder.none),
              items: usdRates.keys.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
              onChanged: (v) => store.setSettings(state.settings.copyWith(currency: v)),
            ),
          ),
          const SizedBox(height: 16),
          Text(t.t('yourData').toUpperCase(), style: TextStyle(fontWeight: FontWeight.w700, color: Colors.grey.shade600)),
          const SizedBox(height: 8),
          Glass(
            padding: const EdgeInsets.all(4),
            child: Column(children: [
              ListTile(
                leading: const Icon(Icons.document_scanner_rounded, color: Color(0xFF7EAB00)),
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
                leading: const Icon(Icons.download_rounded),
                title: Text(t.t('exportJson'), style: const TextStyle(fontWeight: FontWeight.w700)),
                onTap: () {
                  final payload = jsonEncode({
                    'subscriptions': state.subscriptions.map((e) => e.toJson()).toList(),
                    'settings': state.settings.toJson(),
                  });
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Backup ready (${payload.length} bytes)')));
                },
              ),
            ]),
          ),
          const SizedBox(height: 16),
          Text(t.t('reputation').toUpperCase(), style: TextStyle(fontWeight: FontWeight.w700, color: Colors.grey.shade600)),
          const SizedBox(height: 8),
          Glass(
            padding: const EdgeInsets.all(16),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('${state.settings.reputationPoints} pts', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800)),
              Text(t.t('topVerifiers'), style: TextStyle(color: Colors.grey.shade600, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              const Text('1. You  ·  verified votes & price alerts', style: TextStyle(fontWeight: FontWeight.w600)),
              const Text('2. Community seed team', style: TextStyle(fontWeight: FontWeight.w600)),
            ]),
          ),
          const SizedBox(height: 16),
          Glass(
            padding: const EdgeInsets.all(16),
            child: Row(children: [
              const Icon(Icons.shield_rounded, color: Color(0xFF7EAB00)),
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
}
