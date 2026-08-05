import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../data/i18n.dart';
import '../theme/brand.dart';

class AppShell extends StatelessWidget {
  const AppShell({super.key, required this.navigationShell});
  final StatefulNavigationShell navigationShell;

  @override
  Widget build(BuildContext context) {
    final t = context.i18n;
    final dark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      extendBody: true,
      body: navigationShell,
      bottomNavigationBar: SafeArea(
        minimum: const EdgeInsets.fromLTRB(16, 0, 16, 12),
        child: Container(
          decoration: BoxDecoration(
            color: dark ? BubColors.surfaceDarkHi : Colors.white,
            borderRadius: BorderRadius.circular(28),
            border: Border.all(color: bubBorder(context)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: dark ? 0.55 : 0.12),
                blurRadius: 24,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
          child: SizedBox(
            height: 60,
            child: Row(
              children: [
                _Tab(icon: Icons.home_rounded, label: t.t('home'), index: 0, shell: navigationShell),
                _Tab(icon: Icons.bar_chart_rounded, label: t.t('stats'), index: 1, shell: navigationShell),
                Expanded(
                  child: Center(
                    child: Transform.translate(
                      offset: const Offset(0, -18),
                      child: Container(
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(color: BubColors.lime.withValues(alpha: 0.45), blurRadius: 24, spreadRadius: -2),
                          ],
                        ),
                        child: FloatingActionButton(
                          heroTag: 'add',
                          onPressed: () => context.push('/add'),
                          shape: const CircleBorder(),
                          child: const Icon(Icons.add_rounded, size: 30),
                        ),
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
    final activeColor = bubAccentOn(context);
    final idleColor = bubMuted(context);
    return Expanded(
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: () => shell.goBranch(index),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: active ? 28 : 0,
              height: 3,
              margin: const EdgeInsets.only(bottom: 3),
              decoration: BoxDecoration(color: BubColors.lime, borderRadius: BorderRadius.circular(99)),
            ),
            Icon(icon, color: active ? activeColor : idleColor, size: 22),
            const SizedBox(height: 2),
            Text(label, style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: active ? activeColor : idleColor)),
          ],
        ),
      ),
    );
  }
}
