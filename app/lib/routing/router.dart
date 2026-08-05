import 'package:go_router/go_router.dart';
import '../features/add/add_screen.dart';
import '../features/analytics/analytics_screen.dart';
import '../features/calendar/calendar_screen.dart';
import '../features/detail/detail_screen.dart';
import '../features/guides/guide_detail_screen.dart';
import '../features/guides/guides_screen.dart';
import '../features/home/home_screen.dart';
import '../features/ocr/ocr_screen.dart';
import '../features/settings/settings_screen.dart';
import '../widgets/shell.dart';

GoRouter createRouter({String? initialShared}) => GoRouter(
      initialLocation: initialShared == null ? '/' : '/share?q=${Uri.encodeComponent(initialShared)}',
      routes: [
        StatefulShellRoute.indexedStack(
          builder: (context, state, navigationShell) => AppShell(navigationShell: navigationShell),
          branches: [
            StatefulShellBranch(routes: [GoRoute(path: '/', builder: (_, __) => const HomeScreen())]),
            StatefulShellBranch(routes: [GoRoute(path: '/stats', builder: (_, __) => const AnalyticsScreen())]),
            StatefulShellBranch(routes: [GoRoute(path: '/guides', builder: (_, __) => const GuidesScreen())]),
            StatefulShellBranch(routes: [GoRoute(path: '/calendar', builder: (_, __) => const CalendarScreen())]),
          ],
        ),
        GoRoute(path: '/add', builder: (_, __) => const AddScreen()),
        GoRoute(path: '/edit/:id', builder: (_, s) => AddScreen(editId: s.pathParameters['id'])),
        GoRoute(path: '/subs/:id', builder: (_, s) => DetailScreen(id: s.pathParameters['id']!)),
        GoRoute(path: '/guides/:id', builder: (_, s) => GuideDetailScreen(id: s.pathParameters['id']!)),
        GoRoute(path: '/settings', builder: (_, __) => const SettingsScreen()),
        GoRoute(path: '/ocr', builder: (_, __) => const OcrScreen()),
        GoRoute(
          path: '/share',
          builder: (_, s) => GuidesScreen(initialQuery: s.uri.queryParameters['q'] ?? ''),
        ),
      ],
    );
