import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../data/i18n.dart';
import '../theme/brand.dart';
import 'glass.dart';

class AppShell extends StatelessWidget {
  const AppShell({super.key, required this.navigationShell});
  final StatefulNavigationShell navigationShell;

  @override
  Widget build(BuildContext context) {
    final t = context.i18n;
    return Scaffold(
      extendBody: true,
      body: navigationShell,
      bottomNavigationBar: SafeArea(
        minimum: const EdgeInsets.fromLTRB(16, 0, 16, 10),
        child: Glass(
          borderRadius: 28,
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
          child: SizedBox(
            height: 58,
            child: Row(
              children: [
                _Tab(icon: Icons.home_rounded, label: t.t('home'), index: 0, shell: navigationShell),
                _Tab(icon: Icons.bar_chart_rounded, label: t.t('stats'), index: 1, shell: navigationShell),
                Expanded(
                  child: Center(
                    child: Transform.translate(
                      offset: const Offset(0, -16),
                      child: FloatingActionButton(
                        heroTag: 'add',
                        onPressed: () => context.push('/add'),
                        child: const Icon(Icons.add_rounded, size: 30),
                      ),
                    ),
                  ),
                ),
                _Tab(icon: Icons.content_cut_rounded, label: t.t('guides'), index: 2, shell: navigationShell),
                _Tab(icon: Icons.calendar_month_rounded, label: t.t('calendar'), index: 3, shell: navigationShell),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _Tab extends StatelessWidget {
  const _Tab({required this.icon, required this.label, required this.index, required this.shell});
  final IconData icon;
  final String label;
  final int index;
  final StatefulNavigationShell shell;

  @override
  Widget build(BuildContext context) {
    final active = shell.currentIndex == index;
    return Expanded(
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: () => shell.goBranch(index),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (active) Container(width: 28, height: 3, decoration: BoxDecoration(color: BubColors.lime, borderRadius: BorderRadius.circular(99))),
            Icon(icon, color: active ? bubAccentOn(context) : Colors.grey.shade600, size: 22),
            const SizedBox(height: 2),
            Text(label, style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: active ? bubAccentOn(context) : Colors.grey.shade600)),
          ],
        ),
      ),
    );
  }
}
