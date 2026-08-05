enum BillingCycle { weekly, monthly, quarterly, yearly }

enum SubStatus { active, trial, paused, cancelled }

class ServiceGuide {
  ServiceGuide({
    required this.id,
    required this.name,
    required this.domain,
    required this.color,
    required this.category,
    required this.difficulty,
    required this.estMinutes,
    required this.cancelUrl,
    required this.steps,
    required this.issues,
    required this.altMethods,
    required this.votesWorks,
    required this.votesBroken,
    required this.votesOutdated,
    required this.verified,
    required this.lastVerified,
    required this.cancellationScripts,
    required this.countryNotes,
    required this.regions,
    this.typicalPrice,
    this.supportUrl,
  });

  final String id;
  final String name;
  final String domain;
  final String color;
  final String category;
  final double? typicalPrice;
  final int difficulty;
  final int estMinutes;
  final String cancelUrl;
  final List<String> steps;
  final List<String> issues;
  final List<String> altMethods;
  final int votesWorks;
  final int votesBroken;
  final int votesOutdated;
  final bool verified;
  final String lastVerified;
  final List<String> cancellationScripts;
  final List<String> countryNotes;
  final List<String> regions;
  final String? supportUrl;

  factory ServiceGuide.fromJson(Map<String, dynamic> j) => ServiceGuide(
        id: j['id'] as String,
        name: j['name'] as String,
        domain: j['domain'] as String,
        color: j['color'] as String,
        category: j['category'] as String,
        typicalPrice: (j['typicalPrice'] as num?)?.toDouble(),
        difficulty: j['difficulty'] as int,
        estMinutes: j['estMinutes'] as int,
        cancelUrl: j['cancelUrl'] as String,
        steps: (j['steps'] as List).cast<String>(),
        issues: (j['issues'] as List?)?.cast<String>() ?? const [],
        altMethods: (j['altMethods'] as List?)?.cast<String>() ?? const [],
        votesWorks: (j['votes']?['works'] as int?) ?? 0,
        votesBroken: (j['votes']?['broken'] as int?) ?? 0,
        votesOutdated: (j['votes']?['outdated'] as int?) ?? 0,
        verified: j['verified'] as bool? ?? false,
        lastVerified: j['lastVerified'] as String? ?? '',
        cancellationScripts: (j['cancellationScripts'] as List?)?.cast<String>() ?? const [],
        countryNotes: (j['countryNotes'] as List?)?.cast<String>() ?? const [],
        regions: (j['regions'] as List?)?.cast<String>() ?? const ['global'],
        supportUrl: j['supportUrl'] as String?,
      );
}

class Subscription {
  Subscription({
    required this.id,
    required this.name,
    required this.color,
    required this.category,
    required this.price,
    required this.currency,
    required this.cycle,
    required this.nextRenewal,
    required this.status,
    required this.autoRenew,
    required this.isTrial,
    required this.remindDaysBefore,
    required this.createdAt,
    required this.tags,
    this.serviceId,
    this.trialEndsAt,
    this.paymentMethod,
    this.notes,
    this.cancelledAt,
  });

  final String id;
  final String? serviceId;
  final String name;
  final String color;
  final String category;
  final double price;
  final String currency;
  final BillingCycle cycle;
  final String nextRenewal;
  final SubStatus status;
  final bool autoRenew;
  final bool isTrial;
  final String? trialEndsAt;
  final String? paymentMethod;
  final String? notes;
  final List<String> tags;
  final List<int> remindDaysBefore;
  final String createdAt;
  final String? cancelledAt;

