import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app.dart';
import 'services/local_notifications.dart';

/// Share-to-cancel entry: on mobile, wire `receive_sharing_intent` /
/// iOS Share Extension / Android ACTION_SEND into [sharedPayload].
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final reminders = LocalReminderService();
  try {
    await reminders.init();
    await reminders.requestPermission();
  } catch (_) {
    // Permission denial must not block app launch.
  }

  const sharedPayload = String.fromEnvironment('SHARED_URL');
  runApp(ProviderScope(
    child: BubSubApp(sharedPayload: sharedPayload.isEmpty ? null : sharedPayload),
  ));
}
