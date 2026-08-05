import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:bubsub_app/app.dart';

void main() {
  testWidgets('BUB SUB app builds', (tester) async {
    await tester.pumpWidget(const ProviderScope(child: BubSubApp()));
    await tester.pump(const Duration(seconds: 1));
    expect(find.textContaining('BUB'), findsWidgets);
  });
}
