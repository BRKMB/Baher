import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../data/logos.dart';
import '../theme/brand.dart';

class Glass extends StatelessWidget {
  const Glass({
    super.key,
    required this.child,
    this.padding,
    this.borderRadius = 26,
    this.tint,
    this.onTap,
  });

  final Widget child;
  final EdgeInsetsGeometry? padding;
  final double borderRadius;
  final Color? tint;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final body = ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
        child: Container(
          padding: padding,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(borderRadius),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: tint != null
                  ? [tint!.withValues(alpha: 0.94), tint!.withValues(alpha: 0.86)]
                  : dark
                      ? [Colors.white.withValues(alpha: 0.14), Colors.white.withValues(alpha: 0.07)]
                      : [Colors.white.withValues(alpha: 0.96), Colors.white.withValues(alpha: 0.88)],
            ),
            border: Border.all(
              color: dark ? Colors.white.withValues(alpha: 0.16) : const Color(0xFFD0D4E0),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: dark ? 0.4 : 0.1),
                blurRadius: 18,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: child,
        ),
      ),
    );
    if (onTap == null) return body;
    return Material(
      color: Colors.transparent,
      child: InkWell(borderRadius: BorderRadius.circular(borderRadius), onTap: onTap, child: body),
    );
  }
}

class BrandHeaderMark extends StatelessWidget {
  const BrandHeaderMark({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 48,
      height: 48,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Container(
            decoration: BoxDecoration(
              color: BubColors.ink,
              borderRadius: BorderRadius.circular(15),
              border: Border.all(color: BubColors.lime.withValues(alpha: 0.45)),
            ),
            alignment: Alignment.center,
            child: const Text(
              'BUB\nSUB',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: BubColors.lime,
                fontSize: 11,
                fontWeight: FontWeight.w900,
                height: 1.05,
                letterSpacing: -0.3,
              ),
            ),
          ),
          Positioned(
            top: -5,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: const [
                _Peek(color: BubColors.lime, h: 11),
                SizedBox(width: 3),
                _Peek(color: BubColors.blue, h: 13),
                SizedBox(width: 3),
                _Peek(color: BubColors.pink, h: 9),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Peek extends StatelessWidget {
  const _Peek({required this.color, required this.h});
  final Color color;
  final double h;
  @override
  Widget build(BuildContext context) => Container(
        width: 7,
        height: h,
        decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(2)),
      );
}

class LogoTile extends StatelessWidget {
  const LogoTile({super.key, required this.name, required this.color, this.serviceId, this.size = 48});
  final String name;
  final String color;
  final String? serviceId;
  final double size;

  @override
  Widget build(BuildContext context) {
    final spec = logoFor(serviceId) ?? logoFor(name);
    final fallbackBg = _parseColor(color);
    final bg = spec?.bg ?? fallbackBg;
    final radius = BorderRadius.circular(size * 0.22);

    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: bg,
        borderRadius: radius,
        border: Border.all(color: Colors.black.withValues(alpha: 0.06)),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.12), blurRadius: 8, offset: const Offset(0, 3))],
      ),
      clipBehavior: Clip.antiAlias,
      child: spec == null
          ? _Letter(name: name, size: size)
          : spec.kind == LogoKind.mark
              ? Padding(
                  padding: EdgeInsets.all(size * 0.22),
                  child: SvgPicture.asset(
                    spec.asset,
                    colorFilter: const ColorFilter.mode(Colors.white, BlendMode.srcIn),
                    fit: BoxFit.contain,
                    placeholderBuilder: (_) => _Letter(name: name, size: size * 0.7),
                  ),
                )
              : spec.asset.toLowerCase().endsWith('.svg')
                  ? Padding(
                      padding: EdgeInsets.all(size * 0.12),
                      child: SvgPicture.asset(spec.asset, fit: BoxFit.contain),
                    )
                  : Padding(
                      // Full-bleed brand tiles (Netflix/Spotify color blocks) need less inset.
                      padding: EdgeInsets.all(spec.bg.toARGB32() == const Color(0xFFF4F5F8).toARGB32() ? size * 0.14 : size * 0.06),
                      child: Image.asset(
                        spec.asset,
                        fit: BoxFit.contain,
                        errorBuilder: (_, error, stack) => _Letter(name: name, size: size),
                      ),
                    ),
    );
  }

  Color _parseColor(String hex) {
    var h = hex.replaceAll('#', '');
    if (h.length == 6) h = 'FF$h';
    try {
      return Color(int.parse(h, radix: 16));
    } catch (_) {
      return BubColors.ink;
    }
  }
}

class _Letter extends StatelessWidget {
  const _Letter({required this.name, required this.size});
  final String name;
  final double size;
  @override
  Widget build(BuildContext context) => Center(
        child: Text(
          name.isEmpty ? '?' : name.substring(0, 1).toUpperCase(),
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: size * 0.38),
        ),
      );
}
