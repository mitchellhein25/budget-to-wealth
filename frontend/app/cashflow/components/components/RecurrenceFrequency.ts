export const RecurrenceFrequency = {
  WEEKLY: 'Weekly',
  EVERY_2_WEEKS: 'Every2Weeks',
  MONTHLY: 'Monthly',
} as const;

export type RecurrenceFrequency = typeof RecurrenceFrequency[keyof typeof RecurrenceFrequency]
