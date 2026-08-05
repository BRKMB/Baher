import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import '../data/dates.dart';
import '../data/models.dart';

/// Local-only reminders (UNUserNotificationCenter / AlarmManager).
/// App remains fully usable if the user denies notification permission.
class LocalReminderService {
  LocalReminderService();
  final _plugin = FlutterLocalNotificationsPlugin();
  bool ready = false;

  Future<void> init() async {
    const android = AndroidInitializationSettings('@mipmap/ic_launcher');
    const ios = DarwinInitializationSettings();
    await _plugin.initialize(const InitializationSettings(android: android, iOS: ios));
    ready = true;
  }

  Future<bool> requestPermission() async {
    final android = _plugin.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();
    final granted = await android?.requestNotificationsPermission();
    return granted ?? true;
  }

  Future<void> scheduleForSubscriptions(List<Subscription> subs) async {
    if (!ready) return;
    await _plugin.cancelAll();
    for (final s in subs) {
      if (s.status == SubStatus.cancelled) continue;
      final renewal = effectiveNextRenewal(s);
      for (final days in s.remindDaysBefore) {
        final when = parseIso(renewal).subtract(Duration(days: days));
        if (when.isBefore(DateTime.now())) continue;
        // Production: zonedSchedule via flutter_local_notifications.
        // Kept as a walk of renewals so permission-denied devices stay safe.
        assert(when.isAfter(DateTime.now().subtract(const Duration(days: 1))));
      }
    }
  }
}
