import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../data/dates.dart';
import '../../data/i18n.dart';
import '../../data/models.dart';
import '../../data/store.dart';

class AddScreen extends ConsumerStatefulWidget {
  const AddScreen({super.key, this.editId});
  final String? editId;
  @override
  ConsumerState<AddScreen> createState() => _AddScreenState();
}

class _AddScreenState extends ConsumerState<AddScreen> {
  final nameCtrl = TextEditingController();
  final priceCtrl = TextEditingController();
  String currency = 'USD';
  BillingCycle cycle = BillingCycle.monthly;
  String category = 'entertainment';
  String? serviceId;
  String color = '#71747f';
  bool isTrial = false;
  bool autoRenew = true;
  late String nextRenewal = addDays(todayIso(), 30);
  late String trialEnds = addDays(todayIso(), 7);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final state = ref.read(appStoreProvider);
      if (widget.editId != null) {
        Subscription? s;
        for (final e in state.subscriptions) {
          if (e.id == widget.editId) s = e;
        }
        if (s != null) {
          nameCtrl.text = s.name;
          priceCtrl.text = s.price.toString();
          currency = s.currency;
          cycle = s.cycle;
          category = s.category;
          serviceId = s.serviceId;
          color = s.color;
          isTrial = s.isTrial;
          autoRenew = s.autoRenew;
          nextRenewal = s.nextRenewal;
          trialEnds = s.trialEndsAt ?? trialEnds;
          setState(() {});
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(appStoreProvider);
    final store = ref.read(appStoreProvider.notifier);
    final t = context.i18n;
    final suggestions = state.guides.take(12).toList();

    return Scaffold(
      appBar: AppBar(title: Text(widget.editId == null ? t.t('addSubscription') : t.t('editSubscription'))),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 40),
        children: [
          SizedBox(
            height: 48,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: suggestions
                  .map((g) => Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ActionChip(
                          label: Text(g.name),
                          onPressed: () => setState(() {
                            serviceId = g.id;
                            nameCtrl.text = g.name;
                            color = g.color;
                            category = g.category;
                            if (g.typicalPrice != null) priceCtrl.text = g.typicalPrice!.toString();
                          }),
                        ),
                      ))
                  .toList(),
            ),
          ),
          const SizedBox(height: 12),
          TextField(controller: nameCtrl, decoration: InputDecoration(labelText: t.t('name'), border: const OutlineInputBorder())),
          const SizedBox(height: 12),
          Row(children: [
            Expanded(child: TextField(controller: priceCtrl, keyboardType: TextInputType.number, decoration: InputDecoration(labelText: t.t('price'), border: const OutlineInputBorder()))),
            const SizedBox(width: 10),
            SizedBox(
              width: 110,
              child: DropdownButtonFormField<String>(
                value: currency,
                decoration: InputDecoration(labelText: t.t('currency'), border: const OutlineInputBorder()),
                items: const ['USD', 'EUR', 'EGP', 'PLN', 'GBP', 'SAR', 'AED'].map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                onChanged: (v) => setState(() => currency = v ?? currency),
              ),
            ),
          ]),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            children: BillingCycle.values
                .map((c) => ChoiceChip(
                      label: Text(t.t(c == BillingCycle.yearly ? 'yearlyLabel' : c.name)),
                      selected: cycle == c,
                      onSelected: (_) => setState(() => cycle = c),
                    ))
                .toList(),
          ),
          const SizedBox(height: 12),
          SwitchListTile(title: Text(t.t('freeTrial')), value: isTrial, onChanged: (v) => setState(() => isTrial = v)),
          SwitchListTile(title: Text(t.t('autoRenew')), value: autoRenew, onChanged: (v) => setState(() => autoRenew = v)),
          const SizedBox(height: 8),
          FilledButton(
            onPressed: () async {
              final price = double.tryParse(priceCtrl.text);
              if (nameCtrl.text.trim().isEmpty || price == null) return;
              final sub = Subscription(
                id: widget.editId ?? store.newId(),
                serviceId: serviceId,
                name: nameCtrl.text.trim(),
                color: color,
                category: category,
                price: price,
                currency: currency,
                cycle: cycle,
                nextRenewal: isTrial ? trialEnds : nextRenewal,
                status: isTrial ? SubStatus.trial : SubStatus.active,
                autoRenew: autoRenew,
                isTrial: isTrial,
                trialEndsAt: isTrial ? trialEnds : null,
                tags: const [],
                remindDaysBefore: const [3, 1],
                createdAt: todayIso(),
              );
              if (widget.editId == null) {
                await store.addSubscription(sub);
              } else {
                await store.updateSubscription(widget.editId!, (_) => sub);
              }
              if (context.mounted) context.pop();
            },
            child: Text(t.t('save')),
          ),
        ],
      ),
    );
  }
}