  Subscription copyWith({
    String? name,
    String? color,
    String? category,
    double? price,
    String? currency,
    BillingCycle? cycle,
    String? nextRenewal,
    SubStatus? status,
    bool? autoRenew,
    bool? isTrial,
    String? trialEndsAt,
    String? paymentMethod,
    String? notes,
    List<String>? tags,
    List<int>? remindDaysBefore,
    String? cancelledAt,
    String? serviceId,
  }) =>
      Subscription(
        id: id,
        serviceId: serviceId ?? this.serviceId,
        name: name ?? this.name,
        color: color ?? this.color,
        category: category ?? this.category,
        price: price ?? this.price,
        currency: currency ?? this.currency,
        cycle: cycle ?? this.cycle,
        nextRenewal: nextRenewal ?? this.nextRenewal,
        status: status ?? this.status,
        autoRenew: autoRenew ?? this.autoRenew,
        isTrial: isTrial ?? this.isTrial,
        trialEndsAt: trialEndsAt ?? this.trialEndsAt,
        paymentMethod: paymentMethod ?? this.paymentMethod,
        notes: notes ?? this.notes,
        tags: tags ?? this.tags,
        remindDaysBefore: remindDaysBefore ?? this.remindDaysBefore,
        createdAt: createdAt,
        cancelledAt: cancelledAt ?? this.cancelledAt,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'serviceId': serviceId,
        'name': name,
        'color': color,
        'category': category,
        'price': price,
        'currency': currency,
        'cycle': cycle.name,
        'nextRenewal': nextRenewal,
        'status': status.name,
        'autoRenew': autoRenew,
        'isTrial': isTrial,
        'trialEndsAt': trialEndsAt,
        'paymentMethod': paymentMethod,
        'notes': notes,
        'tags': tags,
        'remindDaysBefore': remindDaysBefore,
        'createdAt': createdAt,
        'cancelledAt': cancelledAt,
      };

  factory Subscription.fromJson(Map<String, dynamic> j) => Subscription(
        id: j['id'] as String,
        serviceId: j['serviceId'] as String?,
        name: j['name'] as String,
        color: j['color'] as String? ?? '#71747f',
        category: j['category'] as String? ?? 'other',
        price: (j['price'] as num).toDouble(),
        currency: j['currency'] as String? ?? 'USD',
        cycle: BillingCycle.values.firstWhere(
          (e) => e.name == j['cycle'],
          orElse: () => BillingCycle.monthly,
        ),
        nextRenewal: j['nextRenewal'] as String,
        status: SubStatus.values.firstWhere(
          (e) => e.name == j['status'],
          orElse: () => SubStatus.active,
        ),
        autoRenew: j['autoRenew'] as bool? ?? true,
        isTrial: j['isTrial'] as bool? ?? false,
        trialEndsAt: j['trialEndsAt'] as String?,
        paymentMethod: j['paymentMethod'] as String?,
        notes: j['notes'] as String?,
        tags: (j['tags'] as List?)?.cast<String>() ?? const [],
        remindDaysBefore: (j['remindDaysBefore'] as List?)?.map((e) => e as int).toList() ?? const [3, 1],
        createdAt: j['createdAt'] as String,
        cancelledAt: j['cancelledAt'] as String?,
      );
}

class AppSettings {
  AppSettings({
    this.locale = 'en',
    this.themeMode = 'system',
    this.currency = 'USD',
    this.guideVotes = const {},
    this.reputationPoints = 0,
    this.priceHikeFlags = const {},
  });

  final String locale;
  final String themeMode;
  final String currency;
  final Map<String, String> guideVotes;
  final int reputationPoints;
  final Map<String, bool> priceHikeFlags;

  AppSettings copyWith({
    String? locale,
    String? themeMode,
    String? currency,
    Map<String, String>? guideVotes,
    int? reputationPoints,
    Map<String, bool>? priceHikeFlags,
  }) =>
      AppSettings(
        locale: locale ?? this.locale,
        themeMode: themeMode ?? this.themeMode,
        currency: currency ?? this.currency,
        guideVotes: guideVotes ?? this.guideVotes,
        reputationPoints: reputationPoints ?? this.reputationPoints,
        priceHikeFlags: priceHikeFlags ?? this.priceHikeFlags,
      );

  Map<String, dynamic> toJson() => {
        'locale': locale,
        'themeMode': themeMode,
        'currency': currency,
        'guideVotes': guideVotes,
        'reputationPoints': reputationPoints,
        'priceHikeFlags': priceHikeFlags,
      };

  factory AppSettings.fromJson(Map<String, dynamic> j) => AppSettings(
        locale: j['locale'] as String? ?? 'en',
        themeMode: j['themeMode'] as String? ?? 'system',
        currency: j['currency'] as String? ?? 'USD',
        guideVotes: (j['guideVotes'] as Map?)?.map((k, v) => MapEntry('$k', '$v')) ?? {},
        reputationPoints: j['reputationPoints'] as int? ?? 0,
        priceHikeFlags: (j['priceHikeFlags'] as Map?)?.map((k, v) => MapEntry('$k', v == true)) ?? {},
      );
}
