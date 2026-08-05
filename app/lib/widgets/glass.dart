import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../data/logos.dart';
import '../theme/brand.dart';

/// Elevated panel card — crisp surface, hairline border, deep shadow.
/// (Replaces the old washed-out "glass" look.)
class Glass extends StatelessWidget {
  const Glass({
    super.key,
    required this.child,
    this.padding,
    this.borderRadius = 22,
    this.tint,
    this.onTap,
    this.glow,
  });

  final Widget child;
  final EdgeInsetsGeometry? padding;
  final double borderRadius;
  final Color? tint;
  final VoidCallback? onTap;

  /// Optional neon glow color behind the card.
  final Color? glow;

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final body = Container(
      padding: padding,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(borderRadius),
        color: tint ?? bubSurface(context),
        border: Border.all(color: tint != null ? Colors.white.withValues(alpha: 0.08) : bubBorder(context)),
        boxShadow: [
          if (glow != null)
            BoxShadow(color: glow!.withValues(alpha: 0.35), blurRadius: 40, spreadRadius: -6, offset: const Offset(0, 10)),
          BoxShadow(
            color: Colors.black.withValues(alpha: dark ? 0.5 : 0.08),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: child,
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
              border: Border.all(color: BubColors.lime.withValues(alpha: 0.55)),
              boxShadow: [
                BoxShadow(color: BubColors.lime.withValues(alpha: 0.25), blurRadius: 18, spreadRadius: -4),
              ],
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
    final radius = BorderRadius.circular(size * 0.24);

    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: bg,
        borderRadius: radius,
        border: Border.all(color: Colors.white.withValues(alpha: 0.10)),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.25), blurRadius: 10, offset: const Offset(0, 4))],
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
                      // Full-bleed brand tiles need less inset than photo tiles.
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
