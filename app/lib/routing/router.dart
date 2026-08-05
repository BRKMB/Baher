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
            StatefulShellBranch(routes: [GoRoute(path: '/', builder: (context, state) => const HomeScreen())]),
            StatefulShellBranch(routes: [GoRoute(path: '/stats', builder: (context, state) => const AnalyticsScreen())]),
            StatefulShellBranch(routes: [GoRoute(path: '/guides', builder: (context, state) => const GuidesScreen())]),
            StatefulShellBranch(routes: [GoRoute(path: '/calendar', builder: (context, state) => const CalendarScreen())]),
          ],
        ),
        GoRoute(path: '/add', builder: (context, state) => const AddScreen()),
        GoRoute(path: '/edit/:id', builder: (context, state) => AddScreen(editId: state.pathParameters['id'])),
        GoRoute(path: '/subs/:id', builder: (context, state) => DetailScreen(id: state.pathParameters['id']!)),
        GoRoute(path: '/guides/:id', builder: (context, state) => GuideDetailScreen(id: state.pathParameters['id']!)),
        GoRoute(path: '/settings', builder: (context, state) => const SettingsScreen()),
        GoRoute(path: '/ocr', builder: (context, state) => const OcrScreen()),
        GoRoute(
          path: '/share',
          builder: (context, state) => GuidesScreen(initialQuery: state.uri.queryParameters['q'] ?? ''),
        ),
      ],
    );
