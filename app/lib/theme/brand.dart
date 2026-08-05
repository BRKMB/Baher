import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Official BUB SUB brand tokens from the leather app-icon identity.
abstract final class BubColors {
  static const lime = Color(0xFFC8FF00);
  static const pink = Color(0xFFFF2D8A);
  static const blue = Color(0xFF2F6BFF);
  static const ink = Color(0xFF0A0A0A);
  static const inkSoft = Color(0xFF0F121A);
  static const mist = Color(0xFFE8E9EF);
}

ThemeData buildBubTheme({required Brightness brightness}) {
  final dark = brightness == Brightness.dark;
  final base = dark ? ThemeData.dark(useMaterial3: true) : ThemeData.light(useMaterial3: true);
  final scheme = ColorScheme.fromSeed(
    seedColor: BubColors.lime,
    brightness: brightness,
    primary: BubColors.lime,
    onPrimary: BubColors.ink,
    secondary: BubColors.blue,
    tertiary: BubColors.pink,
  );

  return base.copyWith(
    colorScheme: scheme,
    scaffoldBackgroundColor: dark ? BubColors.inkSoft : BubColors.mist,
    textTheme: GoogleFonts.outfitTextTheme(base.textTheme).apply(
      bodyColor: dark ? Colors.white : BubColors.ink,
      displayColor: dark ? Colors.white : BubColors.ink,
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
      centerTitle: false,
      titleTextStyle: GoogleFonts.outfit(
        fontWeight: FontWeight.w700,
        fontSize: 24,
        color: dark ? Colors.white : BubColors.ink,
      ),
    ),
    floatingActionButtonTheme: const FloatingActionButtonThemeData(
      backgroundColor: BubColors.lime,
      foregroundColor: BubColors.ink,
    ),
    chipTheme: ChipThemeData(
      selectedColor: BubColors.ink,
      backgroundColor: dark ? Colors.white10 : Colors.white54,
      labelStyle: GoogleFonts.outfit(fontWeight: FontWeight.w600, fontSize: 13),
    ),
  );
}
