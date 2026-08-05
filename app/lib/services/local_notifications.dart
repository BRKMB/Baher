import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/data/latest_all.dart' as tz;
import 'package:timezone/timezone.dart' as tz;
import '../data/dates.dart';
import '../data/models.dart';

/// Local-only reminders (UNUserNotificationCenter / AlarmManager).
/// App remains fully usable if the user denies notification permission.
class LocalReminderService {
  LocalReminderService();
  final _plugin = FlutterLocalNotificationsPlugin();
  bool ready = false;
  bool permissionGranted = true;

  Future<void> init() async {
    tz.initializeTimeZones();
    const android = AndroidInitializationSettings('@mipmap/ic_launcher');
    const ios = DarwinInitializationSettings(
      requestAlertPermission: false,
      requestBadgePermission: false,
      requestSoundPermission: false,
    );
    await _plugin.initialize(const InitializationSettings(android: android, iOS: ios));
    ready = true;
  }

  Future<bool> requestPermission() async {
    final android = _plugin.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();
    final ios = _plugin.resolvePlatformSpecificImplementation<IOSFlutterLocalNotificationsPlugin>();
    final androidGranted = await android?.requestNotificationsPermission();
    final iosGranted = await ios?.requestPermissions(alert: true, badge: true, sound: true);
    permissionGranted = androidGranted ?? iosGranted ?? true;
    return permissionGranted;
  }

  Future<void> scheduleForSubscriptions(List<Subscription> subs) async {
    if (!ready || !permissionGranted) return;
    await _plugin.cancelAll();
    var id = 1;
    for (final s in subs) {
      if (s.status == SubStatus.cancelled) continue;
      final renewal = effectiveNextRenewal(s);
      for (final days in s.remindDaysBefore) {
        final when = parseIso(renewal).subtract(Duration(days: days));
        if (when.isBefore(DateTime.now())) continue;
        final tzWhen = tz.TZDateTime.from(when, tz.local);
        try {
          await _plugin.zonedSchedule(
            id++,
            'BUB SUB',
            days == 0 ? '${s.name} charges today' : '${s.name} renews in $days day(s)',
            tzWhen,
            const NotificationDetails(
              android: AndroidNotificationDetails(
                'renewals',
                'Renewal reminders',
                channelDescription: 'Local reminders before subscription charges',
                importance: Importance.high,
                priority: Priority.high,
              ),
              iOS: DarwinNotificationDetails(),
            ),
            androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
          );
        } catch (_) {
          // Web / unsupported platforms — ignore.
        }
      }
    }
  }
}
