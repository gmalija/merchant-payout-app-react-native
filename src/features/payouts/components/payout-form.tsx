import { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, TextInput, View, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { ThemedText } from '@/shared/components/ui/themed-text';
import { ThemedView } from '@/shared/components/ui/themed-view';
import { Button } from '@/shared/components/ui';
import { useThemeColor } from '@/shared/hooks/use-theme-color';
import { Colors, Spacing, Typography, BorderRadius, ComponentSizes, Opacity } from '@/shared/constants';
import { payoutFormInputSchema } from '../schemas/payout-schema';
import { normalizeIban } from '@/shared/utils';
import type { Currency } from '@/shared/types/api';

interface PayoutFormProps {
  onSubmit: (data: { amount: number; currency: Currency; iban: string }) => void;
  isLoading?: boolean;
  defaultCurrency?: Currency;
}

export function PayoutForm({ onSubmit, isLoading = false, defaultCurrency = 'GBP' }: PayoutFormProps) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>(defaultCurrency);
  const [iban, setIban] = useState('');
  const [errors, setErrors] = useState<{
    amount?: string;
    currency?: string;
    iban?: string;
  }>({});
  const [touched, setTouched] = useState<{
    amount?: boolean;
    currency?: boolean;
    iban?: boolean;
  }>({});

  const inputBorderColor = useThemeColor({}, 'border');
  const inputBackgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor(
    { light: Colors.light.disabledText, dark: Colors.dark.textSecondary },
    'text'
  );

  // Validate form and update errors
  const validateForm = useCallback(() => {
    const result = payoutFormInputSchema.safeParse({
      amount,
      currency,
      iban,
    });

    if (result.success) {
      setErrors({});
      return result;
    }

    const newErrors: typeof errors = {};
    result.error.issues?.forEach((err) => {
      const field = err.path[0] as keyof typeof errors;
      if (field && !newErrors[field]) {
        newErrors[field] = err.message;
      }
    });

    setErrors(newErrors);
    return result;
  }, [amount, currency, iban]);

  // Revalidate form whenever validateForm changes
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  // Handle field blur (mark as touched and validate)
  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
    validateForm();
  };

  // Handle amount change
  const handleAmountChange = (text: string) => {
    // Allow only numbers and decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    // Allow only one decimal point
    const parts = cleaned.split('.');
    const formatted = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;

    setAmount(formatted);
  };

  // Handle currency change
  const handleCurrencyChange = () => {
    setCurrency(currency === 'GBP' ? 'EUR' : 'GBP');
  };

  // Handle IBAN change
  const handleIbanChange = (text: string) => {
    // Normalize IBAN as user types
    setIban(normalizeIban(text));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Mark all fields as touched
    setTouched({ amount: true, currency: true, iban: true });

    // Validate and submit
    const result = validateForm();

    if (result.success) {
      onSubmit(result.data);
    }
  };

  // Check if form is valid for submit button
  const isFormValid = useMemo(() => {
    return amount && iban && !errors.amount && !errors.iban;
  }, [amount, iban, errors.amount, errors.iban]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <ThemedView style={styles.form}>
          {/* Amount and Currency Row */}
          <View style={styles.rowContainer}>
            {/* Amount Input */}
            <View style={[styles.fieldContainer, styles.amountField]}>
              <ThemedText style={styles.label}>Amount</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: touched.amount && errors.amount ? Colors.error : inputBorderColor,
                    backgroundColor: inputBackgroundColor,
                    color: textColor,
                  },
                ]}
                value={amount}
                onChangeText={handleAmountChange}
                onBlur={() => handleBlur('amount')}
                placeholder="0.00"
                placeholderTextColor={placeholderColor}
                keyboardType="decimal-pad"
                editable={!isLoading}
                testID="payout-amount-input"
                accessibilityLabel="Payout amount"
                accessibilityHint={errors.amount || "Enter the amount you wish to transfer"}
                accessibilityValue={{ text: amount || 'empty' }}
              />
              {touched.amount && errors.amount && (
                <ThemedText style={styles.errorText}>{errors.amount}</ThemedText>
              )}
            </View>

            {/* Currency Selector */}
            <View style={[styles.fieldContainer, styles.currencyField]}>
              <ThemedText style={styles.label}>Currency</ThemedText>
              <Pressable
                style={[
                  styles.currencyPicker,
                  {
                    borderColor: inputBorderColor,
                    backgroundColor: inputBackgroundColor,
                  },
                ]}
                onPress={handleCurrencyChange}
                disabled={isLoading}
                testID="currency-picker"
                accessibilityRole="button"
                accessibilityLabel={`Currency selector. Currently ${currency}`}
                accessibilityHint="Double tap to switch between GBP and EUR"
                accessibilityState={{ disabled: isLoading }}
              >
                <ThemedText style={[styles.currencyText, { color: textColor }]}>
                  {currency} ▾
                </ThemedText>
              </Pressable>
            </View>
          </View>

          {/* IBAN Input */}
          <View style={styles.fieldContainer}>
            <ThemedText style={styles.label}>IBAN</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: touched.iban && errors.iban ? Colors.error : inputBorderColor,
                  backgroundColor: inputBackgroundColor,
                  color: textColor,
                },
              ]}
              value={iban}
              onChangeText={handleIbanChange}
              onBlur={() => handleBlur('iban')}
              placeholder="FR1212345123451234567A1231013123123123"
              placeholderTextColor={placeholderColor}
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!isLoading}
              testID="payout-iban-input"
              accessibilityLabel="Destination IBAN"
              accessibilityHint={errors.iban || "Enter the destination bank account IBAN. Format: 2 letter country code followed by up to 34 alphanumeric characters"}
              accessibilityValue={{ text: iban || 'empty' }}
            />
            {touched.iban && errors.iban ? (
              <ThemedText style={styles.errorText}>{errors.iban}</ThemedText>
            ) : (
              <ThemedText style={styles.helperText}>
                Enter the destination bank account IBAN
              </ThemedText>
            )}
          </View>

          {/* Submit Button */}
          <Button
            title="Confirm"
            variant="primary"
            size="large"
            onPress={handleSubmit}
            disabled={!isFormValid || isLoading}
            loading={isLoading}
            fullWidth
            testID="payout-continue-button"
            style={styles.submitButton}
            accessibilityLabel="Confirm payout"
            accessibilityHint={!isFormValid ? "Fill all required fields to continue" : "Double tap to proceed to confirmation"}
          />
        </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.surface,
  },
  form: {
    gap: Spacing.base,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  fieldContainer: {
    gap: Spacing.sm,
  },
  amountField: {
    flex: 2,
  },
  currencyField: {
    flex: 1,
    minWidth: 100,
  },
  label: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
  input: {
    height: ComponentSizes.input.md,
    borderWidth: 1,
    borderRadius: BorderRadius.base,
    paddingHorizontal: Spacing.base,
    fontSize: Typography.fontSize.md,
  },
  currencyPicker: {
    height: ComponentSizes.input.md,
    borderWidth: 1,
    borderRadius: BorderRadius.base,
    paddingHorizontal: Spacing.base,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  currencyText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.regular,
  },
  errorText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.error,
    marginTop: -Spacing.xs,
  },
  helperText: {
    fontSize: Typography.fontSize.xs,
    opacity: Opacity.secondary,
  },
  submitButton: {
    marginTop: Spacing.lg,
    height: ComponentSizes.input.md,
  },
});
