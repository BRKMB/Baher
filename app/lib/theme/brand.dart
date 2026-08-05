import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Official BUB SUB brand tokens from the leather app-icon identity.
/// The product identity is dark-first: black leather + neon lime/pink/blue.
abstract final class BubColors {
  static const lime = Color(0xFFC8FF00);

  /// Readable lime for text/icons on light surfaces (neon lime fails WCAG).
  static const limeDeep = Color(0xFF4E7300);
  static const pink = Color(0xFFFF2D8A);
  static const blue = Color(0xFF2F6BFF);
  static const ink = Color(0xFF07080C);

  // Dark surfaces
  static const bgDark = Color(0xFF0A0C12);
  static const surfaceDark = Color(0xFF13161F);
  static const surfaceDarkHi = Color(0xFF1A1E2B);
  static const borderDark = Color(0xFF262B3A);
  static const textDark = Color(0xFFF2F4FA);
  static const mutedDark = Color(0xFF9AA3B8);

  // Light surfaces
  static const bgLight = Color(0xFFEFF1F7);
  static const surfaceLight = Colors.white;
  static const borderLight = Color(0xFFD8DCE8);
  static const textLight = Color(0xFF12141B);
  static const mutedLight = Color(0xFF565E70);
}

bool _isDark(BuildContext context) => Theme.of(context).brightness == Brightness.dark;

/// Accent text/icon color that stays legible on the current surface.
Color bubAccentOn(BuildContext context) => _isDark(context) ? BubColors.lime : BubColors.limeDeep;

/// Secondary/muted text color with guaranteed contrast on the current surface.
Color bubMuted(BuildContext context) => _isDark(context) ? BubColors.mutedDark : BubColors.mutedLight;

/// Card / panel surface color.
Color bubSurface(BuildContext context) => _isDark(context) ? BubColors.surfaceDark : BubColors.surfaceLight;

/// Hairline border color for panels.
Color bubBorder(BuildContext context) => _isDark(context) ? BubColors.borderDark : BubColors.borderLight;

TextStyle bubSectionTitle(BuildContext context) => TextStyle(
      fontSize: 12,
      fontWeight: FontWeight.w800,
      letterSpacing: 1.2,
      color: bubMuted(context),
    );

ThemeData buildBubTheme({required Brightness brightness}) {
  final dark = brightness == Brightness.dark;
  final base = dark ? ThemeData.dark(useMaterial3: true) : ThemeData.light(useMaterial3: true);
  final textColor = dark ? BubColors.textDark : BubColors.textLight;
  final scheme = ColorScheme.fromSeed(
    seedColor: BubColors.lime,
    brightness: brightness,
    primary: BubColors.lime,
    onPrimary: BubColors.ink,
    secondary: BubColors.blue,
    tertiary: BubColors.pink,
    surface: dark ? BubColors.surfaceDark : BubColors.surfaceLight,
    onSurface: textColor,
  );

  final textTheme = GoogleFonts.outfitTextTheme(base.textTheme).apply(
    bodyColor: textColor,
    displayColor: textColor,
  );

  return base.copyWith(
    colorScheme: scheme,
    scaffoldBackgroundColor: dark ? BubColors.bgDark : BubColors.bgLight,
    textTheme: textTheme,
    iconTheme: IconThemeData(color: dark ? BubColors.mutedDark : BubColors.mutedLight),
    appBarTheme: AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
      centerTitle: false,
      iconTheme: IconThemeData(color: textColor),
      titleTextStyle: GoogleFonts.outfit(
        fontWeight: FontWeight.w800,
        fontSize: 22,
        color: textColor,
      ),
    ),
    floatingActionButtonTheme: const FloatingActionButtonThemeData(
      backgroundColor: BubColors.lime,
      foregroundColor: BubColors.ink,
    ),
    chipTheme: ChipThemeData(
      selectedColor: BubColors.lime,
      backgroundColor: dark ? BubColors.surfaceDarkHi : Colors.white,
      checkmarkColor: BubColors.ink,
      labelStyle: GoogleFonts.outfit(
        fontWeight: FontWeight.w700,
        fontSize: 13,
        color: textColor,
      ),
      secondaryLabelStyle: GoogleFonts.outfit(
        fontWeight: FontWeight.w800,
        fontSize: 13,
        color: BubColors.ink,
      ),
      side: BorderSide(color: dark ? BubColors.borderDark : BubColors.borderLight),
    ),
    inputDecorationTheme: InputDecorationTheme(
      hintStyle: TextStyle(color: dark ? BubColors.mutedDark : BubColors.mutedLight, fontWeight: FontWeight.w500),
      iconColor: dark ? BubColors.mutedDark : BubColors.mutedLight,
    ),
    listTileTheme: ListTileThemeData(
      iconColor: dark ? BubColors.mutedDark : BubColors.mutedLight,
      textColor: textColor,
    ),
    dividerColor: dark ? BubColors.borderDark : BubColors.borderLight,
    snackBarTheme: SnackBarThemeData(
      backgroundColor: dark ? BubColors.surfaceDarkHi : BubColors.ink,
      contentTextStyle: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.w600),
    ),
  );
}
