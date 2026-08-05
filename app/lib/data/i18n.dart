import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

class BubI18n {
  BubI18n(this.locale, this._map);
  final Locale locale;
  final Map<String, String> _map;

  static const supported = [Locale('en'), Locale('ar'), Locale('pl')];

  static Future<BubI18n> load(Locale locale) async {
    final code = supported.any((l) => l.languageCode == locale.languageCode)
        ? locale.languageCode
        : 'en';
    final raw = await rootBundle.loadString('assets/i18n/$code.json');
    final map = (jsonDecode(raw) as Map).map((k, v) => MapEntry('$k', '$v'));
    return BubI18n(Locale(code), map);
  }

  String t(String key, [Map<String, String>? vars]) {
    var value = _map[key] ?? key;
    vars?.forEach((k, v) => value = value.replaceAll('{$k}', v));
    return value;
  }

  bool get isRtl => locale.languageCode == 'ar';
}

class BubI18nScope extends InheritedWidget {
  const BubI18nScope({super.key, required this.i18n, required super.child});
  final BubI18n i18n;

  static BubI18n of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<BubI18nScope>()!.i18n;

  @override
  bool updateShouldNotify(BubI18nScope oldWidget) => i18n != oldWidget.i18n;
}

extension BubI18nX on BuildContext {
  BubI18n get i18n => BubI18nScope.of(this);
  String tr(String key, [Map<String, String>? vars]) => i18n.t(key, vars);
}
