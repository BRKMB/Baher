import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'data/i18n.dart';
import 'data/store.dart';
import 'routing/router.dart';
import 'theme/brand.dart';

class BubSubApp extends ConsumerStatefulWidget {
  const BubSubApp({super.key, this.sharedPayload});
  final String? sharedPayload;

  @override
  ConsumerState<BubSubApp> createState() => _BubSubAppState();
}

class _BubSubAppState extends ConsumerState<BubSubApp> {
  BubI18n? i18n;
  late final router = createRouter(initialShared: widget.sharedPayload);

  @override
  void initState() {
    super.initState();
    _loadI18n('en');
  }

  Future<void> _loadI18n(String code) async {
    final loaded = await BubI18n.load(Locale(code));
    if (mounted) setState(() => i18n = loaded);
  }

  @override
  Widget build(BuildContext context) {
    final settings = ref.watch(appStoreProvider.select((s) => s.settings));
    if (i18n == null || i18n!.locale.languageCode != settings.locale) {
      _loadI18n(settings.locale);
    }
    if (i18n == null) {
      return const MaterialApp(home: Scaffold(body: Center(child: CircularProgressIndicator())));
    }

    final themeMode = switch (settings.themeMode) {
      'light' => ThemeMode.light,
      'dark' => ThemeMode.dark,
      _ => ThemeMode.system,
    };

    return BubI18nScope(
      i18n: i18n!,
      child: MaterialApp.router(
        title: 'BUB SUB',
        debugShowCheckedModeBanner: false,
        theme: buildBubTheme(brightness: Brightness.light),
        darkTheme: buildBubTheme(brightness: Brightness.dark),
        themeMode: themeMode,
        locale: i18n!.locale,
        supportedLocales: BubI18n.supported,
        routerConfig: router,
        builder: (context, child) => Directionality(
          textDirection: i18n!.isRtl ? TextDirection.rtl : TextDirection.ltr,
          child: child ?? const SizedBox.shrink(),
        ),
      ),
    );
  }
}
