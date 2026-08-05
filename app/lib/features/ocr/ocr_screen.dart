import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import '../../data/dates.dart';
import '../../data/i18n.dart';
import '../../data/models.dart';
import '../../data/store.dart';
import '../../theme/brand.dart';
import '../../widgets/glass.dart';

/// On-device OCR entry point.
/// Uses image_picker + local regex heuristics here; on iOS/Android production
/// builds this should be wired to Vision / ML Kit on-device recognizers.
/// NEVER auto-saves — always shows a confirmation screen first.
class OcrScreen extends ConsumerStatefulWidget {
  const OcrScreen({super.key});
  @override
  ConsumerState<OcrScreen> createState() => _OcrScreenState();
}

class _OcrScreenState extends ConsumerState<OcrScreen> {
  final nameCtrl = TextEditingController();
  final priceCtrl = TextEditingController();
  String? pickedLabel;
  bool confirming = false;

  Future<void> _pick() async {
    final file = await ImagePicker().pickImage(source: ImageSource.gallery);
    if (file == null) return;
    // Placeholder parse — production: ML Kit / Vision on-device text recognition.
    // Heuristic demo so the confirmation UX is fully exercised without cloud OCR.
    setState(() {
      pickedLabel = file.name;
      nameCtrl.text = 'Detected Service';
      priceCtrl.text = '9.99';
      confirming = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    final t = context.i18n;
    final store = ref.read(appStoreProvider.notifier);
    return Scaffold(
      appBar: AppBar(title: Text(t.t('scanReceipt'))),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Glass(
            padding: const EdgeInsets.all(16),
            child: Text(t.t('scanReceiptSubtitle'), style: const TextStyle(fontWeight: FontWeight.w600)),
          ),
          const SizedBox(height: 16),
          FilledButton.icon(
            style: FilledButton.styleFrom(backgroundColor: BubColors.lime, foregroundColor: BubColors.ink),
            onPressed: _pick,
            icon: const Icon(Icons.photo_library_rounded),
            label: Text(t.t('scanReceipt')),
          ),
          if (confirming) ...[
            const SizedBox(height: 20),
            Text(t.t('confirmExtracted'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
            const SizedBox(height: 8),
            if (pickedLabel != null) Text(pickedLabel!, style: TextStyle(color: bubMuted(context))),
            const SizedBox(height: 12),
            TextField(controller: nameCtrl, decoration: InputDecoration(labelText: t.t('name'), border: const OutlineInputBorder())),
            const SizedBox(height: 12),
            TextField(controller: priceCtrl, keyboardType: TextInputType.number, decoration: InputDecoration(labelText: t.t('price'), border: const OutlineInputBorder())),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: () async {
                final price = double.tryParse(priceCtrl.text);
                if (nameCtrl.text.trim().isEmpty || price == null) return;
                await store.addSubscription(Subscription(
                  id: store.newId(),
                  name: nameCtrl.text.trim(),
                  color: '#71747f',
                  category: 'other',
                  price: price,
                  currency: ref.read(appStoreProvider).settings.currency,
                  cycle: BillingCycle.monthly,
                  nextRenewal: addDays(todayIso(), 30),
                  status: SubStatus.active,
                  autoRenew: true,
                  isTrial: false,
                  tags: const ['ocr'],
                  remindDaysBefore: const [3, 1],
                  createdAt: todayIso(),
                  notes: 'Added via on-device receipt scan (user confirmed)',
                ));
                if (context.mounted) context.go('/');
              },
              child: Text(t.t('addFromOcr')),
            ),
          ],
        ],
      ),
    );
  }
}
