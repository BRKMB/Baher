import type { Subscription } from '../lib/types'
import { addDays, todayISO } from '../lib/dates'
import { getService } from './services'

/**
 * Demo data shown on first launch so the product feels alive.
 * Users can wipe it from Settings → Danger zone.
 */
export function seedSubscriptions(): Subscription[] {
  const today = todayISO()
  const make = (
    serviceId: string,
    overrides: Partial<Subscription>,
  ): Subscription => {
    const svc = getService(serviceId)
    return {
      id: `seed-${serviceId}`,
      serviceId,
      name: svc?.name ?? serviceId,
      color: svc?.color ?? '#71747f',
      category: svc?.category ?? 'other',
      price: svc?.typicalPrice ?? 9.99,
      currency: 'USD',
      cycle: 'monthly',
      nextRenewal: addDays(today, 12),
      status: 'active',
      autoRenew: true,
      isTrial: false,
      tags: [],
      remindDaysBefore: [3, 1],
      createdAt: today,
      ...overrides,
    }
  }

  return [
    make('netflix', { nextRenewal: addDays(today, 3), paymentMethod: 'Visa •• 4242', tags: ['family'] }),
    make('spotify', { nextRenewal: addDays(today, 9), paymentMethod: 'Visa •• 4242' }),
    make('chatgpt-plus', { nextRenewal: addDays(today, 17), tags: ['work'] }),
    make('adobe-cc', {
      nextRenewal: addDays(today, 24),
      cycle: 'monthly',
      paymentMethod: 'Mastercard •• 8810',
      notes: 'Annual plan paid monthly — watch the termination fee.',
      tags: ['work'],
    }),
    make('canva-pro', {
      status: 'trial',
      isTrial: true,
      trialEndsAt: addDays(today, 5),
      nextRenewal: addDays(today, 5),
      price: 15,
    }),
    make('icloud-plus', { nextRenewal: addDays(today, 2), price: 2.99 }),
    make('xbox-game-pass', {
      status: 'cancelled',
      autoRenew: false,
      cancelledAt: addDays(today, -14),
      nextRenewal: addDays(today, -14),
    }),
    make('dropbox', {
      cycle: 'yearly',
      price: 119.88,
      nextRenewal: addDays(today, 41),
      notes: 'Barely using it — candidate for cancellation.',
    }),
  ]
}
