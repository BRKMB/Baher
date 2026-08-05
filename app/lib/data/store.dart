import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';
import 'dates.dart';
import 'models.dart';

const _subsKey = 'bubsub.subs.v1';
const _settingsKey = 'bubsub.settings.v1';

class AppState {
  AppState({
    required this.subscriptions,
    required this.settings,
    required this.guides,
    this.ready = false,
  });

  final List<Subscription> subscriptions;
  final AppSettings settings;
  final List<ServiceGuide> guides;
  final bool ready;

  AppState copyWith({
    List<Subscription>? subscriptions,
    AppSettings? settings,
    List<ServiceGuide>? guides,
    bool? ready,
  }) =>
      AppState(
        subscriptions: subscriptions ?? this.subscriptions,
        settings: settings ?? this.settings,
        guides: guides ?? this.guides,
        ready: ready ?? this.ready,
      );
}

class AppStore extends StateNotifier<AppState> {
  AppStore() : super(AppState(subscriptions: const [], settings: AppSettings(), guides: const [])) {
    _init();
  }

  final _uuid = const Uuid();

  Future<void> _init() async {
    final prefs = await SharedPreferences.getInstance();
    final guidesRaw = await rootBundle.loadString('assets/seed/services.json');
    final guidesJson = jsonDecode(guidesRaw) as Map<String, dynamic>;
    final guides = (guidesJson['services'] as List)
        .cast<Map<String, dynamic>>()
        .map(ServiceGuide.fromJson)
        .toList();

    final settingsRaw = prefs.getString(_settingsKey);
    final settings = settingsRaw == null
        ? AppSettings()
        : AppSettings.fromJson(jsonDecode(settingsRaw) as Map<String, dynamic>);

    final subsRaw = prefs.getString(_subsKey);
    List<Subscription> subs;
    if (subsRaw == null) {
      subs = _seedSubs(guides);
      await prefs.setString(_subsKey, jsonEncode(subs.map((e) => e.toJson()).toList()));
    } else {
      subs = (jsonDecode(subsRaw) as List)
          .cast<Map<String, dynamic>>()
          .map(Subscription.fromJson)
          .toList();
    }

    state = AppState(subscriptions: subs, settings: settings, guides: guides, ready: true);
  }

  List<Subscription> _seedSubs(List<ServiceGuide> guides) {
    ServiceGuide g(String id) => guides.firstWhere((e) => e.id == id);
    final t = todayIso();
    Subscription make(String id, {int renewIn = 12, bool trial = false, SubStatus? status}) {
      final s = g(id);
      return Subscription(
        id: 'seed-$id',
        serviceId: id,
        name: s.name,
        color: s.color,
        category: s.category,
        price: s.typicalPrice ?? 9.99,
        currency: 'USD',
        cycle: BillingCycle.monthly,
        nextRenewal: addDays(t, renewIn),
        status: status ?? (trial ? SubStatus.trial : SubStatus.active),
        autoRenew: status != SubStatus.cancelled,
        isTrial: trial,
        trialEndsAt: trial ? addDays(t, renewIn) : null,
        tags: const [],
        remindDaysBefore: const [3, 1],
        createdAt: t,
        cancelledAt: status == SubStatus.cancelled ? addDays(t, -14) : null,
      );
    }

    return [
      make('netflix', renewIn: 3),
      make('spotify', renewIn: 9),
      make('chatgpt-plus', renewIn: 17),
      make('adobe-cc', renewIn: 24),
      make('canva-pro', renewIn: 5, trial: true),
      make('icloud-plus', renewIn: 2),
      make('xbox-game-pass', renewIn: -14, status: SubStatus.cancelled),
      make('dropbox', renewIn: 41),
      make('anghami', renewIn: 11),
      make('player-pl', renewIn: 15),
    ];
  }

  Future<void> _persistSubs() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_subsKey, jsonEncode(state.subscriptions.map((e) => e.toJson()).toList()));
  }

  Future<void> _persistSettings() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_settingsKey, jsonEncode(state.settings.toJson()));
  }

  Future<void> setSettings(AppSettings settings) async {
    state = state.copyWith(settings: settings);
    await _persistSettings();
  }

  Future<void> addSubscription(Subscription sub) async {
    state = state.copyWith(subscriptions: [sub, ...state.subscriptions]);
    await _persistSubs();
  }

  Future<void> updateSubscription(String id, Subscription Function(Subscription) fn) async {
    state = state.copyWith(
      subscriptions: state.subscriptions.map((s) => s.id == id ? fn(s) : s).toList(),
    );
    await _persistSubs();
  }

  Future<void> deleteSubscription(String id) async {
    state = state.copyWith(subscriptions: state.subscriptions.where((s) => s.id != id).toList());
    await _persistSubs();
  }

  Future<void> resetAll() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_subsKey);
    await prefs.remove(_settingsKey);
    state = AppState(subscriptions: const [], settings: AppSettings(), guides: state.guides);
    await _init();
  }

  String exportBackupJson() => jsonEncode({
        'version': 1,
        'exportedAt': DateTime.now().toUtc().toIso8601String(),
        'subscriptions': state.subscriptions.map((e) => e.toJson()).toList(),
        'settings': state.settings.toJson(),
      });

  Future<int> importBackupJson(String raw) async {
    final decoded = jsonDecode(raw);
    if (decoded is! Map<String, dynamic>) {
      throw const FormatException('Backup must be a JSON object');
    }
    final subsRaw = decoded['subscriptions'];
    if (subsRaw is! List) {
      throw const FormatException('Backup missing subscriptions[]');
    }
    final subs = subsRaw.cast<Map<String, dynamic>>().map(Subscription.fromJson).toList();
    var settings = state.settings;
    if (decoded['settings'] is Map<String, dynamic>) {
      settings = AppSettings.fromJson(decoded['settings'] as Map<String, dynamic>);
    }
    state = state.copyWith(subscriptions: subs, settings: settings);
    await _persistSubs();
    await _persistSettings();
    return subs.length;
  }

  String newId() => _uuid.v4();

  ServiceGuide? guideById(String id) {
    try {
      return state.guides.firstWhere((g) => g.id == id);
    } catch (_) {
      return null;
    }
  }

  ServiceGuide? guideByDomain(String host) {
    final h = host.toLowerCase().replaceFirst('www.', '');
    try {
      return state.guides.firstWhere((g) => g.domain.toLowerCase().contains(h) || h.contains(g.domain.toLowerCase()));
    } catch (_) {
      return null;
    }
  }

  Future<void> voteGuide(String id, String kind) async {
    final votes = Map<String, String>.from(state.settings.guideVotes);
    if (votes[id] == kind) {
      votes.remove(id);
    } else {
      votes[id] = kind;
    }
    final points = state.settings.reputationPoints + (kind == 'works' ? 1 : 0);
    await setSettings(state.settings.copyWith(guideVotes: votes, reputationPoints: points));
  }

  Future<void> flagPriceHike(String serviceId) async {
    final flags = Map<String, bool>.from(state.settings.priceHikeFlags)..[serviceId] = true;
    await setSettings(state.settings.copyWith(
      priceHikeFlags: flags,
      reputationPoints: state.settings.reputationPoints + 5,
    ));
  }
}

final appStoreProvider = StateNotifierProvider<AppStore, AppState>((ref) => AppStore());
